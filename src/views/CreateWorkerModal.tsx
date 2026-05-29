import React, { useState } from "react";
import { X, Bot, Save } from "lucide-react";
import { Btn } from "../components/SharedUI";
import { createPortal } from "react-dom";

export function CreateWorkerModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-[popUp_0.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm">
               <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-display font-semibold text-gray-900">
                New Worker
              </h2>
              <div className="text-xs text-gray-500">
                Deploy an autonomous background worker
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
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Worker Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Schedule Social Post"
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
                />
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <input 
                    type="text" 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="e.g. Posts social content every Monday morning"
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
                />
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Capabilities</label>
                <select 
                   className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none"
                   multiple
                >
                    <option>GitHub API Access</option>
                    <option>Slack Incoming Webhook</option>
                    <option>Database Access (Read/Write)</option>
                    <option>Web Search & Puppeteer</option>
                </select>
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Trigger</label>
                <select 
                   className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all appearance-none"
                >
                    <option>Manual (API Call or Button Action)</option>
                    <option>Scheduled (Cron Job)</option>
                    <option>Event-based (Webhook)</option>
                </select>
            </div>
            <div>
                <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">System Instructions</label>
                <textarea 
                    placeholder="Detailed instructions for the worker..."
                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-sm h-24 resize-none focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all" 
                />
            </div>
        </div>

        <div className="px-6 py-4 border-t border-border bg-gray-50 flex justify-end gap-3">
             <Btn onClick={onClose} className="px-5 py-2">
                Cancel
             </Btn>
             <Btn variant="pur" onClick={onClose} className="px-5 py-2 shadow-sm font-medium !bg-teal-600 hover:!bg-teal-700 !border-teal-600">
                <Save className="w-3.5 h-3.5 mr-1" /> Deploy Worker
             </Btn>
        </div>
      </div>
    </div>,
    document.body
  );
}
