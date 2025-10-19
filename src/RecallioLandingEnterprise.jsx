// src/RecallioLandingEnterprise.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Calendar,
  Mail,
  Video,
  Workflow,
  Lock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

/**
 * Recallio — Landing Page (Brand Refresh: "Memory that acts")
 * - Hero: new headline/subhead, warm-agency color accents
 * - Palette: indigo/blue core + soft amber for "action"
 * - Subtle animated gradient blobs for "living memory" vibe
 * - Partner logos: 30% smaller base + hover enlarge (no grayscale)
 * - Body copy remains clean black
 * - CTAs wired with optional Plausible-safe tracking
 *
 * NOTE:
 * - Put your logo at /public/Recallio.svg (already in your project)
 * - If you have partner logo assets, drop them in /public/logos and update URLs below
 */

const LINKS = {
  primary: "/signup",
  secondary: "/demo",
  docs: "/docs",
};

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Optional analytics-safe click tracking
function track(name) {
  try {
    if (window.plausible) window.plausible(name);
  } catch {}
}

const partnerLogos = [
  { name: "Gmail", src: "/logos/gmail.png" },
  { name: "Calendar", src: "/logos/google-calendar.png" },
  { name: "Slack", src: "/logos/slack.png" },
  { name: "Zoom", src: "/logos/zoom.png" },
  { name: "Drive", src: "/logos/google-drive.png" },
  { name: "Notion", src: "/logos/notion.png" },
];

const Blob = ({ style, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 0.6, scale: 1 }}
    transition={{ duration: 1.4, delay }}
    style={{
      position: "absolute",
      filter: "blur(60px)",
      borderRadius: "999px",
      pointerEvents: "none",
      ...style,
    }}
  />
);

export default function RecallioLandingEnterprise() {
  return (
    <div style={{ background: "#0b1020", minHeight: "100vh" }}>
      {/* Top bar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          backdropFilter: "saturate(140%) blur(8px)",
          background:
            "linear-gradient(to right, rgba(11,16,32,0.75), rgba(11,16,32,0.35))",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/Recallio.svg"
              alt="Recallio"
              style={{ height: 28, display: "block" }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                letterSpacing: 0.4,
              }}
            >
              memory that acts
            </span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a
              href={LINKS.docs}
              style={{
                color: "rgba(255,255,255,0.82)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Docs
            </a>
            <a
              href={LINKS.secondary}
              onClick={() => track("demo_click")}
              style={{
                color: "#0b1020",
                background:
                  "linear-gradient(90deg, #F59E0B 0%, #FDBA74 100%)", // amber -> soft orange
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Watch demo
            </a>
            <a
              href={LINKS.primary}
              onClick={() => track("signup_click")}
              style={{
                color: "#0b1020",
                background:
                  "linear-gradient(90deg, #60A5FA 0%, #818CF8 100%)", // blue/indigo
                padding: "10px 16px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Get started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Animated blobs */}
        <Blob
          delay={0.1}
          style={{
            width: 360,
            height: 360,
            left: -80,
            top: -40,
            background:
              "radial-gradient(closest-side, rgba(99,102,241,0.55), rgba(99,102,241,0))",
          }}
        />
        <Blob
          delay={0.3}
          style={{
            width: 420,
            height: 420,
            right: -120,
            top: 60,
            background:
              "radial-gradient(closest-side, rgba(96,165,250,0.45), rgba(96,165,250,0))",
          }}
        />
        <Blob
          delay={0.6}
          style={{
            width: 300,
            height: 300,
            left: "45%",
            bottom: -80,
            background:
              "radial-gradient(closest-side, rgba(245,158,11,0.35), rgba(245,158,11,0))",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "80px 20px 40px",
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 24,
          }}
        >
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: 56,
                lineHeight: 1.06,
                margin: 0,
                background:
                  "linear-gradient(180deg, #FFFFFF 0%, #C7D2FE 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                letterSpacing: -0.5,
              }}
            >
              Memory that acts.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              style={{
                marginTop: 16,
                fontSize: 18,
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.86)",
                maxWidth: 620,
              }}
            >
              Recallio remembers what matters across your emails, notes, and
              conversations—and takes care of what’s next. Ask naturally:
              <span style={{ color: "#FDBA74", fontWeight: 600 }}>
                {" "}
                “Add that invite to my calendar and set a Zoom for Friday.”
              </span>{" "}
              Consider it done.
            </motion.p>

            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <a
                href={LINKS.primary}
                onClick={() => track("signup_click_hero")}
                style={{
                  color: "#0b1020",
                  background:
                    "linear-gradient(90deg, #60A5FA 0%, #818CF8 100%)",
                  padding: "14px 18px",
                  borderRadius: 12,
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Get started
                <ChevronRight size={18} />
              </a>
              <a
                href={LINKS.secondary}
                onClick={() => track("demo_click_hero")}
                style={{
                  color: "#0b1020",
                  background:
                    "linear-gradient(90deg, #F59E0B 0%, #FDBA74 100%)",
                  padding: "14px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                See it act
                <Sparkles size={18} />
              </a>
            </div>

            {/* Partner logos row */}
            <div
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(110px, 1fr))",
                gap: 12,
                alignItems: "center",
              }}
            >
              {partnerLogos.map((logo) => (
                <motion.div
                  key={logo.name}
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 12,
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "scale(0.7)", // ~30% smaller base
                  }}
                  title={logo.name}
                >
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.name}
                      style={{
                        maxHeight: 24,
                        objectFit: "contain",
                        opacity: 0.9,
                      }}
                    />
                  ) : (
                    <span
                      style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                    >
                      {logo.name}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right card: quick explainer */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background:
                "linear-gradient(180deg, rgba(30,41,86,0.55), rgba(30,41,86,0.25))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: 18,
              color: "#0b1020",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(90deg, rgba(96,165,250,0.22), rgba(129,140,248,0.22))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(180deg, #60A5FA, #818CF8)",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <Workflow color="#0b1020" size={20} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: "2px 0 4px",
                      color: "white",
                      fontSize: 16,
                      fontWeight: 800,
                      letterSpacing: 0.2,
                    }}
                  >
                    How Recallio acts
                  </h3>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 18,
                      color: "rgba(255,255,255,0.9)",
                      fontSize: 14.5,
                      lineHeight: 1.55,
                    }}
                  >
                    <li>Understands requests in plain language</li>
                    <li>Finds the right email, note, or message</li>
                    <li>Performs the next step for you</li>
                  </ul>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginTop: 12,
                }}
              >
                <FeaturePill icon={<Calendar size={16} />} text="Add to calendar" />
                <FeaturePill icon={<Video size={16} />} text="Schedule Zoom" />
                <FeaturePill icon={<Mail size={16} />} text="Draft follow-up" />
                <FeaturePill icon={<ShieldCheck size={16} />} text="Audit trail" />
              </div>
            </div>

            <div
              style={{
                marginTop: 12,
                padding: 14,
                background:
                  "linear-gradient(180deg, rgba(245,158,11,0.18), rgba(253,186,116,0.12))",
                border: "1px solid rgba(253,186,116,0.35)",
                borderRadius: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Lock size={18} color="#F59E0B" />
                <strong style={{ color: "white", fontSize: 14.5 }}>
                  Built for trust
                </strong>
              </div>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(255,255,255,0.9)",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                Least-privilege OAuth scopes, encrypted tokens, and a clear
                action log. Your data stays yours.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section
        style={{
          background: "white",
          color: "#0b1020",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "56px 20px 80px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 18,
            }}
          >
            <Benefit
              icon={<CheckCircle2 color="#1f2937" />}
              title="Remember everything"
              body="Capture notes, emails, and moments across your tools. Recall them instantly by asking naturally."
            />
            <Benefit
              icon={<Sparkles color="#1f2937" />}
              title="Recall context"
              body="Ask for 'the event invite from last week'—Recallio understands people, time, and intent."
            />
            <Benefit
              icon={<Workflow color="#1f2937" />}
              title="Act automatically"
              body="Turn memory into momentum. Add to calendar, schedule a Zoom, or draft a reply—hands-off."
            />
            <Benefit
              icon={<ShieldCheck color="#1f2937" />}
              title="Trust by design"
              body="Private by default with clear controls and an action log you can review anytime."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "#0b1020",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "26px 20px 46px",
            color: "rgba(255,255,255,0.78)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13 }}>© {new Date().getFullYear()} Recallio</span>
          <span style={{ fontSize: 13, opacity: 0.85 }}>
            Recallio — memory that acts
          </span>
        </div>
      </footer>
    </div>
  );
}

function FeaturePill({ icon, text }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(0,0,0,0.06)",
        fontSize: 12.5,
        fontWeight: 600,
      }}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Benefit({ icon, title, body }) {
  return (
    <div
      style={{
        background: "white",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            background: "rgba(15,23,42,0.06)",
            borderRadius: 10,
            padding: 10,
          }}
        >
          {icon}
        </div>
        <strong style={{ fontSize: 16 }}>{title}</strong>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.6 }}>{body}</p>
    </div>
  );
}
