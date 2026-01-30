from __future__ import annotations

from enum import Enum
from typing import Dict, List, Optional, Literal
from pydantic import BaseModel, Field


class Unit(str, Enum):
    USD = "USD"
    SHARES = "shares"
    USD_PER_SHARE = "USD/share"
    PERCENT = "percent"
    RATIO = "ratio"


class PeriodType(str, Enum):
    FY = "FY"
    Q = "Q"


class Period(BaseModel):
    key: str = Field(..., description="Stable period key (e.g., FY2024, Q3-2024)")
    type: PeriodType
    start_date: str = Field(..., description="ISO date YYYY-MM-DD")
    end_date: str = Field(..., description="ISO date YYYY-MM-DD")
    fiscal_year: int
    fiscal_quarter: Optional[int] = Field(None, description="1-4 for quarters, None for FY")


class StatementValue(BaseModel):
    period_key: str
    value: float


class StatementLineItem(BaseModel):
    id: str = Field(..., description="Canonical ID used across companies (e.g., net_income)")
    label: str = Field(..., description="Human label (e.g., Net income)")
    unit: Unit
    values: List[StatementValue]


class FinancialStatement(BaseModel):
    statement_type: Literal["income_statement", "balance_sheet", "cash_flow"]
    line_items: List[StatementLineItem]


class RatioValue(BaseModel):
    period_key: str
    value: float


class Ratio(BaseModel):
    id: str = Field(..., description="Canonical ratio id (e.g., current_ratio)")
    label: str
    unit: Unit = Unit.RATIO
    values: List[RatioValue]


class ChartPoint(BaseModel):
    period_key: str
    value: float


class ChartSeries(BaseModel):
    id: str
    label: str
    unit: Unit
    points: List[ChartPoint]


class CompanyMeta(BaseModel):
    ticker: str
    name: str
    cik: Optional[str] = None


class FilingMeta(BaseModel):
    form: Literal["10-K", "10-Q"]
    accession_number: Optional[str] = None
    filed_date: Optional[str] = None  # ISO date
    report_date: Optional[str] = None  # ISO date


class SummaryBlock(BaseModel):
    title: str
    bullets: List[str]


class FinancialsResponse(BaseModel):
    company: CompanyMeta
    filing: FilingMeta
    periods: List[Period]

    statements: Dict[str, FinancialStatement] = Field(
        ..., description="Keys: income_statement, balance_sheet, cash_flow"
    )

    ratios: List[Ratio] = []
    charts: List[ChartSeries] = []

    summaries: List[SummaryBlock] = []
    notes: Dict[str, str] = Field(default_factory=dict)
