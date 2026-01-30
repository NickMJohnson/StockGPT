import type {
  FilingsResponse,
  FinancialReport,
  ChatRequest,
  ChatResponse,
  ApiError,
} from "../types/financials";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // try to throw a consistent error shape
    const err = (data as ApiError) ?? {
      error: { code: String(res.status), message: res.statusText },
    };
    throw err;
  }

  return data as T;
}

export const api = {
  getFilings: (ticker: string) =>
    request<FilingsResponse>(`/api/filings?ticker=${encodeURIComponent(ticker)}`),

  getReport: (ticker: string, filing_id: string) =>
    request<FinancialReport>(`/api/report`, {
      method: "POST",
      body: JSON.stringify({ ticker, filing_id }),
    }),

  chat: (payload: ChatRequest) =>
    request<ChatResponse>(`/api/chat`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
