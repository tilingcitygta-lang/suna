import { useState, useEffect } from 'react';

const listeners = new Set<() => void>();
let globalToggledApps: string[] = [];

export const useToggledApps = () => {
  const [apps, setApps] = useState<string[]>(globalToggledApps);
  
  useEffect(() => {
    const listener = () => setApps([...globalToggledApps]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  
  const toggleApp = (app: string, forceState?: boolean) => {
    if (forceState !== undefined) {
      if (forceState && !globalToggledApps.includes(app)) {
        globalToggledApps = [...globalToggledApps, app];
      } else if (!forceState && globalToggledApps.includes(app)) {
        globalToggledApps = globalToggledApps.filter(a => a !== app);
      }
    } else {
      if (globalToggledApps.includes(app)) {
        globalToggledApps = globalToggledApps.filter(a => a !== app);
      } else {
        globalToggledApps = [...globalToggledApps, app];
      }
    }
    listeners.forEach(l => l());
  };

  return { toggledApps: apps, toggleApp };
};
