// src/components/IntegrationTile.jsx
export default function IntegrationTile({
    name,
    description,
    status = "disconnected",
    disabled = true,
    onConnect,
  }) {
    const connected = status === "connected";
  
    return (
      <div className="rounded-2xl border p-5 bg-white/60 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-lg">{name}</h3>
          <span
            className={
              "text-xs px-2 py-1 rounded-full " +
              (connected
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600")
            }
          >
            {connected ? "Connected" : "Not connected"}
          </span>
        </div>
  
        <p className="mt-2 text-sm text-gray-600">{description}</p>
  
        <div className="mt-4">
          <button
            type="button"
            className="rounded-xl px-4 py-2 border bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConnect}
            disabled={disabled}
            aria-disabled={disabled}
          >
            {connected ? "Manage" : "Connect"}
          </button>
        </div>
      </div>
    );
  }
  