import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, StopCircle, Zap, Cpu, Brain, SquarePen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputFormProps {
  onSubmit: (inputValue: string, effort: string, model: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasHistory: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  hasHistory,
}) => {
  const [internalInputValue, setInternalInputValue] = useState("");
  const [effort, setEffort] = useState("medium");
    const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");

  const handleInternalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!internalInputValue.trim()) return;
    onSubmit(internalInputValue, effort, model);
    setInternalInputValue("");
  };

  const isSubmitDisabled = !internalInputValue.trim() || isLoading;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInternalSubmit();
    }
  };

  const effortConfig = {
    low: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", queries: "1 query", loops: "1 loop" },
    medium: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", queries: "3 queries", loops: "3 loops" },
    high: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", queries: "5 queries", loops: "10 loops" }
  };

  const currentEffortConfig = effortConfig[effort as keyof typeof effortConfig];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form onSubmit={handleInternalSubmit} className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className={`flex items-center gap-3 ${currentEffortConfig.bg} border ${currentEffortConfig.border} text-neutral-300 rounded-xl px-4 py-3 backdrop-blur-sm transition-all duration-200`}>
            <Zap className={`h-5 w-5 ${currentEffortConfig.color}`} />
            <span className="text-sm font-semibold">Research Effort:</span>
            <Select value={effort} onValueChange={setEffort}>
              <SelectTrigger className="w-[140px] bg-transparent border-none text-sm h-auto p-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600">
                <SelectItem value="low" className="hover:bg-neutral-700 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span>Low</span>
                    <span className="text-xs text-neutral-400">(Fast)</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium" className="hover:bg-neutral-700 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <span>Medium</span>
                    <span className="text-xs text-neutral-400">(Balanced)</span>
                  </div>
                </SelectItem>
                <SelectItem value="high" className="hover:bg-neutral-700 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <span>High</span>
                    <span className="text-xs text-neutral-400">(Comprehensive)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-neutral-500 hidden sm:block">
              {currentEffortConfig.queries} • {currentEffortConfig.loops}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-neutral-300 rounded-xl px-4 py-3 backdrop-blur-sm">
            <Brain className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-semibold">AI Model:</span>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[200px] bg-transparent border-none text-sm h-auto p-0 focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-600">
                              <SelectItem value="deepseek/deepseek-chat-v3-0324:free" className="hover:bg-neutral-700 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                      <Cpu className="h-3 w-3 text-blue-400" />
                                      <span>Deepseek V3</span>
                                      <span className="text-xs text-green-400">(Latest)</span>
                                  </div>
                              </SelectItem>
                              <SelectItem value="qwen/qwen3-235b-a22b:free" className="hover:bg-neutral-700 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                      <Cpu className="h-3 w-3 text-purple-400" />
                                      <span>Qwen 3</span>
                                  </div>
                              </SelectItem>
                              <SelectItem value="google/gemini-2.5-pro-exp-03-25" className="hover:bg-neutral-700 cursor-pointer">
                                  <div className="flex items-center gap-2">
                                      <Cpu className="h-3 w-3 text-yellow-400" />
                                      <span>Gemini 2.5 Pro</span>
                                      <span className="text-xs text-blue-400">(Most Capable)</span>
                                  </div>
                              </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasHistory && (
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="bg-neutral-700/50 border border-neutral-600 text-neutral-300 hover:bg-neutral-600 px-4 py-3 rounded-xl backdrop-blur-sm transition-all duration-200"
            >
              <SquarePen className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          )}
        </div>

        {/* Input Area */}
        <div className="relative bg-neutral-800/50 border border-neutral-600 rounded-2xl p-5 focus-within:border-blue-500 focus-within:bg-neutral-800/70 transition-all duration-200 backdrop-blur-sm shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Textarea
                value={internalInputValue}
                onChange={(e) => setInternalInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  hasHistory 
                    ? "Ask a follow-up question or request comparisons with grades..." 
                    : "Ask me to compare services, analyze solutions, or grade enterprise tools..."
                }
                className="w-full bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-neutral-100 placeholder-neutral-400 text-base min-h-[80px] max-h-[300px] leading-relaxed"
                rows={3}
              />
            </div>
            
            <div className="flex-shrink-0">
              {isLoading ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 h-12 w-12"
                  onClick={onCancel}
                >
                  <StopCircle className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  disabled={isSubmitDisabled}
                  className={`rounded-xl transition-all duration-200 h-12 w-12 ${
                    isSubmitDisabled
                      ? "text-neutral-500 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 bg-blue-500/5"
                  }`}
                >
                  <Send className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {!hasHistory && (
          <div className="text-center space-y-2">
            <p className="text-sm text-neutral-400">
              Press <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs">Enter</kbd> to send, <kbd className="px-2 py-1 bg-neutral-700 rounded text-xs">Shift+Enter</kbd> for new line
            </p>
            <p className="text-xs text-neutral-500">
              Examples: "Compare AWS vs Azure vs GCP for enterprise data storage" • "Grade Microsoft Teams vs Slack for enterprise communication"
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
