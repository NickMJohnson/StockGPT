import { useRef, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Sparkles, Send, Loader2, FlaskConical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { LabMessage, LabResponse, LabChartPoint } from "@/types/financials";

// Palette of CSS chart colours matching the existing design
const SERIES_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const EXAMPLE_PROMPTS = [
  "Chart gross profit vs operating income over time",
  "Compute interest coverage ratio",
  "Show operating expenses as % of revenue by year",
  "Chart revenue growth rate year over year",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function mergeChartData(
  series: { name: string; data: LabChartPoint[] }[],
): Record<string, number | string>[] {
  const periodSet = new Set<string>();
  series.forEach((s) => s.data.forEach((d) => periodSet.add(d.period)));
  const periods = Array.from(periodSet).sort();

  return periods.map((period) => {
    const row: Record<string, number | string> = { period };
    series.forEach((s) => {
      const point = s.data.find((d) => d.period === period);
      if (point !== undefined) row[s.name] = point.value;
    });
    return row;
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function LabRatioCard({
  label,
  value,
  description,
  is_percent,
}: {
  label: string;
  value: number;
  description?: string;
  is_percent?: boolean;
}) {
  const display = is_percent
    ? `${value.toFixed(1)}%`
    : Math.abs(value) >= 1
    ? value.toFixed(2)
    : value.toFixed(4);

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-4 space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-2xl font-semibold font-mono text-foreground">{display}</p>
      {description && (
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      )}
    </div>
  );
}

function LabChartCard({ chart }: { chart: LabResponse["chart"] }) {
  if (!chart) return null;

  const { title, series } = chart;
  const isPercent = series[0]?.is_percent ?? false;
  const chartData = mergeChartData(series);
  const isMulti = series.length > 1;

  const tooltipFormatter = (value: number, name: string) => [
    isPercent ? `${value.toFixed(2)}%` : `${value.toFixed(2)}B`,
    name,
  ];

  return (
    <Card className="glass-card mt-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            {isMulti ? (
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickFormatter={(v) => (isPercent ? `${v}%` : `${v}B`)}
                  width={52}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                  formatter={tooltipFormatter}
                />
                {series.map((s, i) => (
                  <Line
                    key={s.name}
                    type="monotone"
                    dataKey={s.name}
                    stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="lab-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SERIES_COLORS[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={SERIES_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  tickFormatter={(v) => (isPercent ? `${v}%` : `${v}B`)}
                  width={52}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                  formatter={tooltipFormatter}
                />
                <Area
                  type="monotone"
                  dataKey={series[0].name}
                  stroke={SERIES_COLORS[0]}
                  strokeWidth={2}
                  fill="url(#lab-gradient)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
        {/* Legend for multi-series */}
        {isMulti && (
          <div className="flex flex-wrap gap-3 mt-3">
            {series.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                {s.name}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LabResultCard({ message }: { message: LabMessage }) {
  const { question, response } = message;
  return (
    <div className="space-y-3 animate-fade-in">
      {/* User question */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {question}
        </div>
      </div>

      {/* AI response card */}
      <div className="rounded-2xl rounded-tl-sm border border-border/50 bg-card/60 px-4 py-3 space-y-3">
        <p className="text-sm text-foreground leading-relaxed">{response.explanation}</p>

        {response.ratios && response.ratios.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {response.ratios.map((r) => (
              <LabRatioCard key={r.label} {...r} />
            ))}
          </div>
        )}

        {response.chart && <LabChartCard chart={response.chart} />}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface LabPanelProps {
  messages: LabMessage[];
  loading: boolean;
  onSend: (question: string) => void;
}

export function LabPanel({ messages, loading, onSend }: LabPanelProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    onSend(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Empty state */}
      {messages.length === 0 && !loading && (
        <Card className="glass-card">
          <CardContent className="py-10 flex flex-col items-center gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FlaskConical className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">AI Lab</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ask me to compute any financial metric or plot a custom chart from this filing's data.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => onSend(p)}
                  className="rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation history */}
      {messages.length > 0 && (
        <div className="space-y-6">
          {messages.map((m, i) => (
            <LabResultCard key={i} message={m} />
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground animate-fade-in">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Computing…
        </div>
      )}

      <div ref={bottomRef} />

      {/* Input row */}
      <div className="sticky bottom-0 pt-2 pb-1">
        <div className="flex gap-2 rounded-xl border border-border/60 bg-background/80 backdrop-blur-sm p-1.5">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Chart gross margin vs net margin over time…"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            disabled={loading}
          />
          <Button
            size="sm"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="shrink-0 gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </Button>
        </div>
        {messages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLE_PROMPTS.slice(0, 2).map((p) => (
              <Badge
                key={p}
                variant="outline"
                className="cursor-pointer text-xs font-normal hover:bg-muted transition-colors"
                onClick={() => !loading && onSend(p)}
              >
                {p}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
