# Stockpiler API Contract (Frontend ↔ Backend)

This doc defines the **shared response shapes** the frontend will build against.  
Goal: lock these early so UI + backend can ship independently.

## Conventions

- All monetary values are numbers (no commas), with an optional `unit` to indicate scale.
- Statement tables are standardized as:
  - `columns`: array of period labels (e.g. `["FY2021","FY2022","FY2023"]`)
  - `rows`: array of line items with aligned `values` arrays (same length as `columns`)
- Missing/unknown values are `null`.
- Backend may include additional fields, but **must not break** these shapes.

---

## 1) List available filings / periods for a ticker

### `GET /api/filings?ticker={TICKER}`

**Purpose:** Given a ticker, return selectable filings/periods (10-K, 10-Q, FY2023, Q3 2024, etc.).

**Query params**
- `ticker` (string, required) — e.g. `AAPL`

**200 Response**
```json
{
  "ticker": "AAPL",
  "company": "Apple Inc.",
  "filings": [
    {
      "filing_id": "0000320193-23-000106",
      "form": "10-K",
      "period": "FY2023",
      "filed_at": "2023-11-03",
      "fiscal_period_end": "2023-09-30",
      "source_url": "https://www.sec.gov/Archives/..."
    },
    {
      "filing_id": "0000320193-24-000012",
      "form": "10-Q",
      "period": "Q1 2024",
      "filed_at": "2024-02-02",
      "fiscal_period_end": "2023-12-30",
      "source_url": "https://www.sec.gov/Archives/..."
    }
  ]
}
