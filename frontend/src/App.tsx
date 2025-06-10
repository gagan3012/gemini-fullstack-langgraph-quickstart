import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { useState, useEffect, useRef, useCallback } from "react";
import { ProcessedEvent } from "@/components/ActivityTimeline";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessagesView } from "@/components/ChatMessagesView";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function App() {
  const [processedEventsTimeline, setProcessedEventsTimeline] = useState<
    ProcessedEvent[]
  >([]);
  const [historicalActivities, setHistoricalActivities] = useState<
    Record<string, ProcessedEvent[]>
  >({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const hasFinalizeEventOccurredRef = useRef(false);

  const thread = useStream<{
    messages: Message[];
    initial_search_query_count: number;
    max_research_loops: number;
    reasoning_model: string;
  }>({
    apiUrl: import.meta.env.DEV
      ? "http://localhost:2024"
      : "http://localhost:8123",
    assistantId: "agent",
    messagesKey: "messages",    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFinish: (state: any) => {
      console.log(state);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdateEvent: (event: any) => {
      console.log("Received event:", event);
      let processedEvent: ProcessedEvent | null = null;

      // Handle different event types based on LangGraph node names
      if (event.event === "on_chain_start" || event.event === "on_chain_stream") {
        const metadata = (event.metadata as Record<string, unknown>) || {};
        const data = (event.data as Record<string, unknown>) || {};

        // Handle node-specific events
        if (metadata.langgraph_node === "generate_query" && data.output) {
          const output = data.output as { query_list?: string[] };
          processedEvent = {
            title: "Generating Search Queries",
            data: Array.isArray(output.query_list)
              ? output.query_list.join(", ")
              : "Generating search queries...",
          };
        } else if (metadata.langgraph_node === "web_research" && data.output) {
          const output = data.output as { sources_gathered?: Array<{ label: string }> };
          const sources = output.sources_gathered || [];
          const numSources = sources.length;
          const uniqueLabels = [
            ...new Set(sources.map((s) => s.label).filter(Boolean)),
          ];
          const exampleLabels = uniqueLabels.slice(0, 3).join(", ");
          processedEvent = {
            title: "Web Research",
            data: `Gathered ${numSources} sources. Related to: ${exampleLabels || "N/A"
              }.`,
          };
        } else if (metadata.langgraph_node === "reflection" && data.output) {
          const output = data.output as { is_sufficient?: boolean; follow_up_queries?: string[] };
          processedEvent = {
            title: "Reflection",
            data: output.is_sufficient
              ? "Search successful, generating final answer."
              : `Need more information, searching for ${(output.follow_up_queries || []).join(
                ", "
              )}`,
          };
        } else if (metadata.langgraph_node === "finalize_answer") {
          processedEvent = {
            title: "Finalizing Answer",
            data: "Composing and presenting the final answer.",
          };
          hasFinalizeEventOccurredRef.current = true;
        }
      }

      // Fallback for legacy event format
      if (!processedEvent) {
        const legacyEvent = event as Record<string, unknown>;
        if (legacyEvent.generate_query) {
          const generateQuery = legacyEvent.generate_query as { query_list?: string[] };
          processedEvent = {
            title: "Generating Search Queries",
            data: generateQuery.query_list?.join(", ") || "Generating search queries...",
          };
        } else if (legacyEvent.web_research) {
          const webResearch = legacyEvent.web_research as { sources_gathered?: Array<{ label: string }> };
          const sources = webResearch.sources_gathered || [];
          const numSources = sources.length;
          const uniqueLabels = [
            ...new Set(sources.map((s) => s.label).filter(Boolean)),
          ];
          const exampleLabels = uniqueLabels.slice(0, 3).join(", ");
          processedEvent = {
            title: "Web Research",
            data: `Gathered ${numSources} sources. Related to: ${exampleLabels || "N/A"
              }.`,
          };
        } else if (legacyEvent.reflection) {
          const reflection = legacyEvent.reflection as { is_sufficient?: boolean; follow_up_queries?: string[] };
          processedEvent = {
            title: "Reflection",
            data: reflection.is_sufficient
              ? "Search successful, generating final answer."
              : `Need more information, searching for ${(reflection.follow_up_queries || []).join(
                ", "
              )}`,
          };
        } else if (legacyEvent.finalize_answer) {
          processedEvent = {
            title: "Finalizing Answer",
            data: "Composing and presenting the final answer.",
          };
          hasFinalizeEventOccurredRef.current = true;
        }
      }
      if (processedEvent) {
        setProcessedEventsTimeline((prevEvents) => [
          ...prevEvents,
          processedEvent!,
        ]);
      }
    },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [thread.messages]);

  useEffect(() => {
    if (
      hasFinalizeEventOccurredRef.current &&
      !thread.isLoading &&
      thread.messages.length > 0
    ) {
      const lastMessage = thread.messages[thread.messages.length - 1];
      if (lastMessage && lastMessage.type === "ai" && lastMessage.id) {
        setHistoricalActivities((prev) => ({
          ...prev,
          [lastMessage.id!]: [...processedEventsTimeline],
        }));
        setProcessedEventsTimeline([]);
      }
      hasFinalizeEventOccurredRef.current = false;
    }
  }, [thread.messages, thread.isLoading, processedEventsTimeline]);

  const handleSubmit = useCallback(
    (submittedInputValue: string, effort: string, model: string) => {
      if (!submittedInputValue.trim()) return;
      setProcessedEventsTimeline([]);
      hasFinalizeEventOccurredRef.current = false;

      // convert effort to, initial_search_query_count and max_research_loops
      // low means max 1 loop and 1 query
      // medium means max 3 loops and 3 queries
      // high means max 10 loops and 5 queries
      let initial_search_query_count = 0;
      let max_research_loops = 0;
      switch (effort) {
        case "low":
          initial_search_query_count = 1;
          max_research_loops = 1;
          break;
        case "medium":
          initial_search_query_count = 3;
          max_research_loops = 3;
          break;
        case "high":
          initial_search_query_count = 5;
          max_research_loops = 10;
          break;
      }

      const newMessages: Message[] = [
        ...(thread.messages || []),
        {
          type: "human",
          content: submittedInputValue,
          id: Date.now().toString(),
        },
      ];
      thread.submit({
        messages: newMessages,
        initial_search_query_count: initial_search_query_count,
        max_research_loops: max_research_loops,
        reasoning_model: model,
      });
    },
    [thread]
  );
  const handleCancel = useCallback(() => {
    thread.stop();
    window.location.reload();
  }, [thread]);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans antialiased transition-colors duration-300">
        <main className="flex-1 flex flex-col overflow-hidden w-full">
          <div
            className={`flex-1 overflow-y-auto ${
              thread.messages.length === 0 ? "flex" : ""
            }`}
          >
            {thread.messages.length === 0 ? (
              <WelcomeScreen
                handleSubmit={handleSubmit}
                isLoading={thread.isLoading}
                onCancel={handleCancel}
              />
            ) : (
              <ChatMessagesView
                messages={thread.messages}
                isLoading={thread.isLoading}
                scrollAreaRef={scrollAreaRef}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                liveActivityEvents={processedEventsTimeline}
                historicalActivities={historicalActivities}
              />
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
