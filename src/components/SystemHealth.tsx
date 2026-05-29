import React, { useState, useEffect, useRef } from 'react';
import { Activity, Server, AlertTriangle, CheckCircle, ServerCrash, Settings, RefreshCcw, Filter, ChevronRight, ChevronDown, Download, Info, Search, FileText } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { createPortal } from 'react-dom';

type ServerData = {
  name: string;
  latency: number;
  status: 'online' | 'offline';
  prevStatus?: 'online' | 'offline';
  version: string;
  uptime: string;
  history: number[];
  rpsHistory: number[];
};

export function SystemHealth() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [latencyThreshold, setLatencyThreshold] = useState(100);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [autoRestart, setAutoRestart] = useState(false);
  const [chartViews, setChartViews] = useState<Record<string, 'latency' | 'rps'>>({});
  const [toasts, setToasts] = useState<{id: number, message: string}[]>([]);
  const [sandboxStats, setSandboxStats] = useState<{ cpu: number, mem: number } | null>(null);
  const [uptimeStats, setUptimeStats] = useState({ totalTicks: 0, onlineTicks: 0 });

  const autoRestartRef = useRef(autoRestart);

  useEffect(() => {
    autoRestartRef.current = autoRestart;
  }, [autoRestart]);
  
  // Mock servers
  const [servers, setServers] = useState<ServerData[]>([
    { name: 'social-media', latency: 45, status: 'online', prevStatus: 'online', version: '1.2.4', uptime: '4d 12h', history: Array(20).fill(45), rpsHistory: Array(20).fill(50) },
    { name: 'content-creator', latency: 120, status: 'online', prevStatus: 'online', version: '2.0.1', uptime: '12d 3h', history: Array(20).fill(120), rpsHistory: Array(20).fill(50) },
    { name: 'db-writer', latency: 0, status: 'offline', prevStatus: 'offline', version: '1.0.0', uptime: '0m', history: Array(20).fill(0), rpsHistory: Array(20).fill(0) },
  ]);

  const fetchStatus = () => {
    let currentOnline = 0;
    setServers(prev => prev.map(s => {
      let newStatus = s.status;
      let newLatency = s.latency;
      let newUptime = s.uptime;
      let newRps = s.rpsHistory ? s.rpsHistory[s.rpsHistory.length - 1] : 50;

      if (s.status === 'offline' && autoRestartRef.current) {
        newStatus = 'online';
        newLatency = Math.floor(Math.random() * 50) + 10;
        newUptime = '0m (restarted)';
      } else if (newStatus === 'online') {
        const jitter = Math.floor(Math.random() * 20) - 10;
        newLatency = Math.max(10, s.latency + jitter);
        const rpsJitter = Math.floor(Math.random() * 10) - 4;
        newRps = Math.max(0, newRps + rpsJitter);
      } else {
        newRps = 0;
      }
      
      if (s.status === 'online' && newStatus === 'offline') {
        const id = Date.now();
        setToasts(t => [...t, { id, message: `Server ${s.name} is offline!` }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5000);
      }

      const isOnlineNow = newStatus === 'online';
      if (isOnlineNow) currentOnline++;

      return { 
        ...s, 
        prevStatus: s.status,
        status: newStatus, 
        latency: newLatency,
        uptime: newUptime,
        history: [...s.history.slice(-19), newLatency],
        rpsHistory: [...(s.rpsHistory || Array(20).fill(50)).slice(-19), newRps]
      };
    }));
    
    setUptimeStats(prev => ({
      totalTicks: prev.totalTicks + servers.length,
      onlineTicks: prev.onlineTicks + currentOnline
    }));
  };

  const handleDownloadLogs = (e: React.MouseEvent) => {
    e.stopPropagation();
    const logs = {
      timestamp: new Date().toISOString(),
      servers: servers
    };
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-health-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    const headers = ['Timestamp,Server,Status,Latency,RPS,Version,Uptime'];
    const now = new Date().toISOString();
    const rows = servers.map(s => `${now},${s.name},${s.status},${s.latency},${s.rpsHistory[s.rpsHistory.length-1]},${s.version},${s.uptime}`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-health-${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [servers.length]);

  useEffect(() => {
    const fetchEnvStats = async () => {
      try {
        const res = await fetch('/api/sandbox/stats', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.stats) {
            const cpuMatch = data.stats.match(/Cpu\(s\):\s*([\d\.]+)\s*us/);
            const cpu = cpuMatch ? parseFloat(cpuMatch[1]) : Math.floor(Math.random() * 20) + 5;
            const memMatch = data.stats.match(/Mem:\s+(\d+)\s+(\d+)/);
            let memPercent = 0;
            if (memMatch) {
              const total = parseInt(memMatch[1], 10);
              const used = parseInt(memMatch[2], 10);
              memPercent = total > 0 ? (used / total) * 100 : 0;
            } else {
              memPercent = Math.floor(Math.random() * 40) + 20;
            }
            setSandboxStats({ cpu, mem: memPercent });
          }
        }
      } catch (err) {}
    };

    fetchEnvStats();
    const interval = setInterval(fetchEnvStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const offlineCount = servers.filter(s => s.status === 'offline').length;
  const uptimePercentage = uptimeStats.totalTicks > 0 
    ? Math.round((uptimeStats.onlineTicks / uptimeStats.totalTicks) * 100) 
    : 100;

  const toggleRow = (name: string) => {
    setExpandedRows(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const filteredServers = servers.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <div 
        className="px-6 py-2.5 border-b border-border flex items-center gap-3 bg-gray-50 overflow-x-auto whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        title="View System Health"
      >
        <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
          {offlineCount > 0 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            servers.some(s => s.status === 'online' && s.latency > latencyThreshold) ? (
              <Activity className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
            )
          )}
          System Health
          <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full ring-1 ring-indigo-500/20 ml-1">
            {uptimePercentage}% UP
          </span>
        </span>
        <span className="text-[10px] text-gray-400">
          {offlineCount > 0 ? `${offlineCount} server(s) unresponsive` : 'All systems operational'}
        </span>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[250] p-4 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="w-[480px] bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-border animate-[popUp_0.25s_cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-border bg-gray-50">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <h3 className="text-xs font-semibold text-gray-900">MCP Server Latency</h3>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
               <button onClick={handleDownloadCSV} className="p-1 hover:bg-gray-200 rounded" title="Download CSV">
                 <FileText className="w-3.5 h-3.5" />
               </button>
               <button onClick={handleDownloadLogs} className="p-1 hover:bg-gray-200 rounded" title="Download JSON Logs">
                 <Download className="w-3.5 h-3.5" />
               </button>
               <button onClick={(e) => { e.stopPropagation(); fetchStatus(); }} className="p-1 hover:bg-gray-200 rounded" title="Refresh">
                 <RefreshCcw className="w-3.5 h-3.5" />
               </button>
               <button onClick={(e) => { e.stopPropagation(); setFilter(f => f === 'all' ? 'online' : f === 'online' ? 'offline' : 'all'); }} className="p-1 hover:bg-gray-200 rounded flex items-center gap-1" title="Filter">
                 <Filter className="w-3.5 h-3.5" />
                 <span className="text-[10px] capitalize font-medium">{filter === 'all' ? '' : filter}</span>
               </button>
               <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className="p-1 hover:bg-gray-200 rounded" title="Settings">
                 <Settings className="w-3.5 h-3.5" />
               </button>
            </div>
          </div>
          
          <div className="px-3 pb-2 bg-gray-50 border-b border-border">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1.5" />
              <input 
                type="text" 
                placeholder="Filter servers by name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-2 py-1 pl-7 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>
          
          {showSettings && (
            <div className="p-3 bg-indigo-50 border-b border-indigo-100 flex flex-col gap-3 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-indigo-900 flex justify-between items-center">
                  Latency Threshold Alert (ms)
                  <span className="text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">{latencyThreshold}ms</span>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="500" 
                  step="10" 
                  value={latencyThreshold} 
                  onChange={(e) => setLatencyThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded border border-indigo-100">
                <span className="text-[11px] font-semibold text-indigo-900">Auto-Restart Offline Servers</span>
                <button 
                  onClick={() => setAutoRestart(!autoRestart)}
                  className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${autoRestart ? 'bg-indigo-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${autoRestart ? 'translate-x-4' : 'translate-x-0.5'}`} style={{ left: '2px' }} />
                </button>
              </div>
            </div>
          )}

          <div className="p-2 flex flex-col gap-1 overflow-y-auto">
            {filteredServers.map(server => {
              const isExpanded = expandedRows.includes(server.name);
              const isAlert = server.status === 'online' && server.latency > latencyThreshold;
              const isStatusChanged = server.status !== server.prevStatus;
              
              return (
                <div key={server.name} className="flex flex-col rounded hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors">
                  <div 
                    className="flex items-center justify-between p-2 cursor-pointer"
                    onClick={() => toggleRow(server.name)}
                  >
                    <div className="flex items-center gap-2">
                       {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                      <div className={`transition-colors duration-1000 ${isStatusChanged ? 'animate-pulse' : ''}`}>
                        {server.status === 'online' ? (
                          <CheckCircle className={`w-3.5 h-3.5 transition-all duration-700 ${isStatusChanged ? 'text-indigo-400 scale-110' : 'text-emerald-500 scale-100'}`} />
                        ) : (
                          <ServerCrash className={`w-3.5 h-3.5 transition-all duration-700 ${isStatusChanged ? 'text-indigo-400 scale-110' : 'text-red-500 scale-100'}`} />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-gray-700">{server.name}</span>
                    </div>
                    <div className="text-[10px] tabular-nums font-mono">
                      {server.status === 'online' ? (
                        <span className={isAlert ? "text-amber-500 font-semibold flex items-center gap-1" : "text-gray-500"}>
                          {isAlert && <AlertTriangle className="w-3 h-3" />}
                          {server.latency}ms
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">ERR</span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-7 pb-2 text-[10px] text-gray-500 grid grid-cols-2 gap-2 mt-1">
                       <div className="bg-white p-1.5 rounded border border-gray-100">
                         <span className="block text-gray-400 mb-0.5">Version</span>
                         <span className="font-mono text-gray-700">{server.version}</span>
                       </div>
                       <div className="bg-white p-1.5 rounded border border-gray-100">
                         <span className="block text-gray-400 mb-0.5">Uptime</span>
                         <span className="font-mono text-gray-700">{server.uptime}</span>
                       </div>
                       <div className="col-span-2 bg-white p-1.5 rounded border border-gray-100 flex flex-col gap-1.5 mt-0.5">
                         <div className="flex justify-between items-center text-[9px]">
                           <span className="text-gray-400">Environment CPU Usage</span>
                           <span className="font-mono text-gray-700">{sandboxStats ? sandboxStats.cpu.toFixed(1) : '--'}%</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                           <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${sandboxStats ? sandboxStats.cpu : 0}%` }}></div>
                         </div>
                         <div className="flex justify-between items-center text-[9px] pt-1">
                           <span className="text-gray-400">Environment Memory Usage</span>
                           <span className="font-mono text-gray-700">{sandboxStats ? sandboxStats.mem.toFixed(1) : '--'}%</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                           <div className="bg-teal-500 h-full transition-all duration-500" style={{ width: `${sandboxStats ? sandboxStats.mem : 0}%` }}></div>
                         </div>
                       </div>
                       
                       <div 
                         className="col-span-2 bg-white p-1.5 rounded border border-gray-100 h-20 mt-1 flex flex-col cursor-pointer hover:border-indigo-100 transition-colors group"
                         onClick={(e) => {
                           e.stopPropagation();
                           setChartViews(prev => ({
                             ...prev,
                             [server.name]: prev[server.name] === 'rps' ? 'latency' : 'rps'
                           }));
                         }}
                       >
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-[9px] text-gray-400 group-hover:text-indigo-500 transition-colors">
                             {chartViews[server.name] === 'rps' ? 'Requests / Second (5m)' : 'Latency History (5m)'}
                           </span>
                           <span className="text-[8px] text-gray-300 flex items-center gap-0.5"><RefreshCcw className="w-2.5 h-2.5" /> Toggle</span>
                         </div>
                         <div className="flex-1 min-h-[40px]">
                           <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={(chartViews[server.name] === 'rps' ? server.rpsHistory : server.history).map((val, i) => ({ id: i, value: val }))}>
                               <Line 
                                 type="monotone" 
                                 dataKey="value" 
                                 stroke={chartViews[server.name] === 'rps' ? "#6366f1" : (isAlert ? "#f59e0b" : (server.status === 'online' ? "#10b981" : "#ef4444"))} 
                                 strokeWidth={1.5} 
                                 dot={false} 
                                 isAnimationActive={false} 
                               />
                             </LineChart>
                           </ResponsiveContainer>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredServers.length === 0 && (
              <div className="py-4 text-center text-[11px] text-gray-400 italic">
                No {filter} servers found
              </div>
            )}
          </div>
        </div>
        </div>,
        document.body
      )}

      {createPortal(
        <div className="fixed top-4 right-4 z-[99999] flex flex-col gap-2 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="bg-white border border-red-100 shadow-[0_4px_20px_rgba(220,38,38,0.15)] rounded-lg px-4 py-3 flex items-center gap-3 animate-[popUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <ServerCrash className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">{toast.message}</span>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
