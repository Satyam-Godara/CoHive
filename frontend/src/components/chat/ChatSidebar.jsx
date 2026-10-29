import React from "react";
import {
  MessageCircle,
  ShieldAlert,
  CalendarDays,
  Settings2,
  LogOut,
  X,
} from "lucide-react";
import Avatar from "../ui/Avatar.jsx";

export const CHANNELS = [
  {
    id: "general",
    label: "General",
    description: "Anything on your mind",
    icon: MessageCircle,
  },
  {
    id: "complaints",
    label: "Complaints",
    description: "Raise campus concerns",
    icon: ShieldAlert,
  },
  {
    id: "events",
    label: "Events",
    description: "What's happening around campus",
    icon: CalendarDays,
  },
];

export default function ChatSidebar({
  activeChannel,
  onSelectChannel,
  user,
  onOpenProfile,
  onLogout,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? "is-open" : ""}`}
        aria-label="Campus navigation"
      >
        <div className="sidebar-header">
          <div className="auth-brand" style={{ fontSize: "19px" }}>
            <span className="brand-icon-box" style={{ width: "32px", height: "32px" }}>
              <MessageCircle size={18} />
            </span>
            <span>CoHive</span>
          </div>

          {isOpen && (
            <button
              type="button"
              className="btn-icon"
              style={{ color: "var(--sidebar-muted)" }}
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="campus-pill">
          <span>Campus Workspace</span>
          <span className="pulse-dot" title="Connected to campus network" />
        </div>

        <nav className="channel-nav" aria-label="Channels">
          <span className="nav-section-title">
            <span>Channels</span>
            <span>03</span>
          </span>

          {CHANNELS.map((item) => {
            const Icon = item.icon;
            const isActive = activeChannel === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={`channel-tab ${isActive ? "is-active" : ""}`}
                onClick={() => {
                  onSelectChannel(item.id);
                  if (onClose) onClose();
                }}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="channel-tab-icon">
                  <Icon size={16} />
                </span>

                <span className="channel-tab-info">
                  <span className="channel-tab-name">#{item.label}</span>
                  <span className="channel-tab-desc">{item.description}</span>
                </span>

                {isActive && <span className="active-channel-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="safety-note">
            <ShieldAlert size={16} />
            <div>
              <strong>Respectful Campus</strong>
              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "var(--sidebar-muted)" }}>
                Anonymous handles protect your voice, but campus community rules still apply.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="profile-trigger"
            onClick={onOpenProfile}
            title="Edit student profile & anonymous handle"
          >
            <Avatar name={user?.anonymousName || "V"} size={32} />

            <div className="profile-trigger-info">
              <strong>{user?.anonymousName || "Student Member"}</strong>
              <small>{user?.group || "Student"}</small>
            </div>

            <Settings2 size={16} style={{ color: "var(--sidebar-muted)", flexShrink: 0 }} />
          </button>

          <div className="logout-strip">
            <span style={{ fontSize: "11px", color: "var(--sidebar-muted)" }}>
              {user?.rollNumber || "Verified Student"}
            </span>
            <button type="button" className="logout-btn" onClick={onLogout}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
