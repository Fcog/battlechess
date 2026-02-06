# Development Plan: Next.js + Socket.io Chess App

Phased development plan for building an interactive multiplayer chess web app with Next.js (UI + API), Socket.io on the same Node server, and PostgreSQL.

---

## Tech Stack

| Layer           | Technology                          |
| --------------- | ----------------------------------- |
| **Framework**   | Next.js (App Router)                |
| **Real-time**   | Socket.io (custom Node server)      |
| **Chess logic** | chess.js                            |
| **Board UI**    | react-chessboard (or similar)       |
| **Database**    | PostgreSQL + Prisma                 |
| **Auth**        | NextAuth.js or Clerk                |
| **Deploy**      | Railway or Render (single Node app) |

---

## Phase 0: Project Setup

**Goal:** Repo, deps, and custom server that runs Next + Socket.io.

1. Create Next.js app (App Router, TypeScript).
2. Add dependencies: `chess.js`, `react-chessboard`, `socket.io`, `socket.io-client`, `prisma`, `@prisma/client`, plus auth (e.g. `next-auth`).
3. Add a **custom server** (e.g. `server.js` or `server.ts`):
   - Create HTTP server from Next.js app.
   - Attach Socket.io to that same server.
   - Run this script instead of `next dev` / `next start`.
4. Add a minimal Socket.io **client** in the app (e.g. custom hook or provider) that connects to the same host.
5. Verify: `npm run dev` starts one process; frontend loads; Socket.io connection works (e.g. log in browser and server).

**Deliverable:** One command runs Next + Socket.io; client connects.

---

## Phase 1: Local Chess (No Backend, No Auth)

**Goal:** Play a full game on one browser with correct rules.

1. **Board and state**

   - One page (e.g. `/` or `/play`).
   - Use `chess.js` for game state (position, turn, game over).
   - Use `react-chessboard` (or similar) for the board; feed it FEN from `chess.js` and an `onDrop` handler.

2. **Move handling**

   - In `onDrop`, validate with `chess.js`; if valid, update state and re-render.
   - Handle **promotion** (e.g. modal or inline choice when pawn reaches last rank).

3. **UX**

   - Show whose turn it is; show game result (checkmate, stalemate, draw).
   - Highlight last move and/or legal target squares.
   - Optional: list of moves (SAN) or a simple move history.

4. **Optional**
   - Flip board for black; sound or animation on move.

**Deliverable:** Two people can play a full game on one screen with correct rules.

---

## Phase 2: Data Model and API

**Goal:** Persist users and games; create and load games via API.

1. **Database**

   - PostgreSQL (local + hosted, e.g. Neon/Railway/Supabase).
   - Prisma: `User` (id, email, name, etc.), `Game` (id, whiteId, blackId, fen, status, winner, createdAt, updatedAt). Add fields as needed (e.g. PGN, timestamps for clocks later).

2. **Auth**

   - Integrate NextAuth (or Clerk): credentials or OAuth, session.
   - Protect API routes and pages that need a user (e.g. "create game", "my games").

3. **API routes (Next.js)**

   - `POST /api/games` – create game (current user as white or black; or "open" game with one player).
   - `GET /api/games/[id]` – get one game (check permissions).
   - `GET /api/games` – list games for current user (optional: filter by status).
   - `PATCH /api/games/[id]` – update game (e.g. FEN, status, winner). Used by server after validating moves.

4. **Game creation flow**
   - Logged-in user clicks "New game" → create `Game` in DB → redirect to `/game/[id]`.
   - Optional: "Join by link" – second user opens `/game/[id]` and you assign them as black (or via a "join" API).

**Deliverable:** Create game from UI; see it in DB; load game by ID and display position.

---

## Phase 3: Real-Time with Socket.io

**Goal:** Two browsers see the same game and moves in real time.

1. **Server-side Socket.io**

   - On connection, accept a `gameId` (and optionally auth token/session id).
   - Validate user can join that game; then `socket.join('game:' + gameId)`.
   - On `move` event: payload = `{ from, to, promotion? }`. Load game from DB, validate with `chess.js`, update FEN, save to DB, then `io.to('game:' + gameId).emit('move', { fen, move, ... })`.

2. **Client**

   - On `/game/[id]`, join room (emit `join`, send `gameId` and auth).
   - Listen for `move`; update local `chess.js` and board.
   - On "drop piece", validate locally for UX, then emit `move` to server; let server be source of truth and broadcast.

3. **Sync and reconnect**

   - When joining room, server sends current game state (e.g. FEN) so new/reconnecting clients get latest position.
   - Optional: emit short move history so client can rebuild or show history.

4. **Edge cases**
   - Only players in the game can join room and send moves; reject others.
   - Handle "game not found" or "game finished" (don't allow moves).

**Deliverable:** Open same game in two tabs/devices; moves sync in real time and persist.

---

## Phase 4: Matchmaking and Game Lifecycle

**Goal:** Find an opponent and manage game state clearly.

1. **Matchmaking**

   - Option A: "Find game" – add user to a queue (store in Redis or DB). When two users in queue, create `Game`, emit to both "gameReady" with `gameId`, redirect both to `/game/[id]`.
   - Option B: "Create game" → share link; second user opens link and joins as black (simpler).

2. **Game status**

   - Statuses: `waiting`, `active`, `finished` (and optionally `abandoned`).
   - When second player joins, set `active`. When checkmate/resign/draw, set `finished` and set `winner`; broadcast so both UIs show result.

3. **UI**
   - "New game" / "Find game" / "My games".
   - Game page: show "Waiting for opponent" vs "Your turn" / "Opponent's turn" and final result.

**Deliverable:** Start or find a game; see opponent join; play to conclusion and see result.

---

## Phase 5: Polish and Robustness

**Goal:** Better UX and production-ready behavior.

1. **Rules and UX**

   - Promotion UI (modal or buttons).
   - Draw offers, resign (API + Socket events); optional: draw by repetition/50-move (chess.js can help).

2. **Timers (optional)**

   - Per-player clock (e.g. 10+0). Store last move time and remaining time; server or client ticks on opponent's turn; on move, send remaining time; server can flag timeout and end game.

3. **Reliability**

   - Reconnect: on reconnect, re-join room and request current state (you already send FEN on join).
   - Validate every move on server; never trust client for game state.
   - Rate-limit Socket events and API (e.g. by IP or user).

4. **Quality of life**
   - Move list or PGN; "new game" from finished game; basic profile or game history page.

**Deliverable:** App feels complete and safe to deploy.

---

## Phase 6: Deploy

**Goal:** Run the app in production.

1. **Host**

   - Deploy the **custom Node server** (the one that runs Next + Socket.io) to **Railway** or **Render** (not Vercel serverless).

2. **Config**

   - Env: `DATABASE_URL`, auth secrets, `NEXTAUTH_URL` (or auth callback URL).
   - Build: `next build`; start: `node server.js` (or your custom server entry).

3. **Database**

   - Use hosted PostgreSQL (Neon, Railway, Supabase); run `prisma migrate deploy` in deploy step.

4. **Checks**
   - Create account, create/join game, play a full game from two devices, reconnect and see correct position.

**Deliverable:** Public URL where two users can sign up and play chess in real time.

---

## Suggested Folder Structure

```
/app
  /page.tsx                 # Home: New game, Find game, My games
  /game/[id]/page.tsx       # Game page (board + Socket)
  /api
    /auth/[...nextauth]/route.ts
    /games/route.ts         # GET list, POST create
    /games/[id]/route.ts    # GET one, PATCH update
/components
  ChessBoard.tsx            # Wraps react-chessboard + chess.js state
  GameStatus.tsx
  MoveList.tsx
/lib
  chess.ts                  # Helpers around chess.js
  socket.ts                 # Socket.io client setup
  prisma.ts                 # PrismaClient singleton
/server
  index.ts or server.js     # Custom server: Next + Socket.io
  socketHandlers.ts         # join, move, disconnect logic
/prisma
  schema.prisma
```

---

## Order Summary

| Phase | Focus                            | Outcome                    |
| ----- | -------------------------------- | -------------------------- |
| 0     | Next + custom server + Socket.io | One app, client connects   |
| 1     | Board + chess.js + moves         | Play locally on one screen |
| 2     | DB, auth, API                    | Create/load games, users   |
| 3     | Socket.io rooms + move broadcast | Real-time two-player game  |
| 4     | Matchmaking + game status        | Find opponent, finish game |
| 5     | Promotion, timers, reconnect, UX | Production-ready feel      |
| 6     | Deploy to Railway/Render         | Live multiplayer chess     |

---

You can stop after Phase 3 if you only want "share link and play"; Phases 4–5 add matchmaking and polish.
