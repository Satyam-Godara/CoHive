import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Please sign in to continue." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.sub) {
      return res.status(401).json({ message: "Invalid session. Please sign in again." });
    }

    const student = await Student.findById(payload.sub);
    if (!student || !student.isActive) {
      return res.status(401).json({ message: "This account is unavailable. Please sign in again." });
    }

    req.student = student;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Your session has expired. Please sign in again." });
    }
    next(error);
  }
}
