import { ReactNode, useState } from "react";
import { TrendingUp } from "lucide-react";
import { ChatPanel } from "@/components/ChatPanel";
import type { ChatMessage } from "@/types/financials";

interface ReportPageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  chatMessages: ChatMessage[];
  onChatSend: (message: string) => void;
  chatLoading?: boolean;
}

export function ReportPageLayout({
  header,
  children,
  chatMessages,
  onChatSend,
  chatLoading = false,
}: ReportPageLayoutProps) {
  const [isChatCollapsed, setIsChatCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {header}

      {/* Main layout */}
      <div className="flex">
        {/* Main content area */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 lg:pr-[380px]">
            {children}
          </div>
        </main>

        {/* Chat panel - desktop sticky */}
        <aside className="hidden lg:block fixed right-0 top-16 bottom-0 w-[360px] border-l border-border/50 bg-background/50 backdrop-blur-xl">
          <ChatPanel
            messages={chatMessages}
            onSend={onChatSend}
            loading={chatLoading}
            className="h-full border-0 rounded-none bg-transparent"
          />
        </aside>

        {/* Chat panel - mobile overlay */}
        <div
          className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
            isChatCollapsed
              ? "pointer-events-none"
              : "bg-background/80 backdrop-blur-sm pointer-events-auto"
          }`}
          onClick={() => setIsChatCollapsed(true)}
        >
          <div
            className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ${
              isChatCollapsed ? "translate-y-full" : "translate-y-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ChatPanel
              messages={chatMessages}
              onSend={onChatSend}
              loading={chatLoading}
              onToggleCollapse={() => setIsChatCollapsed(true)}
              className="h-[70vh] rounded-b-none"
            />
          </div>
        </div>

        {/* Mobile chat FAB */}
        <ChatPanel
          messages={chatMessages}
          onSend={onChatSend}
          loading={chatLoading}
          isCollapsed={isChatCollapsed}
          onToggleCollapse={() => setIsChatCollapsed(false)}
        />
      </div>
    </div>
  );
}
