import { useEffect, useState } from "react";
import IntegrationTile from "../components/IntegrationTile.jsx";

export default function Integrations() {
  const [connected, setConnected] = useState({});

  useEffect(() => {
    fetch("/api/connectors")
      .then((r) => r.json())
      .then((rows) => {
        const map = {};
        rows.forEach((r) => { map[r.provider] = true; });
        setConnected(map);
      })
      .catch(() => {});
  }, []);

  const tiles = [
    {
      key: "slack",
      name: "Slack",
      description:
        "Ingest messages from channels you choose. DMs optional. Read-only.",
      href: "/api/auth/slack",
    },
    {
      key: "gmail",
      name: "Gmail",
      description:
        "Index subject, snippet, and body from labeled threads. Read-only.",
      href: "/api/auth/gmail",
    },
    {
      key: "zoom",
      name: "Zoom",
      description:
        "Pull meeting metadata and transcripts for meetings you host. Read-only.",
      href: "/api/auth/zoom",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="mt-2 text-gray-600">
            Connect your tools. Your data stays private — you can pause or
            delete any connector at any time.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          {tiles.map((t) => (
            <IntegrationTile
              key={t.key}
              name={t.name}
              description={t.description}
              href={t.href}
              status={connected[t.key] ? "connected" : "disconnected"}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

