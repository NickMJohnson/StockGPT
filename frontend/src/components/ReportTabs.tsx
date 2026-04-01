import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Wallet, PieChart, FlaskConical } from "lucide-react";

type TabKey = "income" | "balance" | "cashflow" | "ratios" | "lab";

interface ReportTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  incomeContent: ReactNode;
  balanceContent: ReactNode;
  cashflowContent: ReactNode;
  ratiosContent: ReactNode;
  labContent: ReactNode;
}

const tabConfig: Array<{ key: TabKey; label: string; shortLabel: string; icon: typeof FileText }> = [
  { key: "income", label: "Income Statement", shortLabel: "Income", icon: BarChart3 },
  { key: "balance", label: "Balance Sheet", shortLabel: "Balance", icon: Wallet },
  { key: "cashflow", label: "Cash Flow", shortLabel: "Cash", icon: PieChart },
  { key: "ratios", label: "Key Ratios", shortLabel: "Ratios", icon: FileText },
  { key: "lab", label: "AI Lab", shortLabel: "Lab", icon: FlaskConical },
];

export function ReportTabs({
  activeTab,
  onTabChange,
  incomeContent,
  balanceContent,
  cashflowContent,
  ratiosContent,
  labContent,
}: ReportTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => onTabChange(value as TabKey)}
      className="w-full"
    >
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-16 z-30 -mx-4 px-4 md:-mx-0 md:px-0 md:rounded-t-lg">
        <TabsList className="w-full h-auto p-1 bg-transparent justify-start gap-1 overflow-x-auto custom-scrollbar">
          {tabConfig.map(({ key, label, shortLabel, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="income" className="mt-6 animate-fade-in">
        {incomeContent}
      </TabsContent>
      <TabsContent value="balance" className="mt-6 animate-fade-in">
        {balanceContent}
      </TabsContent>
      <TabsContent value="cashflow" className="mt-6 animate-fade-in">
        {cashflowContent}
      </TabsContent>
      <TabsContent value="ratios" className="mt-6 animate-fade-in">
        {ratiosContent}
      </TabsContent>
      <TabsContent value="lab" className="mt-6 animate-fade-in">
        {labContent}
      </TabsContent>
    </Tabs>
  );
}
