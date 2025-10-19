'use strict';

/* ---------------- Env + App bootstrap ---------------- */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.set('trust proxy', 1); // behind proxies

/* ---------------- Config ---------------- */
const PORT = Number(process.env.PORT || 3001);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;      // e.g. http://localhost:5173 or https://recallio.dev
const BASE_URL = process.env.BASE_URL;                    // e.g. http://localhost:3001 or https://api.example.com

/* ---------------- Middleware ---------------- */
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_ORIGIN, // if you need multiple, swap to a function and allow an array
  credentials: true
}));
app.use(express.json());
app.use(session({
  name: 'recallio_sess',
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production' // HTTPS-only cookie in prod
}));

/* ---------------- Session helper ---------------- */
function ensureSession(req) {
  if (!req.session) req.session = {};
  if (!req.session.providers) req.session.providers = {};
  if (!req.session.profile) req.session.profile = {}; // { email, name, picture }
  return req.session;
}

/* ---------------- Optional: OAuth state (CSRF) helpers ---------------- */
function setStateCookie(res, val) {
  res.cookie('oauth_state', val, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
}
function getStateCookie(req) {
  return req.cookies?.oauth_state;
}

/* ---------------- Health + debug ---------------- */
app.get('/health', (_req, res) => res.json({ ok: true, port: PORT }));

app.get('/api/debug/google', (_req, res) => {
  const id = process.env.GOOGLE_CLIENT_ID || '';
  const secret = process.env.GOOGLE_CLIENT_SECRET || '';
  res.json({
    hasClientId: Boolean(id),
    clientIdPrefix: id.slice(0, 14),
    hasClientSecret: Boolean(secret),
    baseUrl: process.env.BASE_URL,
    frontendOrigin: process.env.FRONTEND_ORIGIN
  });
});

/* =======================================================================
   SLACK OAUTH
======================================================================= */
const SLACK_AUTHORIZE = 'https://slack.com/oauth/v2/authorize';
const SLACK_TOKEN_URL = 'https://slack.com/api/oauth.v2.access';
const SLACK_SCOPES = ['identity.basic', 'identity.email', 'identity.avatar'].join(' ');

app.get('/api/auth/slack', (_req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  setStateCookie(res, state);

  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID,
    scope: SLACK_SCOPES,
    redirect_uri: `${BASE_URL}/api/auth/slack/callback`,
    state
  });
  res.redirect(`${SLACK_AUTHORIZE}?${params.toString()}`);
});

app.get('/api/auth/slack/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send('Missing code');
  if (!state || state !== getStateCookie(req)) return res.status(400).send('Invalid state');

  try {
    const tokenRes = await axios.post(
      SLACK_TOKEN_URL,
      new URLSearchParams({
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: `${BASE_URL}/api/auth/slack/callback`
      }).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const data = tokenRes.data;
    if (!data.ok) {
      return res.status(400).json({ error: 'Slack token exchange failed', details: data });
    }

    const s = ensureSession(req);
    const authed = data.authed_user || {};

    s.providers.slack = {
      user_id: authed.id,
      access_token: authed.access_token,
      email: data?.user?.email || null // not always present with identity scopes
    };

    if (!s.profile.email && s.providers.slack.email) {
      s.profile.email = s.providers.slack.email;
    }

    res.redirect(`${FRONTEND_ORIGIN}/auth/success?provider=slack&next=/settings/connections`);
  } catch (err) {
    console.error('Slack callback error:', err?.response?.data || err);
    res.redirect(`${FRONTEND_ORIGIN}/auth/error?provider=slack`);
  }
});

/* =======================================================================
   GOOGLE / GMAIL OAUTH
======================================================================= */
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_PROFILE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/profile';

const GOOGLE_SCOPES = {
  basic: ['openid', 'email', 'profile'],
  gmail: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly']
};

const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Demo token store (replace with DB in production)
const tokenStore = new Map(); // key: sub, value: { refresh_token, access_token, expiry }

function buildGoogleAuthURL(scopes, state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/auth/gmail/callback`,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent',
    state
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

// Identity only
app.get('/api/auth/gmail', (_req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  setStateCookie(res, state);
  res.redirect(buildGoogleAuthURL(GOOGLE_SCOPES.basic, state));
});

// Ask for Gmail readonly
app.get('/api/auth/gmail/connect', (_req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  setStateCookie(res, state);
  res.redirect(buildGoogleAuthURL(GOOGLE_SCOPES.gmail, state));
});

app.get('/api/auth/gmail/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send('Missing code');
  if (!state || state !== getStateCookie(req)) return res.status(400).send('Invalid state');

  try {
    const body = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/gmail/callback`,
      grant_type: 'authorization_code'
    }).toString();

    const tokenRes = await axios.post(GOOGLE_TOKEN_URL, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { id_token, access_token, refresh_token, expires_in, scope } = tokenRes.data || {};

    // Verify ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload() || {};
    const sub = payload.sub;

    const s = ensureSession(req);
    // profile
    s.profile.email   = payload.email   || s.profile.email;
    s.profile.name    = payload.name    || s.profile.name;
    s.profile.picture = payload.picture || s.profile.picture;

    const hasGmail = !!(scope && scope.includes('gmail'));

    // provider map
    s.providers.google = {
      sub,
      connected: true,
      has_gmail_scope: hasGmail
    };

    // token store (demo)
    const expiry = Date.now() + (Number(expires_in || 0) * 1000) - 30000;
    const prev = tokenStore.get(sub) || {};
    tokenStore.set(sub, {
      refresh_token: refresh_token || prev.refresh_token,
      access_token,
      expiry
    });

    const gmailParam = hasGmail ? '&gmail=1' : '';
    res.redirect(`${FRONTEND_ORIGIN}/auth/success?provider=google${gmailParam}&next=/settings/connections`);
  } catch (err) {
    console.error('Google callback error:', err?.response?.data || err);
    res.redirect(`${FRONTEND_ORIGIN}/auth/error?provider=google`);
  }
});

async function ensureGoogleAccessToken(sub) {
  const entry = tokenStore.get(sub);
  if (!entry) throw new Error('No token; user must connect Google/Gmail');

  if (Date.now() < (entry.expiry || 0) && entry.access_token) return entry.access_token;
  if (!entry.refresh_token) throw new Error('Missing refresh_token; reconnect with prompt=consent');

  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: entry.refresh_token,
    grant_type: 'refresh_token'
  }).toString();

  const r = await axios.post(GOOGLE_TOKEN_URL, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const { access_token, expires_in } = r.data || {};
  entry.access_token = access_token;
  entry.expiry = Date.now() + (Number(expires_in || 0) * 1000) - 30000;
  tokenStore.set(sub, entry);
  return access_token;
}

app.get('/api/gmail/profile', async (req, res) => {
  try {
    const s = ensureSession(req);
    if (!s.providers.google?.sub) {
      return res.status(401).json({ error: 'Not signed in with Google' });
    }
    const token = await ensureGoogleAccessToken(s.providers.google.sub);
    const resp = await axios.get(GMAIL_PROFILE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(resp.data);
  } catch (err) {
    console.error('Gmail profile error:', err?.response?.data || err);
    res.status(400).json({ error: 'Gmail profile fetch failed' });
  }
});

/* =======================================================================
   SESSION / ME
======================================================================= */
app.get('/api/auth/status', (req, res) => {
  const s = ensureSession(req);
  const primary =
    s.providers.google ? { provider: 'google', email: s.profile.email } :
    s.providers.slack  ? { provider: 'slack',  email: s.providers.slack.email } :
    s.providers.zoom   ? { provider: 'zoom',   email: s.providers.zoom.email } :
    null;

  res.json({ authenticated: !!primary, user: primary });
});

app.get('/api/me', (req, res) => {
  const s = ensureSession(req);
  res.json({
    profile: s.profile,       // { email, name, picture }
    providers: s.providers    // { google: {...}, slack: {...}, zoom: {...} }
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

/* =======================================================================
   ASK (demo) + ACTIONS (demo)
======================================================================= */

// Simple “ask” endpoint that returns a structured, mock answer
app.post('/api/ask', (req, res) => {
  const s = ensureSession(req);
  const q = (req.body?.query || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing query' });

  const answer = {
    query: q,
    summary:
      "Three decisions: (1) Type ramp 12/16/20/28. (2) Accent = Indigo 600. (3) Standardized micro-interactions across buttons. Owners: Maya (Design), Leo (FE), Priya (PM).",
    pills: ["Typography", "Color", "Motion"],
    citations: [
      { kind: "Figma",  title: "Design Review 10/12", url: "https://figma.com/file/abc" },
      { kind: "GDrive", title: "PRD v3",              url: "https://drive.google.com/file/xyz" },
      { kind: "Meet",   title: "Transcript 10/11",    url: "https://meet.google.com/..." }
    ],
    owners: [
      { name: "Maya",  role: "Design" },
      { name: "Leo",   role: "Frontend" },
      { name: "Priya", role: "PM" }
    ]
  };

  res.json({ ok: true, answer });
});

// “Actions” that a UI button can call (mocked for now)
app.post('/api/actions/add_to_calendar', (req, res) => {
  const { title = "Design review recap", when = "Fri 10:00" } = req.body || {};
  res.json({ ok: true, actionId: `cal-${Date.now()}`, title, when });
});

app.post('/api/actions/schedule_zoom', (_req, res) => {
  res.json({ ok: true, actionId: `zoom-${Date.now()}` });
});

app.post('/api/actions/draft_followup', (_req, res) => {
  res.json({
    ok: true,
    draft:
      "Hi team — quick recap of decisions: 1) type ramp 12/16/20/28, 2) accent Indigo 600, 3) standardized micro-interactions. Links attached."
  });
});


/* ---------------- Start server ---------------- */
app.listen(PORT, () => {
  console.log(`Auth server on :${PORT}`);
  console.log('GOOGLE_CLIENT_ID prefix:', (process.env.GOOGLE_CLIENT_ID || '').slice(0, 14));
  console.log('BASE_URL:', BASE_URL, 'FRONTEND_ORIGIN:', FRONTEND_ORIGIN);
});
