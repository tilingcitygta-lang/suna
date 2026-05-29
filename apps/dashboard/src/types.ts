export type ViewType = 'chats' | 'servers' | 'skills' | 'workers' | 'workflows' | 'connectors' | 'knowledge' | 'settings' | 'sources' | 'execution' | 'status';

export interface ViewProps {
  onNavigate: (view: ViewType) => void;
}
