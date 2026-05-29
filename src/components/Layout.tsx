import React, { useState, useRef, useEffect } from "react";
import { BotRegular, SparkleRegular } from "@fluentui/react-icons";
import {
  Snowflake,
  Search,
  PanelRight,
  ChevronDown,
  Plus,
  Crown,
  ArrowUpDown,
  Info,
  Bot,
  GitBranch,
  Puzzle,
  Server,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ViewType } from "../types";
import { syncNgrokUrl } from "../utils/config";
import { SystemHealth } from "./SystemHealth";

const WorkersAnim = () => (
  <div className="w-5 h-5 flex items-center justify-center relative opacity-0 group-hover:opacity-100 transition-opacity">
    <div className="absolute text-base drop-shadow-md transform -skew-x-[10deg] rotate-[20deg] translate-y-1 translate-x-1 pb-1">
      📜
    </div>
    <div className="absolute text-sm z-10 animate-[write_1s_ease-in-out_infinite]">
      ✍️
    </div>
  </div>
);

const WorkflowsAnim = () => (
  <div className="w-5 h-5 flex items-center justify-center relative opacity-0 group-hover:opacity-100 transition-opacity">
    <div className="absolute text-[14px] opacity-70 animate-[spin_3s_linear_infinite] drop-shadow-sm translate-x-0.5 translate-y-1.5">
      ⚙️
    </div>
    <div className="absolute text-[15px] animate-[spin_2s_linear_infinite_reverse] drop-shadow-md -translate-x-1.5 -translate-y-1 z-10">
      ⚙️
    </div>
  </div>
);

const SkillsAnim = () => (
  <div className="w-5 h-5 flex items-center justify-center relative opacity-0 group-hover:opacity-100 transition-opacity">
    <div className="absolute text-base translate-y-1.5 drop-shadow-sm">📖</div>
    <div className="absolute text-xs z-10 animate-[read-book_2s_ease-in-out_infinite] -translate-y-1">
      🤓
    </div>
  </div>
);

const ServersAnim = () => (
  <div className="w-5 h-5 flex items-center justify-center relative opacity-0 group-hover:opacity-100 transition-opacity">
    <div className="absolute text-base drop-shadow-sm">🗄️</div>
    <div className="absolute w-[3px] h-[3px] bg-green-400 rounded-full right-0 top-1 animate-pulse shadow-[0_0_4px_#4ade80]"></div>
    <div className="absolute w-[3px] h-[3px] bg-blue-400 rounded-full left-0 top-2.5 animate-pulse delay-75 shadow-[0_0_4px_#60a5fa]"></div>
  </div>
);

const NewChatAnim = () => (
  <div className="w-5 h-5 flex items-center justify-center relative opacity-0 group-hover:opacity-100 transition-opacity">
    <div className="absolute text-base drop-shadow-sm animate-[bounce_2s_infinite]">
      💬
    </div>
    <div className="absolute text-[10px] -bottom-1 -right-1 z-10 animate-[bounce_2s_infinite_200ms]">
      ✨
    </div>
  </div>
);

export function Sidebar({
  currentView,
  onNavigate,
  onToggleCommandPalette,
  isCollapsed,
  onToggleCollapse,
}: {
  currentView: ViewType;
  onNavigate: (v: ViewType) => void;
  onToggleCommandPalette: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [sessionsOpen, setSessionsOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(true);

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItem = (
    id: ViewType,
    AnimationObj: any,
    label: string,
    Icon: any,
    gradient: string,
  ) => (
    <button
      onClick={() => onNavigate(id)}
      className={`group flex items-center gap-2.5 py-2.5 rounded-xl border w-full transition-all cursor-pointer ${isCollapsed ? "px-0 justify-center text-transparent" : "px-3 text-left text-[13px] font-medium"}
        ${currentView === id ? "bg-white border-border shadow-sm text-gray-900" : "bg-transparent border-transparent text-gray-600 hover:bg-white hover:border-gray-100 hover:shadow-sm"}`}
      title={isCollapsed ? label : ""}
    >
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-0 group-hover:opacity-0`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <AnimationObj />
        </div>
      </div>
      {!isCollapsed && (
        <span className="whitespace-nowrap transition-opacity">{label}</span>
      )}
    </button>
  );

  return (
    <aside
      className={`bg-sidebar border-r border-border flex flex-col py-4 transition-all duration-300 ease-in-out relative overflow-visible shadow-sm z-50 ${isCollapsed ? "w-[72px] min-w-[72px] p-2 items-center" : "w-[250px] min-w-[250px] px-3 opacity-100"}`}
    >
      <div
        className={`flex flex-col h-full w-full overflow-hidden transition-opacity duration-300 opacity-100`}
      >
        <div
          className={`flex items-center justify-between mb-6 px-1 shrink-0 ${isCollapsed ? "flex-col gap-4 mt-2" : ""}`}
        >
          <div className="text-xl text-accent">
            <Snowflake />
          </div>
          <div
            className={`flex gap-2 text-gray-500 ${isCollapsed ? "flex-col" : ""}`}
          >
            {!isCollapsed && (
              <Search
                className="w-4 h-4 cursor-pointer hover:text-gray-900 transition-colors"
                onClick={onToggleCommandPalette}
              />
            )}
            <PanelRight
              className={`w-4 h-4 cursor-pointer hover:text-gray-900 transition-colors ${isCollapsed ? "rotate-180 mb-2" : ""}`}
              onClick={() => onToggleCollapse?.()}
            />
          </div>
        </div>

        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className={`flex items-center justify-between w-full bg-transparent border-none px-1 py-1.5 mb-2 mt-1 cursor-pointer text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-500 transition-colors ${isCollapsed ? "justify-center" : ""}`}
        >
          <div
            className={`flex items-center gap-1.5 ${isCollapsed ? "justify-center" : ""}`}
          >
            <span className="text-sm">🗂️</span>
            {!isCollapsed && <span>Workspace</span>}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${!workspaceOpen ? "-rotate-90" : ""}`}
            />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ${!workspaceOpen ? "max-h-0 opacity-0 mb-0" : "max-h-[500px] opacity-100 mb-6"}`}
        >
          <div
            className={`flex flex-col gap-1.5 mb-1 ${isCollapsed ? "p-0 items-center w-10 mx-auto" : "p-1"}`}
          >
            {navItem(
              "workers",
              WorkersAnim,
              "Workers",
              Bot,
              "from-teal-600 to-teal-400",
            )}
            {navItem(
              "workflows",
              WorkflowsAnim,
              "Workflows",
              GitBranch,
              "from-blue-600 to-blue-400",
            )}
            {navItem(
              "skills",
              SkillsAnim,
              "Skills",
              Puzzle,
              "from-purple-600 to-purple-400",
            )}
            {navItem(
              "servers",
              ServersAnim,
              "Servers",
              Server,
              "from-amber-600 to-amber-400",
            )}
          </div>
        </div>

        <button
          onClick={() => setSessionsOpen(!sessionsOpen)}
          className={`flex items-center justify-between w-full bg-transparent border-none px-1 py-1.5 mb-2 mt-2.5 cursor-pointer text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-500 transition-colors ${isCollapsed ? "justify-center" : ""}`}
        >
          <div
            className={`flex items-center gap-1.5 ${isCollapsed ? "justify-center" : ""}`}
          >
            <span className="text-sm">💬</span>
            {!isCollapsed && <span>Sessions</span>}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${!sessionsOpen ? "-rotate-90" : ""}`}
            />
          )}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 group/sessions ${!sessionsOpen ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}`}
        >
          <button
            onClick={() => onNavigate("chats")}
            className={`group flex items-center gap-2.5 rounded-xl bg-white border border-transparent text-[13px] font-medium text-gray-900 cursor-pointer shadow-sm mb-5 w-full hover:border-border transition-all ${isCollapsed ? "justify-center p-2 mx-auto w-10 h-10" : "px-3 py-2.5"}`}
            title={isCollapsed ? "New Chat" : ""}
          >
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#378ADD] to-blue-400 shadow-[0_2px_5px_rgba(55,138,221,0.3)] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-0 group-hover:opacity-0">
                <Plus className="w-3.5 h-3.5" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <NewChatAnim />
              </div>
            </div>
            {!isCollapsed && <span>New Chat</span>}
          </button>

          {!isCollapsed && (
            <div className="relative mb-4 mx-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search sessions..." 
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-800 shadow-sm"
              />
            </div>
          )}

          {!isCollapsed && (
            <div className="text-center mb-[30px] p-2.5 text-gray-900 mt-2">
              <div className="text-2xl mb-1 opacity-80 relative h-12 flex items-end justify-center overflow-hidden">
                <div className="absolute w-full text-center bottom-2 transition-transform duration-300 group-hover/sessions:-translate-y-12 group-hover/sessions:opacity-0">
                  😔
                </div>
                <div className="absolute w-full text-center bottom-2 transition-transform duration-300 translate-y-12 opacity-0 group-hover/sessions:translate-y-0 group-hover/sessions:opacity-100 group-hover/sessions:animate-[bounce_1s_ease-in-out_infinite]">
                  😊
                </div>
              </div>
              <div className="text-xs font-medium mb-1">No chats yet</div>
              <div className="text-[11px] text-gray-400">
                Start a new project to get going
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto"></div>

        <div className="relative mt-auto w-full" ref={settingsRef}>
          {settingsOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-[200px] bg-white rounded-xl border border-border shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-2 flex flex-col z-[100] animate-[popUp_0.2s_ease-out]">
              <div className="text-[11px] font-semibold text-gray-400 mb-2 pl-2">
                General
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5">
                <span className="text-base w-5 text-center inline-block">
                  💎
                </span>{" "}
                Plan
              </div>
              <div
                onClick={() => {
                  onNavigate("knowledge");
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5"
              >
                <span className="text-base w-5 text-center inline-block">
                  📚
                </span>{" "}
                Knowledge Base
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5">
                <span className="text-base w-5 text-center inline-block">
                  🛟
                </span>{" "}
                Support
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5">
                <span className="text-base w-5 text-center inline-block">
                  💳
                </span>{" "}
                Billing
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5">
                <span className="text-base w-5 text-center inline-block">
                  📊
                </span>{" "}
                Usage
              </div>
              <div
                onClick={() => {
                  onNavigate("connectors");
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5"
              >
                <span className="text-base w-5 text-center inline-block">
                  🔌
                </span>{" "}
                Integrations
              </div>
              <div
                onClick={() => {
                  onNavigate("settings");
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5"
              >
                <span className="text-base w-5 text-center inline-block">
                  🔑
                </span>{" "}
                API Keys
              </div>
              <div
                onClick={() => {
                  onNavigate("settings");
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5"
              >
                <span className="text-base w-5 text-center inline-block">
                  ⚙️
                </span>{" "}
                Settings
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mb-0.5">
                <span className="text-base w-5 text-center inline-block">
                  🎨
                </span>{" "}
                Theme
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-gray-500 cursor-pointer hover:bg-hover hover:text-gray-900 mt-1 border-t border-border pt-2">
                <span className="text-base w-5 text-center inline-block">
                  🚪
                </span>{" "}
                Log out
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-2.5 w-full">
            <div
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`flex-1 flex items-center p-2 bg-white rounded-xl border border-border cursor-pointer min-w-0 ${isCollapsed ? "justify-center w-10 h-10 mx-auto rounded-[12px] p-2" : "gap-2.5 p-2.5"}`}
            >
              <div
                className={`w-6 h-6 rounded bg-gray-200 shrink-0 ${isCollapsed ? "flex items-center justify-center" : ""}`}
              ></div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 mb-0.5 truncate">
                      info
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-orange-50 border border-orange-100 text-[10px] font-semibold text-orange-600">
                      <Crown className="w-3 h-3" /> Ultra
                    </div>
                  </div>
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { useToggledApps } from '../store';

export function TopHeader({
  onNavigate,
}: {
  onNavigate: (v: ViewType) => void;
}) {
  const [tunnelActive, setTunnelActive] = useState<boolean>(false);
  const [connectedToolkits, setConnectedToolkits] = useState<string[]>([]);
  const { toggledApps, toggleApp } = useToggledApps();
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const socialApps = [
    { name: 'TikTok', slug: 'tiktok', icon: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" },
    { name: 'Instagram', slug: 'instagram', icon: "https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" },
    { name: 'Facebook', slug: 'facebook', icon: "https://logo.clearbit.com/facebook.com", specialClass: "rounded-full" },
    { name: 'YouTube', slug: 'youtube', icon: "https://logo.clearbit.com/youtube.com", specialClass: "rounded-full" },
    { name: 'LinkedIn', slug: 'linkedin', icon: "https://logo.clearbit.com/linkedin.com", specialClass: "rounded-sm" },
  ];

  const checkConnections = async () => {
    try {
      const res = await fetch("/api/composio/connected_accounts");
      const data = await res.json();
      if (data.items) {
        const activeSlugs = data.items.filter((a: any) => a.status === 'ACTIVE').map((a: any) => a.toolkit.slug);
        setConnectedToolkits(activeSlugs);
        return activeSlugs;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  useEffect(() => {
    checkConnections();
  }, []);

  const handleToggle = async (slug: string) => {
    if (toggledApps.includes(slug)) {
      toggleApp(slug, false);
      return;
    }

    // Try to turn on
    if (connectedToolkits.includes(slug)) {
      toggleApp(slug, true);
    } else {
      // Connect flow
      setIsConnecting(slug);
      try {
        const res = await fetch("/api/composio/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appName: slug })
        });
        const data = await res.json();
        if (data.redirectUrl) {
          const popup = window.open(data.redirectUrl, "Connect", "width=800,height=600");
          
          const pollTimer = setInterval(async () => {
            if (popup?.closed) {
              clearInterval(pollTimer);
              const active = await checkConnections();
              if (active.includes(slug)) {
                toggleApp(slug, true);
              }
              setIsConnecting(null);
            }
          }, 1000);
        } else {
           setIsConnecting(null);
        }
      } catch (e) {
        setIsConnecting(null);
      }
    }
  };

  useEffect(() => {
    syncNgrokUrl();
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/health");
        setTunnelActive(res.ok);
      } catch (e) {
        setTunnelActive(false);
      }
    }, 5000);
    // Initial fetch
    fetch("/api/health").then(res => setTunnelActive(res.ok)).catch(() => setTunnelActive(false));
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-4 min-h-[60px] pb-3">
      <div
        className="flex flex-wrap gap-1.5 p-0 flex-1 justify-start mr-5"
        id="global-pills"
      >
        {socialApps.map(app => {
          const isToggled = toggledApps.includes(app.slug);
          const isConn = isConnecting === app.slug;
          const isConnected = connectedToolkits.includes(app.slug);
          
          return (
            <div 
              key={app.slug}
              onClick={() => handleToggle(app.slug)}
              className={`relative group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5
                ${isToggled 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-500/20 shadow-indigo-100' 
                  : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'}`}
            >
              {isConnected && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full ring-2 ring-white z-10" title="Connected">
                  {isToggled && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400`}></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isToggled ? 'bg-emerald-500' : 'bg-green-500'}`}></span>
                </span>
              )}
              {isConn ? (
                 <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              ) : (
                <img
                  src={app.icon}
                  width="14"
                  height="14"
                  className={`transition-all duration-300 ${isToggled ? 'scale-110 drop-shadow-sm' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'} ${app.specialClass || ''}`}
                />
              )}
              {app.name}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 items-center shrink-0">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)]" title={tunnelActive ? "AIO Sandbox Tunnel Active" : "AIO Sandbox Tunnel Inactive"}>
          <div className={`w-2 h-2 rounded-full ${tunnelActive ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-[11px] font-medium text-gray-700">Tunnel</span>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl bg-orange-50 border border-orange-100 text-[10px] font-semibold text-orange-600">
            <Crown className="w-3 h-3" /> Ultra
          </div>
          <div className="flex flex-col leading-[1.1]">
            <span className="text-[8px] font-semibold text-gray-400 tracking-wider">
              CREDITS
            </span>
            <span className="text-[12px] font-bold text-gray-900">999,999</span>
          </div>
          <button className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-400 text-white border-none flex items-center justify-center cursor-pointer shadow-[0_2px_6px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={() => onNavigate("status")}
          className="w-7 h-7 rounded-full border border-border bg-transparent text-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          title="Status Overview"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export function GlobalStatus({
  onNavigate,
}: {
  onNavigate: (v: ViewType) => void;
}) {
  const [tunnelActive, setTunnelActive] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/health");
        setTunnelActive(res.ok);
      } catch (e) {
        setTunnelActive(false);
      }
    }, 5000);
    // Initial fetch
    fetch("/api/health").then(res => setTunnelActive(res.ok)).catch(() => setTunnelActive(false));
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col border-b border-border bg-white">
      <SystemHealth />
      <div className="px-6 py-2.5 border-b border-border flex items-center gap-3 bg-gray-50 overflow-x-auto whitespace-nowrap">
        <span className="text-xs text-gray-400 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${tunnelActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {tunnelActive ? 'Sandbox Connection (Online)' : 'Sandbox Connection (Offline)'}
        </span>
      </div>
      <div className="px-6 py-2.5 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2 relative">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute w-full h-full rounded-full bg-accent opacity-50 animate-ping"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
          </div>
          Active Sessions:
        </span>
        <div
          onClick={() => onNavigate("execution")}
          className="relative rounded-[9px] cursor-pointer shadow-[0_0_8px_rgba(59,130,246,0.3)] group overflow-hidden"
          title="View Execution Tracker"
        >
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#3b82f6_360deg)] animate-[spin_2s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg,transparent_0_340deg,#3b82f6_360deg)] animate-[spin_2s_linear_infinite]"></div>
          
          <div className="relative m-[1px] px-2.5 py-1.5 bg-white rounded-lg flex items-center gap-2.5 text-xs hover:bg-blue-50 transition-colors z-10">
            <BotRegular className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">social-media</span>
            <span className="text-gray-500 pr-2 border-r border-gray-200">
              · TikTok batch
            </span>
            <button
              className="text-gray-400 hover:text-accent transition-colors ml-1 p-0.5 rounded-md hover:bg-blue-100"
              title="Open session in new tab"
              onClick={(e) => {
                e.stopPropagation();
                window.open("#", "_blank");
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        
        <div
          onClick={() => onNavigate("execution")}
          className="relative rounded-[9px] cursor-pointer shadow-[0_0_8px_rgba(59,130,246,0.3)] group overflow-hidden"
          title="View Execution Tracker"
        >
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#3b82f6_360deg)] animate-[spin_2s_linear_infinite]"></div>
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg,transparent_0_340deg,#3b82f6_360deg)] animate-[spin_2s_linear_infinite]"></div>
          
          <div className="relative m-[1px] px-2.5 py-1.5 bg-white rounded-lg flex items-center gap-2.5 text-xs hover:bg-blue-50 transition-colors z-10">
            <SparkleRegular className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">content-creator</span>
            <span className="text-gray-500 pr-2 border-r border-gray-200">
              · Blog rewrite
            </span>
            <button
              className="text-gray-400 hover:text-accent transition-colors ml-1 p-0.5 rounded-md hover:bg-blue-100"
              title="Open session in new tab"
              onClick={(e) => {
                e.stopPropagation();
                window.open("#", "_blank");
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
