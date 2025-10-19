import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function Connections() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/me`, { credentials: "include" });
      const data = await res.json();
      setMe(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  const providers = [
    {
      key: "google",
      label: "Gmail / Google",
      connected: !!me?.providers?.google,
      connectHref: `${API}/api/auth/gmail`,
      disconnectHref: `${API}/api/auth/google/disconnect`,
    },
    {
      key: "slack",
      label: "Slack",
      connected: !!me?.providers?.slack,
      connectHref: `${API}/api/auth/slack`,
      disconnectHref: `${API}/api/auth/slack/disconnect`,
    },
    {
      key: "zoom",
      label: "Zoom",
      connected: !!me?.providers?.zoom,
      connectHref: `${API}/api/auth/zoom`,
      disconnectHref: `${API}/api/auth/zoom/disconnect`,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-bold">Connections</h1>
      <p className="mt-2 text-zinc-600">
        Connect Recallio to the tools your team uses every day.
      </p>

      {loading ? (
        <div className="mt-8 text-zinc-500">Loading…</div>
      ) : (
        <div className="mt-8 space-y-4">
          {providers.map((p) => (
            <div key={p.key} className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4">
              <div className="space-y-1">
                <div className="font-medium">{p.label}</div>
                <div className="text-sm text-zinc-600">
                  {p.connected ? "Connected" : "Not connected"}
                </div>
              </div>
              <div className="flex gap-2">
                {!p.connected ? (
                  <a
                    href={p.connectHref}
                    className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Connect
                  </a>
                ) : (
                  <a
                    href={p.disconnectHref}
                    className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50"
                  >
                    Disconnect
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
