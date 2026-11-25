const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALIAS_REGEX = /^[A-Za-z0-9_-]{3,24}$/;
const ROLL_REGEX = /^[A-Za-z0-9/_-]{2,40}$/;

export const MAX_MESSAGE_LENGTH = 2000;

export function validateEmail(value) {
  const clean = (value || "").trim();
  if (!clean) return "Student email is required.";
  if (clean.length > 254) return "Email must be 254 characters or fewer.";
  if (!EMAIL_REGEX.test(clean)) {
    return "Enter a valid email address (e.g. you@college.edu).";
  }
  return "";
}

export function validatePassword(value, { isRegister = false } = {}) {
  const raw = value || "";
  if (!raw) return "Password is required.";
  if (!isRegister) return "";

  if (raw.length < 8) return "Password must be at least 8 characters.";
  if (raw.length > 128) return "Password must be 128 characters or fewer.";
  if (!/[A-Za-z]/.test(raw) || !/\d/.test(raw)) {
    return "Password must include at least one letter and one number.";
  }
  return "";
}

export function getPasswordChecks(value = "") {
  return [
    { id: "length", label: "At least 8 characters", met: value.length >= 8 },
    { id: "letter", label: "Contains a letter", met: /[A-Za-z]/.test(value) },
    { id: "number", label: "Contains a number", met: /\d/.test(value) },
  ];
}

export function validateName(value) {
  const clean = (value || "").trim();
  if (!clean) return "Full name is required.";
  if (clean.length < 2) return "Full name must be at least 2 characters.";
  if (clean.length > 80) return "Full name must be 80 characters or fewer.";
  return "";
}

export function validateRollNumber(value) {
  const clean = (value || "").trim();
  if (!clean) return "Roll number is required.";
  if (clean.length < 2 || clean.length > 40) {
    return "Roll number must be 2–40 characters.";
  }
  if (!ROLL_REGEX.test(clean)) {
    return "Use only letters, numbers, hyphens, underscores, or slashes.";
  }
  return "";
}

export function validateGroup(value) {
  const clean = (value || "").trim();
  if (!clean) return "Class / section is required.";
  if (clean.length < 2) return "Class / section must be at least 2 characters.";
  if (clean.length > 60) return "Class / section must be 60 characters or fewer.";
  return "";
}

export function validateAlias(value, { required = false } = {}) {
  const clean = (value || "").trim();
  if (!clean) {
    return required ? "Anonymous handle cannot be blank." : "";
  }
  if (!ALIAS_REGEX.test(clean)) {
    return "Use 3–24 characters: letters, numbers, underscores, or hyphens.";
  }
  return "";
}

export function validateMessage(value) {
  const clean = (value || "").trim();
  if (!clean) return "Message cannot be empty.";
  if (clean.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`;
  }
  return "";
}
