import { FileText, Calendar, ExternalLink, ChevronDown, Loader2, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Filing } from "@/types/financials";
import { formatDate } from "@/lib/formatters";

interface FilingsPickerCardProps {
  company: string;
  ticker: string;
  filings: Filing[];
  selectedFilingId: string | null;
  onSelectFiling: (id: string) => void;
  onLoadReport: () => void;
  loading?: boolean;
}

function getFormBadgeVariant(form: string): "default" | "secondary" | "outline" {
  if (form === "10-K") return "default";
  if (form === "10-Q") return "secondary";
  return "outline";
}

export function FilingsPickerCard({
  company,
  ticker,
  filings,
  selectedFilingId,
  onSelectFiling,
  onLoadReport,
  loading = false,
}: FilingsPickerCardProps) {
  const selectedFiling = filings.find((f) => f.filing_id === selectedFilingId);

  if (filings.length === 0) {
    return (
      <Card className="glass-card w-full max-w-md animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileText className="h-7 w-7" />
          </div>
          <p className="text-lg font-medium text-foreground">No filings found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter a ticker above to search for SEC filings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card w-full max-w-md animate-slide-up">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-semibold truncate">{company}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono font-semibold">
                {ticker}
              </Badge>
              <span className="text-muted-foreground">
                {filings.length} filing{filings.length !== 1 ? "s" : ""} available
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Select Filing Period
          </label>
          <Select value={selectedFilingId || ""} onValueChange={onSelectFiling}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Choose a filing..." />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="max-h-[280px]">
                {filings.map((filing) => (
                  <SelectItem
                    key={filing.filing_id}
                    value={filing.filing_id}
                    className="py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={getFormBadgeVariant(filing.form)} className="font-mono">
                        {filing.form}
                      </Badge>
                      <span className="font-medium">{filing.period}</span>
                      {filing.filed_at && (
                        <span className="text-xs text-muted-foreground">
                          Filed {formatDate(filing.filed_at)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        {selectedFiling && (
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getFormBadgeVariant(selectedFiling.form)} className="font-mono">
                    {selectedFiling.form}
                  </Badge>
                  <span className="font-semibold">{selectedFiling.period}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  {selectedFiling.filed_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Filed: {formatDate(selectedFiling.filed_at)}
                    </span>
                  )}
                  {selectedFiling.fiscal_period_end && (
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      Period End: {formatDate(selectedFiling.fiscal_period_end)}
                    </span>
                  )}
                </div>
              </div>
              {selectedFiling.source_url && (
                <Button variant="ghost" size="icon" asChild className="shrink-0">
                  <a
                    href={selectedFiling.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on SEC.gov"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={onLoadReport}
          className="w-full h-12 text-base font-medium"
          disabled={!selectedFilingId || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading Report...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Analyze Filing
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
