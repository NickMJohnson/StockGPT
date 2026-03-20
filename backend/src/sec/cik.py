"""Ticker → CIK lookup using SEC's company_tickers.json."""

from functools import lru_cache
from backend.src.sec.client import get_sec_client


@lru_cache(maxsize=2000)
def ticker_to_cik(ticker: str) -> str:
    """Return zero-padded 10-digit CIK for a ticker symbol."""
    client = get_sec_client()
    data = client.get_company_tickers()
    ticker_upper = ticker.upper()

    for entry in data.values():
        if entry.get("ticker", "").upper() == ticker_upper:
            return str(entry["cik_str"]).zfill(10)

    raise ValueError(f"Ticker '{ticker}' not found in SEC database.")


def get_company_name(cik: str) -> str:
    """Return company name from submissions data."""
    client = get_sec_client()
    data = client.get_submissions(cik)
    return data.get("name", "Unknown Company")
