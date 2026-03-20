"""Main pipeline: ticker → normalized facts + ratios + metadata."""

import time
from typing import Optional

from backend.src.sec.client import get_sec_client
from backend.src.sec.cik import ticker_to_cik, get_company_name
from backend.src.parsers.statements import extract_all_annual_facts
from backend.src.ratios.calculations import compute_ratios

# Simple in-memory cache  {cache_key: (data, timestamp)}
_cache: dict[str, tuple[dict, float]] = {}
_CACHE_TTL = 3600  # seconds


def extract_financials(ticker: str, form: str = "10-K") -> dict:
    """
    Full SEC pipeline for one ticker + form type.

    Returns a dict with:
        ticker, company, cik, facts, ratios, periods, latest_period,
        prior_period, filing_meta, form
    """
    cache_key = f"{ticker.upper()}:{form.upper()}"

    if cache_key in _cache:
        data, ts = _cache[cache_key]
        if time.time() - ts < _CACHE_TTL:
            return data

    # ── SEC fetch ─────────────────────────────────────────────────────────────
    cik = ticker_to_cik(ticker)
    client = get_sec_client()

    company_name = get_company_name(cik)
    submissions = client.get_submissions(cik)
    companyfacts = client.get_company_facts(cik)

    # ── Extract ───────────────────────────────────────────────────────────────
    filing_meta = _get_latest_filing_meta(submissions, form)
    facts = extract_all_annual_facts(companyfacts, form)

    # Determine available period keys from the revenue series
    revenue_keys = sorted(facts.get("revenue", {}).keys(), key=_period_sort_key)
    max_periods = 5 if form.upper() == "10-K" else 6   # show last 6 quarters
    periods = revenue_keys[-max_periods:] if len(revenue_keys) > max_periods else revenue_keys

    latest_period: Optional[str] = periods[-1] if periods else None
    prior_period: Optional[str] = periods[-2] if len(periods) >= 2 else None

    ratios = compute_ratios(facts, latest_period, prior_period) if latest_period else {}

    result = {
        "ticker": ticker.upper(),
        "company": company_name,
        "cik": cik,
        "facts": facts,
        "ratios": ratios,
        "periods": periods,           # list of period-key strings
        "latest_period": latest_period,
        "prior_period": prior_period,
        "filing_meta": filing_meta,
        "form": form.upper(),
    }

    _cache[cache_key] = (result, time.time())
    return result


def _period_sort_key(period: str) -> tuple[int, int]:
    """Sort key for period strings: 'FY2024' → (2024, 0), 'Q2 2024' → (2024, 2)."""
    try:
        if period.startswith("FY"):
            return (int(period[2:]), 0)
        if period.startswith("Q"):
            q, y = period.split()
            return (int(y), int(q[1]))
    except Exception:
        pass
    return (0, 0)


def _get_latest_filing_meta(submissions: dict, form: str) -> dict:
    """Return metadata for the most recent filing of the given form type."""
    recent = submissions.get("filings", {}).get("recent", {})
    forms = recent.get("form", [])
    filed_dates = recent.get("filingDate", [])
    report_dates = recent.get("reportDate", [])
    accession_numbers = recent.get("accessionNumber", [])

    for i, f in enumerate(forms):
        if f.upper() == form.upper():
            return {
                "form": f,
                "filed_at": filed_dates[i] if i < len(filed_dates) else None,
                "fiscal_period_end": report_dates[i] if i < len(report_dates) else None,
                "accession_number": accession_numbers[i] if i < len(accession_numbers) else None,
            }

    return {"form": form, "filed_at": None, "fiscal_period_end": None, "accession_number": None}
