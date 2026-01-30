from backend.src.api.schemas import (
    FinancialsResponse,
    CompanyMeta,
    FilingMeta,
    Period,
    PeriodType,
    FinancialStatement,
    StatementLineItem,
    StatementValue,
    Ratio,
    RatioValue,
    Unit,
    SummaryBlock,
    ChartSeries,
    ChartPoint,
)

def get_financials_stub(ticker: str, form: str) -> FinancialsResponse:
    # Two periods to prove "columns by period" + chart series
    periods = [
        Period(key="FY2023", type=PeriodType.FY, start_date="2022-09-25", end_date="2023-09-30", fiscal_year=2023, fiscal_quarter=None),
        Period(key="FY2022", type=PeriodType.FY, start_date="2021-09-26", end_date="2022-09-24", fiscal_year=2022, fiscal_quarter=None),
    ]

    income = FinancialStatement(
        statement_type="income_statement",
        line_items=[
            StatementLineItem(
                id="revenue",
                label="Revenue",
                unit=Unit.USD,
                values=[
                    StatementValue(period_key="FY2023", value=383_285_000_000),
                    StatementValue(period_key="FY2022", value=394_328_000_000),
                ],
            ),
            StatementLineItem(
                id="net_income",
                label="Net income",
                unit=Unit.USD,
                values=[
                    StatementValue(period_key="FY2023", value=96_995_000_000),
                    StatementValue(period_key="FY2022", value=99_803_000_000),
                ],
            ),
        ],
    )

    balance = FinancialStatement(
        statement_type="balance_sheet",
        line_items=[
            StatementLineItem(
                id="cash_and_equivalents",
                label="Cash and cash equivalents",
                unit=Unit.USD,
                values=[
                    StatementValue(period_key="FY2023", value=29_965_000_000),
                    StatementValue(period_key="FY2022", value=23_646_000_000),
                ],
            ),
            StatementLineItem(
                id="total_assets",
                label="Total assets",
                unit=Unit.USD,
                values=[
                    StatementValue(period_key="FY2023", value=352_583_000_000),
                    StatementValue(period_key="FY2022", value=352_755_000_000),
                ],
            ),
        ],
    )

    cashflow = FinancialStatement(
        statement_type="cash_flow",
        line_items=[
            StatementLineItem(
                id="net_cash_from_operations",
                label="Net cash provided by operating activities",
                unit=Unit.USD,
                values=[
                    StatementValue(period_key="FY2023", value=110_543_000_000),
                    StatementValue(period_key="FY2022", value=122_151_000_000),
                ],
            ),
            StatementLineItem(
                id="capital_expenditures",
                label="Capital expenditures",
                unit=Unit.USD,
                values=[
                    StatementValue(period_key="FY2023", value=-10_959_000_000),
                    StatementValue(period_key="FY2022", value=-10_708_000_000),
                ],
            ),
        ],
    )

    ratios = [
        Ratio(
            id="net_margin",
            label="Net margin",
            unit=Unit.PERCENT,
            values=[
                RatioValue(period_key="FY2023", value=25.3),
                RatioValue(period_key="FY2022", value=25.3),
            ],
        )
    ]

    charts = [
        ChartSeries(
            id="revenue_series",
            label="Revenue",
            unit=Unit.USD,
            points=[
                ChartPoint(period_key="FY2022", value=394_328_000_000),
                ChartPoint(period_key="FY2023", value=383_285_000_000),
            ],
        )
    ]

    summaries = [
        SummaryBlock(
            title="Highlights (stub)",
            bullets=[
                "Revenue slightly decreased year over year.",
                "Net income remained roughly flat.",
                "Operating cash flow was strong but decreased from the prior year.",
            ],
        )
    ]

    return FinancialsResponse(
        company=CompanyMeta(ticker=ticker, name="(stub) Example Corp"),
        filing=FilingMeta(form="10-K" if form.upper() == "10-K" else "10-Q"),
        periods=periods,
        statements={
            "income_statement": income,
            "balance_sheet": balance,
            "cash_flow": cashflow,
        },
        ratios=ratios,
        charts=charts,
        summaries=summaries,
        notes={"source": "stub data until SEC pipeline is implemented"},
    )
