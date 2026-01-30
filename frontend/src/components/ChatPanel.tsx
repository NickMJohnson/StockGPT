import { useRef, useEffect } from "react";
import { MessageSquare, Sparkles, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { ChatInput } from "@/components/ChatInput";
import type { ChatMessage } from "@/types/financials";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  loading?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-muted-foreground animate-fade-in">
      <div className="flex gap-1">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <span className="text-sm">Analyzing...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Ask About This Filing</h3>
      <p className="text-sm text-muted-foreground max-w-[250px]">
        Get instant answers about revenue, expenses, margins, or any financial metric in this report.
      </p>
      <div className="mt-6 space-y-2 w-full max-w-[280px]">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Try asking:</p>
        {[
          "What drove revenue growth?",
          "How did margins change?",
          "What are the main risks?",
        ].map((q) => (
          <button
            key={q}
            className="w-full text-left text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-foreground/80"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatPanel({
  messages,
  onSend,
  loading = false,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Mobile collapsed view
  if (isCollapsed) {
    return (
      <Button
        onClick={onToggleCollapse}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50 lg:hidden"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card
      className={`glass-card flex flex-col h-full overflow-hidden ${className}`}
    >
      <CardHeader className="pb-3 border-b border-border/50 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MessageSquare className="h-4 w-4" />
            </div>
            AI Assistant
          </CardTitle>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="lg:hidden h-8 w-8"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-4 p-4">
              {messages.map((msg, idx) => (
                <ChatMessageBubble key={idx} message={msg} />
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <TypingIndicator />
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <ChatInput onSend={onSend} loading={loading} />
    </Card>
  );
}
