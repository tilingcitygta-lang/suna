import React, { useState, useEffect } from "react";
import { Plug, Search } from "lucide-react";
import { FI, Tag, Card } from "../components/SharedUI";

interface ToolkitItem {
  slug: string;
  name: string;
  logo?: string;
  description?: string;
  authConfigDetails?: { type: string }[];
}

interface ConnectedAccount {
  id: string;
  toolkit: { slug: string; name: string; logo?: string };
  status: "ACTIVE" | "FAILED";
}

export function ConnectorsView() {
  const [toolkits, setToolkits] = useState<ToolkitItem[]>([]);
  const [connectedSlugs, setConnectedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/composio/toolkits").then(res => res.json()),
      fetch("/api/composio/connected_accounts").then(res => res.json())
    ]).then(([kitsData, accountsData]) => {
      setToolkits(kitsData.items || []);
      const activeSlugs = (accountsData.items || [])
        .filter((a: ConnectedAccount) => a.status === "ACTIVE")
        .map((a: ConnectedAccount) => a.toolkit.slug);
      setConnectedSlugs(activeSlugs);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load connectors:", err);
      setLoading(false);
    });
  }, []);

  const connectedApps = toolkits.filter((t) => connectedSlugs.includes(t.slug));
  const availableApps = toolkits.filter((t) => !connectedSlugs.includes(t.slug));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="pheader">
        <FI variant="teal">
          <Plug className="w-[15px] h-[15px]" />
        </FI>
        <div>
          <div className="text-[14px] font-display font-semibold text-gray-900">
            Connectors
          </div>
          <div className="text-[11px] text-gray-400">
            Powered by Composio &middot; One-click OAuth for 2,000+ apps
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex border border-border rounded-lg overflow-hidden shrink-0 ml-2">
          <div className="px-2.5 py-1 text-[11px] bg-indigo-50 text-accent cursor-pointer">
            OAuth
          </div>
          <div className="px-2.5 py-1 text-[11px] text-gray-400 bg-white cursor-pointer hover:bg-gray-50">
            API Key
          </div>
          <div className="px-2.5 py-1 text-[11px] text-gray-400 bg-white cursor-pointer hover:bg-gray-50">
            All
          </div>
        </div>
        <input
          type="text"
          placeholder="Search 2,000+ apps…"
          className="input-text w-[150px] ml-2"
        />
      </div>
      <div className="pscroll p-3.5 bg-main-bg">
        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Connected &middot; {connectedApps.length} active
        </div>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {loading ? (
            <div className="col-span-5 py-4 flex items-center gap-2 text-[11px] text-gray-400">Loading connections...</div>
          ) : connectedApps.map((app) => {
            const authType = app.authConfigDetails?.[0]?.type ?? "OAuth";
            return (
            <Card
              key={app.slug}
              className="flex flex-col items-center gap-1.5 p-2.5 relative ring-1 ring-emerald-500/20 bg-emerald-50/10"
            >
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <img
                src={app.logo ?? `https://cdn.simpleicons.org/${app.slug}`}
                width="32"
                height="32"
                className="rounded-lg mb-0.5"
                onError={(e) => {
                  e.currentTarget.src = `https://cdn.simpleicons.org/${app.slug}`;
                }}
                alt={app.name}
              />
              <span className="text-[11px] font-medium text-gray-900 text-center leading-tight truncate w-full px-1">
                {app.name}
              </span>
              <Tag variant={authType === 'OAUTH2' ? 'tg' : 'tb2'}>{authType === 'OAUTH2' ? 'OAuth' : authType}</Tag>
            </Card>
          )})}
        </div>

        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Available Apps
        </div>
        <div className="grid grid-cols-5 gap-2 pb-8">
          {loading ? (
            <div className="col-span-5 py-4 flex items-center gap-2 text-[11px] text-gray-400">Loading tools...</div>
          ) : availableApps.map((app) => {
            const authType = app.authConfigDetails?.[0]?.type ?? "OAuth";
            return (
            <Card
              key={app.slug}
              className="flex flex-col items-center gap-1.5 p-2.5 cursor-pointer opacity-85 hover:opacity-100 transition-opacity hover:shadow-sm"
            >
              <img
                src={app.logo ?? `https://cdn.simpleicons.org/${app.slug}`}
                width="32"
                height="32"
                className="rounded-lg mb-0.5"
                onError={(e) => {
                  e.currentTarget.src = `https://cdn.simpleicons.org/${app.slug}`;
                }}
                alt={app.name}
              />
              <span className="text-[11px] font-medium text-gray-900 text-center leading-tight truncate w-full px-1">
                {app.name}
              </span>
              <span className="flex items-center justify-between w-full mt-1">
                <span className="text-[9px] text-gray-400">{authType === 'OAUTH2' ? 'OAuth' : authType}</span>
                <span className="text-[10px] text-accent font-medium">+ Connect</span>
              </span>
            </Card>
          )})}
        </div>
      </div>
    </div>
  );
}
