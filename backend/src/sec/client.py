"""Rate-limited SEC EDGAR HTTP client."""

import time
import requests
from backend.src.config.settings import SEC_USER_AGENT


class SECClient:
    BASE_URL = "https://data.sec.gov"
    WWW_URL = "https://www.sec.gov"

    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": SEC_USER_AGENT,
            "Accept": "application/json",
        })
        self._last_request_time: float = 0.0

    def _get(self, url: str) -> dict:
        # SEC rate limit: max 10 requests/second
        elapsed = time.time() - self._last_request_time
        if elapsed < 0.11:
            time.sleep(0.11 - elapsed)

        resp = self.session.get(url, timeout=30)
        resp.raise_for_status()
        self._last_request_time = time.time()
        return resp.json()

    def get_company_tickers(self) -> dict:
        """Flat ticker→CIK mapping from SEC (hosted on www.sec.gov)."""
        return self._get(f"{self.WWW_URL}/files/company_tickers.json")

    def get_submissions(self, cik: str) -> dict:
        """Filing history for a company."""
        cik_padded = str(int(cik)).zfill(10)
        return self._get(f"{self.BASE_URL}/submissions/CIK{cik_padded}.json")

    def get_company_facts(self, cik: str) -> dict:
        """All XBRL facts for a company (large payload ~10 MB for big companies)."""
        cik_padded = str(int(cik)).zfill(10)
        return self._get(
            f"{self.BASE_URL}/api/xbrl/companyfacts/CIK{cik_padded}.json"
        )


# Module-level singleton
_client: SECClient | None = None


def get_sec_client() -> SECClient:
    global _client
    if _client is None:
        _client = SECClient()
    return _client
