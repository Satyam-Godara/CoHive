
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Hash,
  LogOut,
  MessageCircle,
  Send,
  Settings2,
  ShieldAlert,
  CalendarDays,
  Users,
  X,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api, { readableError } from "../lib/api.js";

const channels = [
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

function timeLabel(value) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default function ChatPage() {
  const { user, logout, setUser } = useAuth();

  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [alias, setAlias] = useState(user?.anonymousName || "");
  const [aliasMessage, setAliasMessage] = useState("");

  const bottomRef = useRef(null);
  const activeChannel =
    channels.find((item) => item.id === channel) || channels[0];

  // READ: Load messages for the selected channel.
  const loadMessages = useCallback(
    async (showLoader = true) => {
      if (showLoader) setLoading(true);

      try {
        const { data } = await api.get(
          `/messages?channel=${encodeURIComponent(channel)}&limit=100`
        );

        setMessages(data.messages || []);
        setError("");
      } catch (err) {
        setError(readableError(err));
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [channel]
  );

  // Initial load whenever the selected channel changes.
  useEffect(() => {
    let cancelled = false;

    async function fetchInitialMessages() {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(
          `/messages?channel=${encodeURIComponent(channel)}&limit=100`
        );

        if (!cancelled) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        if (!cancelled) setError(readableError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInitialMessages();

    return () => {
      cancelled = true;
    };
  }, [channel]);

  // HTTP polling replaces Socket.IO events.
  // Fetch updates every five seconds without showing the loading screen.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadMessages(false);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [loadMessages]);

  // Scroll to the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // CREATE: Send a message using POST.
  async function sendMessage(event) {
    event.preventDefault();

    const content = draft.trim();

    if (!content || sending) return;

    setSending(true);
    setError("");

    try {
      const { data } = await api.post("/messages", {
        channel,
        content,
      });

      if (data.message) {
        setMessages((current) =>
          current.some((item) => item._id === data.message._id)
            ? current
            : [...current, data.message]
        );
      }

      setDraft("");
    } catch (err) {
      setError(readableError(err));
    } finally {
      setSending(false);
    }
  }

  // UPDATE: Edit a message using PATCH.
  async function saveEdit(messageId) {
    const content = editText.trim();

    if (!content || content.length > 2000) {
      setError("Message must contain 1–2000 characters.");
      return;
    }

    try {
      const { data } = await api.patch(`/messages/${messageId}`, {
        content,
      });

      setMessages((current) =>
        current.map((item) =>
          item._id === messageId ? data.message : item
        )
      );

      setEditingId(null);
      setEditText("");
      setError("");
    } catch (err) {
      setError(readableError(err));
    }
  }

  // DELETE: Delete a message using DELETE.
  async function deleteMessage(messageId) {
    if (
      !window.confirm("Delete this message? This cannot be undone.")
    ) {
      return;
    }

    try {
      await api.delete(`/messages/${messageId}`);

      setMessages((current) =>
        current.filter((item) => item._id !== messageId)
      );

      setError("");
    } catch (err) {
      setError(readableError(err));
    }
  }

  // Update the student's anonymous name.
  async function saveAlias(event) {
    event.preventDefault();
    setAliasMessage("");

    try {
      const { data } = await api.patch("/students/me/alias", {
        anonymousName: alias.trim(),
      });

      setUser(data.user);
      setAlias(data.user.anonymousName);
      setAliasMessage("Anonymous name updated.");
    } catch (err) {
      setAliasMessage(readableError(err));
    }
  }

  return (
    <div className="chat-app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <MessageCircle size={21} />
          </span>
          voxCampus
        </div>

        <div className="workspace-label">
          YOUR CAMPUS <span className="live-dot" />
        </div>

        <div className="channel-list">
          <p className="sidebar-caption">
            CHANNELS <span>03</span>
          </p>

          {channels.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`channel-link ${
                  channel === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setChannel(item.id);
                  setError("");
                  setEditingId(null);
                }}
              >
                <span className="channel-icon">
                  <Icon size={17} />
                </span>

                <span className="channel-text">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>

                {channel === item.id && (
                  <span className="active-bar" />
                )}
              </button>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="privacy-card">
            <ShieldAlert size={17} />
            <div>
              <strong>Stay respectful</strong>
              <p>
                Anonymous doesn't mean consequence-free. Don't share
                private information.
              </p>
            </div>
          </div>

          <button
            className="profile-button"
            onClick={() => setProfileOpen(true)}
          >
            <span className="avatar">
              {(user?.anonymousName || "V")
                .slice(0, 1)
                .toUpperCase()}
            </span>

            <span className="profile-meta">
              <strong>{user?.anonymousName || "Campus member"}</strong>
              <small>{user?.group || "Student"}</small>
            </span>

            <Settings2 size={17} />
          </button>

          <button className="logout-button" onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div className="channel-heading">
            <span className="hash-icon">
              <Hash size={20} />
            </span>

            <div>
              <h1>{activeChannel.label}</h1>
              <p>{activeChannel.description}</p>
            </div>
          </div>

          <div className="header-right">
            <span className="connection">
              <span />
              HTTP chat
            </span>

            <div className="header-members">
              <Users size={16} />
              <span>Campus community</span>
            </div>
          </div>
        </header>

        <div className="channel-intro">
          <div className="intro-icon">
            <activeChannel.icon size={20} />
          </div>

          <div>
            <h2>Welcome to #{activeChannel.id}</h2>
            <p>
              {channel === "general"
                ? "Ask questions, share ideas, or just say hello."
                : channel === "complaints"
                  ? "Share concerns constructively. Avoid posting identifying or sensitive information."
                  : "Share campus events, meetups, workshops, and opportunities."}
            </p>
          </div>
        </div>

        <section className="message-list" aria-live="polite">
          {loading ? (
            <div className="empty-state">
              <div className="spinner" />
              <p>Loading conversation…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MessageCircle size={23} />
              </div>
              <h3>It's quiet in here — for now.</h3>
              <p>
                Start the conversation. Your campus community is listening.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const own =
                String(message.authorId || message.author?._id || "") ===
                String(user?._id || "");

              return (
                <article
                  className={`message ${own ? "own-message" : ""}`}
                  key={message._id}
                >
                  <div className="message-avatar">
                    {(
                      message.anonymousName ||
                      message.author?.anonymousName ||
                      "V"
                    )
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>

                  <div className="message-body">
                    <div className="message-meta">
                      <strong>
                        {message.anonymousName ||
                          message.author?.anonymousName ||
                          "Anonymous student"}
                      </strong>

                      {own && <span className="you-tag">YOU</span>}

                      <time>{timeLabel(message.createdAt)}</time>

                      {message.updatedAt &&
                        new Date(message.updatedAt).getTime() >
                          new Date(message.createdAt).getTime() && (
                          <span className="edited-tag">edited</span>
                        )}
                    </div>

                    {editingId === message._id ? (
                      <div className="edit-row">
                        <input
                          value={editText}
                          onChange={(event) =>
                            setEditText(event.target.value)
                          }
                          maxLength={2000}
                          autoFocus
                        />

                        <button
                          aria-label="Save edit"
                          onClick={() => saveEdit(message._id)}
                        >
                          <Check size={16} />
                        </button>

                        <button
                          aria-label="Cancel edit"
                          onClick={() => setEditingId(null)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <p className="message-content">{message.content}</p>
                    )}

                    {own && editingId !== message._id && (
                      <div className="message-actions">
                        <button
                          onClick={() => {
                            setEditingId(message._id);
                            setEditText(message.content);
                          }}
                          aria-label="Edit message"
                        >
                          <Pencil size={13} /> Edit
                        </button>

                        <button
                          onClick={() => deleteMessage(message._id)}
                          aria-label="Delete message"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}

          {error && (
            <div className="inline-error">
              {error}
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </section>

        <div className="composer-wrap">
          <form className="composer" onSubmit={sendMessage}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Message #${channel} as ${
                user?.anonymousName || "Anonymous student"
              }…`}
              rows={1}
              maxLength={2000}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.currentTarget.form.requestSubmit();
                }
              }}
            />

            <div className="composer-footer">
              <span>
                <ShieldAlert size={13} />
                Your real identity stays off the chat screen.
              </span>

              <div>
                <small>{draft.length}/2000</small>
                <button
                  type="submit"
                  className="send-button"
                  disabled={!draft.trim() || sending}
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>
            </div>
          </form>

          <p className="composer-hint">
            Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </main>

      {profileOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setProfileOpen(false)}
        >
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setProfileOpen(false)}
              aria-label="Close settings"
            >
              <X size={18} />
            </button>

            <div className="modal-avatar">
              {(user?.anonymousName || "V")
                .slice(0, 1)
                .toUpperCase()}
            </div>

            <span className="eyebrow">YOUR CAMPUS IDENTITY</span>
            <h2 id="profile-title">Profile settings</h2>
            <p className="modal-description">
              Other students see your anonymous name, not your registration
              details.
            </p>

            <form onSubmit={saveAlias} className="auth-form">
              <label>
                Anonymous name
                <input
                  value={alias}
                  onChange={(event) => setAlias(event.target.value)}
                  required
                  minLength={3}
                  maxLength={24}
                  placeholder="Choose an alias"
                />
              </label>

              <span className="field-hint">
                Must be unique. Letters, numbers, underscores, and hyphens
                work best.
              </span>

              {aliasMessage && (
                <p
                  className={
                    aliasMessage.includes("updated")
                      ? "success-text"
                      : "form-error"
                  }
                >
                  {aliasMessage}
                </p>
              )}

              <button className="primary-button" type="submit">
                Save anonymous name <Check size={17} />
              </button>
            </form>

            <div className="profile-private">
              <strong>Private account details</strong>
              <span>{user?.email}</span>
              <span>Roll number: {user?.rollNumber}</span>
              <span>Group: {user?.group}</span>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
