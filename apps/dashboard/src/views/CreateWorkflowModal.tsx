import React, { useState } from "react";
import { X, GitBranch, Save } from "lucide-react";
import { Btn } from "../components/SharedUI";
import { createPortal } from "react-dom";

export function CreateWorkflowModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [trigger, setTrigger] = useState("Manual");

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-[popUp_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-accent flex items-center justify-center shadow-sm">
               <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900">
                Create New Workflow
              </h2>
              <div className="text-xs text-gray-500">
                Automate a multi-step pipeline
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

        <div className="p-6 flex flex-col gap-4">
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Workflow Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Daily Social Report"
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" 
                />
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <input 
                    type="text" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="e.g. Generates a report every morning..."
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" 
                />
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Trigger</label>
                <select 
                   value={trigger}
                   onChange={(e) => setTrigger(e.target.value)}
                   className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all leading-tight appearance-none"
                >
                    <option>Manual</option>
                    <option>Schedule (Cron)</option>
                    <option>Webhook</option>
                    <option>File Upload</option>
                </select>
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Initial Steps</label>
                <textarea 
                    placeholder="Define the initial steps or prompt directives..."
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm h-24 resize-none focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" 
                />
            </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
             <Btn onClick={onClose} className="px-5 py-2">
                Cancel
             </Btn>
             <Btn variant="pur" onClick={onClose} className="px-5 py-2 shadow-sm font-medium">
                <Save className="w-3.5 h-3.5 mr-1" /> Create Workflow
             </Btn>
        </div>
      </div>
    </div>,
    document.body
  );
}
