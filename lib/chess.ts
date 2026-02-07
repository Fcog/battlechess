import type { Chess } from "chess.js";

/** Default starting position in FEN. */
export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Describes a move that is waiting for a promotion piece choice. */
export type PendingPromotion = { from: string; to: string };

/** Last move played (for highlighting). */
export type LastMove = { from: string; to: string };

export type PromotionPiece = "q" | "r" | "b" | "n";

/** Returns a human-readable game result, or null if the game is not over. */
export function getGameResult(game: Chess): string | null {
  if (!game.isGameOver()) return null;
  if (game.isCheckmate())
    return game.turn() === "b"
      ? "White wins by checkmate"
      : "Black wins by checkmate";
  if (game.isStalemate()) return "Stalemate (draw)";
  if (game.isDraw()) return "Draw";
  return null;
}
