import React,{ useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { readableError } from "../lib/api.js";

const initialForm = {
  name: "", rollNumber: "", email: "", password: "", group: "", anonymousName: "",
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

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isRegister) {
        await register({
          name: form.name.trim(),
          rollNumber: form.rollNumber.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          group: form.group.trim(),
          anonymousName: form.anonymousName.trim() || undefined,
        });
      } else {
        await login({ email: form.email.trim().toLowerCase(), password: form.password });
      }
      navigate("/chat");
    } catch (err) {
      setError(readableError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <div className="brand brand-light"><span className="brand-mark"><MessageCircle size={21} /></span> CoHive</div>
        <div className="story-copy">
          <span className="eyebrow"><Sparkles size={14} /> YOUR CAMPUS, YOUR VOICE</span>
          <h1>Good conversations.<br /><span>No labels required.</span></h1>
          <p>A space to ask, share, vent, and find your people — with an identity you choose.</p>
          <div className="story-points">
            <div><ShieldCheck size={18} /><span>Talk under your anonymous name</span></div>
            <div><MessageCircle size={18} /><span>Join campus-wide conversations</span></div>
          </div>
        </div>
        <div className="story-footer">Built for students, by students.</div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-brand brand"><span className="brand-mark"><MessageCircle size={20} /></span> CoHive</div>
          <div className="auth-heading">
            <span className="eyebrow">{isRegister ? "JOIN THE COMMUNITY" : "WELCOME BACK"}</span>
            <h2>{isRegister ? "Create your account" : "Pick up where you left off"}</h2>
            <p>{isRegister ? "Set up your student account and choose your campus identity." : "Sign in to join the conversation."}</p>
          </div>

          <form onSubmit={submit} className="auth-form">
            {isRegister && <>
              <label>Full name<input name="name" value={form.name} onChange={update} placeholder="Your real name" autoComplete="name" required minLength={2} maxLength={80} /></label>
              <div className="field-row">
                <label>Roll number<input name="rollNumber" value={form.rollNumber} onChange={update} placeholder="e.g. 24CSE102" required maxLength={40} /></label>
                <label>Class / group<input name="group" value={form.group} onChange={update} placeholder="e.g. CSE-A" required maxLength={60} /></label>
              </div>
            </>}
            <label>Student email<input type="email" name="email" value={form.email} onChange={update} placeholder="you@college.edu" autoComplete="email" required maxLength={254} /></label>
            <label>Password
              <span className="password-wrap">
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={update} placeholder={isRegister ? "At least 8 characters" : "Your password"} autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 8 : 1} />
                <button className="password-toggle" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </span>
            </label>
            {isRegister && <label>Anonymous name <span className="optional">OPTIONAL</span>
              <input name="anonymousName" value={form.anonymousName} onChange={update} placeholder="Leave blank to generate one" maxLength={24} />
              <span className="field-hint">This is the name other students will see. You can change it later if available.</span>
            </label>}
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="primary-button" type="submit" disabled={busy}>{busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <ArrowRight size={17} /></button>
          </form>

          <p className="auth-switch">{isRegister ? "Already part of CoHive?" : "New to CoHive?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
          <p className="privacy-note"><ShieldCheck size={15} /> Your real name and roll number aren't shown in public chat.</p>
        </div>
      </section>
    </main>
  );
}
