import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL; // http://localhost:3001

export default function AuthSuccess() {
  const [status, setStatus] = useState({ loading: true, user: null });

  useEffect(() => {
    fetch(`${API}/api/auth/status`, { credentials: "include" })
      .then(r => r.json())
      .then(data => setStatus({ loading: false, user: data.user }))
      .catch(() => setStatus({ loading: false, user: null }));
  }, []);

  if (status.loading) return <p>Signing you in…</p>;
  if (!status.user) return <p>Signed in, but no session found. Try again.</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Connected ✅</h1>
      <p>Provider: {status.user.provider}</p>
      {status.user.email && <p>Email: {status.user.email}</p>}
      <button onClick={() => (window.location.href = "/")}>Continue</button>
    </div>
  );
}
