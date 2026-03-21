import { useState } from "react";

// API
import { fetchFilings, fetchFinancials, sendChatMessage } from "@/lib/api";

// Components
import { FilingSelectionPageLayout } from "@/components/FilingSelectionPageLayout";
import { TickerInputCard } from "@/components/TickerInputCard";
import { FilingsPickerCard } from "@/components/FilingsPickerCard";
import { ReportPageLayout } from "@/components/ReportPageLayout";
import { ReportHeader } from "@/components/ReportHeader";
import { SummaryCard } from "@/components/SummaryCard";
import { ReportTabs } from "@/components/ReportTabs";
import { StatementTable } from "@/components/StatementTable";
import { RatiosGrid } from "@/components/RatiosGrid";
import { ChartsPanel } from "@/components/ChartsPanel";

// Types
import type { ChatMessage, Filing, FinancialReport } from "@/types/financials";

type AppView = "selection" | "report";
type TabKey = "income" | "balance" | "cashflow" | "ratios";

const Index = () => {
  // Selection state
  const [view, setView] = useState<AppView>("selection");
  const [ticker, setTicker] = useState("");
  const [tickerLoading, setTickerLoading] = useState(false);
  const [tickerError, setTickerError] = useState<string | undefined>();
  const [filings, setFilings] = useState<Filing[]>([]);
  const [company, setCompany] = useState("");
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Report state
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [selectedForm, setSelectedForm] = useState("10-K");
  const [activeTab, setActiveTab] = useState<TabKey>("income");

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch filings for a ticker
  const handleSubmitTicker = async () => {
    if (!ticker.trim()) return;
    setTickerLoading(true);
    setTickerError(undefined);
    setFilings([]);
    setSelectedFilingId(null);
    try {
      const data = await fetchFilings(ticker.trim());
      setCompany(data.company);
      setFilings(data.filings);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ticker not found.";
      setTickerError(msg);
    } finally {
      setTickerLoading(false);
    }
  };

  // Load the selected filing report
  const handleLoadReport = async () => {
    if (!selectedFilingId) return;
    const selectedFiling = filings.find((f) => f.filing_id === selectedFilingId);
    if (!selectedFiling) return;

    setReportLoading(true);
    setTickerError(undefined);
    try {
      const data = await fetchFinancials(ticker.trim(), selectedFiling.form);
      setReport(data);
      setSelectedForm(selectedFiling.form);
      setChatMessages([]); // clear chat on new report
      setView("report");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load report.";
      setTickerError(msg);
    } finally {
      setReportLoading(false);
    }
  };

  // Send a chat message
  const handleChatSend = async (message: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatLoading(true);
    try {
      const { answer } = await sendChatMessage(message, ticker.trim(), selectedForm);
      setChatMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Chat error.";
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChangeFilingClick = () => {
    setView("selection");
    setActiveTab("income");
  };

  // ── Selection view ──────────────────────────────────────────────────────
  if (view === "selection") {
    return (
      <FilingSelectionPageLayout>
        <TickerInputCard
          ticker={ticker}
          onTickerChange={setTicker}
          onSubmitTicker={handleSubmitTicker}
          loading={tickerLoading}
          error={tickerError}
        />

        {filings.length > 0 && (
          <FilingsPickerCard
            company={company}
            ticker={ticker.toUpperCase()}
            filings={filings}
            selectedFilingId={selectedFilingId}
            onSelectFiling={setSelectedFilingId}
            onLoadReport={handleLoadReport}
            loading={reportLoading}
          />
        )}
      </FilingSelectionPageLayout>
    );
  }

  // ── Report view ─────────────────────────────────────────────────────────
  if (!report) return null;

  const selectedFiling = filings.find((f) => f.filing_id === selectedFilingId);

  return (
    <ReportPageLayout
      header={
        <ReportHeader
          company={report.company}
          ticker={report.ticker}
          period={report.period}
          form={selectedFiling?.form}
          sourceUrl={selectedFiling?.source_url}
          onChangeFilingClick={handleChangeFilingClick}
        />
      }
      chatMessages={chatMessages}
      onChatSend={handleChatSend}
      chatLoading={chatLoading}
    >
      <div className="space-y-8">
        {/* AI Summary */}
        <SummaryCard summary={report.summary} />

        {/* Trend charts */}
        <ChartsPanel series={report.series} />

        {/* Statement tabs */}
        <ReportTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          incomeContent={
            <StatementTable
              title="Income Statement"
              statement={report.statements.income_statement}
            />
          }
          balanceContent={
            <StatementTable
              title="Balance Sheet"
              statement={report.statements.balance_sheet}
            />
          }
          cashflowContent={
            <StatementTable
              title="Cash Flow Statement"
              statement={report.statements.cash_flow}
            />
          }
          ratiosContent={<RatiosGrid ratios={report.ratios} />}
        />
      </div>
    </ReportPageLayout>
  );
};

export default Index;
