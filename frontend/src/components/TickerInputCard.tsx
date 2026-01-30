import { useState } from "react";
import { Search, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TickerInputCardProps {
  ticker: string;
  onTickerChange: (ticker: string) => void;
  onSubmitTicker: () => void;
  loading?: boolean;
  error?: string;
}

export function TickerInputCard({
  ticker,
  onTickerChange,
  onSubmitTicker,
  loading = false,
  error,
}: TickerInputCardProps) {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim() && !loading) {
      onSubmitTicker();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Card className="glass-card w-full max-w-md animate-fade-in">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <TrendingUp className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl font-semibold">Search Company</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter a stock ticker to analyze SEC filings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div
              className={`relative flex items-center rounded-lg border-2 transition-all duration-200 ${
                focused
                  ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]"
                  : error
                  ? "border-destructive"
                  : "border-input"
              }`}
            >
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={ticker}
                onChange={(e) => onTickerChange(e.target.value.toUpperCase())}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="AAPL, MSFT, TSLA..."
                className="border-0 bg-transparent text-lg font-medium placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={!ticker.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Find Filings
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Try popular tickers:{" "}
            {["AAPL", "MSFT", "GOOGL", "AMZN"].map((t, i) => (
              <button
                key={t}
                onClick={() => onTickerChange(t)}
                className="text-primary hover:underline font-medium"
                disabled={loading}
              >
                {t}
                {i < 3 && ", "}
              </button>
            ))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
