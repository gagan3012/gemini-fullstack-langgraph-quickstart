import { InputForm } from "./InputForm";
import { Brain, Search, Zap, Award, BarChart3, Shield, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  handleSubmit: (
    submittedInputValue: string,
    effort: string,
    model: string
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  handleSubmit,
  onCancel,
  isLoading,
}) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 flex-1 w-full max-w-7xl mx-auto gap-8 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
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
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              babloo.ai
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 font-medium">Enterprise Research & Analysis Portal</p>
          </div>
        </div>
        
        <p className="text-2xl md:text-3xl text-neutral-800 dark:text-neutral-300 font-light max-w-5xl mx-auto leading-relaxed">
          AI-powered enterprise technology research and evaluation platform
        </p>
        
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto leading-relaxed">
          Like Gartner for AI systems - comprehensive analysis, detailed comparisons, and expert-grade evaluations for enterprise decision-making
        </p>
      </div>    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-8">
      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 text-left backdrop-blur-sm">
        <Search className="h-10 w-10 text-blue-500 dark:text-blue-400 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Deep Research</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Multi-source web research with intelligent query generation and comprehensive analysis
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6 text-left backdrop-blur-sm">
        <Award className="h-10 w-10 text-purple-500 dark:text-purple-400 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Expert Grading</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Professional evaluation with A-F grading system and detailed enterprise scoring matrices
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-6 text-left backdrop-blur-sm">
        <BarChart3 className="h-10 w-10 text-yellow-500 dark:text-yellow-400 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Analysis Reports</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Detailed comparison tables with structured analysis and enterprise-grade reporting
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 text-left backdrop-blur-sm">
        <Shield className="h-10 w-10 text-green-500 dark:text-green-400 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3">Enterprise Ready</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Reliable, scalable research portal designed for enterprise technology evaluation
        </p>
      </div>
    </div>

    <div className="w-full">
      <InputForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={onCancel}
        hasHistory={false}
      />
    </div>    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center w-full max-w-4xl">
      <div className="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
        <Sparkles className="h-6 w-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Powered by Google Gemini</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">Advanced AI reasoning</p>
      </div>
      <div className="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
        <Zap className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mx-auto mb-2" />
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Real-time Processing</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">Live progress tracking</p>
      </div>
      <div className="bg-neutral-200/30 dark:bg-neutral-800/30 border border-neutral-300 dark:border-neutral-700 rounded-lg p-4">
        <BarChart3 className="h-6 w-6 text-green-500 dark:text-green-400 mx-auto mb-2" />
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">Enterprise Analytics</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">Detailed reporting</p>
      </div>
    </div>
    
    <div className="text-center space-y-2">
      <p className="text-xs text-neutral-500 dark:text-neutral-500">
        Try asking: "Compare IBM Watson, Aisera, and Azure AI for enterprise automation with detailed analysis and grades"
      </p>
    </div>
  </div>
);
};
