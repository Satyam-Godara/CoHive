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

  // Auto-resize textarea height smoothly and only show scrollbar past max height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const maxH = 160;
    const nextHeight = Math.min(el.scrollHeight, maxH);
    el.style.height = `${Math.max(nextHeight, 26)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
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
        textareaRef.current.style.height = "26px";
        textareaRef.current.style.overflowY = "hidden";
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
      {error && (
        <div id="composer-error" className="composer-inline-error" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form
        className={`composer-frame ${error ? "has-error" : ""}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <span
          className="composer-privacy-icon"
          title="Real name & roll number stay private"
          aria-hidden="true"
        >
          <ShieldCheck size={17} />
        </span>

        <textarea
          ref={textareaRef}
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName} as ${userAlias || "Student"}`}
          rows={1}
          maxLength={MAX_MESSAGE_LENGTH}
          className="composer-input"
          aria-label={`Type a message to #${channelName}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "composer-error" : undefined}
        />

        {(isNearLimit || isOverLimit) && (
          <span
            className={`char-counter ${isNearLimit ? "warning" : ""} ${
              isOverLimit ? "danger" : ""
            }`}
          >
            {charCount}/{MAX_MESSAGE_LENGTH}
          </span>
        )}

        <button
          type="submit"
          className="send-action-btn"
          disabled={!draft.trim() || isOverLimit || isSubmitting || disabled}
          aria-label="Send message"
          title="Send (Enter)"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
