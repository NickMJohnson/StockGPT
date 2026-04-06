import { useState } from "react";
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
import { FlaskConical, Send, Loader2, X, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { LabTile, LabChartPoint, LabChartSeries } from "@/types/financials";

const SERIES_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const EXAMPLE_PROMPTS = [
  "Chart revenue growth rate year over year",
  "Compute interest coverage ratio",
  "Chart gross margin vs net margin over time",
  "Show operating expenses as % of revenue",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function mergeChartData(
  series: LabChartSeries[],
): Record<string, number | string>[] {
  const periodSet = new Set<string>();
  series.forEach((s) => s.data.forEach((d: LabChartPoint) => periodSet.add(d.period)));
  const periods = Array.from(periodSet).sort();
  return periods.map((period) => {
    const row: Record<string, number | string> = { period };
    series.forEach((s) => {
      const point = s.data.find((d: LabChartPoint) => d.period === period);
      if (point !== undefined) row[s.name] = point.value;
    });
    return row;
  });
}

// ── Tile components ───────────────────────────────────────────────────────────

function RatioTile({
  tile,
  onDelete,
}: {
  tile: Extract<LabTile, { type: "ratio" }>;
  onDelete: (id: string) => void;
}) {
  const display = tile.is_percent
    ? `${tile.value.toFixed(1)}%`
    : Math.abs(tile.value) >= 1
    ? tile.value.toFixed(2)
    : tile.value.toFixed(4);

  return (
    <div className="group relative rounded-xl border border-border/50 bg-card/60 p-4 space-y-1 hover:border-border transition-colors">
      <button
        onClick={() => onDelete(tile.id)}
        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-muted hover:bg-destructive hover:text-destructive-foreground transition-all"
        aria-label="Remove tile"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <p className="text-xs text-muted-foreground font-medium pr-6">{tile.label}</p>
      <p className="text-2xl font-semibold font-mono text-foreground">{display}</p>
      {tile.description && (
        <p className="text-xs text-muted-foreground leading-snug">{tile.description}</p>
      )}
    </div>
  );
}

function ChartTile({
  tile,
  onDelete,
}: {
  tile: Extract<LabTile, { type: "chart" }>;
  onDelete: (id: string) => void;
}) {
  const { title, series } = tile;
  const isPercent = series[0]?.is_percent ?? false;
  const chartData = mergeChartData(series);
  const isMulti = series.length > 1;

  const tooltipFormatter = (value: number, name: string) => [
    isPercent ? `${value.toFixed(2)}%` : `${value.toFixed(2)}B`,
    name,
  ];

  return (
    <Card className="col-span-full glass-card group relative">
      <button
        onClick={() => onDelete(tile.id)}
        className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 bg-muted hover:bg-destructive hover:text-destructive-foreground transition-all z-10"
        aria-label="Remove tile"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm pr-8">{title}</CardTitle>
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
                  <linearGradient id={`lab-grad-${tile.id}`} x1="0" y1="0" x2="0" y2="1">
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
                  fill={`url(#lab-grad-${tile.id})`}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
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

// ── Main component ────────────────────────────────────────────────────────────

interface LabPanelProps {
  tiles: LabTile[];
  loading: boolean;
  lastExplanation?: string;
  onSend: (question: string) => void;
  onDeleteTile: (id: string) => void;
}

export function LabPanel({ tiles, loading, lastExplanation, onSend, onDeleteTile }: LabPanelProps) {
  const [input, setInput] = useState("");

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
      {tiles.length === 0 && !loading && (
        <Card className="glass-card">
          <CardContent className="py-10 flex flex-col items-center gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FlaskConical className="h-7 w-7" />
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">AI Lab</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ask for any metric or chart. Results appear as tiles you can keep or remove.
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

      {/* Tile grid */}
      {tiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tiles.map((tile) =>
            tile.type === "ratio" ? (
              <RatioTile key={tile.id} tile={tile} onDelete={onDeleteTile} />
            ) : (
              <ChartTile key={tile.id} tile={tile} onDelete={onDeleteTile} />
            )
          )}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground animate-fade-in">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Computing…
        </div>
      )}

      {/* Last explanation */}
      {lastExplanation && !loading && (
        <div className="flex items-start gap-2 rounded-lg bg-muted/40 px-4 py-3 text-sm text-muted-foreground animate-fade-in">
          <Info className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <span>{lastExplanation}</span>
        </div>
      )}

      {/* Input */}
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
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </Button>
        </div>
        {tiles.length > 0 && (
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
