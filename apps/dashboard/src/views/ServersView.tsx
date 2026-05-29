import React, { useState } from 'react';
import { 
  Server, Search, Plus, Plug, Folder, Brain, GitPullRequest, Code, ZoomIn, SearchCode, Database, Check
} from 'lucide-react';
import { FI, Btn, Tag, Dot, Card } from '../components/SharedUI';
import { AddServerModal } from '../components/AddServerModal';
import { ConnectorsModal } from './Overlays';

export function ServersView() {
  const [isAddServerOpen, setIsAddServerOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="pheader">
        <FI variant="amb"><Server className="w-[15px] h-[15px]" /></FI>
        <div>
           <div className="text-[14px] font-display font-semibold text-gray-900">MCP Servers</div>
           <div className="text-[11px] text-gray-400">7 connected · Model Context Protocol</div>
        </div>
        <div className="flex-1"></div>
        <input type="text" placeholder="Search servers…" className="input-text w-[150px]" />
        <Btn onClick={() => setIsAddServerOpen(true)}><Plus className="w-3.5 h-3.5" /> Add server</Btn>
        <Btn variant="pur" onClick={() => setIsRegistryOpen(true)}><Plug className="w-3.5 h-3.5" /> Browse registry</Btn>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[224px] border-r border-border bg-sidebar flex flex-col overflow-y-auto">
          <div className="sb-sec">Connected · 7</div>
          <div className="row on ml-1.5 mr-1.5">
            <Dot color="sg" /><FI size="sm" variant="gray"><Folder className="w-3 h-3" /></FI>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-accent">filesystem</div>
               <div className="text-[10px] text-gray-400">23 tools · stdio</div>
            </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
            <Dot color="sg" />
            <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
              <img src="https://logo.clearbit.com/brave.com" width="18" height="18" className="rounded bg-white" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900">brave-search</div>
               <div className="text-[10px] text-gray-400">3 tools · stdio</div>
            </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
            <Dot color="sg" />
            <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
              <img src="https://logo.clearbit.com/puppeteer.com" width="18" height="18" className="rounded bg-white" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900">puppeteer</div>
               <div className="text-[10px] text-gray-400">12 tools · http</div>
            </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
            <Dot color="sg" />
            <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
              <img src="https://logo.clearbit.com/github.com" width="18" height="18" className="rounded bg-white" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900">github</div>
               <div className="text-[10px] text-gray-400">18 tools · stdio</div>
            </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
            <Dot color="sg" /><FI size="sm" variant="pur"><Brain className="w-3 h-3" /></FI>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900">sequential-thinking</div>
               <div className="text-[10px] text-gray-400">1 tool</div>
            </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
            <Dot color="sg" />
            <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
              <img src="https://logo.clearbit.com/postgresql.org" width="18" height="18" className="rounded bg-white" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900">postgres</div>
               <div className="text-[10px] text-gray-400">8 tools · stdio</div>
            </div>
          </div>
          <div className="row ml-1.5 mr-1.5">
            <Dot color="sy" />
            <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" width="18" height="18" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="text-xs font-medium text-gray-900">gmail</div>
               <div className="text-[10px] text-gray-400">5 tools · auth exp.</div>
            </div>
          </div>
          
          <div className="dvd mx-2.5"></div>
          <div className="sb-sec">Available · Add</div>
          <div className="row ml-1.5 mr-1.5 opacity-60">
             <Dot color="sd" />
             <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0"><img src="https://logo.clearbit.com/slack.com" width="16" height="16" className="rounded bg-white" /></div>
             <div className="flex-1"><div className="text-[11px] text-gray-900">slack</div></div>
             <span className="text-[10px] text-accent">+ Add</span>
          </div>
          <div className="row ml-1.5 mr-1.5 opacity-60">
             <Dot color="sd" />
             <div className="w-[22px] h-[22px] flex items-center justify-center shrink-0"><img src="https://logo.clearbit.com/notion.so" width="16" height="16" className="rounded bg-white" /></div>
             <div className="flex-1"><div className="text-[11px] text-gray-900">notion</div></div>
             <span className="text-[10px] text-accent">+ Add</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-main-bg">
          <div className="flex items-center gap-2.5 mb-3.5">
            <FI variant="gray" className="w-[36px] h-[36px] rounded-[10px] text-[18px]">
               <Folder className="w-5 h-5" />
            </FI>
            <div>
               <div className="text-[15px] font-semibold text-gray-900">filesystem</div>
               <div className="text-[10px] text-gray-400">npx @modelcontextprotocol/server-filesystem /workspace</div>
            </div>
            <Tag variant="tg" className="ml-auto">Connected</Tag>
            <Btn size="sm">Restart</Btn>
            <Btn size="sm" className="text-red-700">Disconnect</Btn>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-3.5">
             <Card className="flex items-center gap-2">
               <FI size="sm" variant="pur"><SearchCode className="w-3 h-3" /></FI>
               <div>
                  <div className="text-[9px] text-gray-400">Tools</div>
                  <div className="text-base font-semibold text-gray-900">23</div>
               </div>
             </Card>
             <Card className="flex items-center gap-2">
               <FI size="sm" variant="teal"><SearchCode className="w-3 h-3" /></FI>
               <div>
                  <div className="text-[9px] text-gray-400">Calls today</div>
                  <div className="text-base font-semibold text-gray-900">847</div>
               </div>
             </Card>
             <Card className="flex items-center gap-2">
               <FI size="sm" variant="grn"><Check className="w-3 h-3" /></FI>
               <div>
                  <div className="text-[9px] text-gray-400">Success</div>
                  <div className="text-base font-semibold text-gray-900">99.1%</div>
               </div>
             </Card>
             <Card className="flex items-center gap-2">
               <FI size="sm" variant="amb"><SearchCode className="w-3 h-3" /></FI>
               <div>
                  <div className="text-[9px] text-gray-400">Avg latency</div>
                  <div className="text-base font-semibold text-gray-900">12ms</div>
               </div>
             </Card>
          </div>
          
          <Card className="mb-3">
             <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-gray-900">Available Tools</span>
                <Tag variant="tp">23 tools</Tag>
             </div>
             <div className="grid grid-cols-2 gap-1">
                {[
                  { name: 'read_file', desc: 'Read file contents' },
                  { name: 'write_file', desc: 'Write or create file' },
                  { name: 'list_directory', desc: 'List dir contents' },
                  { name: 'search_files', desc: 'Regex search' },
                  { name: 'edit_file', desc: 'Targeted edits' },
                  { name: 'get_file_info', desc: 'File metadata' }
                ].map(tool => (
                  <div key={tool.name} className="flex items-center gap-2 px-2 py-1.5 bg-main-bg rounded-[7px]">
                    <FI size="xs" variant="gray"><Code className="w-2.5 h-2.5" /></FI>
                    <div>
                       <div className="text-[11px] font-medium text-gray-900">{tool.name}</div>
                       <div className="text-[9px] text-gray-400">{tool.desc}</div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-2 text-center">
                <span className="text-[10px] text-accent cursor-pointer">Show all 23 tools &rarr;</span>
             </div>
          </Card>
        </div>
      </div>
      {isAddServerOpen && <AddServerModal onClose={() => setIsAddServerOpen(false)} />}
      {isRegistryOpen && <ConnectorsModal onClose={() => setIsRegistryOpen(false)} />}
    </div>
  );
}
