import React, { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";
import { formatTime } from "../../lib/utils.js";

export default function MessageItem({
  message,
  isOwn,
  isLeadInGroup,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onRequestDelete,
}) {
  const [editText, setEditText] = useState(message.content);
  const [isSaving, setIsSaving] = useState(false);

  const authorName =
    message.anonymousName ||
    message.author?.anonymousName ||
    "Anonymous Student";

  const isEdited =
    message.updatedAt &&
    new Date(message.updatedAt).getTime() > new Date(message.createdAt).getTime() + 1000;

  async function handleSave() {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === message.content) {
      onCancelEdit();
      return;
    }
    setIsSaving(true);
    try {
      await onSaveEdit(message._id, trimmed);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <article
      className={`message-group ${isOwn ? "is-own" : ""}`}
      tabIndex={0}
      aria-label={`Message from ${authorName}`}
    >
      {isLeadInGroup ? (
        <Avatar name={authorName} size={38} />
      ) : (
        <div style={{ width: "38px", flexShrink: 0 }} aria-hidden="true" />
      )}

      <div className="group-content">
        {isLeadInGroup && (
          <header className="group-header">
            <span className="author-name">{authorName}</span>
            {isOwn && <span className="tag-you">YOU</span>}
            <time className="timestamp" dateTime={message.createdAt}>
              {formatTime(message.createdAt)}
            </time>
            {isEdited && <span className="edited-flag">(edited)</span>}
          </header>
        )}

        {isEditing ? (
          <div className="edit-editor-box">
            <textarea
              className="edit-textarea"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={2000}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onCancelEdit();
                } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
            <div className="edit-button-row">
              <Button
                variant="ghost"
                onClick={onCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                loading={isSaving}
                icon={Check}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="message-bubble">
            <p className="message-text">{message.content}</p>

            {isOwn && (
              <div className="message-actions-bar" role="toolbar" aria-label="Message options">
                <button
                  type="button"
                  className="action-bar-btn"
                  onClick={() => {
                    setEditText(message.content);
                    onStartEdit(message._id);
                  }}
                  title="Edit message"
                  aria-label="Edit message"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="action-bar-btn danger"
                  onClick={() => onRequestDelete(message)}
                  title="Delete message"
                  aria-label="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
