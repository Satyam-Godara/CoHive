import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "460px",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop-layer"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
        className="modal-dialog-box"
        style={{ maxWidth }}
      >
        <button
          type="button"
          className="modal-close-trigger"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {title && (
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
        )}

        {description && (
          <p id="modal-description" className="modal-desc">
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
