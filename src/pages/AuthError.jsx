export default function AuthError() {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider") || "google";
  return (
    <div style={{ padding: 24 }}>
      <h1>Oops — auth failed ❌</h1>
      <p>Provider: {provider}</p>
      <a href="/">Go back</a>
    </div>
  );
}
