import React, { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, ShieldAlert, Sparkles, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import api, { readableError } from "../lib/api.js";
import { canClusterMessages, formatDateDivider, isSameDay } from "../lib/utils.js";
import ChatSidebar, { CHANNELS } from "../components/chat/ChatSidebar.jsx";
import ChatHeader from "../components/chat/ChatHeader.jsx";
import MessageItem from "../components/chat/MessageItem.jsx";
import MessageComposer from "../components/chat/MessageComposer.jsx";
import DeleteModal from "../components/chat/DeleteModal.jsx";
import ProfileModal from "../components/profile/ProfileModal.jsx";
import { MessageStreamSkeleton } from "../components/ui/Skeleton.jsx";

export default function ChatPage() {
  const { user, logout, updateUser } = useAuth();

  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Modals & Active Edit State
  const [editingId, setEditingId] = useState(null);
  const [pendingDeleteMsg, setPendingDeleteMsg] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const bottomRef = useRef(null);
  const activeChannel = CHANNELS.find((item) => item.id === channel) || CHANNELS[0];

  // Online / Offline monitor
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      loadMessages(false);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch messages
  const loadMessages = useCallback(
    async (showSkeleton = true) => {
      if (showSkeleton) setLoading(true);

      try {
        const { data } = await api.get(
          `/messages?channel=${encodeURIComponent(channel)}&limit=100`
        );
        setMessages(data.messages || []);
        setError("");
        setIsOnline(true);
      } catch (err) {
        if (!navigator.onLine) {
          setIsOnline(false);
        } else {
          setError(readableError(err));
        }
      } finally {
        if (showSkeleton) setLoading(false);
      }
    },
    [channel]
  );

  // Channel change effect
  useEffect(() => {
    loadMessages(true);
  }, [loadMessages]);

  // Background polling (every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      if (navigator.onLine) {
        loadMessages(false);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [loadMessages]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // Send message with optimistic update
  async function handleSendMessage(content) {
    setError("");

    // Optimistic temporary message
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      _id: tempId,
      authorId: user?._id,
      anonymousName: user?.anonymousName || "You",
      channel,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const { data } = await api.post("/messages", { channel, content });
      if (data?.message) {
        setMessages((prev) =>
          prev.map((m) => (m._id === tempId ? data.message : m))
        );
      }
    } catch (err) {
      // Revert optimistic message on failure
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      setError(readableError(err));
    }
  }

  // Edit message
  async function handleSaveEdit(messageId, nextContent) {
    try {
      const { data } = await api.patch(`/messages/${messageId}`, {
        content: nextContent,
      });

      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? data.message : m))
      );
      setEditingId(null);
      setError("");
    } catch (err) {
      setError(readableError(err));
    }
  }

  // Delete message
  async function handleConfirmDelete(messageId) {
    try {
      await api.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      setPendingDeleteMsg(null);
      setError("");
    } catch (err) {
      setError(readableError(err));
    }
  }

  return (
    <div className="chat-app-shell">
      {/* Sidebar Navigation */}
      <ChatSidebar
        activeChannel={channel}
        onSelectChannel={(nextId) => {
          setChannel(nextId);
          setEditingId(null);
          setError("");
        }}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={logout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Chat Stage */}
      <main className="chat-viewport">
        <ChatHeader
          channelInfo={activeChannel}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isOnline={isOnline}
        />

        {/* Messages Stream */}
        {loading ? (
          <MessageStreamSkeleton count={5} />
        ) : (
          <section className="messages-scroll-area" aria-label={`#${activeChannel.label} conversation`}>
            {/* Top Channel Introduction Banner (Scrolls naturally) */}
            <div className="feed-intro-card">
              <div className="feed-intro-icon">
                <activeChannel.icon size={24} />
              </div>
              <div>
                <h2>Welcome to #{activeChannel.label}</h2>
                <p>
                  {channel === "general"
                    ? "Ask questions, share ideas, or talk about campus life anonymously."
                    : channel === "complaints"
                    ? "Raise campus grievances constructively. Keep it civil and respect privacy."
                    : "Discover student clubs, workshops, hackathons, and campus events."}
                </p>
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div
                className="alert-banner error"
                style={{ position: "sticky", top: "8px", zIndex: 10 }}
              >
                <span>{error}</span>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ marginLeft: "auto", width: "24px", height: "24px" }}
                  onClick={() => setError("")}
                  aria-label="Dismiss error"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Empty State */}
            {messages.length === 0 ? (
              <div className="feed-empty-state">
                <div className="empty-icon-wrap">
                  <MessageCircle size={28} />
                </div>
                <h3>Quiet in #{activeChannel.label}</h3>
                <p>
                  Be the first to break the ice! Your real name stays private.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const showDateDivider = !prevMsg || !isSameDay(prevMsg.createdAt, msg.createdAt);
                const isClustered = !showDateDivider && canClusterMessages(prevMsg, msg);
                const isOwn = String(msg.authorId || msg.author?._id || "") === String(user?._id || "");

                return (
                  <React.Fragment key={msg._id}>
                    {showDateDivider && (
                      <div className="date-divider" role="separator">
                        <span className="date-divider-pill">
                          {formatDateDivider(msg.createdAt)}
                        </span>
                      </div>
                    )}

                    <MessageItem
                      message={msg}
                      isOwn={isOwn}
                      isLeadInGroup={!isClustered}
                      isEditing={editingId === msg._id}
                      onStartEdit={(id) => setEditingId(id)}
                      onCancelEdit={() => setEditingId(null)}
                      onSaveEdit={handleSaveEdit}
                      onRequestDelete={(target) => setPendingDeleteMsg(target)}
                    />
                  </React.Fragment>
                );
              })
            )}

            <div ref={bottomRef} style={{ height: "1px" }} />
          </section>
        )}

        {/* Message Input Dock */}
        <MessageComposer
          channelName={activeChannel.label}
          userAlias={user?.anonymousName}
          onSend={handleSendMessage}
          disabled={!isOnline}
        />
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!pendingDeleteMsg}
        message={pendingDeleteMsg}
        onClose={() => setPendingDeleteMsg(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Student Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUser={(updated) => updateUser(updated)}
      />
    </div>
  );
}
