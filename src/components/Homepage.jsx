import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import AdBanner from "./AdBanner";

/* ── Floating orb background ─────────────────────────────── */
const orbs = [
  { w: 420, h: 420, x: "-10%", y: "5%", color: "rgba(59,130,246,0.12)", delay: 0, dur: 14 },
  { w: 280, h: 280, x: "60%", y: "-8%", color: "rgba(124,58,237,0.1)", delay: 3, dur: 18 },
  { w: 340, h: 340, x: "75%", y: "55%", color: "rgba(37,99,235,0.09)", delay: 1.5, dur: 16 },
  { w: 200, h: 200, x: "20%", y: "70%", color: "rgba(99,102,241,0.11)", delay: 4, dur: 12 },
  { w: 160, h: 160, x: "45%", y: "30%", color: "rgba(139,92,246,0.07)", delay: 2, dur: 20 },
];

/* ── Feature card data ───────────────────────────────────── */
const features = [
  {
    emoji: "🤖",
    title: "AI-Powered Content",
    desc: "Smart suggestions and professional phrasing tailored to your target industry and role.",
    accent: "from-blue-500 to-cyan-400",
    shadow: "rgba(59,130,246,0.25)",
  },
  {
    emoji: "🎨",
    title: "Modern Templates",
    desc: "ATS-optimised templates that pass automated filters and impress human recruiters.",
    accent: "from-violet-500 to-purple-400",
    shadow: "rgba(124,58,237,0.25)",
  },
  {
    emoji: "⚡",
    title: "Instant Optimisation",
    desc: "Real-time feedback, keyword analysis and improvement tips as you build your resume.",
    accent: "from-indigo-500 to-blue-400",
    shadow: "rgba(99,102,241,0.25)",
  },
  {
    emoji: "🔒",
    title: "Secure & Private",
    desc: "Your data is encrypted end-to-end. We never share your personal details with third parties.",
    accent: "from-emerald-500 to-teal-400",
    shadow: "rgba(16,185,129,0.25)",
  },
  {
    emoji: "📥",
    title: "Multi-Format Export",
    desc: "Download as PDF or print-ready format with one click — pixel-perfect every time.",
    accent: "from-orange-500 to-amber-400",
    shadow: "rgba(245,158,11,0.25)",
  },
  {
    emoji: "✅",
    title: "Skill Verification",
    desc: "Verify your skills with AI-generated quiz questions and earn a verified badge on your resume.",
    accent: "from-rose-500 to-pink-400",
    shadow: "rgba(244,63,94,0.25)",
  },
];

/* ── Stat counter component ──────────────────────────────── */
function CountUp({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── 3D Tilt Card ────────────────────────────────────────── */
function TiltCard({ feature, index }) {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 20;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateZ(10px)`;
    card.style.boxShadow = `${-x * 2}px ${y * 2}px 40px ${feature.shadow}`;
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    card.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
  };
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{
        background: "var(--bg-card)",
        borderRadius: "20px",
        padding: "2rem 1.75rem",
        textAlign: "left",
        border: "1px solid var(--border-dim)",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        willChange: "transform",
        transformStyle: "preserve-3d",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top gradient accent strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: `linear-gradient(90deg, #2563eb, #7c3aed)`,
        borderRadius: "20px 20px 0 0",
      }} />
      {/* Emoji icon with glowing bg */}
      <div style={{
        width: "60px", height: "60px",
        background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.12) 100%)",
        borderRadius: "16px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.8rem",
        marginBottom: "1.25rem",
        transform: "translateZ(20px)",
      }}>{feature.emoji}</div>
      <h3 style={{
        fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)",
        marginBottom: "0.75rem", transform: "translateZ(15px)",
        fontFamily: "'Inter', sans-serif",
      }}>{feature.title}</h3>
      <p style={{
        color: "var(--text-secondary)", lineHeight: 1.65, fontSize: "0.92rem",
        transform: "translateZ(10px)", fontFamily: "'Inter', sans-serif",
      }}>{feature.desc}</p>
    </motion.div>
  );
}

/* ── FAQ Item ────────────────────────────────────────────── */
const faqData = [
  { q: "How does the AI-powered resume builder work?", a: "Our AI analyses your input and suggests professional phrasing, optimises keywords for ATS systems, and provides industry-specific recommendations to make your resume stand out." },
  { q: "Is my data secure?", a: "Yes. All your information is encrypted in transit and at rest. We never share your personal data with third parties without your explicit consent." },
  { q: "Can I download my resume in different formats?", a: "Absolutely! You can download your resume as a PDF optimised for both human readers and applicant tracking systems." },
  { q: "Do you offer templates for specific industries?", a: "Yes, we have templates tailored for tech, healthcare, finance, creative fields, and more — each designed to highlight what recruiters in that industry look for." },
  { q: "How long does it take to create a resume?", a: "Most users create a professional resume in under 10 minutes. Our streamlined process and AI suggestions make it quick and efficient." },
  { q: "Can I update my resume later?", a: "Yes, all your data is saved automatically and you can create multiple versions for different job applications." },
];

function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: "var(--bg-card)", marginBottom: "0.75rem", borderRadius: "14px",
        overflow: "hidden", border: "1px solid var(--border-dim)",
        boxShadow: open ? "0 4px 24px rgba(59,130,246,0.15)" : "0 2px 8px rgba(0,0,0,0.2)",
        transition: "box-shadow 0.3s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "1.4rem 1.5rem", background: "transparent",
          border: "none", textAlign: "left", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "1rem",
        }}
      >
        <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Inter', sans-serif" }}>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          style={{ fontSize: "1.5rem", color: "#3b82f6", flexShrink: 0 }}
        >+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{
              padding: "0 1.5rem 1.4rem",
              color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem",
              fontFamily: "'Inter', sans-serif",
            }}>{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN HOMEPAGE COMPONENT
══════════════════════════════════════════════════════════ */
function Homepage() {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const handleAuth = () => navigate("/auth");

  /* Inject global CSS once */
  useEffect(() => {
    const id = "homepage-global-css";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; }
      @keyframes floatOrb {
        0%,100% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-30px) scale(1.04); }
      }
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes rotateSlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes fadeUpIn {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes glowBadge {
        0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.2); }
        50% { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "var(--bg-dark)", minHeight: "100vh" }}>
      {/* ── Shared Navbar ─────────────────────────────────── */}
      <Navbar />

      {/* ══ HERO SECTION ════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          display: "flex", alignItems: "center",
          position: "relative", overflow: "hidden",
          background: "radial-gradient(ellipse at top, #0a1128 0%, #050b14 100%)",
          paddingTop: "68px",
        }}
      >
        {/* Floating orbs */}
        {orbs.map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: orb.w, height: orb.h,
              left: orb.x, top: orb.y,
              background: `radial-gradient(circle at 40% 40%, ${orb.color}, transparent 70%)`,
              borderRadius: "50%",
              animation: `floatOrb ${orb.dur}s ease-in-out ${orb.delay}s infinite`,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Subtle grid pattern */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          padding: "4rem 2rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem",
          alignItems: "center", position: "relative", zIndex: 1,
          width: "100%",
        }}>
          {/* Left: headline */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(37,99,235,0.1)",
                border: "1px solid rgba(37,99,235,0.2)",
                color: "#2563eb", padding: "0.5rem 1.1rem",
                borderRadius: "999px", fontSize: "0.85rem", fontWeight: 700,
                marginBottom: "1.75rem",
                animation: "glowBadge 2.5s ease-in-out infinite",
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#2563eb",
                animation: "glowBadge 1.5s ease-in-out infinite",
              }} />
              🚀 AI-Powered Resume Builder
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.7 }}
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 900, lineHeight: 1.08,
                marginBottom: "1.5rem", letterSpacing: "-1.5px",
              }}
            >
              <span style={{ color: "var(--text-primary)" }}>Craft Resumes</span>
              <br />
              <span style={{
                backgroundImage: "linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #3b82f6 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                backgroundSize: "200% auto",
                animation: "shimmer 4s linear infinite",
              }}>
                That Get You Hired
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              style={{
                fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7,
                marginBottom: "2.5rem", maxWidth: "520px",
              }}
            >
              Transform your career story into a compelling resume with AI-powered
              insights, modern templates, and professional guidance — ready in under
              10&nbsp;minutes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.55 }}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}
            >
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 12px 36px rgba(37,99,235,0.45)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAuth}
                style={{
                  background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
                  color: "white", border: "none",
                  padding: "1rem 2.2rem", borderRadius: "12px",
                  fontSize: "1rem", fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  boxShadow: "0 8px 28px rgba(37,99,235,0.35)",
                  fontFamily: "'Inter', sans-serif",
                  transition: "box-shadow 0.3s",
                }}
              >
                Start Building Free →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowTemplates(true)}
                style={{
                  background: "rgba(255,255,255,0.05)", color: "white",
                  border: "1.5px solid var(--border-dim)",
                  padding: "1rem 1.8rem", borderRadius: "12px",
                  fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                👁️ Browse Templates
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}
            >
              {[
                { end: 10000, suffix: "+", label: "Resumes Created" },
                { end: 95, suffix: "%", label: "Success Rate" },
                { end: 2, suffix: "min", label: "Average Build Time" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "1.75rem", fontWeight: 900, color: "#2563eb",
                    lineHeight: 1, marginBottom: "0.25rem", letterSpacing: "-0.5px",
                  }}>
                    <CountUp end={s.end} suffix={s.suffix} />
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: 3D floating resume mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -20 }}
            animate={heroInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ perspective: "1000px" }}
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: "var(--bg-card)",
                borderRadius: "24px",
                padding: "2.5rem 2rem",
                boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.3)",
                border: "1px solid var(--border-dim)",
                position: "relative",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Accent top bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                background: "linear-gradient(90deg, #2563eb, #7c3aed, #3b82f6)",
                borderRadius: "24px 24px 0 0",
              }} />
              {/* Resume content preview */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: 800, fontSize: "1rem",
                }}>JD</div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1rem" }}>Jane Doe</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>Senior Software Engineer</div>
                </div>
                <div style={{
                  marginLeft: "auto", background: "rgba(37,99,235,0.1)",
                  color: "#2563eb", padding: "0.35rem 0.8rem",
                  borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700,
                }}>✅ Verified</div>
              </div>
              {/* Skill bars */}
              {[
                { skill: "React & TypeScript", pct: 92 },
                { skill: "Node.js & APIs", pct: 85 },
                { skill: "System Design", pct: 78 },
              ].map(({ skill, pct }, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>{skill}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a78bfa" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={heroInView ? { width: `${pct}%` } : {}}
                      transition={{ duration: 1.2, delay: 1 + i * 0.2, ease: "easeOut" }}
                      style={{
                        height: "100%", borderRadius: 6,
                        background: "linear-gradient(90deg, #2563eb, #7c3aed)",
                      }}
                    />
                  </div>
                </div>
              ))}
              {/* ATS badge */}
              <div style={{
                marginTop: "1.5rem",
                background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)",
                borderRadius: "12px", padding: "1rem",
                display: "flex", alignItems: "center", gap: "0.75rem",
              }}>
                <div style={{ fontSize: "1.5rem" }}>🏆</div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>ATS Score: 97/100</div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Optimised for top ATS systems</div>
                </div>
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                style={{
                  position: "absolute", top: "-14px", right: "-14px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "white", borderRadius: "999px",
                  padding: "0.4rem 0.9rem", fontSize: "0.75rem", fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(16,185,129,0.5)",
                  border: "2px solid white",
                }}
              >
                🤖 AI Generated
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: "absolute", bottom: "2.5rem", left: "50%",
            transform: "translateX(-50%)",
            color: "#94a3b8", fontSize: "0.8rem", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
          }}
        >
          <div style={{
            width: 24, height: 40, border: "2px solid rgba(148,163,184,0.5)",
            borderRadius: "12px", display: "flex", justifyContent: "center",
            padding: "6px 0",
          }}>
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 4, height: 8, borderRadius: 2, background: "#94a3b8" }}
            />
          </div>
          Scroll to explore
        </motion.div>
      </section>

      {/* ══ AD BANNER ═══════════════════════════════════════ */}
      <AdBanner
        adSlot="5880009725"
        style={{ margin: "3rem auto", maxWidth: "728px" }}
      />

      {/* ══ FEATURES SECTION ════════════════════════════════ */}
      <section style={{
        padding: "8rem 2rem",
        background: "var(--bg-dark)",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 4rem" }}
        >
          <div style={{
            display: "inline-block",
            background: "rgba(124,58,237,0.15)",
            color: "#a78bfa", padding: "0.4rem 1rem",
            borderRadius: "999px", fontSize: "0.82rem", fontWeight: 700,
            marginBottom: "1rem",
          }}>✨ Packed with Features</div>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900,
            letterSpacing: "-1px", marginBottom: "1rem",
            backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Why Choose InsightResume?
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Everything you need to build, verify and download a job-winning resume
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem", maxWidth: "1100px", margin: "0 auto",
        }}>
          {features.map((f, i) => <TiltCard key={i} feature={f} index={i} />)}
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════════════ */}
      <section style={{
        padding: "8rem 2rem",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* bg orb */}
        <div style={{
          position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem" }}
        >
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900,
            letterSpacing: "-1px", marginBottom: "1rem", color: "white",
          }}>
            From Blank Page to <span style={{
              backgroundImage: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Dream Job</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7 }}>
            Three simple steps to a professional, verified resume
          </p>
        </motion.div>

        <div style={{
          display: "flex", gap: "2rem", maxWidth: "1000px", margin: "0 auto",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { step: "01", icon: "📝", title: "Enter Your Details", desc: "Fill in your info or just describe yourself in plain English — our AI handles the rest." },
            { step: "02", icon: "🤖", title: "AI Generates Your Resume", desc: "Our AI crafts a professional resume with the right keywords, structure and formatting." },
            { step: "03", icon: "🏆", title: "Verify, Download & Apply", desc: "Verify your skills, download as PDF and start applying to your dream job today." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              style={{
                flex: "1 1 280px", maxWidth: "300px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px", padding: "2.5rem 2rem",
                textAlign: "center",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{
                fontSize: "0.7rem", fontWeight: 800, color: "#60a5fa",
                letterSpacing: "2px", marginBottom: "0.75rem",
              }}>STEP {item.step}</div>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{item.icon}</div>
              <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.75rem", fontSize: "1.1rem" }}>
                {item.title}
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FAQ SECTION ═════════════════════════════════════ */}
      <section style={{ padding: "8rem 2rem", background: "var(--bg-dark)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem" }}
        >
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 900,
            letterSpacing: "-1px", marginBottom: "1rem",
            backgroundImage: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem" }}>
            Get answers to common questions about our platform
          </p>
        </motion.div>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          {faqData.map((faq, i) => <FaqItem key={i} faq={{ q: faq.q, a: faq.a }} index={i} />)}
        </div>
      </section>

      {/* ══ CTA SECTION ═════════════════════════════════════ */}
      <section style={{
        padding: "8rem 2rem",
        background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: "relative" }}
        >
          <h2 style={{
            fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900,
            color: "white", marginBottom: "1rem", letterSpacing: "-1px",
          }}>
            Ready to Transform Your Career?
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.85)", fontSize: "1.1rem",
            maxWidth: "520px", margin: "0 auto 2.5rem", lineHeight: 1.7,
          }}>
            Join thousands of professionals who landed their dream jobs with InsightResume.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAuth}
              style={{
                background: "linear-gradient(135deg, #60a5fa, #7c3aed)", color: "white",
                border: "none", padding: "1rem 2.5rem",
                borderRadius: "12px", fontSize: "1rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              🎯 Create Your Resume Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAuth}
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                color: "white", border: "1.5px solid rgba(255,255,255,0.35)",
                padding: "1rem 2rem", borderRadius: "12px",
                fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Already have an account? Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer style={{
        background: "var(--bg-dark)", color: "white",
        padding: "4rem 2rem 2rem",
      }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr auto",
          gap: "4rem", marginBottom: "2.5rem",
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "10px",
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: "0.9rem",
              }}>IR</div>
              <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "white" }}>
                InsightResume
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", maxWidth: "280px", lineHeight: 1.7 }}>
              AI-powered resume building for the modern job market.
            </p>
          </div>
          <div style={{ display: "flex", gap: "3rem" }}>
            {[
              { heading: "Navigate", links: [
                { label: "Features", path: "/features" },
                { label: "About", path: "/about" },
                { label: "FAQ", path: "/faq" },
                { label: "Contact", path: "/contact" },
              ]},
              { heading: "Account", links: [
                { label: "Sign In", path: "/auth" },
                { label: "Get Started", path: "/auth" },
                { label: "Privacy Policy", path: "/privacy" },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ color: "white", fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>
                  {col.heading}
                </h4>
                {col.links.map(({ label, path }) => (
                  <button
                    key={label}
                    onClick={() => navigate(path)}
                    style={{
                      display: "block", background: "none", border: "none",
                      color: "#94a3b8", cursor: "pointer", marginBottom: "0.5rem",
                      fontSize: "0.85rem", fontFamily: "'Inter', sans-serif",
                      textAlign: "left", transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.target.style.color = "white"}
                    onMouseLeave={e => e.target.style.color = "#94a3b8"}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          paddingTop: "1.5rem", borderTop: "1px solid #1e293b",
          textAlign: "center", color: "#64748b", fontSize: "0.85rem",
        }}>
          Crafted with 💙 by M · © {new Date().getFullYear()} InsightResume
        </div>
      </footer>

      {/* ── Templates Modal ─────────────────────────────── */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            key="modal-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 9998, padding: "1.5rem",
            }}
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              key="modal-box"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "white", borderRadius: "24px",
                padding: "3rem", width: "100%", maxWidth: "680px",
                maxHeight: "85vh", overflowY: "auto",
                boxShadow: "0 40px 80px rgba(0,0,0,0.2)",
              }}
            >
              <h2 style={{
                fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.5rem",
                backgroundImage: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", letterSpacing: "-0.5px",
              }}>Choose Your Style</h2>
              <p style={{ color: "#64748b", marginBottom: "2rem" }}>
                Pick a template that matches your personality and industry
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                {["Modern Pro", "Classic Clean", "Creative Edge", "Executive"].map((t, i) => (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(37,99,235,0.2)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/auth")}
                    style={{
                      background: "linear-gradient(135deg, #f0f4ff, #faf5ff)",
                      border: "1.5px solid rgba(99,102,241,0.2)",
                      borderRadius: "16px", padding: "1.5rem",
                      cursor: "pointer", textAlign: "left",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                      {["🖊️","📄","🎨","💼"][i]}
                    </div>
                    <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "0.25rem" }}>{t}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Click to use this template</div>
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                style={{
                  width: "100%", padding: "1rem",
                  background: "#f1f5f9", border: "none",
                  borderRadius: "12px", fontWeight: 600, cursor: "pointer",
                  color: "#475569", fontFamily: "'Inter', sans-serif",
                }}
              >Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Homepage;
