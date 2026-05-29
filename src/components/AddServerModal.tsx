import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Sparkles, Brain, Code, Server, Check, ArrowRight, Zap, Target, Layers } from 'lucide-react';

export function AddServerModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const handleSuggest = (text: string) => {
    setObjective(text);
  };

  const handleAnalyze = () => {
    if (!objective.trim()) return;
    setIsThinking(true);
    // Simulate deep thinking
    setTimeout(() => {
      setIsThinking(false);
      setAiAnalysis({
        recommendation: "Based on your objective, a custom Node.js MCP server using the `@modelcontextprotocol/sdk` is the best approach. I recommend exposing a REST-to-MCP bridge tool.",
        tools: [
          { name: "query_database", description: "Read structured data", recommended: true },
          { name: "read_files", description: "Access local config", recommended: true },
          { name: "execute_script", description: "Run transformations", recommended: false },
        ]
      });
      setStep(2);
    }, 2500);
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div 
        className="bg-white rounded-2xl border border-gray-200 flex flex-col w-[850px] h-[600px] shadow-2xl overflow-hidden shrink-0 relative z-10 animate-[popUp_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-100 bg-gray-50/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                <Server className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-[16px] font-bold text-gray-900 leading-tight">
                  Create MCP Server
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">
                  AI-assisted workspace integration
                </div>
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
          {step === 1 && (
            <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease]">
              <div className="mb-6 flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full self-start text-sm font-medium">
                <Brain className="w-4 h-4" />
                Deep Thinking Enabled
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">What is the purpose of this server?</h3>
              <p className="text-gray-500 mb-6">Describe what you want to connect to your workspace, and our AI will architect the best approach, generate the tools, and configure the manifest.</p>
              
              <div className="relative mb-6">
                <div className="absolute top-3.5 left-4 text-gray-400">
                  <Target className="w-5 h-5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAnalyze();
                  }}
                  placeholder="e.g., I want an agent to read my Notion pages and Jira tickets..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm text-base"
                />
                <div className="absolute right-3 top-3">
                  <button 
                    onClick={handleAnalyze}
                    disabled={!objective.trim() || isThinking}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    {isThinking ? (
                      <>Thinking <span className="animate-pulse">...</span></>
                    ) : (
                      <>Analyze <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>

              {isThinking && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-b-2xl">
                   <div className="w-16 h-16 relative mb-4">
                     <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                     <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                       <Brain className="w-6 h-6 animate-pulse" />
                     </div>
                   </div>
                   <div className="text-lg font-medium text-gray-900 mb-1">Architecting Solution</div>
                   <div className="text-sm text-gray-500">Analyzing patterns and identifying requisite tools...</div>
                </div>
              )}

              <div className="mt-2">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Popular suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Read private GitHub repositories",
                    "Query local Postgres database",
                    "Interact with AWS resources",
                    "Automate social media posing"
                  ].map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggest(suggestion)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 transition-colors text-left flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && aiAnalysis && (
            <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease]">
              <div className="mb-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full self-start text-sm font-medium">
                <Check className="w-4 h-4" />
                Analysis Complete
              </div>

              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100 flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">AI Recommendation</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{aiAnalysis.recommendation}</p>
                 </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" />
                Proposed Tools
              </h4>
              
              <div className="space-y-2 mb-6 flex-1 overflow-y-auto pr-2">
                {aiAnalysis.tools.map((tool: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer ${tool.recommended ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-gray-200 hover:border-indigo-300'}`}>
                    <div className="mt-0.5">
                       <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${tool.recommended ? 'bg-indigo-500 border-indigo-600 text-white' : 'bg-white border-gray-300 text-transparent'}`}>
                          <Check className="w-3.5 h-3.5" />
                       </div>
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                         <div className="font-mono text-sm font-medium text-gray-900">{tool.name}</div>
                         {tool.recommended && <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Recommended</span>}
                       </div>
                       <div className="text-sm text-gray-500">{tool.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Generate Server
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
