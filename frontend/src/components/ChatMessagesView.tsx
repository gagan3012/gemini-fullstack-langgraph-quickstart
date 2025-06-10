import type React from "react";
import type { Message } from "@langchain/langgraph-sdk";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Copy, CopyCheck, Brain, Award, TrendingUp, Download, Sun, Moon } from "lucide-react";
import { InputForm } from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { generatePDF } from "@/lib/pdfUtils";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ActivityTimeline,
  ProcessedEvent,
} from "@/components/ActivityTimeline";

// Markdown component props type
type MdComponentProps = {
  className?: string;
  children?: ReactNode;
  href?: string;
  style?: React.CSSProperties;
};

// Enhanced markdown components with enterprise-grade table styling
const mdComponents = {  h1: ({ className, children, ...props }: MdComponentProps) => (
    <h1 className={cn("text-3xl font-bold mt-8 mb-6 text-neutral-900 dark:text-neutral-100 border-b-2 border-gradient-to-r from-blue-500 to-purple-500 pb-3", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ className, children, ...props }: MdComponentProps) => (
    <h2 className={cn("text-2xl font-bold mt-6 mb-4 text-neutral-900 dark:text-neutral-100 flex items-center gap-2", className)} {...props}>
      <Award className="h-6 w-6 text-blue-500 dark:text-blue-400" />
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: MdComponentProps) => (
    <h3 className={cn("text-xl font-bold mt-5 mb-3 text-neutral-800 dark:text-neutral-200", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ className, children, ...props }: MdComponentProps) => (
    <h4 className={cn("text-lg font-semibold mt-4 mb-2 text-neutral-800 dark:text-neutral-200", className)} {...props}>
      {children}
    </h4>
  ),
  p: ({ className, children, ...props }: MdComponentProps) => (
    <p className={cn("mb-4 leading-7 text-neutral-700 dark:text-neutral-200 text-base", className)} {...props}>
      {children}
    </p>
  ),
  a: ({ className, children, href, ...props }: MdComponentProps) => (
    <Badge variant="secondary" className="text-xs mx-0.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50 transition-colors">
      <a
        className={cn("hover:text-blue-200 transition-colors", className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    </Badge>
  ),
  ul: ({ className, children, ...props }: MdComponentProps) => (
    <ul className={cn("list-disc pl-6 mb-6 space-y-2", className)} {...props}>
      {children}
    </ul>
  ),
  ol: ({ className, children, ...props }: MdComponentProps) => (
    <ol className={cn("list-decimal pl-6 mb-6 space-y-2", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ className, children, ...props }: MdComponentProps) => (
    <li className={cn("mb-1 text-neutral-200 leading-relaxed", className)} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ className, children, ...props }: MdComponentProps) => (
    <blockquote
      className={cn(
        "border-l-4 border-blue-500 bg-neutral-800/50 pl-6 py-4 italic my-6 text-neutral-300 rounded-r-lg backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }: MdComponentProps) => (
    <code
      className={cn(
        "bg-neutral-800 border border-neutral-600 rounded px-2 py-1 font-mono text-sm text-blue-300",
        className
      )}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ className, children, ...props }: MdComponentProps) => (
    <pre
      className={cn(
        "bg-neutral-900 border border-neutral-600 p-6 rounded-lg overflow-x-auto font-mono text-sm my-6 text-neutral-200 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  ),
  hr: ({ className, ...props }: MdComponentProps) => (
    <hr className={cn("border-neutral-600 my-8", className)} {...props} />
  ),
  table: ({ className, children, ...props }: MdComponentProps) => (
    <div className="my-8 overflow-hidden rounded-xl border border-neutral-600 shadow-2xl bg-neutral-800/30 backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className={cn("w-full border-collapse", className)} {...props}>
          {children}
        </table>
      </div>
    </div>
  ),
  thead: ({ className, children, ...props }: MdComponentProps) => (
    <thead className={cn("bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600", className)} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ className, children, ...props }: MdComponentProps) => (
    <tbody className={cn("divide-y divide-neutral-600", className)} {...props}>
      {children}
    </tbody>
  ),
  tr: ({ className, children, ...props }: MdComponentProps) => (
    <tr className={cn("border-b border-neutral-600 hover:bg-neutral-700/30 transition-all duration-200", className)} {...props}>
      {children}
    </tr>
  ),
  th: ({ className, children, ...props }: MdComponentProps) => (
    <th
      className={cn(
        "px-6 py-4 text-left font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 first:rounded-tl-xl last:rounded-tr-xl border-r border-white/20 last:border-r-0 text-sm uppercase tracking-wide",
        className
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ className, children, ...props }: MdComponentProps) => {
    // Check if this cell contains a grade (A-F)
    const isGrade = typeof children === 'string' && /^[A-F][+-]?$/.test(children.trim());
    const gradeColors = {
      'A': 'text-green-400 bg-green-500/20',
      'B': 'text-blue-400 bg-blue-500/20', 
      'C': 'text-yellow-400 bg-yellow-500/20',
      'D': 'text-orange-400 bg-orange-500/20',
      'F': 'text-red-400 bg-red-500/20'
    };
    const gradeColor = isGrade ? gradeColors[children.toString().trim()[0] as keyof typeof gradeColors] : '';
    
    return (
      <td
        className={cn(
          "px-6 py-4 text-neutral-200 border-r border-neutral-600 last:border-r-0 align-top text-sm leading-relaxed",
          isGrade && `font-bold text-center ${gradeColor} rounded-lg`,
          className
        )}
        {...props}
      >
        {isGrade ? (
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${gradeColor}`}>
            {children}
          </div>
        ) : children}
      </td>
    );
  },
  strong: ({ className, children, ...props }: MdComponentProps) => (
    <strong className={cn("font-bold text-neutral-100", className)} {...props}>
      {children}
    </strong>
  ),
  em: ({ className, children, ...props }: MdComponentProps) => (
    <em className={cn("italic text-neutral-200", className)} {...props}>
      {children}
    </em>
  ),
};

// Props for HumanMessageBubble
interface HumanMessageBubbleProps {
  message: Message;
  mdComponents: typeof mdComponents;
}

// HumanMessageBubble Component
const HumanMessageBubble: React.FC<HumanMessageBubbleProps> = ({
  message,
  mdComponents,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl break-words min-h-7 max-w-[90%] lg:max-w-[85%] px-6 py-4 shadow-lg">
      <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
        {typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content)}
      </ReactMarkdown>
    </div>
  );
};

// Props for AiMessageBubble
interface AiMessageBubbleProps {
  message: Message;
  historicalActivity: ProcessedEvent[] | undefined;
  liveActivity: ProcessedEvent[] | undefined;
  isLastMessage: boolean;
  isOverallLoading: boolean;
  mdComponents: typeof mdComponents;
  handleCopy: (text: string, messageId: string) => void;
  copiedMessageId: string | null;
}

// AiMessageBubble Component
const AiMessageBubble: React.FC<AiMessageBubbleProps> = ({
  message,
  historicalActivity,
  liveActivity,
  isLastMessage,
  isOverallLoading,
  mdComponents,
  handleCopy,
  copiedMessageId,
}) => {
  // Determine which activity events to show and if it's for a live loading message
  const activityForThisBubble =
    isLastMessage && isOverallLoading ? liveActivity : historicalActivity;
  const isLiveActivityForThisBubble = isLastMessage && isOverallLoading;
  return (
    <div className="flex items-start gap-4 w-full">
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
        <Brain className="h-5 w-5 text-white" />
      </div>      <div className="relative break-words flex flex-col max-w-[90%] lg:max-w-[85%] bg-white/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm p-6 shadow-lg backdrop-blur-sm">
        {activityForThisBubble && activityForThisBubble.length > 0 && (
          <div className="mb-6 border-b border-neutral-200 dark:border-neutral-600 pb-4">
            <ActivityTimeline
              processedEvents={activityForThisBubble}
              isLoading={isLiveActivityForThisBubble}
            />
          </div>
        )}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown components={mdComponents} remarkPlugins={[remarkGfm]}>
            {typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content)}
          </ReactMarkdown>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="cursor-pointer bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 self-end mt-6 text-xs transition-all duration-200"
          onClick={() =>
            handleCopy(
              typeof message.content === "string"
                ? message.content
                : JSON.stringify(message.content),
              message.id!
            )
          }
        >
          {copiedMessageId === message.id ? (
            <>
              <CopyCheck className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Props for ChatMessagesView
interface ChatMessagesViewProps {
  messages: Message[];
  isLoading: boolean;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  liveActivityEvents: ProcessedEvent[];
  historicalActivities: Record<string, ProcessedEvent[]>;
}

// ChatMessagesView Component
export function ChatMessagesView({
  messages,
  isLoading,
  scrollAreaRef,
  onSubmit,
  onCancel,
  liveActivityEvents,
  historicalActivities,
}: ChatMessagesViewProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleCopy = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleDownloadPDF = async () => {
    if (messages.length === 0) return;
    
    setIsGeneratingPDF(true);
    try {
      await generatePDF(messages, {
        title: "Babloo.ai Enterprise Research Report",
        subtitle: "AI-Powered Analysis & Grading",
        includeTimestamp: true,
        customFooter: "Generated by Babloo.ai - Enterprise AI Research Platform | Confidential Business Analysis"
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      // You could add a toast notification here
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex flex-col h-full">      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 backdrop-blur-sm p-4 flex items-center gap-3 shadow-sm">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            babloo.ai
          </h1>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Enterprise Research & Analysis Portal</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            className="bg-neutral-200/50 hover:bg-neutral-300/50 dark:bg-neutral-700/50 dark:hover:bg-neutral-600/50 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-3 w-3 mr-1" />
                Dark
              </>
            ) : (
              <>
                <Sun className="h-3 w-3 mr-1" />
                Light
              </>
            )}
          </Button>
          {messages.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-600 dark:text-blue-300 border-blue-500/50 transition-colors"
            >
              {isGeneratingPDF ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-1" />
                  Download PDF
                </>
              )}
            </Button>
          )}
          <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-300 border-green-500/50">
            <TrendingUp className="h-3 w-3 mr-1" />
            Enterprise Grade
          </Badge>
        </div>
      </div>{/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 lg:p-6">
        <div className="space-y-8 max-w-full mx-auto">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            return (
              <div key={message.id || `msg-${index}`} className="space-y-4">
                <div className={`flex ${message.type === "human" ? "justify-end" : "justify-start"}`}>
                  {message.type === "human" ? (
                    <HumanMessageBubble
                      message={message}
                      mdComponents={mdComponents}
                    />
                  ) : (
                    <AiMessageBubble
                      message={message}
                      historicalActivity={historicalActivities[message.id!]}
                      liveActivity={liveActivityEvents}
                      isLastMessage={isLast}
                      isOverallLoading={isLoading}
                      mdComponents={mdComponents}
                      handleCopy={handleCopy}
                      copiedMessageId={copiedMessageId}
                    />
                  )}
                </div>
              </div>
            );
          })}
            {/* Loading state for new AI response */}
          {isLoading &&
            (messages.length === 0 ||
              messages[messages.length - 1].type === "human") && (
              <div className="flex justify-start">
                <div className="flex items-start gap-4 w-full max-w-[90%] lg:max-w-[85%]">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>                  <div className="bg-white/80 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl rounded-tl-sm p-6 shadow-lg backdrop-blur-sm w-full">
                    {liveActivityEvents.length > 0 ? (
                      <ActivityTimeline
                        processedEvents={liveActivityEvents}
                        isLoading={true}
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-spin" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">Conducting enterprise-grade research...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </ScrollArea>      {/* Input */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 bg-gradient-to-r from-neutral-50/50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-700/50 backdrop-blur-sm p-4 shadow-sm">
        <InputForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={onCancel}
          hasHistory={true}
        />
      </div>
    </div>
  );
}
