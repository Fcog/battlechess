# Testing strategy

## Setup

Install dev dependencies and run tests:

```bash
npm install
npm run test        # watch mode
npm run test:run    # single run (e.g. CI)
```

Suggested tests by layer, from highest to lowest effort/impact.

---

## 1. Lib (pure logic) – **highest value, no React**

All functions in `lib/` are pure and easy to unit test.

### `lib/chess.test.ts`

- **getGameResult**
  - Returns `null` for starting position.
  - Returns `"White wins by checkmate"` when black is checkmated.
  - Returns `"Black wins by checkmate"` when white is checkmated.
  - Returns `"Stalemate (draw)"` for a stalemate position.
  - Returns `"Draw"` for 50-move or other draw (optional).

### `lib/chessMoves.test.ts`

- **isPromotionMove**
  - `true` for white pawn e7→e8, black pawn e2→e1.
  - `false` for e2→e4, for knight move, for empty square.
- **tryApplyMove**
  - Returns `{ newFen, san }` for e2→e4; SAN is `"e4"`.
  - Returns `null` for invalid move (e2→e5).
- **tryApplyPromotionMove**
  - Returns `{ newFen, san }` for e7→e8=Q; SAN includes promotion.
  - Returns `null` for invalid promotion.
- **isWhitePiece**
  - `true` for e2 in starting position, `false` for e7.
- **getLegalTargetSquares**
  - e2 in starting position returns `["e3","e4"]`.
  - Empty square or wrong color returns `[]`.

---

## 2. Hooks – **integration with React**

### `hooks/useChessGame.test.ts`

- Use `@testing-library/react` + `renderHook` from `@testing-library/react`.
- Initial state: `fen` is starting FEN, `history` is `[]`, `gameResult` is `null`.
- After a valid move (e.g. trigger `onPieceDrop("e2","e4")`): `fen` changes, `history` is `["e4"]`, `lastMove` is `{ from: "e2", to: "e4" }`.
- Promotion flow: set `pendingPromotion`, then `handlePromotionChoose("q")`; `fen` updates, `pendingPromotion` is null, `history` includes the promotion SAN.
- Invalid drop: `onPieceDrop("e2","e5")` leaves `fen` and `history` unchanged.

---

## 3. Components – **UI behavior**

### `components/MoveList.test.tsx`

- Renders "No moves yet" when `moves={[]}`.
- Renders "1. e4 e5" when `moves={["e4","e5"]}`.
- Renders "1. e4 2. e5" (or paired) for single move then black move; check structure (move numbers, spacing).

### `components/BoardOrientationToggle.test.tsx`

- Renders "Flip board" button.
- `onChange` called with `"black"` when current value is `"white"` and button is clicked.
- `onChange` called with `"white"` when current value is `"black"` and button is clicked.

### `components/PromotionModal.test.tsx`

- Renders four piece options (Queen, Rook, Bishop, Knight).
- Calls `onChoose("q")` when Queen is clicked.
- Calls `onCancel` when Cancel is clicked.
- Optional: Escape key calls `onCancel` (mock `window.addEventListener` or fire event).

### `components/ChessBoard.test.tsx` (optional)

- Renders board and status; pass minimal props (mock handlers).
- Shows "White to move" when `turn="w"` and no `gameResult`.
- Shows game result text when `gameResult` is set.
- More useful once you test with a real board (e.g. drag/drop) via E2E.

---

## 4. E2E (optional later)

- Play a full game: open `/play`, make moves, see result and move list.
- Use Playwright or Cypress; run against `npm run dev` or built app.

---

## Running tests

```bash
npm run test          # watch mode
npm run test:run     # single run (CI)
```

---

## File layout

- Colocated: `lib/chess.test.ts`, `lib/chessMoves.test.ts`, `hooks/useChessGame.test.ts`.
- Or single folder: `__tests__/lib/chess.test.ts`, `__tests__/lib/chessMoves.test.ts`, etc.
