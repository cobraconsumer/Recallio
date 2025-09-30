// src/LandingPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---- assets served from /public ---- */
const LOGO_SRC = "/Recallio.svg";        // ensure public/Recallio.svg exists
const WALLPAPER = "/phone-bg.jpg";       // change if you’re using a different filename

/* ---- animations ---- */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const revealOnScroll = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.05, ease: "easeOut" },
  }),
};

/* ---- simple carousel hook ---- */
function useCarousel(intervalMs = 5500, total = 3) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, total]);
  return index;
}

/* ---- Expanded (readable) mobile notification ---- */
function NotificationExpanded({ app = "Recallio", title, body }) {
  return (
    <motion.div
      key={title}
      layout
      // enter from below, exit above
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      className="w-full rounded-2xl border bg-white/90 backdrop-blur-md shadow-xl p-3.5"
      style={{ WebkitBackdropFilter: "blur(12px)" }}
      aria-label={`${app} reminder`}
    >
      {/* header */}
      <div className="flex items-center gap-3">
        {/* app icon (20% larger) */}
        <div className="h-[2.7rem] w-[2.7rem] rounded-2xl bg-white/90 border shadow-inner grid place-items-center overflow-hidden">
          <img
            src={LOGO_SRC}
            alt={`${app} logo`}
            className="h-[1.8rem] w-[1.8rem] object-contain"
            draggable="false"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* app name as logo (20% larger) */}
          <div className="flex items-baseline justify-between">
            <img
              src={LOGO_SRC}
              alt={app}
              className="h-[1.2rem] w-auto object-contain"
              draggable="false"
            />
            <div className="text-[11px] text-slate-500">now</div>
          </div>
          <div className="mt-0.5 text-[13px] text-slate-500">Reminder</div>
        </div>
      </div>

      {/* content */}
      <div className="mt-2">
        <div className="text-[15px] font-semibold text-slate-900 leading-snug">{title}</div>
        <div className="mt-1.5 text-[13px] leading-relaxed text-slate-700 whitespace-pre-line">
          {body}
        </div>
      </div>

      {/* actions */}
      <div className="mt-3.5 flex items-center gap-2">
        <button className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-[12px]">Open</button>
        <button className="px-3.5 py-1.5 rounded-full border text-[12px]">Snooze</button>
        <button className="px-3.5 py-1.5 rounded-full border text-[12px]">Mark done</button>
      </div>
    </motion.div>
  );
}

/* ---- Phone mock with top notification ---- */
function PhoneMock() {
  const slides = [
    {
      title: "Follow up with Sam about the venue deposit",
      body:
        "You promised Sam you'd confirm the reception venue by Friday.\n" +
        "• Draft email is ready in Notes\n" +
        "• Last convo suggested Riverside Hall\n" +
        "Tip: Attach the cost breakdown photo from Monday.",
    },
    {
      title: "Explain the espresso machine lights in the photo",
      body:
        "Your photo shows the ‘Clean’ light flashing.\n" +
        "Meaning: Needs a rinse cycle.\n" +
        "Steps: Fill tank → press and hold Clean 5s → run 2 cycles → done.",
    },
    {
      title: "Evening review: scan receipts and save summaries",
      body:
        "2 new receipts detected today (Grocer, Gas).\n" +
        "Open Recallio to auto-extract totals and tag for taxes.",
    },
  ];
  const i = useCarousel(5500, slides.length);

  const NOISE =
    "url('data:image/svg+xml;utf8,\
<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" opacity=\"0.05\">\
<filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter>\
<rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\"/></svg>')";

  return (
    <div className="relative">
      {/* decorative blobs */}
      <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-gradient-to-br from-fuchsia-200 via-sky-200 to-cyan-100 blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-pink-200 blur-3xl opacity-60 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="relative mx-auto max-w-[420px] rounded-3xl shadow-2xl border bg-white p-4"
      >
        {/* screen */}
        <div
          className="aspect-[9/19] rounded-2xl overflow-hidden border relative"
          style={{
            backgroundImage: `url('${WALLPAPER}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* readability overlay + subtle texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/15 pointer-events-none" />
          <div className="absolute inset-0" style={{ backgroundImage: NOISE, mixBlendMode: "overlay" }} />

          {/* faux status bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between text-white/70 drop-shadow">
            <div className="h-2 w-16 rounded bg-white/70 shadow-sm" />
            <div className="h-2 w-6 rounded bg-white/70 shadow-sm" />
          </div>

          {/* expanded notification */}
          <div className="absolute inset-x-3 top-12">
            <AnimatePresence mode="wait">
              <NotificationExpanded key={slides[i].title} title={slides[i].title} body={slides[i].body} />
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---- Page ---- */
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-visible bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          {/* brand: Recallio logo (20% larger) */}
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            src={LOGO_SRC}
            alt="Recallio"
            className="h-[1.8rem] md:h-[2.1rem] w-auto"  // 20% larger than h-6/md:h-7
            draggable="false"
          />
          <nav className="hidden md:flex gap-6 text-sm">
            {["Features", "How it works", "Use cases", "Pricing", "FAQ"].map((l) => (
              <a key={l} href={"#" + l.toLowerCase().replaceAll(" ", "")} className="hover:opacity-80">
                {l}
              </a>
            ))}
          </nav>
          <div className="flex gap-2">
            <button className="hidden sm:inline-flex rounded-xl px-4 py-2 border">Sign in</button>
            <button className="rounded-xl px-4 py-2 bg-slate-900 text-white">Join Free Beta</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-start">
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-semibold leading-tight">
            Never forget a task, idea, or photo again.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-slate-600 text-lg max-w-prose">
            <strong>Recallio</strong> is your mobile-first AI companion that remembers your context,
            explains your photos, and nudges you at the right time—without the clutter.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="rounded-xl px-6 py-3 bg-slate-900 text-white">Join Free Beta</button>
            <button className="rounded-xl px-6 py-3 border">See a Demo</button>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><span>✓</span> Privacy-first</span>
            <span className="inline-flex items-center gap-2"><span>✓</span> iOS & Android</span>
            <span className="inline-flex items-center gap-2"><span>✓</span> Free during beta</span>
          </motion.div>
        </motion.div>

        <PhoneMock />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Features</div>
          <h2 className="text-3xl md:text-4xl font-semibold">A second brain that helps—right when you need it</h2>
          <p className="text-slate-600 mt-3">Purpose-built for mobile. Private by default. Designed for real life.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Context Memory", "Remembers your projects, routines, preferences for precise recall."],
            ["Snap + Explain", "Take photos of hardware, receipts, whiteboards—get instant, actionable summaries."],
            ["Adaptive Nudges", "Reminders that learn your timing and context—helpful, not noisy."],
            ["Voice In/Out", "Capture thoughts hands-free and get concise spoken responses."],
            ["Multimodal Context", "Combine text, photos, and history for richer understanding."],
            ["Privacy-First", "Export/delete at any time, encryption in transit and at rest."],
          ].map(([title, text], i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
              variants={revealOnScroll}
              className="rounded-2xl border bg-white p-6"
            >
              <div className="text-xl font-semibold mb-2">{title}</div>
              <p className="text-slate-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Pricing</div>
          <h2 className="text-3xl md:text-4xl font-semibold">Simple, transparent pricing</h2>
          <p className="text-slate-600">Free during beta. Keep your data, anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ["Free Beta", "$0", ["All core features", "Limited reminders", "Community support"]],
            ["Pro", "$8/mo", ["Unlimited memory", "Advanced nudges", "Voice + multimodal"]],
            ["Team", "$15/user/mo", ["Shared spaces", "Admin controls", "Priority support"]],
          ].map(([name, price, feats], i) => (
            <motion.div
              key={name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
              variants={revealOnScroll}
              className="rounded-2xl border bg-white p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-semibold">{name}</div>
                <div className="text-2xl font-semibold">{price}</div>
              </div>
              <ul className="text-slate-600 space-y-2 mb-6">
                {feats.map((f) => (
                  <li key={f} className="flex gap-2"><span>✓</span>{f}</li>
                ))}
              </ul>
              <button className="mt-auto rounded-xl px-4 py-2 bg-slate-900 text-white">Get Started</button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["How does memory work?", "You choose what Recallio remembers. You can delete or export your data anytime."],
            ["Is my data private?", "Yes. Encryption in transit/at rest, with optional local-only memory."],
            ["What platforms are supported?", "iOS and Android at launch; web companion to follow."],
            ["When is the beta?", "Rolling invites over the next few weeks—join the list to reserve your spot."],
          ].map(([q, a], i) => (
            <motion.div
              key={q}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              custom={i}
              variants={revealOnScroll}
              className="rounded-2xl border bg-white p-6"
            >
              <div className="text-lg font-semibold mb-2">{q}</div>
              <p className="text-slate-600">{a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-2xl md:text-3xl font-semibold"
          >
            Ready to build your second brain?
          </motion.h3>
          <p className="text-slate-600 mt-2">
            Join the free beta and be one of the first to try context memory, Snap + Explain, and adaptive nudges.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button className="rounded-xl px-6 py-3 bg-slate-900 text-white">Join Free Beta</button>
            <button className="rounded-xl px-6 py-3 border">Contact Sales</button>
          </div>
          <p className="text-xs text-slate-500 mt-2">No spam. Unsubscribe anytime.</p>
        </div>
      </footer>
    </div>
  );
}
