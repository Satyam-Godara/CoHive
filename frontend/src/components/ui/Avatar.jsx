import React from "react";
import { getAvatarColor } from "../../lib/utils.js";

export default function Avatar({ name = "V", size = 38, className = "" }) {
  const initial = (name || "V").trim().slice(0, 1).toUpperCase();
  const palette = getAvatarColor(name);

  return (
    <div
      className={`author-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: palette.bg,
        color: palette.text,
        borderColor: palette.border,
      }}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
