import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Lock,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const CHANNEL_CARDS = [
  {
    id: "general",
    name: "#general",
    title: "Campus Talk & Q&A",
    description:
      "Ask about classes, faculty, hostels, or placements openly without social pressure.",
    icon: MessageCircle,
  },
  {
    id: "complaints",
    name: "#complaints",
    title: "Grievances & Feedback",
    description:
      "Report facility, Wi-Fi, mess, or admin issues constructively with your identity protected.",
    icon: ShieldAlert,
  },
  {
    id: "events",
    name: "#events",
    title: "Clubs & Hackathons",
    description:
      "Discover workshops, fests, competitions, and student meetups across campus.",
    icon: CalendarDays,
  },
];

const FLOW_STEPS = [
  {
    step: "01",
    title: "Verify Student Status",
    description:
      "Sign up with your student email, roll number, and class section. Only verified students get access.",
    icon: UserCheck,
  },
  {
    step: "02",
    title: "Choose a Campus Alias",
    description:
      "Pick or roll a random anonymous handle. Your real name and roll number never appear in any chat.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Join the Conversation",
    description:
      "Switch between #general, #complaints, and #events, edit or delete your messages anytime.",
    icon: Users,
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Navigation */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link to="/" className="landing-brand" aria-label="CoHive Home">
            <span className="brand-icon-box">
              <MessageCircle size={20} />
            </span>
            <span>CoHive</span>
          </Link>

          <nav className="landing-nav" aria-label="Primary navigation">
            <a href="#channels" className="landing-nav-link">
              Channels
            </a>
            <a href="#how-it-works" className="landing-nav-link">
              How It Works
            </a>
            <a href="#privacy" className="landing-nav-link">
              Privacy
            </a>
          </nav>

          <div className="landing-header-actions">
            {user ? (
              <Link to="/chat" className="btn btn-primary">
                Open Campus Chat <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-grid">
            <div className="landing-hero-copy">
              <div className="landing-badge">
                <ShieldCheck size={15} />
                <span>VERIFIED STUDENTS · ANONYMOUS VOICE</span>
              </div>

              <h1 className="landing-title">
                Honest campus talk.
                <span> Zero social anxiety.</span>
              </h1>

              <p className="landing-subtitle">
                CoHive is the verified student community where you can ask
                questions, raise campus grievances, and share events behind a
                protected anonymous handle.
              </p>

              <div className="landing-cta-row">
                {user ? (
                  <Link to="/chat" className="btn btn-primary btn-lg">
                    Enter Campus Chat <ArrowRight size={18} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      Create Student Account <ArrowRight size={18} />
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                      Sign In to Campus
                    </Link>
                  </>
                )}
              </div>

              <div className="landing-trust-row">
                <span>
                  <CheckCircle2 size={16} /> Student-only verification
                </span>
                <span>
                  <CheckCircle2 size={16} /> Real name never shown
                </span>
                <span>
                  <CheckCircle2 size={16} /> Edit & delete anytime
                </span>
              </div>
            </div>

            {/* Structured Preview Box */}
            <aside
              className="landing-preview-box"
              aria-label="Campus chat preview"
            >
              <div className="preview-box-header">
                <div className="preview-channel-title">
                  <span className="preview-hash">#</span>
                  <div>
                    <strong>general</strong>
                    <small>Campus Workspace · Live</small>
                  </div>
                </div>
                <span className="preview-live-pill">
                  <span className="dot" /> Anonymous Mode
                </span>
              </div>

              <div className="preview-messages">
                <div className="preview-msg-card">
                  <div className="preview-msg-meta">
                    <span className="preview-avatar violet">B</span>
                    <strong>BraveComet1024</strong>
                    <span>10:14 AM</span>
                  </div>
                  <p>
                    Anyone know if the central library stays open past 10 PM
                    during mid-sem exams?
                  </p>
                </div>

                <div className="preview-msg-card is-highlight">
                  <div className="preview-msg-meta">
                    <span className="preview-avatar teal">N</span>
                    <strong>NeonFalcon4821</strong>
                    <span className="tag-you">VERIFIED</span>
                    <span>10:16 AM</span>
                  </div>
                  <p>
                    Yes! Reading room B stays open until midnight starting this
                    Monday.
                  </p>
                </div>

                <div className="preview-msg-card">
                  <div className="preview-msg-meta">
                    <span className="preview-avatar amber">C</span>
                    <strong>CalmOwl7310</strong>
                    <span>10:18 AM</span>
                  </div>
                  <p>
                    Also check #events — the AI club hackathon registration
                    closes tonight!
                  </p>
                </div>
              </div>

              <div className="preview-box-footer">
                <Lock size={14} />
                <span>Real names & roll numbers are hidden from all members</span>
              </div>
            </aside>
          </div>
        </section>

        {/* Channels Section */}
        <section id="channels" className="landing-section">
          <div className="landing-section-inner">
            <div className="landing-section-head">
              <span className="section-eyebrow">THREE FOCUSED CHANNELS</span>
              <h2>Everything campus, neatly organized</h2>
              <p>
                Jump straight into the channel you need—no clutter, no noise.
              </p>
            </div>

            <div className="landing-cards-grid">
              {CHANNEL_CARDS.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.id} className="landing-box-card">
                    <div className="landing-card-top">
                      <span className="landing-card-icon">
                        <Icon size={22} />
                      </span>
                      <span className="landing-channel-tag">{item.name}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="landing-section landing-section-alt">
          <div className="landing-section-inner">
            <div className="landing-section-head">
              <span className="section-eyebrow">SIMPLE 3-STEP FLOW</span>
              <h2>From sign-up to chatting in under a minute</h2>
              <p>
                Clear steps, instant alias generation, and full control over your
                messages.
              </p>
            </div>

            <div className="landing-cards-grid">
              {FLOW_STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.step} className="landing-box-card">
                    <div className="landing-card-top">
                      <span className="landing-step-num">{item.step}</span>
                      <span className="landing-card-icon subtle">
                        <Icon size={20} />
                      </span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Privacy Callout Box */}
        <section id="privacy" className="landing-section">
          <div className="landing-section-inner">
            <div className="landing-privacy-banner">
              <div className="landing-privacy-copy">
                <div className="landing-badge dark">
                  <Lock size={14} />
                  <span>PRIVACY FIRST ARCHITECTURE</span>
                </div>
                <h2>Verified inside. Anonymous outside.</h2>
                <p>
                  Your institutional credentials verify that you belong to the
                  campus—so spam stays out. Every message you send displays only
                  your chosen anonymous alias, which you can reroll anytime in
                  Profile Settings.
                </p>
              </div>
              <div className="landing-privacy-actions">
                <Link
                  to={user ? "/chat" : "/register"}
                  className="btn btn-primary btn-lg"
                >
                  {user ? "Go to Campus Chat" : "Join CoHive Now"}{" "}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-brand">
            <span className="brand-icon-box" style={{ width: "30px", height: "30px" }}>
              <MessageCircle size={16} />
            </span>
            <span>CoHive</span>
          </div>
          <p>Built for university students · Verified & Anonymous Campus Community</p>
        </div>
      </footer>
    </div>
  );
}
