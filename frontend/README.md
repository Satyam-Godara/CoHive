# CoHive — Phase 1 frontend

React + Vite frontend for an anonymous student community with registration, login, three live chat channels, message history, message edit/delete, and alias updates.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` and `VITE_SOCKET_URL` in `.env` to match your backend.

## Expected REST API

All endpoints except registration and login expect `Authorization: Bearer <JWT>`.

- `POST /auth/register`
  - body: `{ "name", "rollNumber", "email", "password", "group", "anonymousName?" }`
  - response: `{ "token", "user": { "_id", "name", "rollNumber", "email", "group", "anonymousName" } }`
- `POST /auth/login`
  - body: `{ "email", "password" }`
  - response: same shape as registration
- `GET /auth/me`
  - response: `{ "user": { ...public/private fields for the signed-in account } }`
- `GET /messages?channel=general&limit=100`
  - response: `{ "messages": [{ "_id", "authorId", "anonymousName", "channel", "content", "createdAt", "updatedAt" }] }`
- `PATCH /messages/:id`
  - body: `{ "content": "updated message" }`
  - response: `{ "message": { ...message } }`
- `DELETE /messages/:id`
  - response: `{ "message": "Message deleted" }`
- `PATCH /students/me/alias`
  - body: `{ "anonymousName": "UniqueAlias" }`
  - response: `{ "user": { ...updated user } }`

## Expected Socket.IO events

Socket connects with `socket.handshake.auth.token`.

Client emits:
- `message:send` with `{ channel, content }`; acknowledgement `{ message }` or `{ error }`.

Server emits:
- `message:new` with a message object
- `message:updated` with the updated message
- `message:deleted` with `{ messageId, channel }`
- `chat:error` with `{ message }`

The server should validate the JWT, validate channel names, limit message length, store messages in MongoDB, and enforce that only the author can edit/delete their own messages. Clients must never be trusted to supply their own author ID or alias.

## Important implementation notes

- The alias should have a unique normalized database index. Handle duplicate-key errors and generate a new alias on collision.
- Normalize email and roll number before storing, and enforce unique indexes for both.
- Keep passwords hashed with bcrypt on the backend. Never send password hashes to the client.
- In a real deployment, serve frontend and API over HTTPS/WSS, validate all input server-side, add rate limits, and consider college email verification and moderation/reporting before public launch.
- The UI intentionally uses `localStorage` for a simple starter JWT flow. For a more hardened production deployment, consider short-lived access tokens with refresh tokens in `HttpOnly`, `Secure`, `SameSite` cookies and CSRF protections where applicable.
- Anonymous means pseudonymous to other users, not invisible to authorized platform administrators. The Complaints channel should not promise confidentiality unless a separate private reporting workflow is built.
