import React from "react";
import { Hash, Menu, Settings2, Users } from "lucide-react";

export default function ChatHeader({
  channelInfo,
  onOpenMobileMenu,
  onOpenProfile,
  isOnline = true,
}) {
  return (
    <header className="chat-top-header">
      <div className="chat-header-channel">
        <button
          type="button"
          className="btn-icon mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open campus channels"
        >
          <Menu size={20} />
        </button>

        <div className="channel-hash-pill">
          <Hash size={18} />
        </div>

        <div>
          <h1>{channelInfo.label}</h1>
          <p>{channelInfo.description}</p>
        </div>
      </div>

      <div className="chat-header-actions">
        <div className={`live-badge ${!isOnline ? "offline" : ""}`}>
          <span className="dot" />
          <span>{isOnline ? "Campus Live" : "Reconnecting…"}</span>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={onOpenProfile}
          title="Profile & Settings"
          aria-label="Open profile settings"
        >
          <Settings2 size={18} />
        </button>
      </div>
    </header>
  );
}
