import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Percent,
  DollarSign,
  Activity,
  PieChart,
} from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/formatters";

interface RatiosGridProps {
  ratios: Record<string, number | null>;
  loading?: boolean;
}

// Common financial ratio metadata
const ratioMeta: Record<
  string,
  { label: string; icon: typeof TrendingUp; isPercent?: boolean; inverseColor?: boolean }
> = {
  gross_margin: { label: "Gross Margin", icon: Percent, isPercent: true },
  operating_margin: { label: "Operating Margin", icon: Percent, isPercent: true },
  net_margin: { label: "Net Margin", icon: Percent, isPercent: true },
  roe: { label: "Return on Equity", icon: TrendingUp, isPercent: true },
  roa: { label: "Return on Assets", icon: TrendingUp, isPercent: true },
  current_ratio: { label: "Current Ratio", icon: Activity },
  quick_ratio: { label: "Quick Ratio", icon: Activity },
  debt_to_equity: { label: "Debt to Equity", icon: PieChart, inverseColor: true },
  asset_turnover: { label: "Asset Turnover", icon: Activity },
  inventory_turnover: { label: "Inventory Turnover", icon: Activity },
  pe_ratio: { label: "P/E Ratio", icon: DollarSign },
  eps: { label: "Earnings Per Share", icon: DollarSign },
  revenue_growth: { label: "Revenue Growth", icon: TrendingUp, isPercent: true },
  earnings_growth: { label: "Earnings Growth", icon: TrendingUp, isPercent: true },
  free_cash_flow_margin: { label: "FCF Margin", icon: Percent, isPercent: true },
};

function getRatioLabel(key: string): string {
  if (ratioMeta[key]) return ratioMeta[key].label;
  // Convert snake_case to Title Case
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getRatioIcon(key: string) {
  return ratioMeta[key]?.icon || Activity;
}

function isPercentRatio(key: string): boolean {
  return ratioMeta[key]?.isPercent || key.includes("margin") || key.includes("growth") || key.includes("return");
}

function getValueColor(value: number | null, key: string): string {
  if (value === null) return "text-muted-foreground";
  
  const isInverse = ratioMeta[key]?.inverseColor;
  
  if (isInverse) {
    // For debt ratios, lower is better
    if (value > 2) return "text-negative";
    if (value < 1) return "text-positive";
    return "text-foreground";
  }
  
  // For most ratios, higher is better
  if (isPercentRatio(key)) {
    if (value > 20) return "text-positive";
    if (value < 0) return "text-negative";
    return "text-foreground";
  }
  
  return "text-foreground";
}

function TrendIndicator({ value, isInverse }: { value: number | null; isInverse?: boolean }) {
  if (value === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
  
  const isPositive = isInverse ? value < 1 : value > 0;
  const isNegative = isInverse ? value > 2 : value < 0;
  
  if (isPositive) return <TrendingUp className="h-4 w-4 text-positive" />;
  if (isNegative) return <TrendingDown className="h-4 w-4 text-negative" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
      ))}
    </div>
  );
}

export function RatiosGrid({ ratios, loading = false }: RatiosGridProps) {
  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Key Financial Ratios</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  const ratioEntries = Object.entries(ratios);

  if (ratioEntries.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <PieChart className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No ratio data available for this filing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Key Financial Ratios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ratioEntries.map(([key, value]) => {
            const Icon = getRatioIcon(key);
            const isPercent = isPercentRatio(key);
            const isInverse = ratioMeta[key]?.inverseColor;
            
            return (
              <div
                key={key}
                className="group relative rounded-xl border border-border/50 bg-card/50 p-4 hover:bg-muted/30 transition-all hover:border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <TrendIndicator value={value} isInverse={isInverse} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{getRatioLabel(key)}</p>
                  <p className={`text-2xl font-semibold font-mono ${getValueColor(value, key)}`}>
                    {isPercent ? formatPercent(value) : formatNumber(value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
