import type { FinancialReport, FilingsResponse, LabResponse } from "@/types/financials";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchFilings(ticker: string): Promise<FilingsResponse> {
  const res = await fetch(`${BASE_URL}/api/filings?ticker=${encodeURIComponent(ticker)}`);
  return handleResponse<FilingsResponse>(res);
}

export async function fetchFinancials(
  ticker: string,
  form: string,
): Promise<FinancialReport> {
  const res = await fetch(
    `${BASE_URL}/api/financials?ticker=${encodeURIComponent(ticker)}&form=${encodeURIComponent(form)}`,
  );
  return handleResponse<FinancialReport>(res);
}

export async function sendChatMessage(
  question: string,
  ticker: string,
  form: string,
): Promise<{ answer: string }> {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, ticker, form }),
  });
  return handleResponse<{ answer: string }>(res);
}

export async function sendLabMessage(
  question: string,
  ticker: string,
  form: string,
): Promise<LabResponse> {
  const res = await fetch(`${BASE_URL}/api/lab`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, ticker, form }),
  });
  return handleResponse<LabResponse>(res);
}
