import { createPortal } from "react-dom";
import React, { useState, useRef, useEffect } from "react";
import {
  Snowflake,
  Paperclip,
  Plug,
  ChevronDown,
  Mic,
  CornerDownLeft,
  X,
  Puzzle,
  Bot,
  AudioLines,
  PhoneOff,
  Settings,
  Search,
  Database,
  Sparkles,
  CheckCircle,
  Loader2,
  Activity,
  Cpu,
  Code,
  Terminal,
  Globe,
  MonitorPlay,
  Zap,
  Monitor,
} from "lucide-react";
import { Tag } from "../components/SharedUI";
import { SkillsModal, ConnectorsModal } from "./Overlays";
import { ComputerPanel } from "./ComputerPanel";

function ExecutionSimulation({
  finalContent,
  finalOptions,
  onComplete,
  onStepChange,
  onSimulationStart,
}: {
  finalContent: string;
  finalOptions?: string[];
  onComplete?: (content: string, options?: string[]) => void;
  onStepChange?: (step: number) => void;
  onSimulationStart?: () => void;
}) {
  const [time, setTime] = useState(0);
  const [steps, setSteps] = useState<
    { title: string; status: "loading" | "done"; icon: React.ReactNode }[]
  >([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (onSimulationStart) onSimulationStart();
    let startTime = Date.now();
    const interval = setInterval(() => {
      setTime((Date.now() - startTime) / 1000);
    }, 100);

    const runSim = async () => {
      const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

      setSteps([
        {
          title: "Planning execution steps...",
          status: "loading",
          icon: <Brain className="w-3.5 h-3.5" />,
        },
      ]);
      if (onStepChange) onStepChange(0);
      await delay(1500);

      setSteps((prev) => [
        { ...prev[0], status: "done" },
        {
          title: "Browsing search engine for context",
          status: "loading",
          icon: <Globe className="w-3.5 h-3.5" />,
        },
      ]);
      if (onStepChange) onStepChange(1);
      await delay(2000);

      setSteps((prev) => [
        prev[0],
        { ...prev[1], status: "done" },
        {
          title: "Writing components and integrating logic",
          status: "loading",
          icon: <Code className="w-3.5 h-3.5" />,
        },
      ]);
      if (onStepChange) onStepChange(2);
      await delay(3000);

      setSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: "done" },
        {
          title: "Running build and syncing state",
          status: "loading",
          icon: <Terminal className="w-3.5 h-3.5" />,
        },
      ]);
      if (onStepChange) onStepChange(3);
      await delay(2000);

      setSteps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: "done" },
        {
          title: "Verifying endpoints",
          status: "loading",
          icon: <MonitorPlay className="w-3.5 h-3.5" />,
        },
      ]);
      if (onStepChange) onStepChange(4);
      await delay(2000);

      setSteps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        prev[3],
        { ...prev[4], status: "done" },
      ]);
      if (onStepChange) onStepChange(5);
      clearInterval(interval);
      setIsDone(true);
      if (onComplete) onComplete(finalContent, finalOptions);
    };

    runSim();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full animate-[fadeIn_0.3s_ease-out]">
      <div
        className={`mb-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-mono relative overflow-hidden transition-all duration-500 ${isDone ? "opacity-80 scale-[0.98] origin-top bg-white border-transparent" : ""}`}
      >
        <div
          className={`flex items-center justify-between mb-3 pb-2 ${isDone ? "text-gray-400 border-transparent" : "border-b border-gray-200"}`}
        >
          <span
            className={`font-semibold flex items-center gap-2 ${isDone ? "text-gray-400" : "text-gray-900"}`}
          >
            <Cpu
              className={`w-4 h-4 ${isDone ? "text-gray-400" : "text-accent"}`}
            />{" "}
            Execution Trace
          </span>
          <span className="text-xs text-gray-500">{time.toFixed(1)}s</span>
        </div>

        <div
          className={`flex flex-col relative pl-2 space-y-1 transition-all duration-500 ${isDone ? "max-h-0 min-h-0 opacity-0 overflow-hidden" : "max-h-[300px] opacity-100"}`}
        >
          <div className="absolute left-[19px] top-6 bottom-4 w-[2px] bg-gray-200 z-0"></div>
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative flex items-start gap-3 py-1 animate-[slideUpFade_0.3s_ease]"
            >
              <div className="relative z-10 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs flex-shrink-0 text-gray-500">
                {s.icon}
              </div>
              <div className="flex-1 flex justify-between items-center bg-white border border-gray-100 rounded-md px-3 py-1.5 shadow-sm">
                <span className="text-gray-700">{s.title}</span>
                <span>
                  {s.status === "done" ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Loader2 className="w-3.5 h-3.5 text-accent animate-spin" />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import {
  Brain,
  Download,
  RefreshCw,
  Github,
  Figma,
  Slack,
  Chrome,
  Trello,
  Box,
} from "lucide-react";
import { useToggledApps } from "../store";
import {
  ModelSelect,
  ProviderRegistry,
  GoogleProvider,
  StorageAdapter,
  MemoryStorageAdapter,
} from "ai-sdk-react-model-picker";

class LocalStorageSyncAdapter implements StorageAdapter {
  constructor(
    private base: StorageAdapter,
    private namespace: string = "ai-sdk-model-picker:",
  ) {}
  async get(key: string): Promise<Record<string, string> | undefined> {
    const val = localStorage.getItem(this.namespace + key);
    if (val) {
      return JSON.parse(val);
    }
    return this.base.get(key);
  }
  async set(key: string, value: Record<string, string>): Promise<void> {
    localStorage.setItem(this.namespace + key, JSON.stringify(value));
    return this.base.set(key, value);
  }
  async remove(key: string): Promise<void> {
    localStorage.removeItem(this.namespace + key);
    return this.base.remove(key);
  }
}

const memoryStorage = new MemoryStorageAdapter();
const storage = new LocalStorageSyncAdapter(memoryStorage);
const registry = new ProviderRegistry();
registry.register(new GoogleProvider());

export function ChatView({
  onChatStateChange,
}: {
  onChatStateChange?: (active: boolean) => void;
}) {
  const [inputVal, setInputVal] = useState("");
  const { toggledApps } = useToggledApps();
  const [tokenStats, setTokenStats] = useState({
    promptTokens: 0,
    candidatesTokens: 0,
    totalTokens: 0,
  });
  const [messages, setMessages] = useState<
    {
      id: string;
      role: "user" | "model";
      content: string;
      skill?: string;
      options?: string[];
      isSimulated?: boolean;
      contentToSet?: string;
      optionsToSet?: string[];
    }[]
  >([]);

  const [currentSimStep, setCurrentSimStep] = useState<number | null>(null);

  const handleSimulationComplete = (
    id: string,
    content: string,
    options?: string[],
  ) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isSimulated: false, content, options } : m,
      ),
    );
    setCurrentSimStep(null);
  };
  const [isTyping, setIsTyping] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<
    "listening" | "working" | "speaking"
  >("listening");
  const [workingStep, setWorkingStep] = useState(0);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-3.1-pro-preview");
  const [agentDropdownOpen, setAgentDropdownOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("General");
  const [selectedSuggestion, setSelectedSuggestion] = useState<{
    prompt: string;
    title?: string;
    subtitle?: string;
  } | null>(null);
  const [useComputerUse, setUseComputerUse] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useFastMode, setUseFastMode] = useState(false);
  const [connectorsPopupOpen, setConnectorsPopupOpen] = useState(false);
  const [manageConnectorsModalOpen, setManageConnectorsModalOpen] =
    useState(false);
  const [includedConnectors, setIncludedConnectors] = useState<string[]>([
    "github",
    "gmail",
  ]);
  const [telegramConnected, setTelegramConnected] = useState(true);

  const connectedApps = [
    {
      id: "slack",
      name: "Slack",
      icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    },
    {
      id: "drive",
      name: "Google Drive",
      icon: "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png",
    },
    {
      id: "gmail",
      name: "Gmail",
      icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
    },
    {
      id: "github",
      name: "GitHub",
      icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    },
  ];

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onChatStateChange) {
      onChatStateChange(isChatMode);
    }
  }, [isChatMode, onChatStateChange]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    let interval: any;
    if (voiceStatus === "working") {
      setWorkingStep(0);
      interval = setInterval(() => {
        setWorkingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [voiceStatus]);

  const handleUseSkill = (skillName: string) => {
    setSelectedSkill(skillName);
    setSkillsModalOpen(false);

    setIsChatMode(true);
    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user" as const,
        content: inputVal || `Load ${skillName} skill.`,
        skill: skillName,
      },
    ];
    setMessages(newMessages);
    const hadInput = inputVal.trim() !== "";
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "";
      let responseOptions: string[] | undefined;

      if (!hadInput) {
        responseText = `Using the **${skillName}** skill. To get started, I need some more information. Could you please provide context or answer the following questions?\n\n1. What is the main objective?\n2. Are there any specific constraints?`;
      } else {
        responseText = `Using the **${skillName}** skill with your request. I've analyzed the request and narrowed it down to a few different options. Please select one or provide a custom message.`;
        responseOptions = [
          "Execute with default parameters",
          "Optimize for speed over quality",
          "Deep analysis mode (slower)",
        ];
      }

      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: responseText,
          options: responseOptions,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = async (
    overrideText?: string,
    voiceMode: boolean = false,
  ) => {
    const textToSubmit = overrideText || inputVal;
    if (!voiceMode && !textToSubmit.trim()) return;

    setUseComputerUse(true);
    setIsChatMode(true);
    if (voiceMode) {
      setIsVoiceMode(true);
      setVoiceStatus("working");
    }

    const newMessages = [
      ...messages,
      {
        id: Date.now().toString(),
        role: "user" as const,
        content: voiceMode ? "Voice request..." : textToSubmit,
        skill: selectedSkill || undefined,
      },
    ];
    setMessages(newMessages);
    if (!voiceMode) {
      setInputVal("");
    }

    let responseText = "Here is an analysis regarding your request: \n\n";
    let responseOptions: string[] | undefined;
    let isSim =
      !voiceMode && !["Yes", "No", "Edit"].includes(overrideText || "");

    if (overrideText === "Run in detached mode") {
      responseText = "Launching session in detached mode...";
      setTimeout(() => window.open("#", "_blank"), 2000);
    } else if (overrideText === "Continue in chat") {
      responseText = `Using the **${selectedSkill || "default"}** protocol. I've initiated the relevant sub-agents. \n\n1. Connected to all requested sources securely.\n2. Pulled relevant configuration objects.\n3. Processing the output locally...\n\n**Task complete.** Let me know if you want to proceed with deployment.`;
    } else if (overrideText === "Create a React dashboard with Tailwind") {
      responseText =
        "I've completed the task. I researched the required components, wrote the React code for the dashboard, and deployed a local preview.\n\nYou can view the code in the **Code** tab or interact with the running application in the **Preview** tab on the right.";
      responseOptions = ["Download Source", "Iterate Design"];
    } else if (
      overrideText === "Yes" ||
      overrideText === "No" ||
      overrideText === "Edit"
    ) {
      responseText = `You selected "${overrideText}". How would you like to proceed?`;
      responseOptions = ["Run in detached mode", "Continue in chat"];
    } else {
      setIsTyping(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSubmit,
            sessionId: "user_123",
            integrations: toggledApps,
            model: selectedModel,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          responseText = data.text || "No response received.";
          if (data.usageMetadata) {
            setTokenStats((prev) => ({
              promptTokens:
                prev.promptTokens + (data.usageMetadata.promptTokenCount || 0),
              candidatesTokens:
                prev.candidatesTokens +
                (data.usageMetadata.candidatesTokenCount || 0),
              totalTokens:
                prev.totalTokens + (data.usageMetadata.totalTokenCount || 0),
            }));
          }
        } else {
          responseText =
            "Sorry, I encountered an error communicating with the agent server.";
        }
      } catch (err) {
        responseText =
          "Sorry, I encountered an error communicating with the agent server.";
      }
      setIsTyping(false);
      responseOptions = ["Yes", "No", "Edit"];
    }

    if (isSim) {
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          content: "",
          isSimulated: true,
          contentToSet: responseText,
          optionsToSet: responseOptions,
        },
      ]);
    } else if (voiceMode) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            content: responseText,
            options: responseOptions,
          },
        ]);
        setIsTyping(false);
        setVoiceStatus("speaking");
        setTimeout(() => setVoiceStatus("listening"), 3000);
      }, 2500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          ...newMessages,
          {
            id: (Date.now() + 1).toString(),
            role: "model",
            content: responseText,
            options: responseOptions,
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  if (isChatMode) {
    return (
      <div className="flex-1 flex overflow-hidden w-full h-full justify-center bg-gray-50/30">
        {/* Left pane: Chat vs Voice */}
        <div
          className={`${useComputerUse ? "w-[420px]" : "w-full max-w-4xl border-x shadow-sm bg-white"} flex flex-col bg-white border-r border-border shrink-0 z-10 
                       ${!useComputerUse ? "my-2 mx-auto sm:my-6 rounded-2xl h-auto" : "h-full py-5 px-4 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300"} `}
        >
          {isVoiceMode ? (
            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-white">
              <div className="relative w-48 h-48 flex items-center justify-center mb-8 mt-20">
                {voiceStatus === "speaking" && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-accent opacity-10 animate-[ping_2s_ease-out_infinite]"></div>
                    <div className="absolute inset-4 rounded-full bg-blue-400 opacity-20 animate-[ping_2.5s_ease-out_infinite]"></div>
                  </>
                )}
                {voiceStatus === "working" && (
                  <div className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent opacity-50 animate-spin"></div>
                )}
                {voiceStatus === "listening" && (
                  <div className="absolute inset-8 rounded-full bg-gray-100 opacity-50 animate-pulse"></div>
                )}

                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500
                    ${
                      voiceStatus === "speaking"
                        ? "bg-gradient-to-br from-accent to-blue-400 shadow-[0_10px_30px_rgba(55,138,221,0.4)]"
                        : voiceStatus === "working"
                          ? "bg-gradient-to-br from-amber-400 to-orange-400 shadow-[0_10px_30px_rgba(251,191,36,0.4)]"
                          : "bg-gray-100 border border-gray-200"
                    }`}
                >
                  <Mic
                    className={`w-10 h-10 transition-colors duration-300 ${voiceStatus === "listening" ? "text-gray-400" : "text-white"}`}
                  />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center transition-all flex items-center justify-center gap-2">
                {voiceStatus === "listening" ? (
                  "Listening..."
                ) : voiceStatus === "working" ? (
                  <div className="flex items-center justify-center gap-3 animate-[fadeIn_0.3s_ease-out]">
                    {workingStep === 0 && (
                      <Cpu className="w-6 h-6 text-indigo-500 animate-[spin_3s_linear_infinite]" />
                    )}
                    {workingStep === 1 && (
                      <Search className="w-6 h-6 text-blue-500 animate-pulse" />
                    )}
                    {workingStep === 2 && (
                      <Code className="w-6 h-6 text-purple-500 animate-[bounce_2s_infinite]" />
                    )}
                    {workingStep === 3 && (
                      <Terminal className="w-6 h-6 text-emerald-500 animate-pulse" />
                    )}
                    {workingStep === 4 && (
                      <Sparkles className="w-6 h-6 text-amber-500 animate-[spin_4s_linear_infinite]" />
                    )}
                    <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {workingStep === 0
                        ? "Initializing LLM..."
                        : workingStep === 1
                          ? "Reading context..."
                          : workingStep === 2
                            ? "Generating code..."
                            : workingStep === 3
                              ? "Executing edit..."
                              : "Finalizing changes..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 animate-[fadeIn_0.5s_ease-out]">
                    <CheckCircle className="w-6 h-6 text-green-500" />{" "}
                    <span>Ready.</span>
                  </div>
                )}
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-[280px] h-12 flex flex-col items-center gap-1 transition-all">
                {voiceStatus === "listening" ? (
                  "Speak naturally to interact with the agent."
                ) : voiceStatus === "working" ? (
                  <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Activity className="w-3.5 h-3.5 text-accent animate-pulse" />{" "}
                      Background processes active
                    </span>
                    <span className="opacity-70 text-xs mt-1 font-mono">
                      {workingStep === 0
                        ? "> model initialization"
                        : workingStep === 1
                          ? "> reading dom structure"
                          : workingStep === 2
                            ? "> ast modification"
                            : workingStep === 3
                              ? "> hot module replacement"
                              : "> verification"}
                    </span>
                  </div>
                ) : (
                  "Task complete. Does this look good?"
                )}
              </p>

              <button
                onClick={() => {
                  setIsVoiceMode(false);
                  setIsChatMode(false);
                }}
                className="mt-auto mb-4 w-14 h-14 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
                title="End Voice Session"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 w-full flex flex-col gap-4 py-2 overflow-y-auto mb-5 chat-history text-sm pr-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 w-full animate-[fadeIn_0.3s_ease] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0
                  ${msg.role === "user" ? "bg-gray-200 text-gray-600" : "bg-gradient-to-br from-accent to-blue-400 text-white shadow-[0_2px_6px_rgba(55,138,221,0.25)]"}`}
                    >
                      {msg.role === "user" ? (
                        "U"
                      ) : (
                        <Snowflake className="w-5 h-5" />
                      )}
                    </div>
                    <div
                      className={`gap-2 flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-[85%] w-full`}
                    >
                      {msg.role === "model" &&
                      msg.isSimulated &&
                      !msg.content ? (
                        <ExecutionSimulation
                          finalContent={msg.contentToSet || ""}
                          finalOptions={msg.optionsToSet}
                          onComplete={(c, o) =>
                            handleSimulationComplete(msg.id, c, o)
                          }
                          onStepChange={setCurrentSimStep}
                          onSimulationStart={() => setCurrentSimStep(0)}
                        />
                      ) : (
                        <div
                          className={`px-4 py-3 rounded-xl leading-relaxed whitespace-pre-wrap font-normal text-gray-900 w-full
                      ${msg.role === "user" ? "bg-gray-100" : "bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.03)]"}`}
                        >
                          {msg.content}
                          {msg.skill && msg.role === "user" && (
                            <div className="mt-2.5">
                              <Tag
                                variant="tp"
                                className="px-2.5 py-1 bg-indigo-50 text-accent"
                              >
                                <span className="text-xs mr-1">🧩</span> Using{" "}
                                {msg.skill} skill
                              </Tag>
                            </div>
                          )}
                        </div>
                      )}

                      {msg.options && (
                        <div className="flex flex-wrap gap-2 w-full mt-2">
                          {msg.options.map((opt, oIdx) => {
                            const isPositive =
                              opt === "Yes" ||
                              opt === "Approve" ||
                              opt === "Run in detached mode";
                            const isNegative =
                              opt === "No" ||
                              opt === "Cancel" ||
                              opt === "Stop";
                            const isNeutral = !isPositive && !isNegative;

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSubmit(opt)}
                                className={`px-4 py-2 border rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 font-medium flex-1 min-w-[max-content] max-w-[200px]
                                  ${
                                    isPositive
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300"
                                      : isNegative
                                        ? "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300"
                                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                  }`}
                              >
                                {opt === "Download Source" && (
                                  <Download className="w-4 h-4" />
                                )}
                                {opt === "Iterate Design" && (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 w-full flex-row animate-[fadeIn_0.3s_ease]">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold shrink-0 bg-gradient-to-br from-accent to-blue-400 text-white shadow-[0_2px_6px_rgba(55,138,221,0.25)]">
                      <Snowflake className="w-5 h-5" />
                    </div>
                    <div className="px-4 py-3 rounded-xl text-sm leading-relaxed max-w-[85%] bg-white border border-border shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center text-gray-900">
                      <div className="loading-dots flex gap-0.5 mt-[-6px]">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="w-full bg-white rounded-2xl border border-border shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative shrink-0 flex flex-col pt-1">
                {toggledApps.length > 0 && (
                  <div className="px-4 py-1.5 flex flex-wrap gap-1 border-b border-gray-100">
                    <span className="text-[10px] text-gray-500 font-medium mr-2 self-center">
                      Active Integrations:
                    </span>
                    {toggledApps.map((app) => (
                      <span
                        key={app}
                        className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 capitalize"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                )}
                <textarea
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="w-full border-none outline-none px-4 pt-3 pb-3 font-sans text-sm text-gray-900 resize-none min-h-[60px] bg-transparent"
                  placeholder="Describe what you need help with..."
                />

                <div className="flex items-center justify-between px-3 py-3 border-t border-gray-100">
                  {/* Tools Left */}
                  <div className="flex items-center gap-1.5">
                    {/* Input Group */}
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg border-none bg-transparent flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-gray-500 transition-all">
                        <Paperclip className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>

                    {/* App Context Group */}
                    <div className="flex items-center gap-1">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setConnectorsPopupOpen(!connectorsPopupOpen)
                          }
                          className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all shadow-sm group"
                        >
                          <div className="w-full h-full rounded-lg absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                          <Plug className="w-3.5 h-3.5 text-pink-500 relative z-10" />
                        </button>

                        {connectorsPopupOpen && (
                          <div className="absolute bottom-full mb-2 left-0 w-56 bg-white rounded-xl border border-border shadow-[0_10px_25px_rgba(0,0,0,0.08)] py-1.5 z-[100] animate-[popUp_0.2s_ease-out]">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-border mb-1">
                              Included Context
                            </div>
                            {connectedApps.map((app) => (
                              <div
                                key={app.id}
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={app.icon}
                                    width="14"
                                    height="14"
                                    alt={app.name}
                                  />
                                  <span className="text-xs text-gray-700 font-medium">
                                    {app.name}
                                  </span>
                                </div>
                                <div
                                  onClick={() =>
                                    setIncludedConnectors((prev) =>
                                      prev.includes(app.id)
                                        ? prev.filter((a) => a !== app.id)
                                        : [...prev, app.id],
                                    )
                                  }
                                  className={`w-7 h-4 rounded-full flex items-center px-0.5 cursor-pointer transition-colors shrink-0 ${includedConnectors.includes(app.id) ? "bg-green-500" : "bg-gray-200"}`}
                                >
                                  <div
                                    className={`w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${includedConnectors.includes(app.id) ? "translate-x-[12px]" : "translate-x-0"}`}
                                  ></div>
                                </div>
                              </div>
                            ))}
                            <div className="border-t border-border mt-1 pt-1">
                              <button
                                onClick={() => {
                                  setConnectorsPopupOpen(false);
                                  setManageConnectorsModalOpen(true);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-accent hover:bg-indigo-50 font-medium transition-colors"
                              >
                                Manage connections
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setTelegramConnected(!telegramConnected)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all shadow-sm shrink-0 ${telegramConnected ? "bg-[#2AABEE] text-white border-[#2AABEE]" : "bg-white text-gray-400 border-border hover:bg-gray-50 hover:text-gray-600"}`}
                        title="Telegram Agent"
                      >
                        <div className="relative flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>
                          <div
                            className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full border-[1px] ${telegramConnected ? "bg-emerald-300 border-[#2AABEE]" : "bg-transparent border-transparent"}`}
                          ></div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Tools Right */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSkillsModalOpen(true)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-white border border-border text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                        title={selectedSkill || "Skills"}
                      >
                        <Puzzle className="w-3.5 h-3.5 text-accent" />
                      </button>

                      <div className="relative flex items-center">
                        <ModelSelect
                          storage={storage}
                          providerRegistry={registry}
                          onModelChange={(m) =>
                            setSelectedModel(m?.id || "gemini-3.1-pro-preview")
                          }
                          className="!h-[30px] !rounded-lg !border-border shadow-sm text-xs !bg-white hover:!bg-gray-50 transition-all font-medium text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>

                    <div className="flex items-center gap-1">
                      <button
                        className="w-7 h-7 rounded-lg border-none bg-transparent flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-gray-500 transition-all"
                        title="Voice Input"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleSubmit("", true)}
                        className="w-7 h-7 rounded-lg border-none bg-transparent flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-accent transition-all flex-shrink-0"
                        title="Voice Mode"
                      >
                        <AudioLines className="w-3.5 h-3.5" />
                      </button>

                      <button className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-blue-400 text-white border-none flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(55,138,221,0.25)] hover:shadow-[0_4px_10px_rgba(55,138,221,0.35)] transition-shadow">
                        <CornerDownLeft
                          className="w-3.5 h-3.5"
                          onClick={() => handleSubmit()}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-1.5 px-1 pb-1 w-full text-[10px] text-gray-400 font-mono items-center">
                <span
                  className="flex items-center gap-1 opacity-70"
                  title="Active Model"
                >
                  <Box className="w-3 h-3 text-blue-400" /> {selectedModel}
                </span>
                <span
                  className="flex items-center gap-1"
                  title="Context Window"
                >
                  <Brain className="w-3 h-3 text-emerald-400" />{" "}
                  {tokenStats.totalTokens > 0
                    ? (tokenStats.totalTokens / 1000).toFixed(1) + "K"
                    : "0"}{" "}
                  / 2M ctx
                </span>
                <span className="opacity-70" title="Tokens Input">
                  {tokenStats.promptTokens > 0
                    ? (tokenStats.promptTokens / 1000).toFixed(1) + "K"
                    : "0"}{" "}
                  inp
                </span>
                <span className="opacity-70" title="Tokens Output">
                  {tokenStats.candidatesTokens > 0
                    ? (tokenStats.candidatesTokens / 1000).toFixed(1) + "K"
                    : "0"}{" "}
                  out
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right pane: Computer Panel */}
        {useComputerUse && (
          <ComputerPanel
            currentSimStep={currentSimStep}
            onClose={() => setUseComputerUse(false)}
          />
        )}

        {skillsModalOpen && (
          <SkillsModal
            onClose={() => setSkillsModalOpen(false)}
            onUseSkill={handleUseSkill}
          />
        )}

        {manageConnectorsModalOpen && (
          <ConnectorsModal
            onClose={() => setManageConnectorsModalOpen(false)}
          />
        )}
      </div>
    );
  }

  const agentSuggestions: Record<
    string,
    { prompt: string; title: string; subtitle: string; icon: React.ReactNode }[]
  > = {
    General: [
      {
        prompt: "Create a React dashboard with Tailwind",
        title: "Build an app",
        subtitle: "Create a React dashboard with Tailwind",
        icon: (
          <Code className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Analyze Q3 tech earnings reports",
        title: "Deep research",
        subtitle: "Analyze Q3 tech earnings reports",
        icon: (
          <Globe className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Clean and format this CSV data",
        title: "Data processing",
        subtitle: "Clean and format this CSV data",
        icon: (
          <Database className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Draft emails based on my calendar",
        title: "Automate tasks",
        subtitle: "Draft emails based on my calendar",
        icon: (
          <Activity className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
        ),
      },
    ],
    "Social Media": [
      {
        prompt: "Draft a viral Twitter thread about AI",
        title: "Twitter Thread",
        subtitle: "Draft a viral Twitter thread",
        icon: (
          <Globe className="w-5 h-5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Create 5 Instagram caption options",
        title: "IG Captions",
        subtitle: "Create 5 Instagram caption options",
        icon: (
          <Activity className="w-5 h-5 text-[#E1306C] group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Plan a one-week content calendar",
        title: "Content Calendar",
        subtitle: "For LinkedIn and Twitter",
        icon: (
          <Database className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Analyze our latest campaign metrics",
        title: "Campaign Analysis",
        subtitle: "Analyze our latest campaign metrics",
        icon: (
          <Activity className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
        ),
      },
    ],
    "Content Creator": [
      {
        prompt: "Write a YouTube video script",
        title: "Video Script",
        subtitle: "Write a YouTube video script",
        icon: (
          <MonitorPlay className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Generate thumbnail ideas",
        title: "Thumbnail Ideas",
        subtitle: "For my new tutorial",
        icon: (
          <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Outline a blog post about productivity",
        title: "Blog Outline",
        subtitle: "Outline a blog post about productivity",
        icon: (
          <Code className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Edit this paragraph for clarity and tone",
        title: "Edit Paragraph",
        subtitle: "For clarity and tone",
        icon: (
          <Zap className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
        ),
      },
    ],
    Coding: [
      {
        prompt: "Review this pull request",
        title: "Code Review",
        subtitle: "Find bugs and suggest improvements",
        icon: (
          <Code className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Debug this React hydration error",
        title: "Debug Error",
        subtitle: "Debug this React hydration error",
        icon: (
          <Zap className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Write unit tests for this utility",
        title: "Write Tests",
        subtitle: "Write unit tests for this utility",
        icon: (
          <Terminal className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Optimize this database query",
        title: "Optimize Query",
        subtitle: "Optimize this database query",
        icon: (
          <Database className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
        ),
      },
    ],
    Support: [
      {
        prompt: "Draft a polite refund refusal",
        title: "Refund Response",
        subtitle: "Draft a polite refund refusal",
        icon: (
          <Activity className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Categorize these customer feedback tickets",
        title: "Categorize Tickets",
        subtitle: "Categorize customer feedback",
        icon: (
          <Database className="w-5 h-5 text-teal-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Create an FAQ based on recent queries",
        title: "Generate FAQ",
        subtitle: "Create an FAQ based on recent queries",
        icon: (
          <Sparkles className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
        ),
      },
      {
        prompt: "Translate this help article to Spanish",
        title: "Translate Article",
        subtitle: "Translate this help article to Spanish",
        icon: (
          <Globe className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
        ),
      },
    ],
  };

  const currentSuggestions =
    agentSuggestions[selectedAgent] || agentSuggestions["General"];

  return (
    <div className="flex-1 flex flex-col items-center p-5 pb-[10vh] overflow-y-auto justify-center">
      <h1 className="font-display tracking-tight text-3xl font-medium text-gray-900 mb-8 mt-10">
        Good evening! Let's get things done.
      </h1>

      <div className="w-full max-w-[680px] bg-white rounded-2xl border border-border shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative transition-all duration-300 mb-8">
        <textarea
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="w-full border-none outline-none px-5 pt-3 pb-5 font-sans text-sm text-gray-900 resize-none min-h-[80px] bg-transparent"
          placeholder="Describe what you need help with..."
        />

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            {/* Input Group */}
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-gray-500 transition-all">
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>

            {/* App Context Group */}
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setConnectorsPopupOpen(!connectorsPopupOpen)}
                  className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all shadow-sm group"
                >
                  <div className="w-full h-full rounded-lg absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <Plug className="w-4 h-4 text-pink-500 relative z-10" />
                </button>

                {connectorsPopupOpen && (
                  <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-xl border border-border shadow-[0_10px_25px_rgba(0,0,0,0.08)] py-1.5 z-[100] animate-[popUp_0.2s_ease-out]">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-border mb-1">
                      Included Context
                    </div>
                    {connectedApps.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={app.icon}
                            width="16"
                            height="16"
                            alt={app.name}
                          />
                          <span className="text-xs text-gray-700 font-medium">
                            {app.name}
                          </span>
                        </div>
                        <div
                          onClick={() =>
                            setIncludedConnectors((prev) =>
                              prev.includes(app.id)
                                ? prev.filter((a) => a !== app.id)
                                : [...prev, app.id],
                            )
                          }
                          className={`w-7 h-4 rounded-full flex items-center px-0.5 cursor-pointer transition-colors shrink-0 ${includedConnectors.includes(app.id) ? "bg-green-500" : "bg-gray-200"}`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full transition-transform shadow-sm ${includedConnectors.includes(app.id) ? "translate-x-[12px]" : "translate-x-0"}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => {
                          setConnectorsPopupOpen(false);
                          setManageConnectorsModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-accent hover:bg-indigo-50 font-medium transition-colors"
                      >
                        Manage connections
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setTelegramConnected(!telegramConnected)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all shadow-sm shrink-0 ml-[-2px] ${telegramConnected ? "bg-[#2AABEE] text-white border-[#2AABEE]" : "bg-white text-gray-400 border-border hover:bg-gray-50 hover:text-gray-600"}`}
                title="Telegram Agent"
              >
                <div className="relative flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                  <div
                    className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border-[1px] ${telegramConnected ? "bg-emerald-300 border-[#2AABEE]" : "bg-transparent border-transparent"}`}
                  ></div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button
                  onClick={() => setAgentDropdownOpen(!agentDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-border text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                >
                  <Bot className="w-3.5 h-3.5 text-teal-600" />{" "}
                  <span>
                    {selectedAgent === "General" ? "Workers" : selectedAgent}
                  </span>
                </button>

                {agentDropdownOpen && (
                  <div className="absolute bottom-full mb-1 left-0 w-48 bg-white rounded-xl border border-border shadow-[0_10px_25px_rgba(0,0,0,0.08)] py-1.5 z-50 animate-[popUp_0.2s_ease-out]">
                    {[
                      "General",
                      "Social Media",
                      "Content Creator",
                      "Coding",
                      "Support",
                    ].map((agent) => (
                      <button
                        key={agent}
                        onClick={() => {
                          setSelectedAgent(agent);
                          setAgentDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${selectedAgent === agent ? "text-teal-600 font-medium bg-teal-50/50" : "text-gray-700"}`}
                      >
                        {agent}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSkillsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-border text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
              >
                <Puzzle className="w-3.5 h-3.5 text-accent" />{" "}
                <span>{selectedSkill || "Skills"}</span>
              </button>

              <div className="relative flex items-center">
                <ModelSelect
                  storage={storage}
                  providerRegistry={registry}
                  onModelChange={(m) =>
                    setSelectedModel(m?.id || "gemini-3.1-pro-preview")
                  }
                  className="!h-[30px] !rounded-lg !border-border shadow-sm text-xs !bg-white hover:!bg-gray-50 transition-all font-medium text-gray-600"
                />
              </div>
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>

            <div className="flex items-center gap-1">
              <button
                className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-gray-500 transition-all"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSubmit("", true)}
                className="w-8 h-8 rounded-lg border-none bg-transparent flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-accent transition-all"
                title="Voice Mode"
              >
                <AudioLines className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSubmit()}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-blue-400 text-white border-none flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(55,138,221,0.25)] hover:shadow-[0_4px_10px_rgba(55,138,221,0.35)] transition-shadow ml-1"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[680px] text-left">
        {currentSuggestions.map((suggestion, idx) => (
          <button
            key={idx}
            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group bg-white text-left"
            onClick={() => setSelectedSuggestion(suggestion)}
          >
            <div className="flex items-center gap-2 text-gray-900 font-medium mb-1">
              {suggestion.icon} {suggestion.title}
            </div>
            <div className="text-xs text-gray-500">{suggestion.subtitle}</div>
          </button>
        ))}
      </div>

      {selectedSuggestion &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#000000_66] backdrop-blur-md p-6">
            <div className="bg-white rounded-[24px] max-w-4xl w-full shadow-2xl overflow-hidden animate-[popUp_0.25s_cubic-bezier(0.16,1,0.3,1)] flex flex-col max-h-[85vh]">
              <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-accent shadow-inner">
                    {selectedSuggestion.icon || (
                      <Sparkles className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xl tracking-tight">
                      Configure Action
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">
                      {selectedSuggestion.title || "Custom Task"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="p-2.5 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 bg-gray-50/30">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  {/* Left Column: Task Definition */}
                  <div className="md:col-span-7 space-y-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-500" /> Base
                        Prompt
                      </label>
                      <div className="bg-white rounded-xl p-5 text-[15px] text-gray-800 border border-gray-200 font-medium shadow-sm leading-relaxed">
                        {selectedSuggestion.prompt}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Code className="w-4 h-4 text-emerald-500" /> Additional
                        Instructions
                      </label>
                      <textarea
                        className="w-full bg-white border border-gray-200 rounded-xl p-5 text-[15px] text-gray-800 outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all resize-none shadow-sm placeholder:text-gray-400 leading-relaxed"
                        rows={6}
                        placeholder="Add specific requirements, constraints, or formatting preferences..."
                      ></textarea>
                    </div>

                    <div className="bg-blue-50/80 border border-blue-100/80 rounded-xl p-5 flex gap-4 text-[13px] text-blue-900 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                      <Brain className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-semibold block mb-1 text-sm text-blue-950">
                          AI Agent Autonomy
                        </span>
                        This action will be executed by an autonomous sub-agent
                        that may call multiple tools, read files, and synthesize
                        information before returning a final result.
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Configuration & Context */}
                  <div className="md:col-span-5 space-y-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Active Skills
                      </label>
                      <div className="space-y-3 pb-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-slate-50 transition-all bg-white relative overflow-hidden group shadow-sm">
                          <div className="absolute inset-y-0 left-0 w-1 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                          <input
                            type="radio"
                            name="skill"
                            className="mt-1 w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                            defaultChecked
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                              Auto-detect
                            </p>
                            <p className="text-[12px] text-gray-500 mt-1.5 leading-snug">
                              Let the agent select the best tools automatically.
                            </p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-slate-50 transition-all bg-white relative overflow-hidden group shadow-sm">
                          <div className="absolute inset-y-0 left-0 w-1 bg-purple-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                          <input
                            type="radio"
                            name="skill"
                            className="mt-1 w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                              Research Protocol
                            </p>
                            <p className="text-[12px] text-gray-500 mt-1.5 leading-snug">
                              Deep analysis across web and local docs.
                            </p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-slate-50 transition-all bg-white relative overflow-hidden group shadow-sm">
                          <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                          <input
                            type="radio"
                            name="skill"
                            className="mt-1 w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                              Code Refactor
                            </p>
                            <p className="text-[12px] text-gray-500 mt-1.5 leading-snug">
                              Structured AST parsing and UI transformation.
                            </p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-slate-50 transition-all bg-white relative overflow-hidden group shadow-sm">
                          <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                          <input
                            type="radio"
                            name="skill"
                            className="mt-1 w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                              Social & Content
                            </p>
                            <p className="text-[12px] text-gray-500 mt-1.5 leading-snug">
                              Specialized models for drafting public posts.
                            </p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-3.5 border border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-slate-50 transition-all bg-white relative overflow-hidden group shadow-sm">
                          <div className="absolute inset-y-0 left-0 w-1 bg-rose-500 transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                          <input
                            type="radio"
                            name="skill"
                            className="mt-1 w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-gray-900 leading-tight">
                              Data Processing
                            </p>
                            <p className="text-[12px] text-gray-500 mt-1.5 leading-snug">
                              Clean, format, and structure CSVs securely.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                      <label className="block text-xs font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Database className="w-4 h-4 text-teal-500" /> Connected
                        MCP Servers
                      </label>
                      <div className="space-y-3.5">
                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-[#24292e] text-white p-1.5 rounded-md">
                              <Github className="w-4 h-4" />
                            </div>
                            GitHub Repository
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              defaultChecked
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-[#F24E1E] text-white p-1.5 rounded-md">
                              <Figma className="w-4 h-4" />
                            </div>
                            Figma Design Files
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              defaultChecked
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-[#4A154B] text-white p-1.5 rounded-md">
                              <Slack className="w-4 h-4" />
                            </div>
                            Slack Communications
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-[#0F9D58] text-white p-1.5 rounded-md">
                              <Chrome className="w-4 h-4" />
                            </div>
                            Google Drive Docs
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-black text-white p-1.5 rounded-md">
                              <Database className="w-4 h-4" />
                            </div>
                            Notion Workspace
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              defaultChecked
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-[#0052CC] text-white p-1.5 rounded-md">
                              <Trello className="w-4 h-4" />
                            </div>
                            Trello Boards
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input type="checkbox" className="peer sr-only" />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all hover:shadow-sm">
                          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 flex items-center gap-3">
                            <div className="flex bg-[#FF6B6B] text-white p-1.5 rounded-md">
                              <Box className="w-4 h-4" />
                            </div>
                            AIO Sandbox
                          </span>
                          <div className="relative inline-flex items-center h-5 rounded-full w-9">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              defaultChecked
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-between items-center">
                <div className="text-sm font-medium text-emerald-600 flex items-center gap-2.5">
                  <span className="relative flex w-2.5 h-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-500"></span>
                  </span>
                  System ready to connect
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedSuggestion(null)}
                    className="px-6 py-3 rounded-xl text-[14px] font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleSubmit(selectedSuggestion.prompt);
                      setSelectedSuggestion(null);
                    }}
                    className="px-8 py-3 rounded-xl text-[14px] font-bold bg-accent text-white hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Run Action <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {skillsModalOpen && (
        <SkillsModal
          onClose={() => setSkillsModalOpen(false)}
          onUseSkill={handleUseSkill}
        />
      )}

      {manageConnectorsModalOpen && (
        <ConnectorsModal onClose={() => setManageConnectorsModalOpen(false)} />
      )}
    </div>
  );
}
