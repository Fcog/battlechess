import { Chess } from "chess.js";
import type { PromotionPiece } from "@/lib/chess";

/** True if moving the piece from source to target is a promotion move. */
export function isPromotionMove(
  fen: string,
  sourceSquare: string,
  targetSquare: string
): boolean {
  const game = new Chess(fen);
  const piece = game.get(
    sourceSquare as Parameters<typeof game.get>[0]
  );
  const targetRank = targetSquare[1];
  return (
    piece?.type === "p" && (targetRank === "8" || targetRank === "1")
  );
}

/** Applies a non-promotion move. Returns new FEN or null if invalid. */
export function tryApplyMove(
  fen: string,
  from: string,
  to: string
): string | null {
  const game = new Chess(fen);
  const move = game.move({ from, to } as { from: string; to: string });
  return move ? game.fen() : null;
}

/** Applies a promotion move. Returns new FEN or null if invalid. */
export function tryApplyPromotionMove(
  fen: string,
  from: string,
  to: string,
  promotion: PromotionPiece
): string | null {
  const game = new Chess(fen);
  const move = game.move({
    from,
    to,
    promotion,
  } as { from: string; to: string; promotion: string });
  return move ? game.fen() : null;
}

/** True if the piece on the given square in this position is white. */
export function isWhitePiece(fen: string, square: string): boolean {
  const game = new Chess(fen);
  const piece = game.get(square as Parameters<typeof game.get>[0]);
  return piece?.color === "w";
}
