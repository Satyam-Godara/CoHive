import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";

export default function DeleteModal({
  isOpen,
  message,
  onClose,
  onConfirm,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!message) return null;

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm(message._id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="420px">
      <div className="danger-icon-badge">
        <AlertTriangle size={24} />
      </div>

      <h2 className="modal-title">Delete this message?</h2>
      <p className="modal-desc">
        This action cannot be undone. The message will be permanently removed
        from the campus channel.
      </p>

      {message.content && (
        <div
          style={{
            padding: "10px 14px",
            background: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
            fontSize: "13px",
            color: "var(--ink-secondary)",
            marginBottom: "20px",
            maxHeight: "80px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
          }}
        >
          "{message.content}"
        </div>
      )}

      <div className="modal-actions-footer">
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Keep message
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          loading={isDeleting}
          icon={Trash2}
        >
          Delete forever
        </Button>
      </div>
    </Modal>
  );
}
