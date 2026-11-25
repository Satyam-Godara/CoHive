import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Send, ShieldCheck } from "lucide-react";
import { MAX_MESSAGE_LENGTH, validateMessage } from "../../lib/validation.js";

export default function MessageComposer({
  channelName,
  userAlias,
  onSend,
  disabled = false,
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
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

  function handleChange(e) {
    const nextVal = e.target.value;
    setDraft(nextVal);
    if (error) {
      setError(nextVal.length > MAX_MESSAGE_LENGTH ? validateMessage(nextVal) : "");
    }
  }

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    if (isSubmitting || disabled) return;

    const validationError = validateMessage(draft);
    if (validationError) {
      setError(validationError);
      textareaRef.current?.focus();
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onSend(draft.trim());
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
  const isNearLimit = charCount > 1800 && charCount <= MAX_MESSAGE_LENGTH;
  const isOverLimit = charCount > MAX_MESSAGE_LENGTH;

  return (
    <div className="composer-dock">
      <form
        className={`composer-frame ${error ? "has-error" : ""}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName} as ${userAlias || "Student"}…`}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          className="composer-input"
          aria-label={`Type a message to #${channelName}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "composer-error" : undefined}
        />

        <div className="composer-controls">
          <div className="composer-meta">
            {error ? (
              <span id="composer-error" className="field-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{error}</span>
              </span>
            ) : (
              <>
                <ShieldCheck size={14} />
                <span>Real name & roll number stay private</span>
              </>
            )}
          </div>

          <div className="composer-actions-right">
            <span
              className={`char-counter ${isNearLimit ? "warning" : ""} ${
                isOverLimit ? "danger" : ""
              }`}
            >
              {charCount > 0 ? `${charCount}/${MAX_MESSAGE_LENGTH}` : ""}
            </span>

            <button
              type="submit"
              className="send-action-btn"
              disabled={!draft.trim() || isOverLimit || isSubmitting || disabled}
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
