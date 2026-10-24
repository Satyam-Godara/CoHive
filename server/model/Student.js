const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true, minlength: 2, maxlength: 80},
    rollNumber: {type: String, required: true, trim: true, maxlength: 40, set: (value) => value.trim().toUpperCase()},
    email: {type: String, required: true, trim: true, lowercase: true, maxlength: 254},
    passwordHash: {type: String, required: true, select: false},
    group: {type: String, required: true, trim: true, maxlength: 60},
    anonymousName: {type: String, required: true, trim: true, minlength: 3, maxlength: 24},
    anonymousNameKey: {type: String, required: true, select: false},
    role: {type: String, enum: ["student", "moderator", "admin"], default: "student"},
    isActive: {type: Boolean, default: true},
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
