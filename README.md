# Talkive (V1) — AI Emotional Companion (SaaS Starter)

Dark, calm, glassy AI companion web app. **Not a therapist or medical product.**

## Prerequisites

- Node.js **18+** (recommended: 20+)
- MongoDB running locally or a MongoDB Atlas URI

## 1) Backend setup

In a terminal:

```bash
cd backend
npm install
```

Create an environment file:

- Copy `backend/env.example` → `backend/.env` (create `.env` manually; this repo can’t auto-generate dotfiles here)

Then run:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## 2) Frontend setup

```bash
cd frontend
npm install
```

Create an environment file:

- Copy `frontend/env.example` → `frontend/.env`

Then run:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Admin login (hidden)

There is **no admin toggle** and **no separate admin page link**.

- Use the same login form.
- If the credentials match `ADMIN_EMAIL` + `ADMIN_PASSWORD`, you will be redirected to `/admin`.

## Gmail / Google authentication (verified emails)

To ensure only **real, existing emails** can access the app, this project supports **Google Sign-In**:

- Frontend: uses Google OAuth client (`VITE_GOOGLE_CLIENT_ID`)
- Backend: verifies Google ID token (`GOOGLE_CLIENT_ID`) and only accepts **verified** emails

Optional strict mode:

- Set `REQUIRE_GOOGLE_AUTH=true` to disable password signup/login (users must use Google)
- Set `GMAIL_ONLY=true` to only allow `@gmail.com` accounts

## Key API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/chat/history` (JWT)
- `POST /api/chat` (JWT)
- `GET /api/admin/overview` (admin JWT)
- `GET /api/admin/users` (admin JWT)
- `PATCH /api/admin/users/:id/block` (admin JWT)

