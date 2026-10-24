import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import { makeAlias, normalizeAlias, isValidAlias } from "../utils/alias.js";

function signToken(student) {
  return jwt.sign(
    { sub: String(student._id), role: student.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d", issuer: "cohive" }
  );
}

function sendAuthResponse(res, student, status = 200) {
  res.status(status).json({
    token: signToken(student),
    user: student.toPublicJSON(),
  });
}

export async function register(req, res) {
  const { name, rollNumber, email, password, group, anonymousName } = req.body || {};

  if (![name, rollNumber, email, password, group].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Name, roll number, email, password, and class/group are required." });
  }
  if (name.trim().length < 2 || name.trim().length > 80) {
    return res.status(400).json({ message: "Name must be between 2 and 80 characters." });
  }
  if (rollNumber.trim().length > 40 || group.trim().length > 60) {
    return res.status(400).json({ message: "Roll number or class/group is too long." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }
  if (password.length < 8 || password.length > 128) {
    return res.status(400).json({ message: "Password must be between 8 and 128 characters." });
  }
  if (anonymousName !== undefined && anonymousName !== null && anonymousName !== "") {
    if (typeof anonymousName !== "string" || !isValidAlias(anonymousName.trim())) {
      return res.status(400).json({ message: "Anonymous name must be 3–24 characters: letters, numbers, underscores, or hyphens." });
    }
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanRoll = rollNumber.trim().toUpperCase();

  const existing = await Student.findOne({
    $or: [{ email: cleanEmail }, { rollNumber: cleanRoll }],
  }).lean();

  if (existing) {
    return res.status(409).json({
      message: existing.email === cleanEmail
        ? "An account with this email already exists."
        : "This roll number is already registered.",
    });
  }

  const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12);
  const requestedAlias = typeof anonymousName === "string" && anonymousName.trim()
    ? anonymousName.trim()
    : null;

  // A unique index is the final authority; retry generated aliases on collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const alias = requestedAlias || makeAlias();
    const aliasKey = normalizeAlias(alias);

    try {
      const student = await Student.create({
        name: name.trim(),
        rollNumber: cleanRoll,
        email: cleanEmail,
        passwordHash,
        group: group.trim(),
        anonymousName: alias,
        anonymousNameKey: aliasKey,
      });
      return sendAuthResponse(res, student, 201);
    } catch (error) {
      if (error?.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        if (field === "anonymousNameKey" && !requestedAlias) continue;
        if (field === "anonymousNameKey") {
          return res.status(409).json({ message: "That anonymous name is already taken. Please choose another." });
        }
      }
      throw error;
    }
  }

  return res.status(500).json({ message: "Couldn't generate an available anonymous name. Please try again." });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const student = await Student.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!student || !student.isActive || !(await bcrypt.compare(password, student.passwordHash))) {
    return res.status(401).json({ message: "Incorrect email or password." });
  }

  return sendAuthResponse(res, student);
}
