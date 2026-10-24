const adjectives = [
  "Amber", "Brave", "Calm", "Clever", "Cosmic", "Curious", "Daring",
  "Electric", "Gentle", "Happy", "Indigo", "Jolly", "Lucky", "Mellow",
  "Misty", "Neon", "Quiet", "Rapid", "Silver", "Sunny", "Velvet", "Witty"
];
const nouns = [
  "Badger", "Comet", "Coyote", "Falcon", "Fox", "Gecko", "Heron",
  "Koala", "Lynx", "Maple", "Otter", "Owl", "Panda", "Phoenix",
  "Pine", "Raven", "Robin", "Sparrow", "Tiger", "Willow", "Wolf", "Wren"
];

export function makeAlias() {
  const adjective = adjectives[cryptoIndex(adjectives.length)];
  const noun = nouns[cryptoIndex(nouns.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${adjective}${noun}${number}`;
}

function cryptoIndex(length) {
  // Alias collisions are still handled by the unique database index.
  return Math.floor(Math.random() * length);
}

export function normalizeAlias(value) {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}

export function isValidAlias(value) {
  return /^[A-Za-z0-9_-]{3,24}$/.test(value);
}
