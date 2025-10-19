'use strict';

/* ---------------- Env + App bootstrap ---------------- */
const path = require('path');
// Always load env from server/.env regardless of where node starts
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const session = require('cookie-session');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

const app = express();
app.set('trust proxy', 1); // behind proxies

const PORT = Number(process.env.PORT || 3001);              // default 3001 for local
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;        // e.g. http://localhost:5173
const BASE_URL = process.env.BASE_URL;                      // e.g. http://localhost:3001

app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(session({
  name: 'recallio_sess',
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production' // http OK on localhost, HTTPS only in prod
}));


/* ---------------- Basic health + debug ---------------- */
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

/* ---------------- Slack OAuth ---------------- */
const SLACK_AUTHORIZE = 'https://slack.com/oauth/v2/authorize';
const SLACK_TOKEN_URL = 'https://slack.com/api/oauth.v2.access';
const SLACK_SCOPES = ['identity.basic', 'identity.email', 'identity.avatar'].join(' ');

app.get('/api/auth/slack', (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID,
    scope: SLACK_SCOPES,
    redirect_uri: `${BASE_URL}/api/auth/slack/callback`
  });
  res.redirect(`${SLACK_AUTHORIZE}?${params.toString()}`);
});

app.get('/api/auth/slack/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

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
    if (!data.ok) return res.status(400).json({ error: 'Slack token exchange failed', details: data });

    const authed = data.authed_user || {};
    req.session.user = {
      provider: 'slack',
      user_id: authed.id,
      access_token: authed.access_token
    };

    res.redirect(`${FRONTEND_ORIGIN}/auth/success?provider=slack`);
  } catch (err) {
    console.error('Slack callback error:', err?.response?.data || err);
    res.redirect(`${FRONTEND_ORIGIN}/auth/error?provider=slack`);
  }
});

/* ---------------- Google / Gmail OAuth ---------------- */
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GMAIL_PROFILE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/profile';

const GOOGLE_SCOPES = {
  basic: ['openid', 'email', 'profile'],
  gmail: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly']
};

const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// demo token store (replace with DB for production)
const tokenStore = new Map(); // key: sub, value: { refresh_token, access_token, expiry }

function buildGoogleAuthURL(scopes) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/auth/gmail/callback`,
    response_type: 'code',
    scope: scopes.join(' '),
    access_type: 'offline',
    include_granted_scopes: 'true',
    prompt: 'consent'
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

// Identity only
app.get('/api/auth/gmail', (_req, res) => {
  res.redirect(buildGoogleAuthURL(GOOGLE_SCOPES.basic));
});

// Ask for Gmail readonly
app.get('/api/auth/gmail/connect', (_req, res) => {
  res.redirect(buildGoogleAuthURL(GOOGLE_SCOPES.gmail));
});

app.get('/api/auth/gmail/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

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

    const ticket = await oauth2Client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload() || {};
    const sub = payload.sub;

    req.session.user = {
      provider: 'google',
      sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      has_gmail_scope: !!(scope && scope.includes('gmail'))
    };

    const expiry = Date.now() + (Number(expires_in || 0) * 1000) - 30000;
    tokenStore.set(sub, {
      refresh_token: refresh_token || tokenStore.get(sub)?.refresh_token,
      access_token,
      expiry
    });

    const gmailParam = (scope && scope.includes('gmail')) ? '&gmail=1' : '';
    res.redirect(`${FRONTEND_ORIGIN}/auth/success?provider=google${gmailParam}`);
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
    if (!req.session.user || req.session.user.provider !== 'google') {
      return res.status(401).json({ error: 'Not signed in with Google' });
    }
    const token = await ensureGoogleAccessToken(req.session.user.sub);
    const resp = await axios.get(GMAIL_PROFILE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(resp.data);
  } catch (err) {
    console.error('Gmail profile error:', err?.response?.data || err);
    res.status(400).json({ error: 'Gmail profile fetch failed' });
  }
});

/* ---------------- Session helpers ---------------- */
app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: !!req.session.user, user: req.session.user || null });
});

app.post('/api/auth/logout', (req, res) => {
  req.session = null;
  res.json({ ok: true });
});

/* ---------------- Start server ---------------- */
app.listen(PORT, () => {
  console.log(`Auth server on :${PORT}`);
  console.log('GOOGLE_CLIENT_ID prefix:', (process.env.GOOGLE_CLIENT_ID || '').slice(0, 14));
  console.log('BASE_URL:', BASE_URL, 'FRONTEND_ORIGIN:', FRONTEND_ORIGIN);
});
