
import mongoose from "mongoose";
import Message, { CHANNELS } from "../models/Message.js";

const MAX_MESSAGE_LENGTH = 2000;

// CREATE: POST /api/messages
export async function sendMessage(req, res) {
  try {
    const student = req.student;
    const { channel, content } = req.body || {};

    if (!student) {
      return res.status(401).json({
        message: "Please sign in to continue.",
      });
    }

    if (!CHANNELS.includes(channel)) {
      return res.status(400).json({
        message: "Unknown chat channel.",
      });
    }

    const cleanContent =
      typeof content === "string" ? content.trim() : "";

    if (
      !cleanContent ||
      cleanContent.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        message: "Message must contain 1–2000 characters.",
      });
    }

    const message = await Message.create({
      author: student._id,
      anonymousName: student.anonymousName,
      channel,
      content: cleanContent,
    });

    return res.status(201).json({
      message: message.toClientJSON(),
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      message: "Couldn't send the message.",
    });
  }
}

// READ: GET /api/messages?channel=general&limit=100
export async function listMessages(req, res) {
  try {
    const channel =
      typeof req.query.channel === "string"
        ? req.query.channel
        : "general";

    if (!CHANNELS.includes(channel)) {
      return res.status(400).json({
        message: "Unknown chat channel.",
      });
    }

    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 100;

    const messages = await Message.find({ channel })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    return res.json({
      messages: messages.reverse().map((message) => ({
        _id: String(message._id),
        authorId: String(message.author),
        anonymousName: message.anonymousName,
        channel: message.channel,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      })),
    });
  } catch (error) {
    console.error("List messages error:", error);

    return res.status(500).json({
      message: "Couldn't load messages.",
    });
  }
}

// UPDATE: PATCH /api/messages/:id
export async function editMessage(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid message ID.",
      });
    }

    const cleanContent =
      typeof content === "string" ? content.trim() : "";

    if (
      !cleanContent ||
      cleanContent.length > MAX_MESSAGE_LENGTH
    ) {
      return res.status(400).json({
        message: "Message must contain 1–2000 characters.",
      });
    }

    const message = await Message.findOneAndUpdate(
      {
        _id: id,
        author: req.student._id,
      },
      {
        $set: { content: cleanContent },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!message) {
      const exists = await Message.exists({ _id: id });

      return res.status(exists ? 403 : 404).json({
        message: exists
          ? "You can only edit your own messages."
          : "Message not found.",
      });
    }

    return res.json({
      message: message.toClientJSON(),
    });
  } catch (error) {
    console.error("Edit message error:", error);

    return res.status(500).json({
      message: "Couldn't edit the message.",
    });
  }
}

// DELETE: DELETE /api/messages/:id
export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid message ID.",
      });
    }

    const message = await Message.findOneAndDelete({
      _id: id,
      author: req.student._id,
    });

    if (!message) {
      const exists = await Message.exists({ _id: id });

      return res.status(exists ? 403 : 404).json({
        message: exists
          ? "You can only delete your own messages."
          : "Message not found.",
      });
    }

    return res.json({
      message: "Message deleted successfully.",
      messageId: String(message._id),
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      message: "Couldn't delete the message.",
    });
  }
}
