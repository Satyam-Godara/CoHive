const AVATAR_PALETTES = [
  { bg: "#ede9fe", text: "#6d28d9", border: "#ddd6fe" }, // Violet
  { bg: "#e0e7ff", text: "#4338ca", border: "#c7d2fe" }, // Indigo
  { bg: "#dbeafe", text: "#1d4ed8", border: "#bfdbfe" }, // Blue
  { bg: "#ccfbf1", text: "#0f766e", border: "#99f6e4" }, // Teal
  { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" }, // Green
  { bg: "#fef3c7", text: "#b45309", border: "#fde68a" }, // Amber
  { bg: "#ffedd5", text: "#c2410c", border: "#fed7aa" }, // Orange
  { bg: "#ffe4e6", text: "#be123c", border: "#fecdd3" }, // Rose
  { bg: "#fae8ff", text: "#a21caf", border: "#f5d0fe" }, // Fuchsia
  { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" }, // Slate
  { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc" }, // Cyan
  { bg: "#f3e8ff", text: "#7e22ce", border: "#e9d5ff" }, // Purple
];

export function getAvatarColor(identifier = "") {
  if (!identifier) return AVATAR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i += 1) {
    hash = (hash << 5) - hash + identifier.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

export function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDateDivider(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return "Today";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function isSameDay(dateStrA, dateStrB) {
  if (!dateStrA || !dateStrB) return false;
  const a = new Date(dateStrA);
  const b = new Date(dateStrB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function canClusterMessages(prevMsg, currMsg) {
  if (!prevMsg || !currMsg) return false;

  const prevAuthor = prevMsg.authorId || prevMsg.author?._id || prevMsg.anonymousName;
  const currAuthor = currMsg.authorId || currMsg.author?._id || currMsg.anonymousName;

  if (prevAuthor !== currAuthor) return false;
  if (!isSameDay(prevMsg.createdAt, currMsg.createdAt)) return false;

  // Max 5 minutes between messages for visual grouping
  const timeA = new Date(prevMsg.createdAt).getTime();
  const timeB = new Date(currMsg.createdAt).getTime();
  return Math.abs(timeB - timeA) <= 5 * 60 * 1000;
}

const ADJECTIVES = [
  "Amber", "Brave", "Calm", "Clever", "Cosmic", "Curious", "Daring",
  "Electric", "Gentle", "Happy", "Indigo", "Jolly", "Lucky", "Mellow",
  "Misty", "Neon", "Quiet", "Rapid", "Silver", "Sunny", "Velvet", "Witty"
];

const NOUNS = [
  "Badger", "Comet", "Coyote", "Falcon", "Fox", "Gecko", "Heron",
  "Koala", "Lynx", "Maple", "Otter", "Owl", "Panda", "Phoenix",
  "Pine", "Raven", "Robin", "Sparrow", "Tiger", "Willow", "Wolf", "Wren"
];

export function generateRandomAlias() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${adj}${noun}${num}`;
}
