import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import type { Statement } from "@/types/financials";
import { formatNumber, getUnitLabel } from "@/lib/formatters";

interface StatementTableProps {
  title: string;
  statement: Statement;
  loading?: boolean;
}

function ValueCell({ value }: { value: number | null }) {
  const formattedValue = formatNumber(value);
  const isNegative = value !== null && value < 0;

  return (
    <td
      className={`font-mono text-right px-3 py-2 border-b border-border/50 whitespace-nowrap ${
        isNegative ? "text-negative" : ""
      }`}
    >
      {formattedValue}
    </td>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-24 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function StatementTable({ title, statement, loading = false }: StatementTableProps) {
  const { unit, columns, rows } = statement;

  if (loading) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="py-12 text-center">
          <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No data available for {title}.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          {unit && (
            <Badge variant="secondary" className="text-xs font-normal">
              {getUnitLabel(unit)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground px-4 py-3 border-b border-border sticky left-0 bg-muted/30 z-10 min-w-[200px]">
                    Item
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="text-right font-medium text-muted-foreground px-3 py-3 border-b border-border whitespace-nowrap min-w-[100px]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  // Detect section headers (usually all null values or specific patterns)
                  const isHeader = row.values.every((v) => v === null) || row.label.toUpperCase() === row.label;
                  
                  return (
                    <tr
                      key={`${row.label}-${idx}`}
                      className={`hover:bg-muted/30 transition-colors ${
                        isHeader && row.values.every(v => v === null) ? "bg-muted/20" : ""
                      }`}
                    >
                      <td
                        className={`text-left px-4 py-2.5 border-b border-border/50 sticky left-0 bg-card z-10 ${
                          isHeader && row.values.every(v => v === null)
                            ? "font-semibold text-foreground bg-muted/20"
                            : "text-foreground/90"
                        }`}
                      >
                        {row.label}
                      </td>
                      {row.values.map((value, vIdx) => (
                        <ValueCell key={`${row.label}-${vIdx}`} value={value} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
