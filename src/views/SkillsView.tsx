import React, { useState } from 'react';
import { 
  Puzzle, Plus, Search, Code, FileText, Database, GitBranch, Image as ImageIcon, Share2, BarChart2, Star, Download, Settings, Trash2, Edit3, X, ChevronRight, Activity, Terminal
} from 'lucide-react';
import { FI, Btn, Tag, Card } from '../components/SharedUI';
import { CreateSkillModal } from './CreateSkillModal';

function ToolPlayground() {
  const [toolCall, setToolCall] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const executeTool = async () => {
    if(!toolCall.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/sandbox/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: toolCall })
      });
      const data = await res.json();
      setResult(data.output || data.error || 'Done');
    } catch (e: any) {
      setResult(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Tool Playground</h2>
        <p className="text-sm text-gray-500">Test specific tool calls against your local sandbox environment.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Command or Script</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={toolCall}
              onChange={(e) => setToolCall(e.target.value)}
              placeholder="e.g. ls -la /workspace or python script.py"
              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent font-mono"
            />
            <Btn variant="pur" onClick={executeTool}>
              {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></div> : <Terminal className="w-4 h-4 mr-1" />}
              Run Tool
            </Btn>
          </div>
        </div>
        <div className="flex-1 bg-[#1E1E1E] p-4 overflow-y-auto">
          {result ? (
            <pre className="text-gray-300 font-mono text-[13px] whitespace-pre-wrap leading-relaxed">{result}</pre>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm font-mono">
              Sandbox output will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkillsView() {
  const [activeTab, setActiveTab] = useState<'library' | 'playground'>('library');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: 'All', icon: null },
    { id: 'Code', icon: Code },
    { id: 'Research', icon: Search },
    { id: 'Content', icon: FileText },
    { id: 'Data', icon: Database },
    { id: 'Automation', icon: GitBranch },
    { id: 'Image', icon: ImageIcon },
  ];

  const mySkills = [
    { id: 1, name: 'PR Reviewer', icon: 'github', desc: 'Reviews PRs with code quality analysis', installed: true, used: 142, category: 'Code', rating: 4.8 },
    { id: 2, name: 'Content Writer', icon: Share2, desc: 'Multi-platform social generation', installed: true, used: 89, category: 'Content', rating: 4.5, color: 'pnk' },
    { id: 3, name: 'Data Analyst', icon: BarChart2, desc: 'Analyze CSV/JSON data with pandas', installed: true, used: 56, category: 'Data', rating: 4.7, color: 'amb' },
    { id: 4, name: 'SEO Optimizer', icon: Search, desc: 'Extracts keywords and semantic score', installed: true, used: 12, category: 'Content', rating: 4.3, color: 'blu' },
    { id: 5, name: 'Bash Script Gen', icon: Terminal, desc: 'Generates robust shell scripts for DevOps', installed: true, used: 104, category: 'Automation', rating: 4.9, color: 'grn' },
    { id: 6, name: 'Brand Asset Maker', icon: ImageIcon, desc: 'Generates SVG and PNG assets dynamically', installed: true, used: 31, category: 'Image', rating: 4.6, color: 'pur' },
  ];

  const discoverSkills = [
    { id: 'd1', name: 'UI Component Gen', icon: Code, desc: 'Generates React/Tailwind components from prompt', installed: false, downloads: '14k', category: 'Code', rating: 4.9, color: 'blu' },
    { id: 'd2', name: 'Database Migrator', icon: Database, desc: 'Writes SQL migrations safely', installed: false, downloads: '8.2k', category: 'Data', rating: 4.6, color: 'org' },
    { id: 'd3', name: 'Meeting Summarizer', icon: FileText, desc: 'Bullet point takeaways and action items', installed: false, downloads: '22k', category: 'Content', rating: 4.8, color: 'pnk' },
    { id: 'd4', name: 'Notion Sync', icon: Share2, desc: 'Syncs data with Notion blocks API', installed: false, downloads: '5.1k', category: 'Automation', rating: 4.2, color: 'amb' },
    { id: 'd5', name: 'Research Paper Analyst', icon: Search, desc: 'Parses academic PDFs for key findings', installed: false, downloads: '11k', category: 'Research', rating: 4.7, color: 'pur' },
    { id: 'd6', name: 'Log Analyzer', icon: Activity, desc: 'Finds anomalies in server logs', installed: false, downloads: '3.4k', category: 'Automation', rating: 4.5, color: 'grn' },
  ];

  const allSkills = [...mySkills, ...discoverSkills];
  
  const filteredMySkills = mySkills.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscoverSkills = discoverSkills.filter(s => 
    (activeCategory === 'All' || s.category === activeCategory) &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderIcon = (skill: any) => {
    if (skill.icon === 'github') {
      return (
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <img src="https://logo.clearbit.com/github.com" width="32" height="32" className="rounded-lg bg-white shadow-sm" alt="GitHub" />
        </div>
      );
    }
    const IconComponent = skill.icon;
    return <FI variant={skill.color || 'pur'}><IconComponent className="w-4 h-4" /></FI>;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F9FAFB]">
      <div className="flex items-center px-6 bg-white border-b border-gray-200 shrink-0 shadow-sm z-10 h-[72px]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm border border-purple-200">
            <Puzzle className="w-5 h-5" />
          </div>
          <div>
             <div className="text-base font-semibold text-gray-900 tracking-tight">Skills Workspace</div>
             <div className="text-xs text-gray-500 font-medium">Extend capabilities & test tools</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6 ml-8 h-full">
          <button 
            onClick={() => setActiveTab('library')}
            className={`h-full px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'library' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Library
          </button>
          <button 
            onClick={() => setActiveTab('playground')}
            className={`h-full px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'playground' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Tool Playground
          </button>
        </div>
        
        <div className="flex-1"></div>
        {activeTab === 'library' && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search skills…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all w-[240px]" 
              />
            </div>
            <Btn variant="pur" className="!px-4 !py-2 !text-sm whitespace-nowrap !shadow-sm" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 ml-[-2px]" /> 
              Create Skill
            </Btn>
          </div>
        )}
      </div>
      
      {activeTab === 'playground' ? (
        <ToolPlayground />
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-56 bg-white border-r border-gray-200 shrink-0 overflow-y-auto px-4 py-6">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Categories</h3>
          <div className="space-y-1">
            {categories.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveCategory(c.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all font-medium ${activeCategory === c.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {c.icon && <c.icon className="w-4 h-4" />}
                {c.id}
              </button>
            ))}
          </div>
          
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-8 mb-3 px-2">Filters</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium">
              <Star className="w-4 h-4" /> Top Rated
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium">
              <Download className="w-4 h-4" /> Most Used
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          
          {filteredMySkills.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Installed Skills
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{filteredMySkills.length}</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMySkills.map(skill => (
                  <div 
                    key={skill.id} 
                    onClick={() => setSelectedSkill(skill)}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group h-full relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-4">
                      {renderIcon(skill)}
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 transition-all" title="Settings">
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{skill.name}</h3>
                    <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">{skill.desc}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium"><Activity className="w-3.5 h-3.5 text-emerald-500" /> {skill.used} runs</span>
                        <span className="flex items-center gap-1 text-gray-400"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {skill.rating}</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{skill.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredDiscoverSkills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Discover
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">New</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDiscoverSkills.map(skill => (
                  <div 
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-accent hover:shadow-md transition-all cursor-pointer flex flex-col group h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      {renderIcon(skill)}
                      <button className="px-3 py-1 bg-white border border-gray-200 hover:border-accent hover:text-accent rounded-lg text-xs font-semibold text-gray-700 shadow-sm transition-all flex items-center gap-1">
                        <Download className="w-3 h-3" /> Install
                      </button>
                    </div>
                    
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{skill.name}</h3>
                    <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 flex-1 leading-relaxed">{skill.desc}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 font-medium"><Download className="w-3.5 h-3.5 text-blue-500" /> {skill.downloads}</span>
                        <span className="flex items-center gap-1 text-gray-400"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {skill.rating}</span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{skill.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(filteredMySkills.length === 0 && filteredDiscoverSkills.length === 0) && (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
               <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                 <Search className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills found</h3>
               <p className="text-gray-500 max-w-[300px] mb-6">We couldn't find any skills matching your search criteria in this category.</p>
               <button 
                 onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                 className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
               >
                 Clear Filters
               </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Skill Details Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] animate-[fadeIn_0.2s_ease-out]">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedSkill(null)}></div>
          <div className="bg-white rounded-2xl w-[600px] max-h-[85vh] shadow-[0_24px_50px_rgba(0,0,0,0.2)] relative z-10 flex flex-col overflow-hidden animate-[popUp_0.2s_ease-out]">
            
            <button 
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 hover:bg-gray-200 text-gray-500 transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8 pb-6 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
              <div className="flex items-start gap-5">
                <div className="scale-125 origin-top-left -ml-1">
                  {renderIcon(selectedSkill)}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex gap-2 items-center mb-1.5">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedSkill.name}</h2>
                    {selectedSkill.installed && (
                      <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Installed
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-4 pr-6">{selectedSkill.desc}</p>
                  
                  <div className="flex items-center gap-4 text-[13px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {selectedSkill.rating} Rating</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center gap-1.5">
                      {selectedSkill.installed ? (
                        <><Activity className="w-4 h-4 text-emerald-500" /> {selectedSkill.used} Executions</>
                      ) : (
                        <><Download className="w-4 h-4 text-blue-500" /> {selectedSkill.downloads} Downloads</>
                      )}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-indigo-600">{selectedSkill.category}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-900 mb-3">About this Skill</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
                This skill provides specialized context and logic flows for the agent. It automatically connects to required dependencies and applies best practices specific to its domain. 
                When activated, the agent will adapt its behavior, tone, and execution strategies.
              </p>

              <h3 className="text-sm font-bold text-gray-900 mb-3">Capabilities</h3>
              <ul className="space-y-2 mb-8">
                <li className="flex items-start gap-2.5 text-[13px] text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                  Directly interfaces with related APIs and data sources
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                  Applies customized reasoning models
                </li>
                <li className="flex items-start gap-2.5 text-[13px] text-gray-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  </div>
                  Provides deterministic outputs for reliable execution
                </li>
              </ul>
              
              {selectedSkill.installed && (
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Settings className="w-4 h-4 text-gray-500"/> Configuration</h4>
                       <span className="text-[10px] text-gray-400 font-medium">Read-only view</span>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex items-center justify-between text-[12px]">
                          <span className="text-gray-500">Auto-trigger words:</span>
                          <span className="font-mono bg-white px-2 py-0.5 border border-gray-200 rounded text-gray-700">['review', 'PR', 'analyze']</span>
                       </div>
                       <div className="flex items-center justify-between text-[12px]">
                          <span className="text-gray-500">Timeout limit:</span>
                          <span className="font-mono bg-white px-2 py-0.5 border border-gray-200 rounded text-gray-700">120s</span>
                       </div>
                    </div>
                 </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
              {selectedSkill.installed ? (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-red-50 text-red-600 hover:border-red-200 transition-colors shadow-sm">
                    <Trash2 className="w-4 h-4" /> Uninstall
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors shadow-sm">
                      <Edit3 className="w-4 h-4" /> Edit Logic
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-black rounded-lg text-sm font-medium hover:bg-gray-800 text-white transition-colors shadow-sm">
                      <Activity className="w-4 h-4" /> Run Skill
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700 transition-colors shadow-sm">
                    View Source
                  </button>
                  <button className="flex items-center gap-2 px-8 py-2 bg-accent rounded-lg text-sm font-medium hover:bg-accent/90 text-white transition-colors shadow-sm">
                    <Download className="w-4 h-4" /> Install Skill
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && <CreateSkillModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

