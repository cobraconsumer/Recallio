import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function AuthSuccess() {
  const nav = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const providerFromQuery = params.get("provider"); // e.g., "google"
  const next = params.get("next") || "/settings/connections";

  const [state, setState] = useState({
    loading: true,
    user: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API}/api/auth/status`, { credentials: "include" });
        const data = await res.json();
        if (cancelled) return;

        setState({ loading: false, user: data.user ?? null, error: null });

        // brief pause so the user sees "Connected!" then bounce
        setTimeout(() => nav(next), 900);
      } catch (e) {
        if (cancelled) return;
        setState({ loading: false, user: null, error: "Could not confirm session." });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [nav, next]);

  if (state.loading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-xl font-semibold">Finishing sign-in…</h1>
        <p className="mt-2 text-zinc-600">Securing your session and redirecting.</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Hmm…</h1>
        <p className="mt-2 text-zinc-700">{state.error}</p>
        <a href="/auth/error?error=Session%20not%20found" className="inline-block mt-6 rounded-xl px-4 py-2 ring-1 ring-zinc-200">
          View error details
        </a>
      </div>
    );
  }

  const provider = state.user?.provider || providerFromQuery || "provider";
  const email = state.user?.email;

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-green-600">Connected!</h1>
      <p className="mt-2 text-zinc-700">
        {provider.charAt(0).toUpperCase() + provider.slice(1)} has been linked to your account.
      </p>
      {email && <p className="mt-1 text-zinc-500 text-sm">Email: {email}</p>}

      <div className="mt-6 flex justify-center gap-3">
        <a
          href="/settings/connections"
          className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Connections
        </a>
        <a
          href="/"
          className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50"
        >
          Home
        </a>
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        You’ll be redirected automatically in a moment…
      </p>
    </div>
  );
}
