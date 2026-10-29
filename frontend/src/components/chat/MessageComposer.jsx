import React, { useEffect, useRef, useState } from "react";
import { Send, ShieldCheck } from "lucide-react";

export default function MessageComposer({
  channelName,
  userAlias,
  onSend,
  disabled = false,
}) {
  const [draft, setDraft] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea height smoothly
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.min(el.scrollHeight, 140);
    el.style.height = `${Math.max(nextHeight, 40)}px`;
  }, [draft]);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    const content = draft.trim();
    if (!content || isSubmitting || disabled) return;

    setIsSubmitting(true);
    try {
      await onSend(content);
      setDraft("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "40px";
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const charCount = draft.length;
  const isNearLimit = charCount > 1800;

  return (
    <div className="composer-dock">
      <form className="composer-frame" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName} as ${userAlias || "Student"}…`}
          rows={1}
          maxLength={2000}
          className="composer-input"
          aria-label={`Type a message to #${channelName}`}
        />

        <div className="composer-controls">
          <div className="composer-meta">
            <ShieldCheck size={14} />
            <span>Real name & roll number stay private</span>
          </div>

          <div className="composer-actions-right">
            <span className={`char-counter ${isNearLimit ? "warning" : ""}`}>
              {charCount > 0 ? `${charCount}/2000` : ""}
            </span>

            <button
              type="submit"
              className="send-action-btn"
              disabled={!draft.trim() || isSubmitting || disabled}
              aria-label="Send message"
              title="Send (Enter)"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </form>

      <div className="keyboard-shortcut-hint">
        <strong>Enter</strong> to send · <strong>Shift + Enter</strong> for line break
      </div>
    </div>
  );
}
