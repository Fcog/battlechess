"use client";

import { useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { PromotionModal } from "@/components/PromotionModal";
import { getLegalTargetSquares } from "@/lib/chessMoves";
import type { LastMove, PendingPromotion, PromotionPiece } from "@/lib/chess";

const LAST_MOVE_HIGHLIGHT = {
  backgroundColor: "rgba(255, 213, 0, 0.4)",
};
const LEGAL_TARGET_HIGHLIGHT = {
  backgroundColor: "rgba(0, 128, 0, 0.35)",
};

export type ChessBoardProps = {
  fen: string;
  turn: "w" | "b";
  isGameOver: boolean;
  gameResult: string | null;
  lastMove: LastMove | null;
  draggingFrom: string | null;
  setDraggingFrom: (square: string | null) => void;
  pendingPromotion: PendingPromotion | null;
  isWhitePromotion: boolean;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  handlePromotionChoose: (piece: PromotionPiece) => void;
  handlePromotionCancel: () => void;
};

export function ChessBoard({
  fen,
  turn,
  isGameOver,
  gameResult,
  lastMove,
  draggingFrom,
  setDraggingFrom,
  pendingPromotion,
  isWhitePromotion,
  onPieceDrop,
  handlePromotionChoose,
  handlePromotionCancel,
}: ChessBoardProps) {
  const statusLabel = gameResult ?? (turn === "w" ? "White to move" : "Black to move");

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = LAST_MOVE_HIGHLIGHT;
      styles[lastMove.to] = LAST_MOVE_HIGHLIGHT;
    }
    if (draggingFrom) {
      const legalSquares = getLegalTargetSquares(fen, draggingFrom);
      legalSquares.forEach((sq) => {
        if (!styles[sq]) styles[sq] = LEGAL_TARGET_HIGHLIGHT;
      });
    }
    return styles;
  }, [fen, lastMove, draggingFrom]);

  return (
    <div className="relative flex w-full min-h-0 min-w-0 flex-col">
      <p
        className={`shrink-0 py-1.5 text-center text-sm font-medium ${
          gameResult != null
            ? "text-zinc-900 dark:text-zinc-100 font-semibold"
            : "text-zinc-600 dark:text-zinc-400"
        }`}
        aria-live="polite"
      >
        {statusLabel}
      </p>
      <div className="relative min-h-0 flex-1 w-full">
        <Chessboard
        options={{
          position: fen,
          squareStyles,
          onPieceDrag: ({ square }) => setDraggingFrom(square),
          onPieceDrop: ({ sourceSquare, targetSquare }) => {
            const result =
              sourceSquare != null && targetSquare != null
                ? onPieceDrop(sourceSquare, targetSquare)
                : false;
            setDraggingFrom(null);
            return result;
          },
          boardOrientation: "white",
          allowDragging: !isGameOver && !pendingPromotion,
          boardStyle: {
            width: "100%",
            height: "100%",
            minHeight: 0,
            minWidth: 0,
          },
        }}
      />
      {pendingPromotion != null && (
        <PromotionModal
          isWhite={isWhitePromotion}
          onChoose={handlePromotionChoose}
          onCancel={handlePromotionCancel}
        />
      )}
      </div>
    </div>
  );
}
