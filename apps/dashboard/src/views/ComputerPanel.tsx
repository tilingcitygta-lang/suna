import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Folder, File, Code, Monitor, Clock, Battery, Wifi, Maximize, Minus, X, Globe, Key, Shield, Image as ImageIcon, MonitorPlay, ArrowLeft, ArrowRight, RotateCw, Lock, RefreshCw, Smartphone, Radio, FileCode2, Notebook, Save, Activity, Network } from 'lucide-react';
import { getSandboxUrl } from '../utils/config';

function FileExplorer({ sandboxUrl }: { sandboxUrl: string }) {
  const [files, setFiles] = useState<{name: string, is_directory: boolean}[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('/workspace');
  const [loading, setLoading] = useState(false);

  const loadFiles = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sandbox/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dirPath: path })
      });
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setCurrentPath(path);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadFiles('/workspace');
  }, []);

  const navigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    loadFiles('/' + parts.join('/'));
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="h-10 border-b border-gray-200 flex items-center px-4 gap-3 bg-gray-50">
        <button onClick={navigateUp} disabled={currentPath === '/'} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm font-mono text-gray-700 font-medium">{currentPath}</span>
        <button onClick={() => loadFiles(currentPath)} className="p-1 hover:bg-gray-200 rounded ml-auto">
          <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {files.map((f, i) => (
          <div 
            key={i} 
            className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded cursor-pointer group"
            onClick={() => f.is_directory && loadFiles(currentPath === '/' ? `/${f.name}` : `${currentPath}/${f.name}`)}
          >
            {f.is_directory ? <Folder className="w-5 h-5 text-blue-400 fill-blue-100" /> : <File className="w-5 h-5 text-gray-400" />}
            <span className={`text-sm ${f.is_directory ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{f.name}</span>
          </div>
        ))}
        {!loading && files.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-10">Folder is empty</div>
        )}
      </div>
    </div>
  );
}

function TerminalWidget() {
  const [history, setHistory] = useState<{command: string, output: string}[]>([]);
  const [input, setInput] = useState('');
  
  const handleExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setHistory(prev => [...prev, { command: input, output: 'Executing...' }]);
    const currentInput = input;
    setInput('');
    
    try {
      const res = await fetch('/api/sandbox/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: currentInput })
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1].output = data.output || 'No output';
          return newHistory;
        });
      } else {
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output = "Error executing command";
            return newHistory;
        })
      }
    } catch (err) {
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output = "Network error";
            return newHistory;
        })
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-emerald-400 font-mono text-sm p-4 overflow-hidden border-t border-border">
      <div className="flex-1 overflow-y-auto space-y-4">
        {history.map((item, i) => (
          <div key={i}>
            <div className="flex gap-2 text-gray-400"><span className="text-emerald-500">$</span> {item.command}</div>
            <div className="whitespace-pre-wrap mt-1">{item.output}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleExecute} className="mt-4 flex gap-2 border-t border-gray-800 pt-4">
        <span className="text-emerald-500">$</span>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-emerald-400"
          autoFocus 
        />
      </form>
    </div>
  )
}

function ResourceMonitor() {
  const [stats, setStats] = useState<string>("Loading stats...");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/sandbox/stats', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || "No stats available");
        }
      } catch (e) {
        setStats("Failed to load stats");
      }
    };
    fetchStats();
    const int = setInterval(fetchStats, 5000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="absolute bottom-4 right-4 bg-gray-900 text-emerald-400 font-mono text-[10px] p-3 rounded-lg shadow-xl border border-gray-700 whitespace-pre z-50 pointer-events-none opacity-80 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1 text-gray-300">
        <Activity className="w-3 h-3 text-emerald-400" />
        <span className="font-semibold uppercase tracking-wider">AIO Sandbox Monitor</span>
      </div>
      {stats}
    </div>
  );
}

export function ComputerPanel({ currentSimStep, onClose }: { currentSimStep?: number | null, onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState<string>('screen');
  const [tunnelPopupOpen, setTunnelPopupOpen] = useState(false);
  const [sshPopupOpen, setSshPopupOpen] = useState(false);
  const [portForwardPopupOpen, setPortForwardPopupOpen] = useState(false);
  const [includedApps, setIncludedApps] = useState<string[]>(['tiktok', 'instagram', 'facebook', 'youtube', 'linkedin', 'slack', 'drive', 'gmail', 'github']);
  const [sandboxUrl, setSandboxUrl] = useState<string>(getSandboxUrl());

  useEffect(() => {
    // We could fetch SANDBOX_URL from our api, but it's typically localhost:8080 when user runs docker locally.
    // Fetch from an endpoint if available
    fetch('/api/health') // just a dummy, assume localhost:8080 for client browser to access local docker
  }, []);

  const toggleApp = (app: string) => {
    setIncludedApps(prev => prev.includes(app) ? prev.filter(a => a !== app) : [...prev, app]);
  };

  const handleRestartServices = async () => {
    try {
      const res = await fetch('/api/sandbox/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'pm2 restart mcp-gateway && pm2 restart tunnel' })
      });
      if (res.ok) {
        alert('Services restarted successfully!');
      } else {
        alert('Failed to restart services');
      }
    } catch (e) {
      alert('Failed to restart services');
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/sandbox/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: { includedApps, env: 'dev' } })
      });
      if (res.ok) {
        alert('Session config saved to /workspace/aio_session.json!');
      } else {
        alert('Failed to save config');
      }
    } catch (e) {
      alert('Failed to save config');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden relative h-full">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center p-1 bg-gray-100 rounded-lg shrink-0 gap-1">
          <button 
            onClick={() => setActiveTab('screen')}
            title="AIO Sandbox VNC"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'screen' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            title="Filesystem"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'files' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Folder className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            title="Terminal"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'terminal' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('vscode')}
            title="VS Code Server"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'vscode' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <FileCode2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('jupyter')}
            title="Jupyter Notebook"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'jupyter' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Notebook className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('canvas')}
            title="Canvas"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'canvas' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('browser')}
            title="Browser"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'browser' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Globe className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            title="Live Preview"
            className={`flex items-center justify-center w-7 h-7 rounded-md transition-all
              ${activeTab === 'preview' ? 'bg-white shadow-sm text-accent' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <MonitorPlay className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-5 bg-border mx-2 shrink-0"></div>
        
        {/* Target Apps - Colorful Icons */}
        <div className="flex items-center gap-3">
          <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" width="18" height="18" onClick={() => toggleApp('tiktok')} title="TikTok" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('tiktok') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" width="18" height="18" onClick={() => toggleApp('instagram')} title="Instagram" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('instagram') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="18" height="18" onClick={() => toggleApp('facebook')} title="Facebook" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('facebook') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" width="18" height="18" onClick={() => toggleApp('youtube')} title="YouTube" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('youtube') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" width="18" height="18" onClick={() => toggleApp('linkedin')} title="LinkedIn" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('linkedin') ? 'grayscale opacity-40' : ''}`} />
        </div>
        
        <div className="w-px h-5 bg-border mx-2 shrink-0"></div>

        {/* MCPs */}
        <div className="flex items-center gap-3 shrink-0">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" width="16" height="16" onClick={() => toggleApp('slack')} title="Slack MCP" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('slack') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" width="16" height="16" onClick={() => toggleApp('drive')} title="Drive MCP" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('drive') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" width="16" height="16" onClick={() => toggleApp('gmail')} title="Gmail MCP" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('gmail') ? 'grayscale opacity-40' : ''}`} />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" width="16" height="16" onClick={() => toggleApp('github')} title="GitHub MCP" className={`cursor-pointer hover:-translate-y-0.5 transition-transform drop-shadow-sm ${!includedApps.includes('github') ? 'opacity-30 grayscale' : 'opacity-80'}`} />
        </div>

        <div className="w-px h-5 bg-border mx-2 shrink-0"></div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => { setTunnelPopupOpen(!tunnelPopupOpen); setSshPopupOpen(false); setPortForwardPopupOpen(false); }}
              title="Tunnel"
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all border ${tunnelPopupOpen ? 'bg-indigo-50 border-indigo-200 text-accent shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Radio className="w-4 h-4" />
            </button>
            {tunnelPopupOpen && (
              <div className="absolute top-10 left-0 w-[300px] bg-white rounded-xl border border-border shadow-xl p-4 z-50 animate-[popUp_0.2s_ease-out]">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Internet Tunnel</h4>
                <p className="text-xs text-gray-500 mb-3">Run this command to expose the agent's port to the internet.</p>
                <div className="p-2.5 bg-gray-900 rounded-lg font-mono text-[11px] text-emerald-400 break-all select-all border border-gray-800">
                  lt --port 3000 --subdomain frost-agent-402
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => { setSshPopupOpen(!sshPopupOpen); setTunnelPopupOpen(false); setPortForwardPopupOpen(false); }}
              title="SSH Connection"
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all border ${sshPopupOpen ? 'bg-indigo-50 border-indigo-200 text-accent shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Key className="w-4 h-4" />
            </button>
            {sshPopupOpen && (
              <div className="absolute top-10 left-0 w-[320px] bg-white rounded-xl border border-border shadow-xl p-4 z-50 animate-[popUp_0.2s_ease-out]">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">SSH Access</h4>
                <p className="text-xs text-gray-500 mb-3">Connect to the agent container securely via SSH.</p>
                <div className="p-2.5 bg-gray-900 rounded-lg font-mono text-[11px] text-blue-400 break-all select-all border border-gray-800 mb-3">
                  ssh root@frost-agent.dev -p 2222
                </div>
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">PRIVATE KEY</div>
                <div className="p-2 bg-gray-50 rounded-lg font-mono text-[9px] text-gray-500 h-[60px] overflow-y-auto border border-gray-200">
                  -----BEGIN OPENSSH PRIVATE KEY-----<br/>
                  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW<br/>
                  QyNTUxOQAAACD4w4h5Q+C9b8Hk5z5r9x7...<br/>
                  -----END OPENSSH PRIVATE KEY-----
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => { setPortForwardPopupOpen(!portForwardPopupOpen); setSshPopupOpen(false); setTunnelPopupOpen(false); }}
              title="Port Forwarding"
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all border ${portForwardPopupOpen ? 'bg-indigo-50 border-indigo-200 text-accent shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            >
              <Network className="w-4 h-4" />
            </button>
            {portForwardPopupOpen && (
              <div className="absolute top-10 left-0 w-[240px] bg-white rounded-xl border border-border shadow-xl p-3 z-50 animate-[popUp_0.2s_ease-out]">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Forwarded Ports</h4>
                <div className="space-y-2">
                  <a href={`${sandboxUrl}/proxy/3000`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-mono border border-transparent hover:border-gray-200">
                    <span>3000</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </a>
                  <a href={`${sandboxUrl}/proxy/5173`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-mono border border-transparent hover:border-gray-200">
                    <span>5173</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </a>
                  <a href={`${sandboxUrl}/proxy/8080`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 font-mono border border-transparent hover:border-gray-200">
                    <span>8080</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleRestartServices}
            title="Restart Services"
            className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handleSaveConfig}
            title="Save Session Config"
            className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1"></div>
        
        <div className="flex items-center gap-2 mr-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100" title="Frost Agent Connected">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-0 overflow-hidden flex flex-col bg-gray-900 border-t border-border">
        {activeTab === 'screen' && (
          <iframe 
            src={`${sandboxUrl}/vnc/index.html?autoconnect=true&resize=scale`} 
            className="w-full h-full border-0"
            title="AIO Sandbox VNC"
          />
        )}

        {activeTab === 'files' && (
          <FileExplorer sandboxUrl={sandboxUrl} />
        )}

        {activeTab === 'terminal' && (
          <TerminalWidget />
        )}
        {activeTab === 'vscode' && (
          <iframe 
            src={`${sandboxUrl}/code-server/`} 
            className="w-full h-full border-0"
            title="VS Code Server"
          />
        )}

        {activeTab === 'jupyter' && (
          <iframe 
            src={`${sandboxUrl}/jupyter/`} 
            className="w-full h-full border-0 bg-white"
            title="Jupyter Notebook"
          />
        )}

        {activeTab === 'canvas' && (
          <div className="flex-1 bg-white rounded-xl border border-border overflow-hidden relative shadow-[inset_0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fafafa]">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,#3b82f6_360deg)] animate-spin" style={{ animationDuration: '2s' }}></div>
                 <div className="absolute inset-[2px] bg-white rounded-xl flex items-center justify-center z-10">
                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors" />
                 </div>
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">Rendering Visual Layer...</div>
              <div className="text-[12px] text-gray-500 max-w-[280px] text-center leading-relaxed">
                The agent is currently generating graphical assets and painting the canvas output.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'browser' && (
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-10 border-b border-gray-200 flex items-center px-3 gap-2 bg-gray-50 text-gray-500 shrink-0">
                <ArrowLeft className="w-4 h-4 cursor-not-allowed opacity-50" />
                <ArrowRight className="w-4 h-4 cursor-not-allowed opacity-50" />
                <RotateCw className="w-4 h-4 cursor-pointer hover:text-gray-900" />
                <div className="flex-1 mx-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs font-mono flex items-center gap-2 text-gray-900">
                    <Lock className="w-3 h-3 text-green-600" />
                    <span>https://react.dev/reference/react</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white flex flex-col items-center justify-center">
                <div className="animate-pulse flex flex-col items-center w-full max-w-lg">
                    <div className="h-8 bg-gray-100 rounded w-1/3 mb-6"></div>
                    <div className="h-4 bg-gray-100 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6 mb-8"></div>
                    
                    <div className="w-full space-y-4">
                        <div className="h-20 bg-gray-50 border border-gray-100 rounded-lg w-full"></div>
                        <div className="h-20 bg-gray-50 border border-gray-100 rounded-lg w-full"></div>
                        <div className="h-20 bg-gray-50 border border-gray-100 rounded-lg w-full"></div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center justify-between px-3 text-xs text-gray-500 shrink-0">
                <span>localhost:3000</span>
                <div className="flex gap-2">
                    <Smartphone className="w-3.5 h-3.5 hover:text-gray-900 cursor-pointer" />
                    <Monitor className="w-3.5 h-3.5 text-gray-900 cursor-pointer" />
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50/50 p-8">
                <div className="w-full h-full bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-gray-200 p-6 flex flex-col relative overflow-hidden">
                    {currentSimStep === 4 && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center animate-[fadeOut_2s_ease-out_forwards]">
                          <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-medium text-gray-700">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent" /> Compiling preview...
                          </div>
                      </div>
                    )}
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Analytics Overview</h2>
                    <div className="flex gap-4 mb-6">
                        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Total Users</div>
                            <div className="text-2xl font-semibold">12,404</div>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <div className="text-xs text-gray-500 mb-1">Revenue</div>
                            <div className="text-2xl font-semibold">$4,302</div>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-end p-4 gap-2">
                        <div className="w-1/4 bg-blue-500 rounded-t-sm" style={{height: '40%'}}></div>
                        <div className="w-1/4 bg-blue-400 rounded-t-sm" style={{height: '65%'}}></div>
                        <div className="w-1/4 bg-blue-600 rounded-t-sm" style={{height: '90%'}}></div>
                        <div className="w-1/4 bg-blue-300 rounded-t-sm" style={{height: '30%'}}></div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {['tiktok', 'instagram', 'facebook', 'youtube', 'linkedin', 'slack', 'drive', 'gmail', 'github'].includes(activeTab) && (
          <div className="flex-1 bg-white rounded-xl border border-border flex items-center justify-center shadow-sm overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"></div>
            
            <div className="text-center z-10 w-full max-w-sm px-6">
              <div className="w-20 h-20 mx-auto bg-gray-50 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center mb-5 relative">
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                 {activeTab === 'tiktok' && <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" width="40" height="40" />}
                 {activeTab === 'instagram' && <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" width="40" height="40" />}
                 {activeTab === 'facebook' && <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" width="40" height="40" />}
                 {activeTab === 'youtube' && <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" width="40" height="40" />}
                 {activeTab === 'linkedin' && <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" width="40" height="40" />}
                 {activeTab === 'slack' && <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" width="40" height="40" />}
                 {activeTab === 'drive' && <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" width="40" height="40" />}
                 {activeTab === 'gmail' && <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" width="40" height="40" />}
                 {activeTab === 'github' && <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" width="40" height="40" className="opacity-80"/>}
              </div>
              <h2 className="text-2xl font-medium text-gray-900 capitalize mb-2">{activeTab} Integration</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                The agent has established an active context session with {activeTab}. It can read, process, and automatically execute actions directly within this platform.
              </p>
              
              <div className="mt-8 flex flex-col gap-2">
                 <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col text-left">
                       <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Status</span>
                       <span className="text-[13px] text-gray-500">Connected & Authorized</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                 </div>
                 <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col text-left">
                       <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Permissions</span>
                       <span className="text-[13px] text-gray-500">Full Access (Read / Write)</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ResourceMonitor />
    </div>
  );
}
