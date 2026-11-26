import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Dices,
  FileText,
  Globe,
  Hexagon,
  Lock,
  MessageSquare,
  Network,
  Send,
  Share2,
  ShieldCheck,
  User,
  Volume2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import "./LandingPage.css";

const SAMPLE_ALIASES = [
  "AmberBadger4129",
  "CosmicOwl7412",
  "VelvetFox3041",
  "CleverFalcon2048",
  "NeonLynx5520",
];

const DROPIN_MESSAGES = {
  general: [
    {
      author: "NeonLynx5520",
      accent: "#c3c0ff",
      text: "Anyone else stuck on the DBMS normalization sheet? Glad I can ask here without feeling awkward.",
    },
    {
      author: "AmberBadger4129",
      accent: "#bfc6dd",
      text: "Same! Just dropped a quick step-by-step breakdown above.",
    },
  ],
  complaints: [
    {
      author: "SilentOtter8821",
      accent: "#c3c0ff",
      text: "Water cooler near Block B lab has been warm all week—needs maintenance.",
    },
    {
      author: "CleverFalcon2048",
      accent: "#bfc6dd",
      text: "Upvoted! Raising this anonymously makes it way easier to report.",
    },
  ],
  events: [
    {
      author: "CosmicOwl7412",
      accent: "#c3c0ff",
      text: "24-hour Campus Hackathon registrations close tonight at 11:59 PM!",
    },
    {
      author: "VelvetFox3041",
      accent: "#bfc6dd",
      text: "Looking for 1 backend dev to join our team—DM your alias.",
    },
  ],
};

export default function LandingPage() {
  const { user } = useAuth();

  // Interactive Bento 1 reactions
  const [reactions, setReactions] = useState({
    rocket: { count: 14, active: false },
    fire: { count: 9, active: false },
  });

  // Interactive Bento 2 alias cycler
  const [aliasIdx, setAliasIdx] = useState(0);
  const activeAlias = SAMPLE_ALIASES[aliasIdx];

  // Interactive Bento 3 channel switcher
  const [previewChannel, setPreviewChannel] = useState("general");

  // Premium scroll progress bar & IntersectionObserver reveal animations
  const [scrollProgress, setScrollProgress] = useState(0);
  const pageRef = useRef(null);

  useEffect(() => {
    const rootEl = pageRef.current;
    if (!rootEl) return;

    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
        setScrollProgress(progress);
        rootEl.style.setProperty("--scroll-y", `${scrollTop}px`);
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const targets = rootEl.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  function toggleReaction(key) {
    setReactions((prev) => {
      const current = prev[key];
      const nextActive = !current.active;
      return {
        ...prev,
        [key]: {
          active: nextActive,
          count: nextActive ? current.count + 1 : current.count - 1,
        },
      };
    });
  }

  const primaryCtaPath = user ? "/chat" : "/register";
  const primaryCtaLabel = user ? "Open CoHive" : "Join The Hive";

  return (
    <div ref={pageRef} className="cosmic-landing">
      {/* Premium Scroll Progress Bar */}
      <div
        className="cosmic-scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* Fixed Glassmorphic Navbar */}
      <header className="cosmic-header">
        <div className="cosmic-header-inner">
          <Link to="/" className="cosmic-brand" aria-label="CoHive Home">
            <img src="/images/cohive-badge.png" alt="CoHive Hexagon Badge" />
            <span>CoHive</span>
          </Link>

          <nav className="cosmic-nav" aria-label="Primary navigation">
            <a href="#channels">Channels</a>
            <a href="#privacy">Privacy</a>
            <a href="#drop-in">Explore</a>
            <a href="#footer">Community</a>
          </nav>

          <div className="cosmic-header-actions">
            <Link to={primaryCtaPath} className="cosmic-btn-pill-light">
              {user ? "Open CoHive" : "Open CoHive"}
            </Link>
            <Link
              to={user ? "/chat" : "/login"}
              className="cosmic-avatar-btn"
              aria-label={user ? "Go to Chat" : "Sign In"}
              title={user ? "Go to Chat" : "Sign In"}
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </header>

      <main className="cosmic-main">
        {/* Hero Section: Asymmetric Split */}
        <section className="cosmic-hero">
          <div className="cosmic-glow-top" aria-hidden="true" />
          <div className="cosmic-glow-right" aria-hidden="true" />

          {/* Subtle Decorative Sparkles */}
          <svg
            aria-hidden="true"
            className="cosmic-sparkle cosmic-sparkle-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <svg
            aria-hidden="true"
            className="cosmic-sparkle cosmic-sparkle-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>

          <div className="cosmic-container cosmic-hero-grid">
            {/* Left Column */}
            <div className="cosmic-hero-copy">
              <h1 className="cosmic-hero-title">
                REAL CAMPUS TALK.{" "}
                <span className="cosmic-hero-title-accent">
                  ZERO SOCIAL PRESSURE.
                </span>
              </h1>

              <p className="cosmic-hero-subtitle">
                CoHive is your verified anonymous campus community. Ask
                unfiltered doubts in #general, raise #complaints safely without
                fear of judgment, and discover #events—under an alias only you
                control.
              </p>

              <div className="cosmic-hero-actions">
                <Link to={primaryCtaPath} className="cosmic-btn-primary">
                  {primaryCtaLabel}
                </Link>
                <Link
                  to={user ? "/chat" : "/login"}
                  className="cosmic-btn-glass"
                >
                  {user ? "Open Channels" : "Sign In"}
                </Link>
              </div>
            </div>

            {/* Right Column: Borderless 3D Tilted Product Showcase */}
            <div className="cosmic-hero-showcase">
              <div className="cosmic-showcase-glow" aria-hidden="true" />

              {/* Tilted 3D Workspace Window */}
              <div className="cosmic-3d-window">
                <div className="cosmic-3d-topbar">
                  <div className="cosmic-3d-dots" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="cosmic-3d-window-title">
                    cohive / anonymous-hive
                  </span>
                  <span className="cosmic-3d-live-tag">
                    <span className="cosmic-eyebrow-dot" />
                    Alias Active
                  </span>
                </div>

                <div className="cosmic-3d-body">
                  {/* Left Sidebar */}
                  <aside className="cosmic-3d-sidebar">
                    <div className="cosmic-3d-hive-head">
                      <span className="cosmic-3d-hex-badge">
                        <Hexagon size={14} />
                      </span>
                      <span>Campus Hive</span>
                    </div>

                    <div className="cosmic-3d-nav-group">
                      <span className="cosmic-3d-nav-label">Channels</span>
                      <div className="cosmic-3d-ch active">
                        <span>#</span>
                        <span>general</span>
                      </div>
                      <div className="cosmic-3d-ch">
                        <span>#</span>
                        <span>complaints</span>
                      </div>
                      <div className="cosmic-3d-ch">
                        <span>#</span>
                        <span>events</span>
                      </div>
                    </div>

                    <div className="cosmic-3d-nav-group">
                      <span className="cosmic-3d-nav-label">Privacy Shield</span>
                      <div className="cosmic-3d-voice">
                        <span className="cosmic-3d-voice-left">
                          <Volume2 size={13} />
                          <span>Identity Hidden</span>
                        </span>
                        <span className="cosmic-3d-voice-dot" />
                      </div>
                    </div>
                  </aside>

                  {/* Right Live Feed */}
                  <div className="cosmic-3d-feed">
                    <div className="cosmic-3d-feed-head">
                      <span className="cosmic-3d-feed-hash">#</span>
                      <span>general</span>
                    </div>

                    {/* Anonymous Student Message 1 */}
                    <div className="cosmic-3d-msg">
                      <div className="cosmic-3d-avatar cosmic-3d-avatar-faculty">
                        AB
                      </div>
                      <div className="cosmic-3d-msg-content">
                        <div className="cosmic-3d-msg-meta">
                          <strong>AmberBadger4129</strong>
                          <span className="cosmic-3d-faculty-badge">
                            Verified
                          </span>
                          <time>2:14 PM</time>
                        </div>
                        <p>
                          Anyone else stuck on today&apos;s OS deadlock lab?
                          Was hesitant to ask in class—sharing my notes here!
                        </p>
                        <div className="cosmic-3d-pdf-card">
                          <span className="cosmic-3d-pdf-icon">
                            <FileText size={15} />
                          </span>
                          <div className="cosmic-3d-pdf-meta">
                            <strong>OS_Deadlock_Notes.pdf</strong>
                            <span>1.2 MB · Anonymous Share</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Anonymous Student Message 2 */}
                    <div className="cosmic-3d-msg">
                      <div className="cosmic-3d-avatar cosmic-3d-avatar-student">
                        CF
                      </div>
                      <div className="cosmic-3d-msg-content">
                        <div className="cosmic-3d-msg-meta">
                          <strong>CleverFalcon2048</strong>
                          <time>2:16 PM</time>
                        </div>
                        <p>
                          You&apos;re not alone! Check page 3—way easier to ask
                          real doubts here without any labels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lying Student Character PNG (Top Edge of Card) */}
              <img
                src="/images/char-student-laying.png"
                alt=""
                aria-hidden="true"
                className="cosmic-char cosmic-char-laying"
              />

              {/* Student Character PNG (Left Side) */}
              <img
                src="/images/char-student.png"
                alt=""
                aria-hidden="true"
                className="cosmic-char cosmic-char-student"
              />

              {/* Scholar Owl Mascot PNG (Front-Center) */}
              <img
                src="/images/char-owl.png"
                alt=""
                aria-hidden="true"
                className="cosmic-char cosmic-char-owl"
              />

              {/* Faculty Mentor Character PNG (Bottom-Right) */}
              <img
                src="/images/char-faculty.png"
                alt=""
                aria-hidden="true"
                className="cosmic-char cosmic-char-faculty"
              />
            </div>
          </div>
        </section>

        {/* Feature Bento Section 1: Media Left / Copy Right (Character Left) */}
        <section id="channels" className="cosmic-bento-section">
          <div className="cosmic-container">
            <div className="cosmic-bento-wrap" data-reveal="">
              <img
                src="/images/char-student.png"
                alt=""
                aria-hidden="true"
                className="cosmic-bento-char cosmic-bento-char-left"
              />
              <div className="cosmic-bento-card">
              <div className="cosmic-bento-glow-tl" aria-hidden="true" />

              <div className="cosmic-col-6">
                <div className="cosmic-inner-window">
                  <div className="cosmic-inner-header">
                    <div className="cosmic-channel-title">
                      <span className="cosmic-channel-hash">#</span>
                      <span>complaints</span>
                    </div>
                    <span className="cosmic-chip">Anonymous Mode</span>
                  </div>

                  {/* Message 1 */}
                  <div className="cosmic-msg-card">
                    <div className="cosmic-msg-avatar cosmic-msg-avatar-primary">
                      SO
                    </div>
                    <div className="cosmic-msg-body">
                      <div className="cosmic-msg-meta">
                        <span className="cosmic-msg-author">SilentOtter8821</span>
                        <span className="cosmic-msg-time">11:42 PM</span>
                      </div>
                      <p className="cosmic-msg-text">
                        Hostel Block C Wi-Fi has been dropping every evening
                        during lab prep. Hoping this gets escalated soon!
                      </p>
                      <div className="cosmic-code-pill">
                        <Code2 size={16} />
                        <span>identity_shield_active.log</span>
                      </div>
                      <div className="cosmic-reactions">
                        <button
                          type="button"
                          className={`cosmic-reaction-btn ${
                            reactions.rocket.active ? "active" : ""
                          }`}
                          onClick={() => toggleReaction("rocket")}
                        >
                          <span>👍</span>
                          <span>{reactions.rocket.count}</span>
                        </button>
                        <button
                          type="button"
                          className={`cosmic-reaction-btn ${
                            reactions.fire.active ? "active" : ""
                          }`}
                          onClick={() => toggleReaction("fire")}
                        >
                          <span>🔥</span>
                          <span>{reactions.fire.count}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message 2 */}
                  <div className="cosmic-msg-card">
                    <div className="cosmic-msg-avatar cosmic-msg-avatar-tertiary">
                      VF
                    </div>
                    <div className="cosmic-msg-body">
                      <div className="cosmic-msg-meta">
                        <span className="cosmic-msg-author">VelvetFox3041</span>
                        <span className="cosmic-faculty-pill">Verified Alias</span>
                      </div>
                      <p className="cosmic-msg-text">
                        Agreed—glad we can raise real facility issues here
                        without worrying about backlash.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cosmic-col-6 cosmic-copy-block">
                <span className="cosmic-section-tag">
                  01 / Anonymous Channels
                </span>
                <h2 className="cosmic-section-title">
                  SPEAK FREELY WITHOUT LABELS
                </h2>
                <p className="cosmic-section-desc">
                  Ask honest academic doubts in #general, raise campus
                  grievances safely in #complaints, and share #events. Your
                  real name and roll number never appear in any public chat.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Feature Bento Section 2: Copy Left / Media Right (Character Right) */}
        <section id="privacy" className="cosmic-bento-section">
          <div className="cosmic-container">
            <div className="cosmic-bento-wrap" data-reveal="">
              <img
                src="/images/char-faculty.png"
                alt=""
                aria-hidden="true"
                className="cosmic-bento-char cosmic-bento-char-right"
              />
              <div className="cosmic-bento-card">
              <div className="cosmic-bento-glow-br" aria-hidden="true" />

              <div className="cosmic-col-5 cosmic-copy-block">
                <span className="cosmic-section-tag">
                  02 / Decoupled Identity
                </span>
                <h2 className="cosmic-section-title">
                  VERIFIED ACCESS. HIDDEN IDENTITY.
                </h2>
                <p className="cosmic-section-desc">
                  Every member signs up with their student email and roll
                  number to keep outsiders out, while public channels only show
                  your auto-generated or custom anonymous alias.
                </p>
              </div>

              <div className="cosmic-col-7">
                <div className="cosmic-inner-window">
                  <div className="cosmic-inner-header">
                    <div className="cosmic-channel-title">
                      <span className="cosmic-shield-pill">
                        <ShieldCheck size={14} />
                        DECOUPLED
                      </span>
                      <span>Identity Shield</span>
                    </div>
                    <span className="cosmic-msg-time">bcrypt + JWT</span>
                  </div>

                  <div className="cosmic-identity-grid">
                    {/* Private Server Vault */}
                    <div className="cosmic-vault-card">
                      <div className="cosmic-vault-head">
                        <Lock size={14} />
                        <span>Private Student Record</span>
                      </div>
                      <div className="cosmic-vault-rows">
                        <div className="cosmic-vault-row">
                          <span>Name</span>
                          <code>••••••••••••</code>
                        </div>
                        <div className="cosmic-vault-row">
                          <span>Roll No</span>
                          <code>24CSE••••</code>
                        </div>
                        <div className="cosmic-vault-row">
                          <span>Email</span>
                          <code>••••@college.edu</code>
                        </div>
                      </div>
                      <span className="cosmic-vault-note">
                        Encrypted on server · Never shown in chat
                      </span>
                    </div>

                    {/* Bridge Arrow */}
                    <div className="cosmic-identity-bridge" aria-hidden="true">
                      <ArrowRight size={18} />
                    </div>

                    {/* Public Alias Card */}
                    <div className="cosmic-alias-card">
                      <div className="cosmic-alias-head">
                        <span>Public Chat Persona</span>
                        <span className="cosmic-alias-live">Visible</span>
                      </div>
                      <div className="cosmic-alias-preview">
                        <div className="cosmic-alias-avatar">
                          {activeAlias.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong>{activeAlias}</strong>
                          <span>Verified Campus Member</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="cosmic-roll-btn"
                        onClick={() =>
                          setAliasIdx((i) => (i + 1) % SAMPLE_ALIASES.length)
                        }
                      >
                        <Dices size={15} />
                        <span>Roll Random Alias</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Feature Bento Section 3: Media Left / Copy Right (Character Left) */}
        <section id="drop-in" className="cosmic-bento-section-last">
          <div className="cosmic-container">
            <div className="cosmic-bento-wrap" data-reveal="">
              <img
                src="/images/char-owl.png"
                alt=""
                aria-hidden="true"
                className="cosmic-bento-char cosmic-bento-char-left-owl"
              />
              <div className="cosmic-bento-card">
              <div className="cosmic-bento-glow-bc" aria-hidden="true" />

              <div className="cosmic-col-6">
                <div className="cosmic-inner-window">
                  <div className="cosmic-dropin-grid">
                    {/* Mini Channel List */}
                    <div className="cosmic-mini-sidebar">
                      <span className="cosmic-mini-caption">
                        Campus Channels
                      </span>
                      <button
                        type="button"
                        className={`cosmic-mini-ch-btn ${
                          previewChannel === "general" ? "active" : ""
                        }`}
                        onClick={() => setPreviewChannel("general")}
                      >
                        <span>#</span>
                        <span>general</span>
                      </button>
                      <button
                        type="button"
                        className={`cosmic-mini-ch-btn ${
                          previewChannel === "complaints" ? "active" : ""
                        }`}
                        onClick={() => setPreviewChannel("complaints")}
                      >
                        <span>#</span>
                        <span>complaints</span>
                      </button>
                      <button
                        type="button"
                        className={`cosmic-mini-ch-btn ${
                          previewChannel === "events" ? "active" : ""
                        }`}
                        onClick={() => setPreviewChannel("events")}
                      >
                        <span>#</span>
                        <span>events</span>
                      </button>

                      <span
                        className="cosmic-mini-caption"
                        style={{ marginTop: "0.5rem", color: "#c7c4d8" }}
                      >
                        Your Alias
                      </span>
                      <div className="cosmic-voice-room">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <Volume2 size={15} style={{ color: "#c3c0ff" }} />
                          AmberBadger4129
                        </span>
                      </div>
                    </div>

                    {/* Mini Live Drop-in Feed */}
                    <div className="cosmic-dropin-feed">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.6rem",
                        }}
                      >
                        {DROPIN_MESSAGES[previewChannel].map((m) => (
                          <div key={m.author} className="cosmic-dropin-msg">
                            <strong style={{ color: m.accent }}>
                              {m.author}
                            </strong>
                            <p>{m.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="cosmic-dropin-input">
                        <span>Message #{previewChannel} anonymously...</span>
                        <Send size={15} style={{ color: "#c3c0ff" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cosmic-col-6 cosmic-copy-block">
                <span className="cosmic-section-tag">
                  03 / Instant Campus Connect
                </span>
                <h2 className="cosmic-section-title">
                  THREE CHANNELS. ZERO JUDGMENT.
                </h2>
                <p className="cosmic-section-desc">
                  Switch seamlessly between #general, #complaints, and #events.
                  Edit or delete your own messages anytime, or change your
                  anonymous alias whenever you want.
                </p>
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>

      {/* Cosmic Footer */}
      <footer id="footer" className="cosmic-footer">
        <div className="cosmic-container">
          <div className="cosmic-footer-grid">
            <div className="cosmic-footer-brand-col">
              <div>
                <button type="button" className="cosmic-lang-pill">
                  <Globe size={15} />
                  <span>English (US)</span>
                  <ChevronDown size={15} />
                </button>
              </div>

              <div className="cosmic-social-row">
                <a
                  href="#channels"
                  aria-label="Community Forum"
                  className="cosmic-social-btn"
                >
                  <MessageSquare size={16} />
                </a>
                <a
                  href="#privacy"
                  aria-label="Privacy Shield"
                  className="cosmic-social-btn"
                >
                  <Code2 size={16} />
                </a>
                <a
                  href="#drop-in"
                  aria-label="Campus Network"
                  className="cosmic-social-btn"
                >
                  <Network size={16} />
                </a>
                <Link
                  to={primaryCtaPath}
                  aria-label="Join CoHive"
                  className="cosmic-social-btn"
                >
                  <Share2 size={16} />
                </Link>
              </div>
            </div>

            <div className="cosmic-footer-col">
              <span className="cosmic-footer-heading">Platform</span>
              <Link to={primaryCtaPath}>Join The Hive</Link>
              <a href="#channels">Anonymous Channels</a>
              <a href="#privacy">Identity Shield</a>
            </div>

            <div className="cosmic-footer-col">
              <span className="cosmic-footer-heading">Channels</span>
              <a href="#drop-in">#general</a>
              <a href="#drop-in">#complaints</a>
              <a href="#drop-in">#events</a>
            </div>

            <div className="cosmic-footer-col">
              <span className="cosmic-footer-heading">Access</span>
              <Link to="/register">Create Alias</Link>
              <Link to="/login">Student Sign In</Link>
              <Link to="/chat">Campus Chat</Link>
            </div>

            <div className="cosmic-footer-col">
              <span className="cosmic-footer-heading">Legal</span>
              <a href="#footer">Privacy Policy</a>
              <a href="#footer">Terms of Use</a>
              <a href="#footer">Security</a>
            </div>
          </div>
        </div>

        <div className="cosmic-watermark" aria-hidden="true">
          <span>cohive</span>
        </div>
      </footer>
    </div>
  );
}
