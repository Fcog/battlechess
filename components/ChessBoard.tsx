"use client";

import { Chessboard } from "react-chessboard";
import { PromotionModal } from "@/components/PromotionModal";
import { useChessGame } from "@/hooks/useChessGame";

export function ChessBoard() {
  const {
    fen,
    turn,
    isGameOver,
    gameResult,
    pendingPromotion,
    isWhitePromotion,
    onPieceDrop,
    handlePromotionChoose,
    handlePromotionCancel,
  } = useChessGame();

  const statusLabel = gameResult ?? (turn === "w" ? "White to move" : "Black to move");

  return (
    <div className="relative flex h-full w-full min-h-0 min-w-0 flex-col">
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
          onPieceDrop: ({ sourceSquare, targetSquare }) =>
            sourceSquare != null && targetSquare != null
              ? onPieceDrop(sourceSquare, targetSquare)
              : false,
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
