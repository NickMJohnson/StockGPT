"""Compute key financial ratios from extracted facts."""

from typing import Optional


def compute_ratios(
    facts: dict[str, dict[str, float]],
    latest_period: str,
    prior_period: Optional[str] = None,
) -> dict[str, float]:
    """
    Compute financial ratios for the most recent period.

    Args:
        facts:          {concept_id: {period_key: raw_usd_value}}
        latest_period:  period key to compute ratios for (e.g. "FY2024" or "Q1 2024")
        prior_period:   prior period key for growth rates, or None

    Returns:
        {ratio_id: value}  — percentages as plain floats (25.3 = 25.3%)
    """

    def get(concept: str, period: str = latest_period) -> Optional[float]:
        return facts.get(concept, {}).get(period)

    rev = get("revenue")
    ni = get("net_income")
    gp = get("gross_profit")
    oi = get("operating_income")
    ta = get("total_assets")
    tl = get("total_liabilities")
    se = get("stockholders_equity")
    tca = get("total_current_assets")
    tcl = get("total_current_liabilities")
    cash = get("cash_and_equivalents")
    ar = get("accounts_receivable")
    ocf = get("net_cash_from_operations")
    capex = get("capital_expenditures")  # already negated → negative number

    ratios: dict[str, float] = {}

    # Margin ratios
    if rev and gp:
        ratios["gross_margin"] = round(gp / rev * 100, 2)
    if rev and oi:
        ratios["operating_margin"] = round(oi / rev * 100, 2)
    if rev and ni:
        ratios["net_margin"] = round(ni / rev * 100, 2)

    # Return ratios
    if ta and ni:
        ratios["roa"] = round(ni / ta * 100, 2)
    if se and ni and se != 0:
        ratios["roe"] = round(ni / se * 100, 2)

    # Liquidity ratios
    if tca and tcl and tcl != 0:
        ratios["current_ratio"] = round(tca / tcl, 2)
    if tcl and tcl != 0:
        numerator = (cash or 0) + (ar or 0)
        if numerator > 0:
            ratios["quick_ratio"] = round(numerator / tcl, 2)

    # Leverage ratio
    if tl and se and se != 0:
        ratios["debt_to_equity"] = round(tl / se, 2)

    # Efficiency
    if rev and ta:
        ratios["asset_turnover"] = round(rev / ta, 2)

    # Free cash flow margin  (capex is already negative, so FCF = ocf + capex)
    if rev and ocf:
        fcf = ocf + (capex or 0)
        ratios["free_cash_flow_margin"] = round(fcf / rev * 100, 2)

    # Growth rates (period-over-period)
    if prior_period:
        prior_rev = get("revenue", prior_period)
        if rev and prior_rev and prior_rev != 0:
            ratios["revenue_growth"] = round((rev - prior_rev) / abs(prior_rev) * 100, 2)

        prior_ni = get("net_income", prior_period)
        if ni and prior_ni and prior_ni != 0:
            ratios["earnings_growth"] = round((ni - prior_ni) / abs(prior_ni) * 100, 2)

    return ratios
