import React, { useState } from 'react';
import { 
  Bot, Filter, Plus, Pause, Square, Code, RotateCw, GitBranch, Check, Download, MoreHorizontal, RefreshCcw, ScrollText, FileJson
} from 'lucide-react';
import { FI, Btn, Tag, Dot } from '../components/SharedUI';
import { CreateWorkerModal } from './CreateWorkerModal';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const dummyData1 = [{v:20}, {v:30}, {v:25}, {v:50}, {v:45}, {v:60}, {v:80}, {v:65}, {v:90}];
const dummyData2 = [{v:10}, {v:15}, {v:12}, {v:20}, {v:35}, {v:30}, {v:40}, {v:45}, {v:60}];
const dummyData3 = [{v:50}, {v:40}, {v:60}, {v:55}, {v:70}, {v:65}, {v:85}, {v:80}, {v:95}];


export function WorkersView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const downloadLogsJson = () => {
    const logs = [
      { tool: "github.list_pull_requests", args: { repo: "frost-ai", state: "open" }, result: "3 PRs found", duration: "0.4s", status: "success" },
      { tool: "github.create_review_comment", status: "running", context: "Analyzing security vulnerabilities..." }
    ];
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tool_call_trace.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadLogsCsv = () => {
    const logs = [
      { tool: "github.list_pull_requests", result: "3 PRs found", duration: "0.4s", status: "success" },
      { tool: "github.create_review_comment", result: "", duration: "", status: "running" }
    ];
    const csvRows = [
      ["Tool", "Result", "Duration", "Status"],
      ...logs.map(log => [log.tool, log.result, log.duration, log.status])
    ];
    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tool_call_trace.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="pheader">
        <FI variant="teal"><Bot className="w-[15px] h-[15px]" /></FI>
        <div>
           <div className="text-[14px] font-display font-semibold text-gray-900">Workers</div>
           <div className="text-[11px] text-gray-400">3 running · 1 queued · 2 paused</div>
        </div>
        <div className="flex-1"></div>
        <Btn><Filter className="w-3.5 h-3.5" /> Filter</Btn>
        <Btn variant="pur" onClick={() => setIsModalOpen(true)}><Plus className="w-3.5 h-3.5" /> New worker</Btn>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[228px] border-r border-border bg-sidebar overflow-y-auto">
          <div className="sb-sec">Running</div>
          <div className="row on ml-1.5 mr-1.5 hover:bg-indigo-50">
             <Dot color="sg" />
             <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
               <img src="https://logo.clearbit.com/github.com" width="18" height="18" className="rounded" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-accent truncate">PR Reviewer</div>
               <div className="text-[10px] text-gray-400">8 tools · 4m 23s</div>
             </div>
             <div className="w-10 h-5 opacity-70 ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyData1}>
                     <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
             <Dot color="sg" />
             <FI size="sm" variant="pnk"><GitBranch className="w-3 h-3" /></FI>
             <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900 truncate">Social Scheduler</div>
               <div className="text-[10px] text-gray-400">composio · 5m</div>
             </div>
             <div className="w-10 h-5 opacity-50 ml-2 grayscale">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyData2}>
                     <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
             <Dot color="sg" />
             <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
               <img src="https://logo.clearbit.com/brave.com" width="18" height="18" className="rounded bg-white" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900 truncate">Web Researcher</div>
               <div className="text-[10px] text-gray-400">brave + puppeteer</div>
             </div>
             <div className="w-10 h-5 opacity-50 ml-2 grayscale">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyData3}>
                     <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="dvd mx-2.5"></div>
          
          <div className="sb-sec">Queued</div>
          <div className="row ml-1.5 mr-1.5">
             <Dot color="sy" />
             <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" width="18" height="18" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900 truncate">Email Drafter</div>
               <div className="text-[10px] text-gray-400">3rd in queue</div>
             </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden bg-main-bg">
          <div className="px-3.5 py-2.5 border-b border-border bg-white flex items-center gap-2.5 shrink-0">
             <div className="w-7 h-7 flex items-center justify-center shrink-0">
                 <img src="https://logo.clearbit.com/github.com" width="28" height="28" className="rounded-md" />
             </div>
             <div className="min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 truncate">PR Reviewer</div>
                <div className="text-[10px] text-gray-400 truncate">Reviewing repo: frost-ai · PR #42, #43, #44</div>
             </div>
             <Tag variant="tg" className="ml-auto">Running</Tag>
             <Btn size="sm"><Pause className="w-3 h-3" /> Pause</Btn>
             <Btn size="sm" className="text-[#A32D2D]"><Square className="w-3 h-3" fill="currentColor" /> Stop</Btn>
             
             {/* Quick Actions Dropdown */}
             <div className="relative">
                <Btn size="sm" onClick={() => setShowQuickActions(!showQuickActions)}>
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Btn>
                {showQuickActions && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-border bottom-border shadow-lg drop-shadow-sm rounded-xl py-1 z-50 overflow-hidden text-[11px] animate-[popUp_0.2s_ease-out]">
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors">
                      <RefreshCcw className="w-3.5 h-3.5 text-gray-400" /> Restart
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors">
                       <RotateCw className="w-3.5 h-3.5 text-gray-400" /> Reset State
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors">
                       <ScrollText className="w-3.5 h-3.5 text-gray-400" /> View Logs
                    </button>
                  </div>
                )}
             </div>
          </div>
          <div className="px-3.5 py-2.5 border-b border-border bg-white flex gap-4 shrink-0">
             <div className="flex-1">
                <div className="flex justify-between mb-1"><span className="text-[10px] text-gray-400">Tokens used</span><span className="text-[10px] font-medium text-gray-900">12,480</span></div>
                <div className="h-1 rounded-sm bg-gray-200 overflow-hidden"><div className="h-full bg-accent" style={{width: '25%'}}></div></div>
             </div>
             <div className="flex-1">
                <div className="flex justify-between mb-1"><span className="text-[10px] text-gray-400">Runtime</span><span className="text-[10px] font-medium text-gray-900">4m 23s</span></div>
                <div className="h-1 rounded-sm bg-gray-200 overflow-hidden"><div className="h-full bg-emerald-500" style={{width: '44%'}}></div></div>
             </div>
             <div className="flex-1">
                <div className="flex justify-between mb-1"><span className="text-[10px] text-gray-400">Tools called</span><span className="text-[10px] font-medium text-gray-900">8 / ~15</span></div>
                <div className="h-1 rounded-sm bg-gray-200 overflow-hidden"><div className="h-full bg-amber-500" style={{width: '53%'}}></div></div>
             </div>
          </div>
          <div className="pscroll p-3.5 bg-main-bg">
             <div className="flex justify-between items-center mb-2">
               <div className="text-[11px] font-semibold text-gray-900">Tool Call Trace</div>
               <div className="flex gap-2">
                 <Btn size="sm" onClick={downloadLogsJson}><FileJson className="w-3.5 h-3.5" /> Download as JSON</Btn>
                 <Btn size="sm" onClick={downloadLogsCsv}><Download className="w-3.5 h-3.5" /> Download as CSV</Btn>
               </div>
             </div>
             <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] my-0.5 bg-white border border-border mt-2">
                <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
                   <img src="https://logo.clearbit.com/github.com" width="14" height="14" className="rounded-sm" />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="font-medium text-gray-900 text-[11px]">github · list_pull_requests</div>
                   <div className="text-[10px] text-gray-400">repo="frost-ai" state="open" &rarr; 3 PRs found</div>
                </div>
                <span className="text-[9px] text-gray-400 truncate">0.4s</span>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
             </div>
             <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] mt-1 bg-blue-50 border border-blue-200">
                <FI size="xs" variant="blu"><Code className="w-2.5 h-2.5" /></FI>
                <div className="flex-1 min-w-0">
                   <div className="font-medium text-blue-600 text-[11px]">github · create_review_comment</div>
                   <div className="text-[10px] text-accent">Analyzing security vulnerabilities…</div>
                </div>
                <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
             </div>
          </div>
        </div>
      </div>
      {isModalOpen && <CreateWorkerModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
