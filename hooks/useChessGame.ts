"use client";

import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import {
  STARTING_FEN,
  type PendingPromotion,
  type PromotionPiece,
} from "@/lib/chess";

export function useChessGame() {
  const [fen, setFen] = useState(STARTING_FEN);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

  const game = new Chess(fen);
  const isGameOver = game.isGameOver();
  const turn = game.turn();

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      const gameInstance = new Chess(fen);
      const piece = gameInstance.get(
        sourceSquare as Parameters<typeof gameInstance.get>[0]
      );
      const targetRank = targetSquare[1];
      const isPromotion =
        piece?.type === "p" && (targetRank === "8" || targetRank === "1");

      if (isPromotion) {
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        return false;
      }

      const move = gameInstance.move({
        from: sourceSquare,
        to: targetSquare,
      } as { from: string; to: string });
      if (move) {
        setFen(gameInstance.fen());
        return true;
      }
      return false;
    },
    [fen]
  );

  const handlePromotionChoose = useCallback(
    (piece: PromotionPiece) => {
      if (!pendingPromotion) return;
      const gameInstance = new Chess(fen);
      const move = gameInstance.move({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: piece,
      } as { from: string; to: string; promotion: string });
      if (move) {
        setFen(gameInstance.fen());
      }
      setPendingPromotion(null);
    },
    [fen, pendingPromotion]
  );

  const handlePromotionCancel = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const isWhitePromotion =
    pendingPromotion != null &&
    new Chess(fen).get(
      pendingPromotion.from as Parameters<Chess["get"]>[0]
    )?.color === "w";

  return {
    fen,
    turn,
    isGameOver,
    pendingPromotion,
    isWhitePromotion,
    onPieceDrop,
    handlePromotionChoose,
    handlePromotionCancel,
  };
}
