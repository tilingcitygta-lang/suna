import React from 'react';
import { 
  Database, Upload, Folder, Filter, Settings, User, Key, CreditCard, Palette, BarChart2
} from 'lucide-react';
import { FI, Btn, Tag, Card, Toggle } from '../components/SharedUI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const usageData = [
  { name: 'Mon', tokens: 4000, cost: 0.12 },
  { name: 'Tue', tokens: 3000, cost: 0.09 },
  { name: 'Wed', tokens: 2000, cost: 0.06 },
  { name: 'Thu', tokens: 2780, cost: 0.08 },
  { name: 'Fri', tokens: 1890, cost: 0.05 },
  { name: 'Sat', tokens: 2390, cost: 0.07 },
  { name: 'Sun', tokens: 3490, cost: 0.10 },
];

export function KnowledgeView() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="pheader">
        <FI variant="amb"><Database className="w-[15px] h-[15px]" /></FI>
        <div>
           <div className="text-[14px] font-display font-semibold text-gray-900">Knowledge Base</div>
           <div className="text-[11px] text-gray-400">Vector database for RAG context &middot; 124 files embedded</div>
        </div>
        <div className="flex-1"></div>
        <Btn variant="pur"><Upload className="w-3.5 h-3.5" /> Upload Documents</Btn>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[224px] border-r border-border bg-sidebar flex flex-col overflow-y-auto p-2">
          <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mx-2 mt-2 mb-1">Collections</div>
          <div className="row on rounded-[9px] mb-0.5">
            <FI size="sm" variant="pur"><Folder className="w-3 h-3" /></FI>
            <span className="text-[11px] font-medium text-accent flex-1">Default</span>
            <span className="text-[9px] text-accent">84</span>
          </div>
          <div className="row mb-0.5">
            <FI size="sm" variant="gray"><Folder className="w-3 h-3" /></FI>
            <span className="text-[11px] font-medium text-gray-900 flex-1">Codebase Docs</span>
            <span className="text-[9px] text-gray-400">21</span>
          </div>
          <div className="row mb-0.5">
            <FI size="sm" variant="gray"><Folder className="w-3 h-3" /></FI>
            <span className="text-[11px] font-medium text-gray-900 flex-1">Marketing Assets</span>
            <span className="text-[9px] text-gray-400">7</span>
          </div>
          <div className="px-2 py-1.5"><span className="text-[10px] text-accent cursor-pointer">+ New Collection</span></div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-main-bg">
          <div className="flex gap-2">
             <input type="text" placeholder="Search across Default collection…" className="input-text flex-1" />
             <Btn><Filter className="w-3.5 h-3.5" /> Filter</Btn>
          </div>
          <Card className="p-0 overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-main-bg">
                  <th className="px-3.5 py-2.5 text-[10px] text-gray-400 font-medium">Document Name</th>
                  <th className="px-3.5 py-2.5 text-[10px] text-gray-400 font-medium">Type</th>
                  <th className="px-3.5 py-2.5 text-[10px] text-gray-400 font-medium">Size</th>
                  <th className="px-3.5 py-2.5 text-[10px] text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-3.5 py-2.5 flex items-center gap-2">
                    <FI size="xs" variant="cor"><FileText className="w-2.5 h-2.5" /></FI>
                    <span className="text-[11px] font-medium text-gray-900">Q3_Financial_Report.pdf</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-[11px] text-gray-500">PDF</td>
                  <td className="px-3.5 py-2.5 text-[11px] text-gray-500">2.4 MB</td>
                  <td className="px-3.5 py-2.5"><Tag variant="tg">Embedded</Tag></td>
                </tr>
                <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-3.5 py-2.5 flex items-center gap-2">
                    <FI size="xs" variant="blu"><FileText className="w-2.5 h-2.5" /></FI>
                    <span className="text-[11px] font-medium text-gray-900">API_Documentation_v2.md</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-[11px] text-gray-500">Markdown</td>
                  <td className="px-3.5 py-2.5 text-[11px] text-gray-500">45 KB</td>
                  <td className="px-3.5 py-2.5"><Tag variant="tg">Embedded</Tag></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function SettingsView() {
  const [notifyState, setNotifyState] = React.useState(true);
  const [darkModeState, setDarkModeState] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('account');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="pheader">
        <FI variant="gray"><Settings className="w-[15px] h-[15px]" /></FI>
        <div>
           <div className="text-[14px] font-display font-semibold text-gray-900">Settings</div>
           <div className="text-[11px] text-gray-400">Manage your account and workspace preferences</div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[224px] border-r border-border bg-sidebar flex flex-col overflow-y-auto p-2">
          <div className={`row mb-0.5 cursor-pointer ${activeTab === 'account' ? 'on' : ''}`} onClick={() => setActiveTab('account')}>
            <FI size="sm" variant={activeTab === 'account' ? 'pur' : 'gray'}><User className="w-3 h-3" /></FI>
            <span className={`text-[11px] font-medium flex-1 ${activeTab === 'account' ? 'text-accent' : 'text-gray-900'}`}>My Account</span>
          </div>
          <div className={`row mb-0.5 cursor-pointer ${activeTab === 'usage' ? 'on' : ''}`} onClick={() => setActiveTab('usage')}>
            <FI size="sm" variant={activeTab === 'usage' ? 'pur' : 'gray'}><BarChart2 className="w-3 h-3" /></FI>
            <span className={`text-[11px] font-medium flex-1 ${activeTab === 'usage' ? 'text-accent' : 'text-gray-900'}`}>Usage</span>
          </div>
          <div className="row mb-0.5 opacity-50 cursor-not-allowed">
            <FI size="sm" variant="gray"><Key className="w-3 h-3" /></FI>
            <span className="text-[11px] font-medium text-gray-900 flex-1">API Keys</span>
          </div>
          <div className="row mb-0.5 opacity-50 cursor-not-allowed">
            <FI size="sm" variant="gray"><CreditCard className="w-3 h-3" /></FI>
            <span className="text-[11px] font-medium text-gray-900 flex-1">Billing & Plans</span>
          </div>
          <div className="row mb-0.5 opacity-50 cursor-not-allowed">
            <FI size="sm" variant="gray"><Palette className="w-3 h-3" /></FI>
            <span className="text-[11px] font-medium text-gray-900 flex-1">Appearance</span>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5 max-w-[800px] bg-main-bg">
          {activeTab === 'account' && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-900">Profile Information</h3>
                <Card>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-[60px] h-[60px] rounded-full bg-orange-50 flex items-center justify-center text-2xl text-orange-600 font-semibold border-2 border-white shadow-sm">A</div>
                    <div>
                      <Btn className="mb-1.5 text-xs px-3">Change Avatar</Btn>
                      <div className="text-[10px] text-gray-400">JPG, GIF or PNG. Max size of 800K</div>
                    </div>
                  </div>
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1 tracking-wide uppercase">First Name</label>
                      <input type="text" className="input-text" defaultValue="Frost" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1 tracking-wide uppercase">Last Name</label>
                      <input type="text" className="input-text" defaultValue="Admin" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-[10px] font-semibold text-gray-500 mb-1 tracking-wide uppercase">Email Address</label>
                    <input type="email" className="input-text opacity-60 cursor-not-allowed" defaultValue="info@frost-ai.com" disabled />
                  </div>
                  <Btn variant="pur">Save Changes</Btn>
                </Card>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-900">Preferences</h3>
                <Card className="flex flex-col gap-3 pb-3.5 pt-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-gray-900">Desktop Notifications</div>
                      <div className="text-[10px] text-gray-400">Get notified when workflows finish</div>
                    </div>
                    <Toggle on={notifyState} onClick={() => setNotifyState(!notifyState)} />
                  </div>
                  <div className="dvd"></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium text-gray-900">Dark Mode</div>
                      <div className="text-[10px] text-gray-400">Switch theme across the workspace</div>
                    </div>
                    <Toggle on={darkModeState} onClick={() => setDarkModeState(!darkModeState)} />
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'usage' && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-900">Workspace Usage</h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <Card className="p-4">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-1">Total Tokens (7d)</div>
                  <div className="text-2xl font-bold text-gray-900">20,240</div>
                </Card>
                <Card className="p-4">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-1">Est. Cost (7d)</div>
                  <div className="text-2xl font-bold text-gray-900">$0.57</div>
                </Card>
              </div>
              
              <Card className="p-5 h-[350px]">
                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-4">Token Consumption</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 10, fill: '#6B7280' }} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ensure missing icon
import { FileText } from 'lucide-react';
