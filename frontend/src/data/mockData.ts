import type { FinancialReport, Filing, ChatMessage } from "@/types/financials";

export const mockFilings: Filing[] = [
  {
    filing_id: "aapl-10k-2023",
    form: "10-K",
    period: "FY2023",
    filed_at: "2023-11-03",
    fiscal_period_end: "2023-09-30",
    source_url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193",
  },
  {
    filing_id: "aapl-10q-q4-2023",
    form: "10-Q",
    period: "Q4 2023",
    filed_at: "2023-08-04",
    fiscal_period_end: "2023-07-01",
  },
  {
    filing_id: "aapl-10k-2022",
    form: "10-K",
    period: "FY2022",
    filed_at: "2022-10-28",
    fiscal_period_end: "2022-09-24",
  },
  {
    filing_id: "aapl-10q-q3-2023",
    form: "10-Q",
    period: "Q3 2023",
    filed_at: "2023-05-05",
  },
];

export const mockReport: FinancialReport = {
  company: "Apple Inc.",
  ticker: "AAPL",
  period: "FY2023",
  summary: `Apple reported strong fiscal year 2023 results despite macroeconomic headwinds. Total revenue came in at $383.3 billion, down 2.8% year-over-year, primarily due to weakness in iPhone and Mac segments. However, the Services segment continued its impressive growth trajectory, reaching $85.2 billion in revenue (+9.1% YoY).

Gross margin improved to 44.1% from 43.3%, driven by favorable product mix and cost efficiencies. The company generated $110.5 billion in operating cash flow and returned over $90 billion to shareholders through dividends and buybacks.

Key risks include supply chain concentration in China, regulatory scrutiny in the EU regarding App Store policies, and increased competition in the smartphone market.`,
  statements: {
    income_statement: {
      unit: "USDb",
      columns: ["FY2021", "FY2022", "FY2023"],
      rows: [
        { label: "Revenue", values: [365.8, 394.3, 383.3] },
        { label: "Cost of Revenue", values: [212.9, 223.5, 214.1] },
        { label: "Gross Profit", values: [152.8, 170.8, 169.1] },
        { label: "Operating Expenses", values: [null, null, null] },
        { label: "Research & Development", values: [21.9, 26.3, 29.9] },
        { label: "Selling, General & Admin", values: [21.9, 25.1, 24.9] },
        { label: "Total Operating Expenses", values: [43.9, 51.3, 54.8] },
        { label: "Operating Income", values: [108.9, 119.4, 114.3] },
        { label: "Interest Expense", values: [-2.6, -2.9, -3.9] },
        { label: "Other Income", values: [0.3, -0.2, -0.4] },
        { label: "Income Before Tax", values: [109.2, 119.1, 113.7] },
        { label: "Income Tax Expense", values: [14.5, 19.3, 16.7] },
        { label: "Net Income", values: [94.7, 99.8, 97.0] },
      ],
    },
    balance_sheet: {
      unit: "USDb",
      columns: ["FY2021", "FY2022", "FY2023"],
      rows: [
        { label: "ASSETS", values: [null, null, null] },
        { label: "Cash & Equivalents", values: [34.9, 23.6, 29.9] },
        { label: "Short-term Investments", values: [27.7, 24.7, 31.6] },
        { label: "Accounts Receivable", values: [26.3, 28.2, 29.5] },
        { label: "Inventory", values: [6.6, 4.9, 6.3] },
        { label: "Total Current Assets", values: [134.8, 135.4, 143.6] },
        { label: "Property, Plant & Equipment", values: [39.4, 42.1, 43.7] },
        { label: "Goodwill & Intangibles", values: [0.0, 0.0, 0.0] },
        { label: "Long-term Investments", values: [127.9, 120.8, 100.5] },
        { label: "Total Assets", values: [351.0, 352.8, 352.6] },
        { label: "LIABILITIES", values: [null, null, null] },
        { label: "Accounts Payable", values: [54.8, 64.1, 62.6] },
        { label: "Short-term Debt", values: [9.6, 11.1, 9.8] },
        { label: "Total Current Liabilities", values: [125.5, 153.9, 145.3] },
        { label: "Long-term Debt", values: [109.1, 98.9, 95.3] },
        { label: "Total Liabilities", values: [287.9, 302.1, 290.4] },
        { label: "EQUITY", values: [null, null, null] },
        { label: "Common Stock", values: [57.4, 64.8, 73.8] },
        { label: "Retained Earnings", values: [5.6, -3.1, -214.0] },
        { label: "Total Equity", values: [63.1, 50.7, 62.1] },
      ],
    },
    cash_flow: {
      unit: "USDb",
      columns: ["FY2021", "FY2022", "FY2023"],
      rows: [
        { label: "OPERATING ACTIVITIES", values: [null, null, null] },
        { label: "Net Income", values: [94.7, 99.8, 97.0] },
        { label: "Depreciation & Amortization", values: [11.3, 11.1, 11.5] },
        { label: "Stock-Based Compensation", values: [7.9, 9.0, 10.8] },
        { label: "Changes in Working Capital", values: [-4.9, 1.2, -8.8] },
        { label: "Cash from Operations", values: [104.0, 122.2, 110.5] },
        { label: "INVESTING ACTIVITIES", values: [null, null, null] },
        { label: "Capital Expenditures", values: [-11.1, -10.7, -10.9] },
        { label: "Acquisitions", values: [-0.0, -0.0, -0.0] },
        { label: "Investment Purchases", values: [-109.6, -76.9, -29.5] },
        { label: "Investment Sales", values: [106.9, 67.6, 45.5] },
        { label: "Cash from Investing", values: [-14.5, -22.4, 3.7] },
        { label: "FINANCING ACTIVITIES", values: [null, null, null] },
        { label: "Debt Issued", values: [20.4, 5.5, 5.2] },
        { label: "Debt Repaid", values: [-8.8, -9.5, -11.1] },
        { label: "Dividends Paid", values: [-14.5, -14.8, -15.0] },
        { label: "Stock Buybacks", values: [-85.5, -89.4, -77.5] },
        { label: "Cash from Financing", values: [-93.4, -110.7, -108.5] },
        { label: "Net Change in Cash", values: [-3.9, -10.9, 5.7] },
      ],
    },
  },
  ratios: {
    gross_margin: 44.1,
    operating_margin: 29.8,
    net_margin: 25.3,
    roe: 156.1,
    roa: 27.5,
    current_ratio: 0.99,
    quick_ratio: 0.94,
    debt_to_equity: 1.53,
    asset_turnover: 1.09,
    pe_ratio: 29.2,
    eps: 6.13,
    revenue_growth: -2.8,
    earnings_growth: -2.8,
    free_cash_flow_margin: 26.0,
  },
  series: {
    revenue: [
      { period: "FY2019", value: 260.2 },
      { period: "FY2020", value: 274.5 },
      { period: "FY2021", value: 365.8 },
      { period: "FY2022", value: 394.3 },
      { period: "FY2023", value: 383.3 },
    ],
    free_cash_flow: [
      { period: "FY2019", value: 58.9 },
      { period: "FY2020", value: 73.4 },
      { period: "FY2021", value: 92.9 },
      { period: "FY2022", value: 111.4 },
      { period: "FY2023", value: 99.6 },
    ],
    net_margin: [
      { period: "FY2019", value: 21.2 },
      { period: "FY2020", value: 20.9 },
      { period: "FY2021", value: 25.9 },
      { period: "FY2022", value: 25.3 },
      { period: "FY2023", value: 25.3 },
    ],
  },
};

export const mockChatMessages: ChatMessage[] = [
  {
    role: "user",
    content: "What were the main drivers of revenue change this year?",
  },
  {
    role: "assistant",
    content: `Revenue declined 2.8% to $383.3B in FY2023, primarily driven by:

1. **iPhone** (-2.4%): Slower upgrade cycles and macro headwinds in China
2. **Mac** (-27%): Post-pandemic normalization after M1 chip boom
3. **iPad** (-3.4%): Continued market softness

Partially offset by:
- **Services** (+9.1%): Strong App Store, iCloud, and Apple Music growth
- **Wearables** (+5%): Apple Watch Ultra and AirPods demand`,
  },
];
