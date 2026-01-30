import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, DollarSign, Percent, BarChart3 } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

interface SeriesPoint {
  period: string;
  value: number | null;
}

interface ChartsPanelProps {
  series?: Record<string, SeriesPoint[]>;
  revenueSeries?: SeriesPoint[];
  fcfSeries?: SeriesPoint[];
  marginSeries?: SeriesPoint[];
  loading?: boolean;
}

interface ChartCardProps {
  title: string;
  icon: typeof TrendingUp;
  data: SeriesPoint[];
  color: string;
  isPercent?: boolean;
  loading?: boolean;
}

function ChartCard({ title, icon: Icon, data, color, isPercent = false, loading = false }: ChartCardProps) {
  const chartData = useMemo(() => {
    return data
      .filter((d) => d.value !== null)
      .map((d) => ({
        period: d.period,
        value: d.value as number,
      }));
  }, [data]);

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const firstValue = chartData[0]?.value || 0;
  const lastValue = chartData[chartData.length - 1]?.value || 0;
  const trend = firstValue !== 0 ? ((lastValue - firstValue) / Math.abs(firstValue)) * 100 : 0;
  const trendLabel = trend >= 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
            {title}
          </CardTitle>
          <Badge
            variant={trend >= 0 ? "default" : "destructive"}
            className={`font-mono text-xs ${
              trend >= 0 ? "bg-positive/10 text-positive hover:bg-positive/20" : ""
            }`}
          >
            {trendLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(val) =>
                  isPercent ? `${val.toFixed(0)}%` : formatNumber(val)
                }
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                formatter={(value: number) => [
                  isPercent ? `${value.toFixed(2)}%` : formatNumber(value),
                  title,
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartsPanel({
  series,
  revenueSeries,
  fcfSeries,
  marginSeries,
  loading = false,
}: ChartsPanelProps) {
  // Use provided series or extract from the series object
  const revenue = revenueSeries || series?.revenue || series?.total_revenue || [];
  const fcf = fcfSeries || series?.free_cash_flow || series?.fcf || [];
  const margin = marginSeries || series?.net_margin || series?.operating_margin || [];

  const hasData = revenue.length > 0 || fcf.length > 0 || margin.length > 0;

  if (!hasData && !loading) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            No historical data available for charts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Trend Analysis</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Revenue"
          icon={DollarSign}
          data={revenue}
          color="hsl(var(--chart-1))"
          loading={loading}
        />
        <ChartCard
          title="Free Cash Flow"
          icon={TrendingUp}
          data={fcf}
          color="hsl(var(--chart-2))"
          loading={loading}
        />
        <ChartCard
          title="Net Margin"
          icon={Percent}
          data={margin}
          color="hsl(var(--chart-3))"
          isPercent
          loading={loading}
        />
      </div>
    </div>
  );
}
