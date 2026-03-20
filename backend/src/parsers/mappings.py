"""
Maps canonical financial concepts to possible US-GAAP XBRL tags.

CONCEPT_TAGS: {concept_id: (gaap_tags_list, negate)}
  - gaap_tags_list: tried in order; the series with the highest score wins
  - negate: True if the SEC value must be negated for display
    (e.g. PaymentsToAcquirePropertyPlantAndEquipment is a positive "payment"
     but shown as a negative outflow in the cash flow statement)

Layout lists: ordered rows for each statement, (concept_id | None, label).
  None concept_id = section header (displayed with null values).
"""

CONCEPT_TAGS: dict[str, tuple[list[str], bool]] = {
    # ── Income Statement ─────────────────────────────────────────────────────
    "revenue": (
        [
            "RevenueFromContractWithCustomerExcludingAssessedTax",
            "Revenues",
            "SalesRevenueNet",
            "RevenueFromContractWithCustomerIncludingAssessedTax",
            "SalesRevenueGoodsNet",
            "RevenuesExcludingInterestAndDividends",
        ],
        False,
    ),
    "cost_of_revenue": (
        ["CostOfRevenue", "CostOfGoodsAndServicesSold", "CostOfGoodsSold"],
        False,
    ),
    "gross_profit": (["GrossProfit"], False),
    "rd_expense": (["ResearchAndDevelopmentExpense"], False),
    "sga_expense": (
        ["SellingGeneralAndAdministrativeExpense", "GeneralAndAdministrativeExpense"],
        False,
    ),
    "operating_income": (["OperatingIncomeLoss"], False),
    "interest_expense": (
        ["InterestExpense", "InterestExpenseDebt", "InterestAndDebtExpense"],
        True,   # reported positive by SEC; show as negative
    ),
    "income_before_tax": (
        [
            "IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest",
            "IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments",
        ],
        False,
    ),
    "income_tax_expense": (["IncomeTaxExpenseBenefit"], False),
    "net_income": (
        ["NetIncomeLoss", "NetIncomeLossAvailableToCommonStockholdersBasic"],
        False,
    ),
    "eps_diluted": (["EarningsPerShareDiluted"], False),

    # ── Balance Sheet ────────────────────────────────────────────────────────
    "cash_and_equivalents": (
        [
            "CashAndCashEquivalentsAtCarryingValue",
            "CashAndCashEquivalentsAndShortTermInvestments",
            "Cash",
        ],
        False,
    ),
    "short_term_investments": (
        [
            "ShortTermInvestments",
            "AvailableForSaleSecuritiesCurrent",
            "MarketableSecuritiesCurrent",
        ],
        False,
    ),
    "accounts_receivable": (
        ["AccountsReceivableNetCurrent", "ReceivablesNetCurrent"],
        False,
    ),
    "inventory": (["InventoryNet", "InventoryGross"], False),
    "total_current_assets": (["AssetsCurrent"], False),
    "total_assets": (["Assets"], False),
    "accounts_payable": (["AccountsPayableCurrent", "AccountsPayable"], False),
    "short_term_debt": (
        ["ShortTermBorrowings", "LongTermDebtCurrent", "NotesPayableCurrent", "CommercialPaper"],
        False,
    ),
    "total_current_liabilities": (["LiabilitiesCurrent"], False),
    "long_term_debt": (
        ["LongTermDebtNoncurrent", "LongTermDebt", "LongTermNotesPayable"],
        False,
    ),
    "total_liabilities": (["Liabilities"], False),
    "stockholders_equity": (
        [
            "StockholdersEquity",
            "StockholdersEquityAttributableToParent",
        ],
        False,
    ),

    # ── Cash Flow ────────────────────────────────────────────────────────────
    "net_cash_from_operations": (
        ["NetCashProvidedByUsedInOperatingActivities"],
        False,
    ),
    "depreciation": (
        [
            "DepreciationDepletionAndAmortization",
            "DepreciationAndAmortization",
            "Depreciation",
        ],
        False,
    ),
    "sbc": (
        ["ShareBasedCompensation", "AllocatedShareBasedCompensationExpense"],
        False,
    ),
    "capital_expenditures": (
        ["PaymentsToAcquirePropertyPlantAndEquipment", "PurchaseOfPropertyPlantAndEquipment"],
        True,   # reported positive; display as negative
    ),
    "net_cash_from_investing": (
        ["NetCashProvidedByUsedInInvestingActivities"],
        False,
    ),
    "dividends_paid": (
        ["PaymentsOfDividends", "PaymentsOfDividendsCommonStock"],
        True,
    ),
    "stock_buybacks": (
        ["PaymentsForRepurchaseOfCommonStock", "PaymentsForRepurchaseOfEquity"],
        True,
    ),
    "net_cash_from_financing": (
        ["NetCashProvidedByUsedInFinancingActivities"],
        False,
    ),
    "net_change_in_cash": (
        [
            "CashCashEquivalentsRestrictedCashAndRestrictedCashEquivalentsPeriodIncreaseDecreaseIncludingExchangeRateEffect",
            "CashAndCashEquivalentsPeriodIncreaseDecrease",
        ],
        False,
    ),
}

# ── Statement display layouts ────────────────────────────────────────────────
# Each entry: (concept_id or None, display_label)
# None → section header row (null values, bold in UI)

INCOME_STATEMENT_LAYOUT: list[tuple[str | None, str]] = [
    (None, "REVENUES"),
    ("revenue", "Revenue"),
    ("cost_of_revenue", "Cost of Revenue"),
    ("gross_profit", "Gross Profit"),
    (None, "OPERATING EXPENSES"),
    ("rd_expense", "Research & Development"),
    ("sga_expense", "Selling, General & Admin"),
    ("operating_income", "Operating Income"),
    (None, "OTHER INCOME / EXPENSE"),
    ("interest_expense", "Interest Expense"),
    ("income_before_tax", "Income Before Tax"),
    ("income_tax_expense", "Income Tax Expense"),
    ("net_income", "Net Income"),
]

BALANCE_SHEET_LAYOUT: list[tuple[str | None, str]] = [
    (None, "ASSETS"),
    ("cash_and_equivalents", "Cash & Equivalents"),
    ("short_term_investments", "Short-term Investments"),
    ("accounts_receivable", "Accounts Receivable"),
    ("inventory", "Inventory"),
    ("total_current_assets", "Total Current Assets"),
    ("total_assets", "Total Assets"),
    (None, "LIABILITIES"),
    ("accounts_payable", "Accounts Payable"),
    ("short_term_debt", "Short-term Debt"),
    ("total_current_liabilities", "Total Current Liabilities"),
    ("long_term_debt", "Long-term Debt"),
    ("total_liabilities", "Total Liabilities"),
    (None, "EQUITY"),
    ("stockholders_equity", "Total Equity"),
]

CASH_FLOW_LAYOUT: list[tuple[str | None, str]] = [
    (None, "OPERATING ACTIVITIES"),
    ("net_income", "Net Income"),
    ("depreciation", "Depreciation & Amortization"),
    ("sbc", "Stock-Based Compensation"),
    ("net_cash_from_operations", "Cash from Operations"),
    (None, "INVESTING ACTIVITIES"),
    ("capital_expenditures", "Capital Expenditures"),
    ("net_cash_from_investing", "Cash from Investing"),
    (None, "FINANCING ACTIVITIES"),
    ("dividends_paid", "Dividends Paid"),
    ("stock_buybacks", "Stock Buybacks"),
    ("net_cash_from_financing", "Cash from Financing"),
    ("net_change_in_cash", "Net Change in Cash"),
]
