import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
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
import {
  getPasswordChecks,
  validateAlias,
  validateEmail,
  validateGroup,
  validateName,
  validatePassword,
  validateRollNumber,
} from "../lib/validation.js";
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setFieldErrors({});
    setTouched({});
    setError("");
  }, [mode]);

  if (user) return <Navigate to="/chat" replace />;

  function validateSingleField(name, value) {
    switch (name) {
      case "name":
        return isRegister ? validateName(value) : "";
      case "rollNumber":
        return isRegister ? validateRollNumber(value) : "";
      case "group":
        return isRegister ? validateGroup(value) : "";
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value, { isRegister });
      case "anonymousName":
        return isRegister ? validateAlias(value, { required: false }) : "";
      default:
        return "";
    }
  }

  function update(e) {
    const { name, value } = e.target;
    const nextValue = name === "rollNumber" ? value.toUpperCase() : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (touched[name]) {
      const nextErr = validateSingleField(name, nextValue);
      setFieldErrors((prev) => ({ ...prev, [name]: nextErr }));
    }
    if (error) setError("");
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErr = validateSingleField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: nextErr }));
  }

  function handleRollDice() {
    const randomAlias = generateRandomAlias();
    setForm((prev) => ({ ...prev, anonymousName: randomAlias }));
    setTouched((prev) => ({ ...prev, anonymousName: true }));
    setFieldErrors((prev) => ({ ...prev, anonymousName: "" }));
  }

  function validateAll() {
    const fields = isRegister
      ? ["name", "rollNumber", "group", "email", "password", "anonymousName"]
      : ["email", "password"];

    const nextErrors = {};
    const nextTouched = {};
    let firstInvalid = null;

    for (const field of fields) {
      nextTouched[field] = true;
      const err = validateSingleField(field, form[field]);
      if (err) {
        nextErrors[field] = err;
        if (!firstInvalid) firstInvalid = field;
      }
    }

    setTouched((prev) => ({ ...prev, ...nextTouched }));
    setFieldErrors(nextErrors);

    if (firstInvalid && formRef.current) {
      const target = formRef.current.querySelector(`[name="${firstInvalid}"]`);
      target?.focus();
    }

    return !firstInvalid;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!validateAll()) return;

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

  const passwordChecks = getPasswordChecks(form.password);

  return (
    <main className="auth-container">
      {/* Left Brand Showcase Section */}
      <section className="auth-showcase">
        <Link to="/" className="auth-brand" aria-label="Back to CoHive landing page">
          <span className="brand-icon-box">
            <MessageCircle size={22} />
          </span>
          <span>CoHive</span>
        </Link>

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
          <div className="auth-top-bar">
            <Link to="/" className="auth-back-link">
              <ArrowLeft size={15} />
              <span>Back to Home</span>
            </Link>
            <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
              <Link
                to="/login"
                role="tab"
                aria-selected={!isRegister}
                className={`auth-mode-tab ${!isRegister ? "is-active" : ""}`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                role="tab"
                aria-selected={isRegister}
                className={`auth-mode-tab ${isRegister ? "is-active" : ""}`}
              >
                Create Account
              </Link>
            </div>
          </div>

          <header className="auth-form-header">
            <span className="auth-pill form-pill">
              {isRegister ? "STUDENT ENROLLMENT" : "WELCOME BACK"}
            </span>
            <h2>{isRegister ? "Create your account" : "Sign in to CoHive"}</h2>
            <p>
              {isRegister
                ? "Verify your student credentials and choose your campus alias."
                : "Enter your university credentials to jump into the discussion."}
            </p>
          </header>

          <form ref={formRef} onSubmit={submit} className="auth-form-grid" noValidate>
            {isRegister && (
              <>
                <Input
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={update}
                  onBlur={handleBlur}
                  error={fieldErrors.name}
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
                    onBlur={handleBlur}
                    error={fieldErrors.rollNumber}
                    placeholder="e.g. 24CSE102"
                    required
                    maxLength={40}
                  />

                  <Input
                    label="Class / Section"
                    name="group"
                    value={form.group}
                    onChange={update}
                    onBlur={handleBlur}
                    error={fieldErrors.group}
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
              onBlur={handleBlur}
              error={fieldErrors.email}
              placeholder="you@college.edu"
              autoComplete="email"
              required
              maxLength={254}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={update}
                onBlur={handleBlur}
                error={fieldErrors.password}
                placeholder={isRegister ? "At least 8 chars, letter & number" : "Your password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                required
                minLength={isRegister ? 8 : 1}
                maxLength={128}
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
                <ul className="password-checklist" aria-label="Password requirements">
                  {passwordChecks.map((item) => (
                    <li key={item.id} className={item.met ? "is-met" : ""}>
                      {item.met ? (
                        <CheckCircle2 size={13} aria-hidden="true" />
                      ) : (
                        <Circle size={13} aria-hidden="true" />
                      )}
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isRegister && (
              <Input
                label="Anonymous Campus Name"
                badge="Optional"
                name="anonymousName"
                value={form.anonymousName}
                onChange={update}
                onBlur={handleBlur}
                error={fieldErrors.anonymousName}
                placeholder="Leave blank to auto-generate"
                maxLength={24}
                helpText="3–24 chars (letters, numbers, _ or -). Shown publicly in chat."
                rightAction={
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={handleRollDice}
                    title="Roll a random campus alias"
                    aria-label="Roll a random campus alias"
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
              style={{ width: "100%", height: "46px", marginTop: "4px" }}
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
