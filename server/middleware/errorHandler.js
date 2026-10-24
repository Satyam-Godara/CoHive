export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0];
    const messages = {
      email: "An account with this email already exists.",
      rollNumber: "This roll number is already registered.",
      anonymousNameKey: "That anonymous name is already taken.",
    };
    return res.status(409).json({ message: messages[field] || "A record with these details already exists." });
  }

  if (error?.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0];
    return res.status(400).json({ message: firstError?.message || "Please check the submitted details." });
  }

  console.error(error);
  res.status(error.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Something went wrong. Please try again."
      : error.message || "Internal server error.",
  });
}
