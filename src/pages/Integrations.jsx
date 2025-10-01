// src/pages/Integrations.jsx
import IntegrationTile from "../components/IntegrationTile.jsx";

export default function Integrations() {
  const tiles = [
    {
      key: "slack",
      name: "Slack",
      description:
        "Ingest messages from channels you choose. DMs optional. Read-only.",
    },
    {
      key: "gmail",
      name: "Gmail",
      description:
        "Index subject, snippet, and body from labeled threads. Read-only.",
    },
    {
      key: "zoom",
      name: "Zoom",
      description:
        "Pull meeting metadata and transcripts for meetings you host. Read-only.",
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
              status="disconnected"
              disabled
              onConnect={() => {}}
            />
          ))}
        </div>

        <section className="mt-10 rounded-2xl border bg-white/70 p-6">
          <h2 className="font-semibold">Import progress</h2>
          <p className="text-sm text-gray-600 mt-1">
            We’ll show connector progress here after you connect.
          </p>
        </section>

        <section className="mt-8 text-xs text-gray-500 leading-relaxed">
          By connecting you grant <strong>read-only</strong> access. Recallio
          stores text, timestamps, authors, and minimal metadata. You can delete
          sources anytime. Team-visible memories only appear for content from
          shared channels/meetings.
        </section>
      </div>
    </main>
  );
}
