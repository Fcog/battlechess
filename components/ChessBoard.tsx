"use client";

import { Chessboard } from "react-chessboard";
import { PromotionModal } from "@/components/PromotionModal";
import { useChessGame } from "@/hooks/useChessGame";

export function ChessBoard() {
  const {
    fen,
    isGameOver,
    pendingPromotion,
    isWhitePromotion,
    onPieceDrop,
    handlePromotionChoose,
    handlePromotionCancel,
  } = useChessGame();

  return (
    <div className="relative h-full w-full min-h-0 min-w-0">
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
  );
}
