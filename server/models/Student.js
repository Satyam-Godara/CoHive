import mongoose from "mongoose";

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

studentSchema.index({ email: 1 }, { unique: true });
studentSchema.index({ rollNumber: 1 }, { unique: true });
studentSchema.index({ anonymousNameKey: 1 }, { unique: true });

studentSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    name: this.name,
    rollNumber: this.rollNumber,
    email: this.email,
    group: this.group,
    anonymousName: this.anonymousName,
    role: this.role,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("Student", studentSchema);
