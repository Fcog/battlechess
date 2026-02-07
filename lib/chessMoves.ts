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

export type MoveResult = { newFen: string; san: string };

/** Applies a non-promotion move. Returns new FEN and SAN, or null if invalid. */
export function tryApplyMove(
  fen: string,
  from: string,
  to: string
): MoveResult | null {
  try {
    const game = new Chess(fen);
    const move = game.move({ from, to } as { from: string; to: string });
    return move ? { newFen: game.fen(), san: move.san } : null;
  } catch {
    return null;
  }
}

/** Applies a promotion move. Returns new FEN and SAN, or null if invalid. */
export function tryApplyPromotionMove(
  fen: string,
  from: string,
  to: string,
  promotion: PromotionPiece
): MoveResult | null {
  try {
    const game = new Chess(fen);
    const move = game.move({
      from,
      to,
      promotion,
    } as { from: string; to: string; promotion: string });
    return move ? { newFen: game.fen(), san: move.san } : null;
  } catch {
    return null;
  }
}

/** True if the piece on the given square in this position is white. */
export function isWhitePiece(fen: string, square: string): boolean {
  const game = new Chess(fen);
  const piece = game.get(square as Parameters<typeof game.get>[0]);
  return piece?.color === "w";
}

/** Returns the list of square IDs that the piece on fromSquare can move to. */
export function getLegalTargetSquares(
  fen: string,
  fromSquare: string
): string[] {
  const game = new Chess(fen);
  const moves = game.moves({
    verbose: true,
    square: fromSquare as Parameters<typeof game.moves>[0]["square"],
  });
  return moves.map((m) => m.to);
}
