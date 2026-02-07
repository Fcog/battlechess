# Chess App

Multiplayer chess built with Next.js (App Router), Socket.io, Prisma, and NextAuth.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **chess.js** + **react-chessboard** for the board and game logic
- **Socket.io** (custom server) for real-time play (planned)
- **Prisma** + **PostgreSQL** for users and games
- **NextAuth** (credentials + optional Google OAuth)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment

Copy the example env and set your values:

```bash
cp .env.example .env
```

Edit `.env`:

- **DATABASE_URL** – PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/chess_app` for local Docker).
- **NEXTAUTH_URL** – App URL (e.g. `http://localhost:3000`).
- **NEXTAUTH_SECRET** – Random secret for sessions (e.g. `openssl rand -base64 32`).

Optional for Google sign-in: set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXT_PUBLIC_GOOGLE_ENABLED=true`.

### 3. Database

With PostgreSQL running:

```bash
npx prisma migrate dev
npx prisma db seed
```

The seed creates a test user: **test@example.com** (any password works with the dev credentials provider).

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Sign in** to log in, then **Play locally** for a local game.

## Scripts

| Command              | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start Next.js + Socket.io dev |
| `npm run build`      | Production build              |
| `npm run start`      | Production server             |
| `npm run lint`       | Run ESLint                    |
| `npm run test`       | Run Vitest (watch)            |
| `npm run test:run`   | Run Vitest once               |
| `npx prisma db seed` | Create/update test user       |

## Project layout

- **app/** – Routes (home, `/play`, `/auth/signin`), API (`/api/auth/[...nextauth]`).
- **components/** – ChessBoard, MoveList, PromotionModal, BoardOrientationToggle, Providers.
- **hooks/** – `useChessGame` for local game state.
- **lib/** – Chess helpers, moves, Prisma client, NextAuth config, socket client, move sound.
- **prisma/** – Schema (User, Game, Account, Session, VerificationToken), migrations, seed.
- **server.js** – Custom HTTP server serving Next.js and Socket.io.

## Testing

Unit tests use Vitest and React Testing Library. See `TESTING.md` for strategy and setup. Run:

```bash
npm run test
```

## Plan

See `CHESS_APP_PLAN.md` for phases (local chess ✅, DB + auth ✅, game API, real-time, etc.).
