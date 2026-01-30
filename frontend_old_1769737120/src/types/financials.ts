export type StatementUnit = "USD" | "USDm" | "USDb";

export type StatementRow = {
  label: string;
  values: Array<number | null>;
};

export type Statement = {
  unit?: StatementUnit;
  columns: string[];
  rows: StatementRow[];
};

export type SeriesPoint = { period: string; value: number | null };

export type FinancialReport = {
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
  series?: Record<string, SeriesPoint[]>;
};

export type Filing = {
  filing_id: string;
  form: string; // "10-K" | "10-Q" etc
  period: string; // "FY2023", "Q1 2024", etc
  filed_at?: string; // ISO date
  fiscal_period_end?: string; // ISO date
  source_url?: string;
};

export type FilingsResponse = {
  ticker: string;
  company: string;
  filings: Filing[];
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatRequest =
  | { ticker: string; period: string; question: string }
  | { ticker: string; period: string; messages: ChatMessage[] };

export type ChatCitation = {
  statement: "income_statement" | "balance_sheet" | "cash_flow";
  label: string;
  period: string;
};

export type ChatResponse = {
  answer: string;
  citations?: ChatCitation[];
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
