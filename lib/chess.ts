/** Default starting position in FEN. */
export const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Describes a move that is waiting for a promotion piece choice. */
export type PendingPromotion = { from: string; to: string };

export type PromotionPiece = "q" | "r" | "b" | "n";
