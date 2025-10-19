import React from "react";
import { useLocation } from "react-router-dom";

export default function AuthError() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const msg = params.get("error") || "Something went wrong connecting this provider.";

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-red-600">Connection Failed</h1>
      <p className="mt-2 text-zinc-700">{msg}</p>
      <a href="/settings/connections" className="inline-block mt-6 rounded-xl px-4 py-2 ring-1 ring-zinc-200">
        Back to Connections
      </a>
    </div>
  );
}
