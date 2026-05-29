import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Check,
  Snowflake,
  CornerRightDown,
  X,
  Puzzle,
  Database,
  FileText,
  Code,
  Plug,
} from "lucide-react";
import { Tag, Btn } from "../components/SharedUI";

export function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-[100]"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[600px] bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-border overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search commands, agents, tools..."
              autoFocus
              className="flex-1 border-none outline-none text-[15px] font-sans"
            />
            <span
              className="text-[11px] bg-gray-100 px-2 py-1 rounded-md text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              ESC
            </span>
          </div>
          <div className="p-4">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Switch Model
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 border border-border rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#378ADD] to-blue-400 text-white flex items-center justify-center shadow-sm">
                  <Snowflake className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    claude-sonnet-4-5
                  </div>
                  <div className="text-xs text-gray-400">
                    Anthropic &middot; Active
                  </div>
                </div>
                <Check className="text-accent w-4 h-4" />
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-hover transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-400 text-white flex items-center justify-center shadow-sm font-bold">
                  G
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500">gpt-4o</div>
                  <div className="text-xs text-gray-400">
                    OpenAI &middot; 54 models
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-5">
              Switch Agent
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-[13px] flex items-center gap-1.5 cursor-pointer font-medium hover:bg-sky-100">
                <Snowflake className="w-3.5 h-3.5" /> Frost{" "}
                <Check className="w-3 h-3 ml-0.5" />
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-border text-gray-500 text-[13px] cursor-pointer hover:bg-hover">
                social-media
              </div>
              <div className="px-3 py-1.5 rounded-lg border border-border text-gray-500 text-[13px] cursor-pointer hover:bg-hover">
                content-creator
              </div>
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-border flex items-center gap-2.5 text-xs text-gray-400">
            Also try:
            <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm text-gray-600">
              /file
            </span>
            <span className="bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm text-gray-600">
              /skills
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function SkillsModal({
  onClose,
  onUseSkill,
}: {
  onClose: () => void;
  onUseSkill: (skill: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "config" | "docs" | "instructions"
  >("config");
  const [instructions, setInstructions] = useState("");

  const skills = [
    {
      name: "PR Reviewer",
      desc: "Reviews PRs with code quality analysis",
      icon: "https://logo.clearbit.com/github.com",
      type: "image",
    },
    {
      name: "Content Writer",
      desc: "Multi-platform social generation",
      icon: <FileText className="w-5 h-5 text-pink-500" />,
      type: "icon",
    },
    {
      name: "Data Analyst",
      desc: "Analyze CSV/JSON data",
      icon: <Database className="w-5 h-5 text-amber-500" />,
      type: "icon",
    },
    {
      name: "Web Researcher",
      desc: "Brave search & puppeteer",
      icon: "https://logo.clearbit.com/brave.com",
      type: "image",
    },
  ];

  return (
    <div
      className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="w-[850px] h-[550px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-accent flex items-center justify-center shadow-sm">
              <Puzzle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900">
                Comprehensive Skills Controls
              </h2>
              <div className="text-xs text-gray-500">
                Select and configure an AI skill to attach to your session
              </div>
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-[280px] border-r border-border p-4 flex flex-col min-h-0 bg-gray-50/50">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg mb-4 shrink-0 shadow-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search available skills..."
                className="bg-transparent border-none outline-none text-xs w-full"
              />
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
              {skills.map((s) => (
                <div
                  key={s.name}
                  onClick={() => {
                    setSelected(s.name);
                    setActiveTab("config");
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected === s.name ? "bg-indigo-50 border-accent shadow-sm" : "bg-white border-border hover:border-gray-300 shadow-sm"}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                    {s.type === "image" ? (
                      <img
                        src={s.icon as string}
                        width="20"
                        height="20"
                        className="rounded-md"
                      />
                    ) : (
                      s.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate leading-tight mt-0.5">
                      {s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-main-bg relative min-h-0">
            {selected ? (
              <div className="flex flex-col h-full animate-[fadeIn_0.3s_ease]">
                {/* Header area */}
                <div className="px-6 pt-6 pb-0 flex flex-col shrink-0 bg-white border-b border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                      <Puzzle className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {selected}
                      </h3>
                      <div className="flex gap-2 mt-1.5">
                        <Tag variant="tg" className="text-[10px]">
                          Installed
                        </Tag>
                        <Tag variant="tb2" className="text-[10px]">
                          Verified
                        </Tag>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab("config")}
                      className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === "config" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      Configuration
                    </button>
                    <button
                      onClick={() => setActiveTab("docs")}
                      className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === "docs" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      SKILL.md
                    </button>
                    <button
                      onClick={() => setActiveTab("instructions")}
                      className={`px-2 py-2 text-xs font-medium border-b-2 transition-colors ${activeTab === "instructions" ? "border-accent text-accent" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      Custom Instructions
                    </button>
                  </div>
                </div>

                {/* Content area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {activeTab === "config" && (
                    <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease]">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Features & Permissions
                      </div>

                      <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-border shadow-sm">
                        <div className="pr-6">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Auto-execute actions
                          </div>
                          <div className="text-xs text-gray-500 leading-relaxed">
                            Allow skill to run filesystem actions, commands, and
                            edits without requiring explicit prompt
                            confirmations.
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="rounded text-accent focus:ring-accent w-4 h-4 mt-1 cursor-pointer"
                          defaultChecked
                        />
                      </div>

                      <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-border shadow-sm">
                        <div className="pr-6">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Extended reasoning
                          </div>
                          <div className="text-xs text-gray-500 leading-relaxed">
                            Use complex multi-step planning. Increases quality
                            of generated code but results in slower execution.
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="rounded text-accent focus:ring-accent w-4 h-4 mt-1 cursor-pointer"
                        />
                      </div>

                      <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-border shadow-sm">
                        <div className="pr-6">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            Context injection
                          </div>
                          <div className="text-xs text-gray-500 leading-relaxed">
                            Automatically append repository context and index
                            files to all prompt queries made in this session.
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="rounded text-accent focus:ring-accent w-4 h-4 mt-1 cursor-pointer"
                          defaultChecked
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === "docs" && (
                    <div className="flex flex-col h-full animate-[fadeIn_0.2s_ease]">
                      <div className="bg-gray-900 rounded-xl flex-1 overflow-hidden flex flex-col font-mono text-[11px] text-gray-300">
                        <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
                          <div className="text-gray-400">SKILL.md</div>
                          <div className="text-gray-500">Read only</div>
                        </div>
                        <div className="p-4 overflow-y-auto leading-relaxed">
                          <span className="text-purple-400">
                            # Skill Metadata
                          </span>
                          <br />
                          <span>name: "{selected}"</span>
                          <br />
                          <span>version: "1.0.4"</span>
                          <br />
                          <span>author: "Frost AI"</span>
                          <br />
                          <br />
                          <span className="text-purple-400">## Directives</span>
                          <br />
                          <span className="text-emerald-400">
                            1. ALWAYS check the provided workspace context
                            before executing.
                          </span>
                          <br />
                          <span className="text-emerald-400">
                            2. DO NOT modify files outside the intended scope.
                          </span>
                          <br />
                          <span className="text-emerald-400">
                            3. Provide concise explanations and prioritize
                            accurate edits.
                          </span>
                          <br />
                          <br />
                          <span className="text-purple-400">
                            ## Trigger Conditions
                          </span>
                          <br />
                          <span>
                            Matches keywords related to code reviews, PRs, and
                            GitHub workflows.
                          </span>
                          <br />
                          <br />
                          <span className="text-purple-400">
                            ## Capabilities
                          </span>
                          <br />
                          <span>- Abstract Syntax Tree (AST) scanning</span>
                          <br />
                          <span>- Context-aware diff generation</span>
                          <br />
                          <span>- Automated testing synthesis</span>
                          <br />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "instructions" && (
                    <div className="flex flex-col h-full animate-[fadeIn_0.2s_ease]">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                        Custom Instructions
                      </div>
                      <p className="text-xs text-gray-500 mb-4">
                        Add your own instructions to guide how this skill
                        behaves in the current session. These will be appended
                        to the skill's system prompt.
                      </p>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="E.g. Always use Tailwind utility classes instead of inline styles. Prefer functional components..."
                        className="flex-1 w-full p-3 bg-white border border-border rounded-xl text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent shadow-sm"
                      ></textarea>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 p-4 shrink-0 border-t border-border bg-white mt-auto">
                  <Btn onClick={onClose} className="px-5 py-2">
                    Cancel
                  </Btn>
                  <Btn
                    variant="pur"
                    onClick={() => onUseSkill(selected)}
                    className="px-6 py-2 text-sm font-semibold shadow-sm"
                  >
                    Save & Use Skill
                  </Btn>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center animate-[fadeIn_0.3s_ease]">
                <Puzzle className="w-12 h-12 mb-4 opacity-30 text-accent" />
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Select a skill to configure
                </div>
                <div className="text-xs text-gray-400 max-w-[200px]">
                  Skills act as specific protocol instructions for the AI
                  workspace
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConnectorsModal({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<"all" | "oauth" | "api_key">("all");
  const [search, setSearch] = useState("");

  const connectedApps = [
    {
      name: "GitHub",
      icon: "https://logo.clearbit.com/github.com",
      tag: "OAuth",
      variant: "tg",
    },
    {
      name: "Slack",
      icon: "https://logo.clearbit.com/slack.com",
      tag: "OAuth",
      variant: "tg",
    },
    {
      name: "Gmail",
      icon: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
      tag: "OAuth",
      variant: "tg",
    },
    {
      name: "Drive",
      icon: "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png",
      tag: "OAuth",
      variant: "tg",
    },
    {
      name: "Jira",
      icon: "https://logo.clearbit.com/atlassian.com",
      tag: "OAuth",
      variant: "tg",
    },
    {
      name: "AWS",
      icon: "https://logo.clearbit.com/aws.amazon.com",
      tag: "API Key",
      variant: "tb2",
    },
    {
      name: "Supabase",
      icon: "https://logo.clearbit.com/supabase.com",
      tag: "API Key",
      variant: "tb2",
    },
    {
      name: "Linear",
      icon: "https://logo.clearbit.com/linear.app",
      tag: "OAuth",
      variant: "tg",
    },
  ];

  const availableApps = [
    {
      name: "X (Twitter)",
      icon: "https://logo.clearbit.com/twitter.com",
      tag: "OAuth",
    },
    {
      name: "HubSpot",
      icon: "https://logo.clearbit.com/hubspot.com",
      tag: "OAuth",
    },
    {
      name: "Salesforce",
      icon: "https://logo.clearbit.com/salesforce.com",
      tag: "OAuth",
    },
    {
      name: "Notion",
      icon: "https://logo.clearbit.com/notion.so",
      tag: "OAuth",
    },
    {
      name: "Discord",
      icon: "https://logo.clearbit.com/discord.com",
      tag: "OAuth",
    },
    {
      name: "Stripe",
      icon: "https://logo.clearbit.com/stripe.com",
      tag: "API Key",
    },
    {
      name: "Twilio",
      icon: "https://logo.clearbit.com/twilio.com",
      tag: "API Key",
    },
    {
      name: "Shopify",
      icon: "https://logo.clearbit.com/shopify.com",
      tag: "API Key",
    },
    {
      name: "Asana",
      icon: "https://logo.clearbit.com/asana.com",
      tag: "OAuth",
    },
    {
      name: "Trello",
      icon: "https://logo.clearbit.com/trello.com",
      tag: "OAuth",
    },
    {
      name: "Mongo",
      icon: "https://logo.clearbit.com/mongodb.com",
      tag: "API Key",
    },
    {
      name: "Datadog",
      icon: "https://logo.clearbit.com/datadoghq.com",
      tag: "API Key",
    },
    {
      name: "Zendesk",
      icon: "https://logo.clearbit.com/zendesk.com",
      tag: "OAuth",
    },
    {
      name: "Heroku",
      icon: "https://logo.clearbit.com/heroku.com",
      tag: "API Key",
    },
    {
      name: "Figma",
      icon: "https://logo.clearbit.com/figma.com",
      tag: "OAuth",
    },
  ];

  const filterApps = (apps: any[]) => {
    return apps.filter((app) => {
      const matchesSearch = app.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType =
        filter === "all" ||
        (filter === "oauth" && app.tag === "OAuth") ||
        (filter === "api_key" && app.tag === "API Key");
      return matchesSearch && matchesType;
    });
  };

  const filteredConnected = filterApps(connectedApps);
  const filteredAvailable = filterApps(availableApps);

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-2xl border border-border flex flex-col w-[850px] h-[600px] shadow-2xl overflow-hidden shrink-0 relative z-10 animate-[popUp_0.2s_ease-out]">
        <div className="flex flex-col border-b border-border bg-gray-50/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                <Plug className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="text-[16px] font-bold text-gray-900 leading-tight">
                  Composio Integrations
                </div>
                <div className="text-[12px] text-gray-500 mt-0.5">
                  Securely connect and authenticate with 2,000+ apps and
                  services
                </div>
              </div>
            </div>
            <div
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="px-6 pb-4 flex items-center justify-between">
            <div className="flex border border-border rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
              <div
                className={`px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${filter === "all" ? "bg-indigo-50 text-accent" : "text-gray-500 hover:bg-gray-50"}`}
                onClick={() => setFilter("all")}
              >
                All
              </div>
              <div className="w-px bg-border bg-gray-200"></div>
              <div
                className={`px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${filter === "oauth" ? "bg-indigo-50 text-accent" : "text-gray-500 hover:bg-gray-50"}`}
                onClick={() => setFilter("oauth")}
              >
                OAuth
              </div>
              <div className="w-px bg-border bg-gray-200"></div>
              <div
                className={`px-4 py-1.5 text-xs font-medium cursor-pointer transition-colors ${filter === "api_key" ? "bg-indigo-50 text-accent" : "text-gray-500 hover:bg-gray-50"}`}
                onClick={() => setFilter("api_key")}
              >
                API Key
              </div>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 2,000+ apps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm w-[250px] bg-white border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-main-bg bg-opacity-50">
          {filteredConnected.length > 0 && (
            <div className="mb-8 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>Active Connections</span>
                <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px]">
                  {filteredConnected.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {filteredConnected.map((app) => (
                  <div
                    key={app.name}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 absolute top-2.5 right-2.5"></div>
                    <img
                      src={app.icon}
                      width="36"
                      height="36"
                      className="rounded-xl mt-1 shadow-sm border border-gray-100"
                    />
                    <span className="text-[13px] font-semibold text-gray-900">
                      {app.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                      {app.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredAvailable.length > 0 && (
            <div className="animate-[fadeIn_0.3s_ease-out] delay-100">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>Available Integrations</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {filteredAvailable.map((app) => (
                  <div
                    key={app.name}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-border border-dashed shadow-sm relative group cursor-pointer hover:border-accent/50 hover:bg-gray-50 transition-all"
                  >
                    <img
                      src={app.icon}
                      width="36"
                      height="36"
                      className="rounded-xl mt-1 opacity-80 group-hover:opacity-100 transition-opacity shadow-sm"
                    />
                    <span className="text-[12px] font-semibold text-gray-900 truncate w-full text-center">
                      {app.name}
                    </span>
                    <span className="text-[10px] text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      + Connect
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredConnected.length === 0 && filteredAvailable.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Search className="w-12 h-12 mb-4 text-gray-300" />
              <div className="text-sm font-medium text-gray-600">
                No apps found
              </div>
              <div className="text-xs mt-1">
                Try adjusting your filters or search query
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
