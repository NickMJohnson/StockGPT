"""AI-generated summary of financial results using Claude."""

from backend.src.config.settings import ANTHROPIC_API_KEY


def summarize_financials(
    company: str,
    period: str,
    ratios: dict,
    statements: dict,
    ticker: str = "",
) -> str:
    """
    Generate a concise natural-language summary of key financial highlights.
    Falls back to a template summary if ANTHROPIC_API_KEY is not set.
    """
    if not ANTHROPIC_API_KEY:
        return _template_summary(company, period, ratios)

    try:
        import anthropic  # type: ignore

        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        context = _build_context(company, period, ratios, statements)

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=500,
            messages=[
                {
                    "role": "user",
                    "content": (
                        "You are a financial analyst. Write a concise 3–5 sentence summary "
                        "of the following financial results. Focus on key trends, strengths, "
                        "and risks. Use specific numbers where helpful.\n\n" + context
                    ),
                }
            ],
        )
        return response.content[0].text.strip()

    except Exception:
        return _template_summary(company, period, ratios)


def _build_context(company: str, period: str, ratios: dict, statements: dict) -> str:
    lines = [f"Company: {company}", f"Period: {period}", "", "Key Ratios:"]

    ratio_labels = {
        "gross_margin": "Gross Margin %",
        "operating_margin": "Operating Margin %",
        "net_margin": "Net Margin %",
        "revenue_growth": "Revenue Growth %",
        "earnings_growth": "Earnings Growth %",
        "roe": "Return on Equity %",
        "roa": "Return on Assets %",
        "current_ratio": "Current Ratio",
        "debt_to_equity": "Debt-to-Equity",
        "free_cash_flow_margin": "FCF Margin %",
    }
    for key, label in ratio_labels.items():
        val = ratios.get(key)
        if val is not None:
            lines.append(f"  {label}: {val}")

    income = statements.get("income_statement", {})
    columns = income.get("columns", [])
    rows = income.get("rows", [])
    if columns and rows:
        lines.append(f"\nIncome Statement ({', '.join(columns)}):")
        for row in rows:
            vals = row.get("values", [])
            if vals and any(v is not None for v in vals):
                val_str = ", ".join(
                    f"${v}B" if v is not None else "N/A" for v in vals
                )
                lines.append(f"  {row['label']}: {val_str}")

    return "\n".join(lines)


def _template_summary(company: str, period: str, ratios: dict) -> str:
    parts = [f"{company} ({period}):"]

    if "revenue_growth" in ratios:
        g = ratios["revenue_growth"]
        word = "grew" if g >= 0 else "declined"
        parts.append(f"Revenue {word} {abs(g):.1f}% year-over-year.")

    if "net_margin" in ratios:
        parts.append(f"Net margin was {ratios['net_margin']:.1f}%.")

    if "free_cash_flow_margin" in ratios:
        parts.append(f"Free cash flow margin was {ratios['free_cash_flow_margin']:.1f}%.")

    if "current_ratio" in ratios:
        cr = ratios["current_ratio"]
        health = "healthy" if cr > 1.5 else "tight" if cr < 1.0 else "adequate"
        parts.append(f"Liquidity is {health} (current ratio: {cr:.2f}).")

    if len(parts) == 1:
        parts.append("Financial data has been loaded from SEC EDGAR.")

    return " ".join(parts)
