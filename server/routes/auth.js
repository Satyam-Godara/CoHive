import { Router } from "express";
import { login, register } from "../controllers/auth.js";
import { requireAuth } from "../middleware/auth.js";
import Student from "../models/Student.js";
import { isValidAlias, normalizeAlias } from "../utils/alias.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.student.toPublicJSON() });
});

async function handleAliasUpdate(req, res) {
  try {
    const { anonymousName } = req.body || {};
    if (!anonymousName || typeof anonymousName !== "string" || !isValidAlias(anonymousName.trim())) {
      return res.status(400).json({
        message: "Anonymous name must be 3–24 characters: letters, numbers, underscores, or hyphens.",
      });
    }

    const cleanAlias = anonymousName.trim();
    const aliasKey = normalizeAlias(cleanAlias);

    const existing = await Student.findOne({
      anonymousNameKey: aliasKey,
      _id: { $ne: req.student._id },
    }).lean();

    if (existing) {
      return res.status(409).json({
        message: "That anonymous name is already taken. Please choose another.",
      });
    }

    req.student.anonymousName = cleanAlias;
    req.student.anonymousNameKey = aliasKey;
    await req.student.save();

    return res.json({ user: req.student.toPublicJSON() });
  } catch (error) {
    console.error("Update alias error:", error);
    return res.status(500).json({ message: "Couldn't update anonymous name." });
  }
}

router.patch("/alias", requireAuth, handleAliasUpdate);
router.patch("/me/alias", requireAuth, handleAliasUpdate);

export default router;

