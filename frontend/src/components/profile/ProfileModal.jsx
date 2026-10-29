import React, { useState } from "react";
import { Check, Dices, Lock, ShieldCheck, Sparkles } from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Avatar from "../ui/Avatar.jsx";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import api, { readableError } from "../../lib/api.js";
import { generateRandomAlias } from "../../lib/utils.js";

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) {
  const [alias, setAlias] = useState(user?.anonymousName || "");
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [isSaving, setIsSaving] = useState(false);

  function handleRollDice() {
    const freshAlias = generateRandomAlias();
    setAlias(freshAlias);
    setStatusMessage({ text: "Generated a new random handle. Click Save to keep it.", type: "info" });
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    const cleanAlias = alias.trim();
    if (!cleanAlias) {
      setStatusMessage({ text: "Anonymous name cannot be blank.", type: "error" });
      return;
    }
    if (cleanAlias.length < 3 || cleanAlias.length > 24) {
      setStatusMessage({ text: "Anonymous name must be 3–24 characters.", type: "error" });
      return;
    }

    setIsSaving(true);
    setStatusMessage({ text: "", type: "" });

    try {
      // First try /students/me/alias, then fallback to /auth/alias if needed
      let res;
      try {
        res = await api.patch("/students/me/alias", { anonymousName: cleanAlias });
      } catch (err) {
        if (err?.response?.status === 404) {
          res = await api.patch("/auth/alias", { anonymousName: cleanAlias });
        } else {
          throw err;
        }
      }

      if (res?.data?.user) {
        onUpdateUser(res.data.user);
        setStatusMessage({ text: "Your anonymous handle was updated successfully!", type: "success" });
      }
    } catch (err) {
      setStatusMessage({ text: readableError(err), type: "error" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <Avatar name={alias || user?.anonymousName || "V"} size={54} />
        <div>
          <span className="auth-pill" style={{ marginBottom: "6px", display: "inline-flex" }}>
            <ShieldCheck size={12} /> Campus Identity
          </span>
          <h2 className="modal-title" style={{ fontSize: "20px", margin: 0 }}>
            Student Identity & Settings
          </h2>
        </div>
      </div>

      <form onSubmit={handleSave} className="auth-form-grid">
        <Input
          label="Your Public Campus Alias"
          helpText="This is the only name shown in campus discussions. You can change it anytime if available."
          name="alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          required
          minLength={3}
          maxLength={24}
          placeholder="e.g. BraveComet1024"
          rightAction={
            <button
              type="button"
              className="input-action-btn"
              onClick={handleRollDice}
              title="Generate a random student handle"
            >
              <Dices size={18} />
            </button>
          }
        />

        {statusMessage.text && (
          <div
            className={`alert-banner ${
              statusMessage.type === "error"
                ? "error"
                : statusMessage.type === "success"
                ? "success"
                : ""
            }`}
            style={{
              background:
                statusMessage.type === "info"
                  ? "var(--brand-50)"
                  : undefined,
              borderColor:
                statusMessage.type === "info"
                  ? "var(--brand-200)"
                  : undefined,
              color:
                statusMessage.type === "info"
                  ? "var(--brand-700)"
                  : undefined,
            }}
          >
            {statusMessage.text}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={isSaving}
          disabled={!alias.trim() || alias === user?.anonymousName}
          icon={Check}
          style={{ width: "100%" }}
        >
          Save Anonymous Handle
        </Button>
      </form>

      <div className="private-info-box">
        <strong>
          <Lock size={14} style={{ color: "var(--brand-600)" }} />
          Private Student Credentials (Never Shared)
        </strong>
        <div className="private-info-row">
          <span>Real Name:</span>
          <strong>{user?.name || "Student Member"}</strong>
        </div>
        <div className="private-info-row">
          <span>Student Email:</span>
          <span>{user?.email}</span>
        </div>
        <div className="private-info-row">
          <span>Roll Number:</span>
          <span>{user?.rollNumber}</span>
        </div>
        <div className="private-info-row">
          <span>Class / Group:</span>
          <span>{user?.group}</span>
        </div>
      </div>
    </Modal>
  );
}
