"""Extract normalized financial facts from the SEC companyfacts API.

All returned fact dicts use string period keys:
  Annual   → "FY2023"
  Quarterly → "Q1 2024", "Q2 2024", "Q3 2024"
"""

from backend.src.parsers.mappings import CONCEPT_TAGS

_QUARTERS = {"Q1", "Q2", "Q3"}


def extract_all_annual_facts(
    companyfacts: dict,
    form: str = "10-K",
) -> dict[str, dict[str, float]]:
    """
    Extract facts for every concept in CONCEPT_TAGS.

    Returns:
        {concept_id: {period_key: value_in_raw_usd}}

    Values for concepts with negate=True are already negated.
    """
    us_gaap = companyfacts.get("facts", {}).get("us-gaap", {})
    is_quarterly = form.upper() == "10-Q"
    results: dict[str, dict[str, float]] = {}

    for concept_id, (gaap_tags, negate) in CONCEPT_TAGS.items():
        if is_quarterly:
            series = _extract_best_quarterly_series(us_gaap, gaap_tags)
        else:
            series = _extract_best_annual_series(us_gaap, gaap_tags)

        if series:
            if negate:
                series = {pk: -v for pk, v in series.items()}
            results[concept_id] = series

    return results


# ── Annual (10-K) ─────────────────────────────────────────────────────────────

def _extract_best_annual_series(
    us_gaap: dict,
    gaap_tags: list[str],
) -> dict[str, float]:
    """Return {\"FY2023\": value, ...} for the best-scoring annual series."""
    best: dict[str, float] = {}
    best_score: float = -1.0

    for tag in gaap_tags:
        if tag not in us_gaap:
            continue

        entries = _get_usd_entries(us_gaap[tag])
        annual = [
            e for e in entries
            if e.get("form") == "10-K" and e.get("fp") == "FY"
        ]
        if not annual:
            continue

        by_fy: dict[int, dict] = {}
        for e in annual:
            fy = e.get("fy")
            if fy is None:
                continue
            prev = by_fy.get(fy)
            if prev is None or e.get("filed", "") > prev.get("filed", ""):
                by_fy[fy] = e

        if not by_fy:
            continue

        score = max(by_fy) * 100 + len(by_fy)
        if score > best_score:
            best_score = score
            best = {f"FY{fy}": e["val"] for fy, e in by_fy.items()}

    return best


# ── Quarterly (10-Q) ──────────────────────────────────────────────────────────

def _extract_best_quarterly_series(
    us_gaap: dict,
    gaap_tags: list[str],
) -> dict[str, float]:
    """Return {\"Q1 2024\": value, ...} for the best-scoring quarterly series."""
    best: dict[str, float] = {}
    best_score: float = -1.0

    for tag in gaap_tags:
        if tag not in us_gaap:
            continue

        entries = _get_usd_entries(us_gaap[tag])
        quarterly = [
            e for e in entries
            if e.get("form") == "10-Q" and e.get("fp") in _QUARTERS
        ]
        if not quarterly:
            continue

        # Deduplicate by (fy, fp) — keep most recently filed
        by_period: dict[tuple, dict] = {}
        for e in quarterly:
            fy = e.get("fy")
            fp = e.get("fp")
            if fy is None or fp is None:
                continue
            key = (fy, fp)
            prev = by_period.get(key)
            if prev is None or e.get("filed", "") > prev.get("filed", ""):
                by_period[key] = e

        if not by_period:
            continue

        max_fy = max(k[0] for k in by_period)
        score = max_fy * 100 + len(by_period)
        if score > best_score:
            best_score = score
            # "Q1 2024" format
            best = {
                f"{fp} {fy}": e["val"]
                for (fy, fp), e in by_period.items()
            }

    return best


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_usd_entries(concept_data: dict) -> list:
    """Return USD unit entries, falling back to first available unit."""
    units = concept_data.get("units", {})
    entries = units.get("USD", [])
    if not entries:
        for v in units.values():
            entries = v
            break
    return entries
