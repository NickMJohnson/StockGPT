"""Build the API response from extracted financial data."""

from backend.src.parsers.mappings import (
    INCOME_STATEMENT_LAYOUT,
    BALANCE_SHEET_LAYOUT,
    CASH_FLOW_LAYOUT,
)

_BILLION = 1_000_000_000.0


def build_financials_response(extracted: dict, summary: str = "") -> dict:
    """
    Convert extracted pipeline data into the shape the frontend expects.
    Monetary values are expressed in billions USD (unit: "USDb").
    """
    facts = extracted["facts"]
    periods = extracted["periods"]          # list of period-key strings
    ratios = extracted["ratios"]
    latest_period = extracted["latest_period"]
    filing_meta = extracted["filing_meta"]

    return {
        "company": extracted["company"],
        "ticker": extracted["ticker"],
        "period": latest_period or "Unknown",
        "filing": filing_meta,
        "statements": {
            "income_statement": _build_statement(facts, INCOME_STATEMENT_LAYOUT, periods),
            "balance_sheet": _build_statement(facts, BALANCE_SHEET_LAYOUT, periods),
            "cash_flow": _build_statement(facts, CASH_FLOW_LAYOUT, periods),
        },
        "ratios": ratios,
        "summary": summary,
        "series": _build_series(facts, periods),
    }


def _build_statement(
    facts: dict[str, dict[str, float]],
    layout: list[tuple],
    periods: list[str],
) -> dict:
    """Build a Statement object with columns + rows in billions USD."""
    rows = []

    for concept_id, label in layout:
        if concept_id is None:
            rows.append({"label": label, "values": [None] * len(periods)})
        else:
            concept_facts = facts.get(concept_id, {})
            values = [_to_billions(concept_facts.get(p)) for p in periods]
            rows.append({"label": label, "values": values})

    return {"unit": "USDb", "columns": list(periods), "rows": rows}


def _to_billions(val: float | None) -> float | None:
    if val is None:
        return None
    return round(val / _BILLION, 2)


def _build_series(
    facts: dict[str, dict[str, float]],
    periods: list[str],
) -> dict:
    """Build chart series for revenue, free_cash_flow, and net_margin."""
    series: dict[str, list] = {}

    rev_facts = facts.get("revenue", {})
    if rev_facts:
        series["revenue"] = [
            {"period": p, "value": _to_billions(rev_facts.get(p))}
            for p in periods
        ]

    ocf_facts = facts.get("net_cash_from_operations", {})
    capex_facts = facts.get("capital_expenditures", {})
    if ocf_facts:
        fcf_pts = []
        for p in periods:
            ocf = ocf_facts.get(p)
            capex = capex_facts.get(p, 0) or 0
            if ocf is not None:
                fcf_pts.append({"period": p, "value": _to_billions(ocf + capex)})
            else:
                fcf_pts.append({"period": p, "value": None})
        series["free_cash_flow"] = fcf_pts

    ni_facts = facts.get("net_income", {})
    if rev_facts and ni_facts:
        margin_pts = []
        for p in periods:
            rev = rev_facts.get(p)
            ni = ni_facts.get(p)
            if rev and ni and rev != 0:
                margin_pts.append({"period": p, "value": round(ni / rev * 100, 2)})
            else:
                margin_pts.append({"period": p, "value": None})
        series["net_margin"] = margin_pts

    return series
