import mongoose from "mongoose";

export const CHANNELS = ["general", "complaints", "events"];

const messageSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    anonymousName: {
      type: String,
      required: true,
      maxlength: 24,
    },
    channel: {
      type: String,
      required: true,
      enum: CHANNELS,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

messageSchema.index({ channel: 1, createdAt: -1 });

messageSchema.methods.toClientJSON = function toClientJSON() {
  return {
    _id: this._id,
    authorId: this.author?._id ? String(this.author._id) : String(this.author),
    anonymousName: this.anonymousName,
    channel: this.channel,
    content: this.content,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model("Message", messageSchema);
