"""List SEC filings for a company from the submissions API."""

from backend.src.sec.client import get_sec_client
from backend.src.sec.cik import ticker_to_cik


def get_filings_list(
    ticker: str,
    form_types: list[str] | None = None,
    limit: int = 20,
) -> dict:
    """
    Return company info + list of recent filings.
    Shape matches the frontend FilingsResponse type.
    """
    if form_types is None:
        form_types = ["10-K", "10-Q"]

    cik = ticker_to_cik(ticker)
    client = get_sec_client()
    data = client.get_submissions(cik)

    company_name = data.get("name", "Unknown")
    recent = data.get("filings", {}).get("recent", {})

    forms = recent.get("form", [])
    filed_dates = recent.get("filingDate", [])
    report_dates = recent.get("reportDate", [])
    accession_numbers = recent.get("accessionNumber", [])
    fiscal_years = recent.get("fy", [])
    fiscal_periods = recent.get("fp", [])

    filings = []
    for i, form in enumerate(forms):
        if form not in form_types:
            continue
        if len(filings) >= limit:
            break

        accession = accession_numbers[i] if i < len(accession_numbers) else ""
        filed_at = filed_dates[i] if i < len(filed_dates) else ""
        report_date = report_dates[i] if i < len(report_dates) else ""
        fy = fiscal_years[i] if i < len(fiscal_years) else None
        fp = fiscal_periods[i] if i < len(fiscal_periods) else None

        period = _build_period_label(fp, fy, form, report_date)
        filing_id = accession.replace("-", "")
        source_url = (
            f"https://www.sec.gov/cgi-bin/browse-edgar"
            f"?action=getcompany&CIK={cik}&type={form}&dateb=&owner=include&count=10"
        )

        filings.append({
            "filing_id": filing_id,
            "form": form,
            "period": period,
            "filed_at": filed_at or None,
            "fiscal_period_end": report_date or None,
            "source_url": source_url,
        })

    return {
        "ticker": ticker.upper(),
        "company": company_name,
        "filings": filings,
    }


def _build_period_label(fp: str | None, fy: int | None, form: str, report_date: str) -> str:
    """Build a human-readable period label like 'FY2024' or 'Q1 2024'."""
    if fp and fy:
        if fp == "FY" or form == "10-K":
            return f"FY{fy}"
        return f"{fp} {fy}"

    # Fallback: infer from report_date
    if not report_date:
        return "Unknown"
    try:
        year = int(report_date[:4])
        if form == "10-K":
            return f"FY{year}"
        month = int(report_date[5:7])
        if month <= 3:
            quarter = "Q1"
        elif month <= 6:
            quarter = "Q2"
        elif month <= 9:
            quarter = "Q3"
        else:
            quarter = "Q4"
        return f"{quarter} {year}"
    except Exception:
        return report_date
