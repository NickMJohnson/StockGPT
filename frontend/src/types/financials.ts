// Core financial data types for StockGPT

export interface Statement {
  unit?: "USD" | "USDm" | "USDb";
  columns: string[]; // e.g. ["FY2021","FY2022","FY2023"]
  rows: Array<{ label: string; values: Array<number | null> }>;
}

export interface FinancialReport {
  company: string;
  ticker: string;
  period: string;
  statements: {
    income_statement: Statement;
    balance_sheet: Statement;
    cash_flow: Statement;
  };
  ratios: Record<string, number | null>;
  summary: string;
  series?: Record<string, Array<{ period: string; value: number | null }>>;
}

export interface Filing {
  filing_id: string;
  form: string; // "10-K", "10-Q", etc
  period: string; // "FY2023", "Q1 2024"
  filed_at?: string; // ISO date
  fiscal_period_end?: string; // ISO date
  source_url?: string;
}

export interface FilingsResponse {
  ticker: string;
  company: string;
  filings: Filing[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
