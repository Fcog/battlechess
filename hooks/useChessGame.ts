"use client";

import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import {
  STARTING_FEN,
  getGameResult,
  type PendingPromotion,
  type PromotionPiece,
} from "@/lib/chess";
import {
  isPromotionMove,
  tryApplyMove,
  tryApplyPromotionMove,
  isWhitePiece,
} from "@/lib/chessMoves";

export function useChessGame() {
  const [fen, setFen] = useState(STARTING_FEN);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

  const game = new Chess(fen);
  const isGameOver = game.isGameOver();
  const turn = game.turn();
  const gameResult = getGameResult(game);

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      if (isPromotionMove(fen, sourceSquare, targetSquare)) {
        setPendingPromotion({ from: sourceSquare, to: targetSquare });
        return false;
      }
      const newFen = tryApplyMove(fen, sourceSquare, targetSquare);
      if (newFen) {
        setFen(newFen);
        return true;
      }
      return false;
    },
    [fen]
  );

  const handlePromotionChoose = useCallback(
    (piece: PromotionPiece) => {
      if (!pendingPromotion) return;
      const newFen = tryApplyPromotionMove(
        fen,
        pendingPromotion.from,
        pendingPromotion.to,
        piece
      );
      if (newFen) setFen(newFen);
      setPendingPromotion(null);
    },
    [fen, pendingPromotion]
  );

  const handlePromotionCancel = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const isWhitePromotion =
    pendingPromotion != null &&
    isWhitePiece(fen, pendingPromotion.from);

  return {
    fen,
    turn,
    isGameOver,
    gameResult,
    pendingPromotion,
    isWhitePromotion,
    onPieceDrop,
    handlePromotionChoose,
    handlePromotionCancel,
  };
}
