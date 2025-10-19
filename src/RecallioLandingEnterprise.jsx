// src/RecallioLandingEnterprise.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Database,
  Workflow,
  Rocket,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Lock,
  PlugZap,
} from "lucide-react";

/**
 * Recallio — Enterprise Landing Page
 * - Gradient branding, clean black body text
 * - Integrations logos: ~30% smaller + hover enlarge (no grayscale)
 * - CTAs wired to LINKS + Plausible-safe click tracking
 */

/* ---------- Links (edit me) ---------- */
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const LINKS = {
  demo: "https://your-typeform-or-hubspot-form.com", // TODO: replace with real demo form URL
  onePager: "/Recallio-OnePager.pdf", // ensure the PDF exists in /public
  contact: "mailto:sales@recallio.com",
};

/* ---------- Accent + motion ---------- */
const ACCENT = {
  text: "text-indigo-600",
  bg: "bg-indigo-600",
  ring: "ring-indigo-600/20",
  hover: "hover:bg-indigo-700",
  gradient: "from-indigo-600 via-indigo-500 to-violet-500",
  gradientText:
    "bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

/* helper for analytics-safe click */
const track =
  (name) =>
  () => {
    try {
      window.plausible && window.plausible(name);
    } catch {}
  };

/* ---------- Header ---------- */
function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/Recallio.svg" alt="Recallio" className="h-9 w-auto" />
          <span className="sr-only">Recallio</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-900">
          <a href="#features" className="hover:opacity-70 transition">
            Features
          </a>
          <a href="#workflow" className="hover:opacity-70 transition">
            Workflow
          </a>
          <a href="#integrations" className="hover:opacity-70 transition">
            Integrations
          </a>
          <a href="#security" className="hover:opacity-70 transition">
            Security
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={LINKS.contact}
            className="hidden sm:inline-flex items-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50 transition"
            onClick={track("contact_click")}
          >
            Contact Sales
          </a>
          <a
            href={LINKS.demo}
            target="_blank"
            rel="noopener"
            className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm ${ACCENT.bg} ${ACCENT.hover} transition`}
            onClick={track("demo_click_header")}
          >
            Get a Demo
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
      {/* Gradient hairline under header */}
      <div className={`h-[2px] w-full bg-gradient-to-r ${ACCENT.gradient}`} />
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft gradient blobs */}
      <div
        className={`pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${ACCENT.gradient}`}
      />
      <div
        className={`pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full blur-3xl opacity-15 bg-gradient-to-tr ${ACCENT.gradient}`}
      />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-900">
              <Sparkles className={`${ACCENT.text} h-4 w-4`} />
              <span className={`${ACCENT.text}`}>Enterprise AI Memory</span>
            </div>
            <h1 className={`mt-5 text-4xl md:text-5xl font-bold tracking-tight text-zinc-900`}>
              Turn scattered knowledge into{" "}
              <span className={`${ACCENT.gradientText}`}>instant answers</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-zinc-900/90 max-w-xl">
              Recallio captures your team’s files, meetings, and context—then answers questions
              with citations. Secure by design, deployable in days.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={LINKS.demo}
                target="_blank"
                rel="noopener"
                className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r ${ACCENT.gradient} shadow-sm transition hover:opacity-95`}
                onClick={track("demo_click_hero")}
              >
                Book a Live Demo
              </a>
              <a
                href="#security"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 transition"
              >
                Read Security Brief
              </a>
            </div>
    <div className="mt-3 flex flex-col sm:flex-row gap-3">
  <a
    href={`${API}/api/auth/gmail`}
    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 shadow-sm transition hover:opacity-95"
  >
    Continue with Google
  </a>

  <a
    href={`${API}/api/auth/gmail/connect`}
    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 transition"
  >
    Connect Gmail
  </a>
</div>

            <div className="mt-6 flex items-center gap-6 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`${ACCENT.text} h-4 w-4`} /> SOC 2 in progress
              </div>
              <div className="flex items-center gap-2">
                <Lock className={`${ACCENT.text} h-4 w-4`} /> SSO / SAML
              </div>
              <div className="flex items-center gap-2">
                <Building2 className={`${ACCENT.text} h-4 w-4`} /> On-prem & VPC
              </div>
            </div>
          </div>

          {/* Device Mock */}
          <motion.div variants={container} initial="hidden" animate="show" className="relative">
            <motion.div
              variants={item}
              className="relative mx-auto w-full max-w-xl rounded-3xl border border-zinc-200 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <img src="/Recallio.svg" alt="Recallio" className="h-7 w-auto" />
                  <span className={`text-sm font-semibold ${ACCENT.text}`}>Recallio • Workspace</span>
                </div>
                <div className="text-xs text-zinc-500">v2.1</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5">
                <aside className="hidden md:block col-span-2 border-r border-zinc-100 p-4">
                  <div className="text-xs font-semibold text-zinc-700 mb-3">Collections</div>
                  <ul className="space-y-2">
                    {["Design Specs", "Client Calls", "Engineering", "Legal", "Research", "All Docs"].map(
                      (t) => (
                        <li key={t} className="flex items-center gap-2 text-sm text-zinc-900">
                          <div
                            className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${ACCENT.gradient}`}
                          ></div>
                          {t}
                        </li>
                      )
                    )}
                  </ul>
                </aside>
                <div className="col-span-3 p-5">
                  <div className="rounded-2xl border border-zinc-200 p-4">
                    <div className="text-xs font-medium text-zinc-500">Ask your workspace</div>
                    <div className="mt-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-zinc-900/90">
                      “Summarize key decisions from last week’s design review and link sources.”
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        {
                          title: "Three design decisions & owners",
                          pills: ["Typography", "Color", "Motion"],
                          body:
                            "Harmonized type ramp to 12/16/20/28, accent palette = Indigo 600, micro-interactions standardized across buttons.",
                        },
                        {
                          title: "Linked sources",
                          pills: ["Figma", "GDrive", "Meet"],
                          body: "Cites FigJam board + PRD v3 + 2 meeting transcripts.",
                        },
                      ].map((card, idx) => (
                        <div key={idx} className="rounded-xl border border-zinc-200 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h4 className={`text-sm font-semibold ${ACCENT.text}`}>{card.title}</h4>
                            <div className="flex flex-wrap gap-2">
                              {card.pills.map((p) => (
                                <span
                                  key={p}
                                  className={`inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-900 ${ACCENT.ring}`}
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-zinc-900/90">{card.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
function Features() {
  const features = [
    {
      icon: <Workflow className={`${ACCENT.text} h-5 w-5`} />,
      title: "Answers with citations",
      desc: "Every response links to the exact lines in your docs and calls—so legal and leadership can trust it.",
    },
    {
      icon: <Database className={`${ACCENT.text} h-5 w-5`} />,
      title: "Bring your data",
      desc: "Ingest Google Drive, Notion, Confluence, Figma, Slack, Meet transcripts, and more with granular controls.",
    },
    {
      icon: <ShieldCheck className={`${ACCENT.text} h-5 w-5`} />,
      title: "Enterprise-grade security",
      desc: "SSO/SAML, SCIM, audit logs, per-space permissions, on-prem and VPC options. SOC 2 program underway.",
    },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-zinc-200 p-6 shadow-sm bg-white">
            <div className="flex items-center gap-3">
              {f.icon}
              <h3 className={`text-base font-semibold ${ACCENT.text}`}>{f.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-900/90">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Workflow ---------- */
function WorkflowSection() {
  const steps = [
    { title: "Connect", desc: "Select sources and spaces—no code onboarding.", icon: PlugZap },
    { title: "Index", desc: "Recallio builds a secure memory graph of your org.", icon: Database },
    { title: "Ask", desc: "Get precise answers with citations and owners.", icon: Workflow },
    { title: "Ship", desc: "Decide faster. Reduce meetings. Ship more.", icon: Rocket },
  ];
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className={`text-xl font-bold ${ACCENT.text}`}>How teams use Recallio</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.title} className="relative rounded-2xl border border-zinc-200 p-5">
              <s.icon className={`${ACCENT.text} h-5 w-5`} />
              <h3 className={`mt-3 text-sm font-semibold ${ACCENT.text}`}>{s.title}</h3>
              <p className="mt-1 text-sm text-zinc-900/90">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Integrations (logos smaller + hover enlarge) ---------- */
function Integrations() {
  // Files must exist in /public (case-sensitive)
  const logos = [
    { name: "Figma", src: "/Figma-logo.svg" },
    { name: "Google Drive", src: "/google-drive.svg" },
    { name: "Google Meet", src: "/google-meet.svg" },
    { name: "Notion", src: "/Notion-logo.svg" },
    { name: "Confluence", src: "/confluence-1.svg" },
  ];

  return (
    <section id="integrations" className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <h2 className={`text-xl font-bold ${ACCENT.text}`}>Works with your stack</h2>
        <p className="mt-2 text-sm text-zinc-900/90">Plug in your tools and keep permissions intact.</p>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {logos.map(({ name, src }) => (
          <div
            key={name}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm overflow-hidden flex items-center justify-center"
          >
            {/* subtle gradient sweep on hover, matches site accent */}
            <div
              className={`pointer-events-none absolute inset-x-0 -bottom-8 h-16 opacity-0 group-hover:opacity-20 transition bg-gradient-to-r ${ACCENT.gradient}`}
            />
            <img
              src={src}
              alt={name}
              loading="lazy"
              decoding="async"
              // h-10 → ~30% smaller ≈ h-7; md:h-12 → md:h-8
              className="h-7 md:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Security ---------- */
function Security() {
  const bullets = [
    "Data stays in your control (on-prem/VPC)",
    "Row-level permissions & redaction",
    "SSO/SAML + SCIM provisioning",
    "Audit logs & retention policies",
  ];
  return (
    <section id="security" className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className={`text-xl font-bold ${ACCENT.text}`}>Security by design</h2>
            <p className="mt-2 text-sm text-zinc-900/90 max-w-2xl">
              Enterprise controls without the enterprise headache. We designed Recallio for
              security-first teams handling sensitive IP. Our SOC 2 program is underway (Type I
              planned); please contact sales for details.
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-auto">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-zinc-900/90">
                <CheckCircle2 className={`${ACCENT.text} h-4 w-4`} /> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section id="cta" className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
        <h2 className={`text-2xl font-bold text-zinc-900`}>See Recallio in your environment</h2>
        <p className="mt-2 text-sm text-zinc-900/90">15-minute discovery • tailored demo • security brief</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={LINKS.demo}
            target="_blank"
            rel="noopener"
            className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r ${ACCENT.gradient} shadow-sm transition hover:opacity-95`}
            onClick={track("demo_click_cta")}
          >
            Book a Demo
          </a>
          <a
            href={LINKS.onePager}
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-50 transition"
            onClick={track("onepager_download")}
          >
            Download One-Pager
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/Recallio.svg" alt="Recallio" className="h-6 w-auto" />
          <span className="text-sm font-semibold text-zinc-900">Recallio</span>
        </div>
        <div className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Recallio, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
export default function RecallioLandingEnterprise() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <Hero />
      <Features />
      <WorkflowSection />
      <Integrations />
      <Security />
      <CTA />
      <Footer />
    </div>
  );
}
