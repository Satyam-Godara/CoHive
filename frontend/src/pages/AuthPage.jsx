import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Dices,
  Eye,
  EyeOff,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { readableError } from "../lib/api.js";
import { generateRandomAlias } from "../lib/utils.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const initialForm = {
  name: "",
  rollNumber: "",
  email: "",
  password: "",
  group: "",
  anonymousName: "",
};

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/chat" replace />;

  function update(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "rollNumber" ? value.toUpperCase() : value,
    }));
  }

  function handleRollDice() {
    const randomAlias = generateRandomAlias();
    setForm((prev) => ({ ...prev, anonymousName: randomAlias }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (isRegister) {
        await register({
          name: form.name.trim(),
          rollNumber: form.rollNumber.trim().toUpperCase(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          group: form.group.trim(),
          anonymousName: form.anonymousName.trim() || undefined,
        });
      } else {
        await login({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
      }
      navigate("/chat");
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-container">
      {/* Left Brand Showcase Section */}
      <section className="auth-showcase">
        <div className="auth-brand">
          <span className="brand-icon-box">
            <MessageCircle size={22} />
          </span>
          <span>CoHive</span>
        </div>

        <div className="auth-showcase-content">
          <div className="auth-pill">
            <Sparkles size={14} />
            <span>CAMPUS EXPRESSION · VERIFIED PRIVACY</span>
          </div>

          <h1 className="auth-headline">
            Real campus talk.<br />
            <span>Zero social anxiety.</span>
          </h1>

          <p className="auth-subhead">
            The authenticated space to ask questions, report campus grievances,
            and discover events with a protected anonymous student alias.
          </p>

          <div className="feature-cards">
            <div className="feature-card">
              <ShieldCheck size={20} />
              <div>
                <strong>Verified Student Privacy</strong>
                <p>Only verified students enter. Your real name and roll number never appear in chat.</p>
              </div>
            </div>

            <div className="feature-card">
              <Users size={20} />
              <div>
                <strong>Three Focused Channels</strong>
                <p>Casual discussions in #general, facility issues in #complaints, and hackathons in #events.</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="auth-showcase-footer">
          CoHive · Built for university students by students.
        </footer>
      </section>

      {/* Right Form Section */}
      <section className="auth-panel">
        <div className="auth-form-card">
          <header className="auth-form-header">
            <span className="auth-pill" style={{ display: "inline-flex", marginBottom: "12px" }}>
              {isRegister ? "STUDENT ENROLLMENT" : "WELCOME BACK"}
            </span>
            <h2>{isRegister ? "Create your account" : "Sign in to CoHive"}</h2>
            <p>
              {isRegister
                ? "Verify your student credentials and choose your campus alias."
                : "Enter your university credentials to jump into the discussion."}
            </p>
          </header>

          <form onSubmit={submit} className="auth-form-grid" noValidate={false}>
            {isRegister && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="e.g. Alex Sharma"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  helpText="Used solely for institutional verification."
                />

                <div className="field-row-split">
                  <Input
                    label="Roll Number"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={update}
                    placeholder="e.g. 24CSE102"
                    required
                    maxLength={40}
                  />

                  <Input
                    label="Class / Section"
                    name="group"
                    value={form.group}
                    onChange={update}
                    placeholder="e.g. CSE-A"
                    required
                    maxLength={60}
                  />
                </div>
              </>
            )}

            <Input
              label="Student Email"
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@college.edu"
              autoComplete="email"
              required
              maxLength={254}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={update}
              placeholder={isRegister ? "At least 8 characters" : "Your password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={isRegister ? 8 : 1}
              helpText={isRegister ? "Must contain at least 8 characters." : undefined}
              rightAction={
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {isRegister && (
              <Input
                label="Anonymous Campus Name"
                badge="Optional"
                name="anonymousName"
                value={form.anonymousName}
                onChange={update}
                placeholder="Leave blank to auto-generate"
                maxLength={24}
                helpText="This is what other students will see. You can change it anytime."
                rightAction={
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={handleRollDice}
                    title="Roll a random campus alias"
                  >
                    <Dices size={18} />
                  </button>
                }
              />
            )}

            {error && (
              <div className="alert-banner error" role="alert">
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={busy}
              icon={ArrowRight}
              style={{ width: "100%", height: "46px", marginTop: "6px" }}
            >
              {isRegister ? "Create Student Account" : "Sign in to Campus"}
            </Button>
          </form>

          <p className="auth-footer-switch">
            {isRegister ? "Already registered?" : "New to CoHive?"}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Sign in instead" : "Create an account"}
            </Link>
          </p>

          <div className="privacy-disclaimer">
            <Lock size={14} />
            <span>Encrypted with college student privacy protection</span>
          </div>
        </div>
      </section>
    </main>
  );
}
