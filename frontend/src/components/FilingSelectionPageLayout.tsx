import { ReactNode } from "react";
import { TrendingUp } from "lucide-react";

interface FilingSelectionPageLayoutProps {
  children: ReactNode;
}

export function FilingSelectionPageLayout({ children }: FilingSelectionPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Stockpiler</span>
          </div>
          <div className="text-sm text-muted-foreground">
            SEC Filing Analysis
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Hero text */}
          <div className="text-center space-y-4 max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Analyze SEC Filings with{" "}
              <span className="gradient-text">AI-Powered</span> Insights
            </h1>
            <p className="text-lg text-muted-foreground">
              Get instant access to parsed financial statements, key ratios, and
              AI-generated summaries for any public company.
            </p>
          </div>

          {/* Card content slot */}
          <div className="w-full flex flex-col items-center gap-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Data sourced from SEC EDGAR. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
