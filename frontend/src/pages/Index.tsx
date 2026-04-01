import { useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// API
import { fetchFilings, fetchFinancials, sendChatMessage, sendLabMessage } from "@/lib/api";

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
import { LabPanel } from "@/components/LabPanel";

// Types
import type { ChatMessage, Filing, FinancialReport, LabMessage } from "@/types/financials";

const LOADING_STEPS = [
  "Fetching SEC filing...",
  "Extracting financial statements...",
  "Computing ratios...",
  "Generating AI summary...",
];

type AppView = "selection" | "report";
type TabKey = "income" | "balance" | "cashflow" | "ratios" | "lab";

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
  const [reportError, setReportError] = useState<string | undefined>();
  const [loadingStep, setLoadingStep] = useState(0);

  // Report state
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [selectedForm, setSelectedForm] = useState("10-K");
  const [activeTab, setActiveTab] = useState<TabKey>("income");

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Lab state
  const [labMessages, setLabMessages] = useState<LabMessage[]>([]);
  const [labLoading, setLabLoading] = useState(false);

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
    setReportError(undefined);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 2500);

    try {
      const data = await fetchFinancials(ticker.trim(), selectedFiling.form);
      setReport(data);
      setSelectedForm(selectedFiling.form);
      setChatMessages([]); // clear chat on new report
      setLabMessages([]);  // clear lab on new report
      setView("report");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load report.";
      setReportError(msg);
    } finally {
      clearInterval(stepInterval);
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

  // Send a lab request
  const handleLabSend = async (question: string) => {
    setLabLoading(true);
    try {
      const response = await sendLabMessage(question, ticker.trim(), selectedForm);
      setLabMessages((prev) => [...prev, { question, response }]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lab error.";
      setLabMessages((prev) => [
        ...prev,
        { question, response: { explanation: `Error: ${msg}` } },
      ]);
    } finally {
      setLabLoading(false);
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

        {reportLoading && (
          <Card className="glass-card w-full max-w-md animate-fade-in">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-base font-medium text-foreground">
                {LOADING_STEPS[loadingStep]}
              </p>
              <p className="text-xs text-muted-foreground">
                First load may take 5–10 seconds
              </p>
            </CardContent>
          </Card>
        )}

        {!reportLoading && reportError && (
          <Card className="glass-card w-full max-w-md animate-fade-in border-destructive/50">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-semibold text-foreground">Failed to load report</p>
                <p className="text-sm text-muted-foreground">{reportError}</p>
              </div>
              <Button variant="outline" onClick={handleLoadReport} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {!reportLoading && !reportError && filings.length > 0 && (
          <FilingsPickerCard
            company={company}
            ticker={ticker.toUpperCase()}
            filings={filings}
            selectedFilingId={selectedFilingId}
            onSelectFiling={setSelectedFilingId}
            onLoadReport={handleLoadReport}
            loading={false}
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
          labContent={
            <LabPanel
              messages={labMessages}
              loading={labLoading}
              onSend={handleLabSend}
            />
          }
        />
      </div>
    </ReportPageLayout>
  );
};

export default Index;
