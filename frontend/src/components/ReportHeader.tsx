import { ArrowLeft, Building2, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportHeaderProps {
  company: string;
  ticker: string;
  period: string;
  form?: string;
  filedAt?: string;
  sourceUrl?: string;
  onChangeFilingClick?: () => void;
}

export function ReportHeader({
  company,
  ticker,
  period,
  form,
  filedAt,
  sourceUrl,
  onChangeFilingClick,
}: ReportHeaderProps) {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left section */}
          <div className="flex items-center gap-4 min-w-0">
            {onChangeFilingClick && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onChangeFilingClick}
                className="shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold truncate">{company}</h1>
                  <Badge variant="outline" className="font-mono font-semibold shrink-0">
                    {ticker}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {form && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      {form}
                    </Badge>
                  )}
                  <span>{period}</span>
                  {filedAt && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {filedAt}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 shrink-0">
            {sourceUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">View on SEC</span>
                </a>
              </Button>
            )}
            {onChangeFilingClick && (
              <Button variant="outline" size="sm" onClick={onChangeFilingClick}>
                Change Filing
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
