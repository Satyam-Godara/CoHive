# CoHive Phase 1

Express + MongoDB + Mongoose + JWT + bcrypt + React + Vite.

## Requirements

- Node.js 20 or newer recommended
- MongoDB running locally or a MongoDB Atlas URI

## backend Setup

```bash
cd ./server
npm install
cp .env.example .env
```

For a quick local MongoDB instance, the default URI is:
`mongodb://127.0.0.1:27017/cohive`


Run normally:
```bash
npm start
```


## frontend Setup

open new terminal

```bash
cd ./frontend
npm install
cp .env.example .env
npm run dev
```
frontend running on : `http://localhost:5173`


Health check: `GET http://localhost:5000/api/health`

## API

- `POST /api/auth/register` — `{ name, rollNumber, email, password, group, anonymousName? }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/messages?channel=general&limit=100` — authenticated
- `POST /api/messages` — `{ channel, content }` — authenticated
- `PATCH /api/messages/:id` — authenticated; only author can edit
- `DELETE /api/messages/:id` — authenticated; only author can delete