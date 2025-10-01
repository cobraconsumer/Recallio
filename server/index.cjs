// server/index.cjs
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ---- tiny dev-only storage (replace with DB later) ----
const dataDir = path.join(__dirname, "data");
const connectorsPath = path.join(dataDir, "connectors.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const loadConnectors = () => {
  try { return JSON.parse(fs.readFileSync(connectorsPath, "utf8")); }
  catch { return []; }
};
const saveConnector = (rec) =>
  fs.writeFileSync(connectorsPath, JSON.stringify([...loadConnectors(), rec], null, 2));

// ---- helpers ----
const makeState = () => crypto.randomBytes(16).toString("hex");
const stateStore = new Map(); // state -> ts
const notConfigured = (res, what, vars) =>
  res.status(501).send(
    `<html><body style="font-family:ui-sans-serif,system-ui">
<h2>${what} OAuth not configured</h2>
<p>Set these in <code>server/.env</code> and restart:</p>
<pre>${vars.join("\n")}</pre>
</body></html>`
  );

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ============ SLACK OAUTH ============
// 1) Start: redirect user to Slack
app.get("/api/auth/slack", (_req, res) => {
  const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET, SLACK_REDIRECT_URI } = process.env;
  if (!SLACK_CLIENT_ID || !SLACK_CLIENT_SECRET || !SLACK_REDIRECT_URI) {
    return notConfigured(res, "Slack", [
      "SLACK_CLIENT_ID",
      "SLACK_CLIENT_SECRET",
      "SLACK_REDIRECT_URI",
    ]);
  }

  const scope = ["channels:read", "channels:history", "users:read", "files:read"].join(",");

  const state = makeState();
  stateStore.set(state, Date.now());

  const url = new URL("https://slack.com/oauth/v2/authorize");
  url.searchParams.set("client_id", SLACK_CLIENT_ID);
  url.searchParams.set("scope", scope);
  url.searchParams.set("redirect_uri", SLACK_REDIRECT_URI);
  url.searchParams.set("state", state);

  res.redirect(url.toString());
});

// 2) Callback: exchange code -> tokens
app.get("/api/auth/slack/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) return res.status(400).send(`Slack error: ${error}`);
    if (!state || !stateStore.has(state)) return res.status(400).send("Invalid state.");
    stateStore.delete(state);

    const params = new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: process.env.SLACK_REDIRECT_URI,
    });

    const r = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data = await r.json();
    if (!data.ok) return res.status(400).send(`Slack token exchange failed: ${data.error}`);

    saveConnector({
      provider: "slack",
      team: data.team?.name,
      team_id: data.team?.id,
      authed_user_id: data.authed_user?.id,
      bot_user_id: data.bot_user_id,
      scope: data.scope,
      access_token: data.access_token, // bot token
      installedAt: new Date().toISOString(),
    });

    res.send(`<html><body style="font-family:ui-sans-serif,system-ui">
<h2>Slack connected ✅</h2>
<p>You can close this tab and return to Recallio.</p>
</body></html>`);
  } catch (e) {
    console.error("Slack callback error:", e);
    res.status(500).send("Internal error during Slack OAuth.");
  }
});

// placeholders for the other providers (keep for now)
app.get("/api/auth/gmail", (_req, res) => res.json({ ok: true, message: "Google OAuth start" }));
app.get("/api/auth/zoom", (_req, res) => res.json({ ok: true, message: "Zoom OAuth start" }));

// dev helper
app.get("/api/connectors", (_req, res) => res.json(loadConnectors()));

app.listen(PORT, () => console.log(`API server listening on http://localhost:${PORT}`));
