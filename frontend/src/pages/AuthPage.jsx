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
  ShieldCheck,
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
import "./AuthPage.css";

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
    <main className="cosmic-auth">
      {/* Subtle Cosmic Sparkles */}
      <svg
        aria-hidden="true"
        className="cosmic-auth-sparkle cosmic-auth-sparkle-1"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg
        aria-hidden="true"
        className="cosmic-auth-sparkle cosmic-auth-sparkle-2"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* Top-Left Brand Logo */}
      <Link to="/" className="cosmic-auth-brand" aria-label="Back to CoHive landing page">
        <img src="/images/cohive-badge.png" alt="CoHive Hexagon Badge" />
        <span>CoHive</span>
      </Link>

      {/* Centered Card */}
      <section className={`cosmic-auth-card ${isRegister ? "is-register" : ""}`}>
        {/* Left: Login / Signup Form */}
        <div className="cosmic-auth-form-col">
          <Link to="/" className="cosmic-auth-back">
            <ArrowLeft size={14} />
            <span>Go back</span>
          </Link>

          <header className="cosmic-auth-header">
            <h2>{isRegister ? "Create an account" : "Welcome back!"}</h2>
            <p>
              {isRegister
                ? "Verify your student status and pick your anonymous alias."
                : "We're so excited to see you again!"}
            </p>
          </header>

          <form ref={formRef} onSubmit={submit} className="auth-form-grid" noValidate>
            {isRegister && (
              <>
                <div className="field-row-split">
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
                  />

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
                </div>

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

            {!isRegister && (
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
            )}

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
              style={{ width: "100%", height: "44px", marginTop: "4px" }}
            >
              {isRegister ? "Create Account" : "Log In"}
            </Button>
          </form>

          <p className="cosmic-auth-switch">
            {isRegister ? "Already have an account?" : "Need an account?"}
            <Link to={isRegister ? "/login" : "/register"}>
              {isRegister ? "Log In" : "Register"}
            </Link>
          </p>
        </div>

        {/* Right: CoHive Anonymous Identity Companion */}
        <aside className="cosmic-auth-side" aria-label="Privacy overview">
          <div className="cosmic-auth-owl-wrap">
            <img src="/images/char-owl.png" alt="CoHive Scholar Owl" />
          </div>

          <h3>Anonymous Campus Connect</h3>
          <p>
            {isRegister
              ? "Your real name and roll number verify your campus access—public channels only see your alias."
              : "Jump back into #general, #complaints, and #events under your private student alias."}
          </p>

          {isRegister && form.anonymousName.trim() ? (
            <div className="cosmic-auth-alias-preview">
              <ShieldCheck size={14} />
              <span>Alias: {form.anonymousName.trim()}</span>
            </div>
          ) : (
            <div className="cosmic-auth-privacy-badge">
              <Lock size={14} />
              <span>Real identity stays private</span>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
