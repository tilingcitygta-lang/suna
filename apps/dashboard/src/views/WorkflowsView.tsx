import React, { useState } from 'react';
import { 
  GitBranch, Plus, Play, Share2
} from 'lucide-react';
import { FI, Btn, Tag, Card, Toggle } from '../components/SharedUI';
import { CreateWorkflowModal } from './CreateWorkflowModal';

export function WorkflowsView() {
  const [on1, setOn1] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="pheader">
        <FI variant="blu"><GitBranch className="w-[15px] h-[15px]" /></FI>
        <div>
           <div className="text-[14px] font-display font-semibold text-gray-900">Workflows</div>
           <div className="text-[11px] text-gray-400">Automated multi-step pipelines · 3 active</div>
        </div>
        <div className="flex-1"></div>
        <div className="flex border border-border rounded-lg overflow-hidden shrink-0">
           <div className="px-2.5 py-1 text-[11px] bg-indigo-50 text-accent cursor-pointer">All</div>
           <div className="px-2.5 py-1 text-[11px] text-gray-400 bg-white cursor-pointer hover:bg-gray-50">Active</div>
        </div>
        <Btn variant="pur" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> New workflow
        </Btn>
      </div>
      <div className="pscroll p-3.5 bg-main-bg">
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <Card className="flex flex-col min-h-0 relative">
             <div className="flex items-center gap-2 mb-2.5">
                <FI variant="pnk"><Share2 className="w-3.5 h-3.5" /></FI>
                <div className="flex-1 min-w-0">
                   <div className="text-xs font-semibold text-gray-900 truncate">Daily Social Report</div>
                   <div className="text-[10px] text-gray-400 truncate">Cron · every day at 9:00 AM</div>
                </div>
                <Toggle on={on1} onClick={() => setOn1(!on1)} />
             </div>
             <div className="flex gap-1 flex-wrap mb-3">
                <Tag variant="tp">0 9 * * *</Tag>
                {on1 && <Tag variant="tg">Active</Tag>}
             </div>
             <div className="flex items-center justify-between mt-auto">
                <div className="text-[10px] text-gray-400">Last run · 6h ago</div>
                <Btn size="sm"><Play className="w-3 h-3" /> Run</Btn>
             </div>
          </Card>
          <Card className="border-dashed flex flex-col items-center justify-center gap-2 min-h-[120px] opacity-65 cursor-pointer hover:opacity-100 hover:bg-gray-50 transition-all" onClick={() => setIsModalOpen(true)}>
             <FI variant="gray" className="bg-transparent text-gray-500 shadow-none border border-gray-200"><Plus className="w-4 h-4" /></FI>
             <div className="text-xs font-medium text-gray-500">Create new workflow</div>
          </Card>
        </div>
      </div>
      {isModalOpen && <CreateWorkflowModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
