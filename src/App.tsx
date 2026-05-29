import React, { useState, useEffect } from 'react';
import { Sidebar, TopHeader, GlobalStatus } from './components/Layout';
import { ChatView } from './views/ChatView';
import { ServersView } from './views/ServersView';
import { SkillsView } from './views/SkillsView';
import { WorkersView } from './views/WorkersView';
import { WorkflowsView } from './views/WorkflowsView';
import { ConnectorsView } from './views/ConnectorsView';
import { KnowledgeView, SettingsView } from './views/ConfigViews';
import { CommandPalette } from './views/Overlays';
import { ViewType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('chats');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isChatActive) {
      setIsSidebarCollapsed(true);
    }
  }, [isChatActive]);

  return (
    <div className="flex-1 rounded-3xl overflow-hidden flex shadow-2xl bg-main-bg relative text-gray-900 font-sans min-h-0 min-w-0 border border-border">
       <Sidebar 
          currentView={currentView} 
          onNavigate={setCurrentView} 
          onToggleCommandPalette={() => setCommandPaletteOpen(true)} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
       />
       
       <main className="flex-1 flex flex-col relative bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,#f9f9fa_100%)] min-w-0 z-10 overflow-hidden">
          {!(currentView === 'chats' && isChatActive) && <TopHeader onNavigate={setCurrentView} />}
          {!(currentView === 'chats' && isChatActive) && <GlobalStatus onNavigate={setCurrentView} />}
          
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-transparent">
            {currentView === 'chats' && <ChatView onChatStateChange={setIsChatActive} />}
            {currentView === 'servers' && <ServersView />}
            {currentView === 'skills' && <SkillsView />}
            {currentView === 'workers' && <WorkersView />}
            {currentView === 'workflows' && <WorkflowsView />}
            {currentView === 'connectors' && <ConnectorsView />}
            {currentView === 'knowledge' && <KnowledgeView />}
            {currentView === 'settings' && <SettingsView />}
            
            {/* Fallbacks for non-implemented views */}
            {['sources', 'execution', 'status'].includes(currentView) && (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="text-4xl mb-4 opacity-50">🚧</div>
                 <h2 className="text-lg font-medium text-gray-900">View under construction</h2>
                 <p className="text-sm text-gray-500 mt-2">({currentView} view)</p>
                 <button onClick={() => setCurrentView('chats')} className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Return home</button>
              </div>
            )}
          </div>
       </main>

       {commandPaletteOpen && <CommandPalette onClose={() => setCommandPaletteOpen(false)} />}
       
    </div>
  )
}
