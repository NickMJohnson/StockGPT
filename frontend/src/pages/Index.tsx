import { useState } from "react";

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

// Mock data
import { mockFilings, mockReport, mockChatMessages } from "@/data/mockData";

// Types
import type { ChatMessage, Filing } from "@/types/financials";

type AppView = "selection" | "report";
type TabKey = "income" | "balance" | "cashflow" | "ratios";

const Index = () => {
  // App state
  const [view, setView] = useState<AppView>("selection");
  const [ticker, setTicker] = useState("");
  const [tickerLoading, setTickerLoading] = useState(false);
  const [tickerError, setTickerError] = useState<string>();
  const [filings, setFilings] = useState<Filing[]>([]);
  const [company, setCompany] = useState("");
  const [selectedFilingId, setSelectedFilingId] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Report state
  const [activeTab, setActiveTab] = useState<TabKey>("income");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [chatLoading, setChatLoading] = useState(false);

  // Simulated ticker search
  const handleSubmitTicker = () => {
    if (!ticker.trim()) return;

    setTickerLoading(true);
    setTickerError(undefined);

    // Simulate API call
    setTimeout(() => {
      if (ticker.toUpperCase() === "AAPL") {
        setCompany("Apple Inc.");
        setFilings(mockFilings);
      } else if (ticker.toUpperCase() === "INVALID") {
        setTickerError("Ticker not found. Please try another symbol.");
        setFilings([]);
      } else {
        // Demo: show mock data for any ticker
        setCompany(`${ticker.toUpperCase()} Corporation`);
        setFilings(mockFilings);
      }
      setTickerLoading(false);
    }, 800);
  };

  // Simulated report load
  const handleLoadReport = () => {
    if (!selectedFilingId) return;

    setReportLoading(true);

    // Simulate API call
    setTimeout(() => {
      setReportLoading(false);
      setView("report");
    }, 1000);
  };

  // Chat handler
  const handleChatSend = (message: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've analyzed the ${mockReport.period} filing for ${mockReport.company}. Based on the financial statements, here's my response to your question about "${message}":\n\nThe data shows strong fundamentals with some areas to monitor. Would you like me to elaborate on any specific aspect?`,
        },
      ]);
      setChatLoading(false);
    }, 1500);
  };

  // Back to selection
  const handleChangeFilingClick = () => {
    setView("selection");
    setActiveTab("income");
  };

  // Render selection view
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

  // Render report view
  const selectedFiling = filings.find((f) => f.filing_id === selectedFilingId);

  return (
    <ReportPageLayout
      header={
        <ReportHeader
          company={mockReport.company}
          ticker={mockReport.ticker}
          period={mockReport.period}
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
        {/* Summary */}
        <SummaryCard summary={mockReport.summary} />

        {/* Charts */}
        <ChartsPanel series={mockReport.series} />

        {/* Tabs with statements */}
        <ReportTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          incomeContent={
            <StatementTable
              title="Income Statement"
              statement={mockReport.statements.income_statement}
            />
          }
          balanceContent={
            <StatementTable
              title="Balance Sheet"
              statement={mockReport.statements.balance_sheet}
            />
          }
          cashflowContent={
            <StatementTable
              title="Cash Flow Statement"
              statement={mockReport.statements.cash_flow}
            />
          }
          ratiosContent={<RatiosGrid ratios={mockReport.ratios} />}
        />
      </div>
    </ReportPageLayout>
  );
};

export default Index;
