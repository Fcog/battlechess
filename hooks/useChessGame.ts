"use client";

import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import {
  STARTING_FEN,
  getGameResult,
  type LastMove,
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
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

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
      const result = tryApplyMove(fen, sourceSquare, targetSquare);
      if (result) {
        setFen(result.newFen);
        setLastMove({ from: sourceSquare, to: targetSquare });
        setHistory((prev) => [...prev, result.san]);
        return true;
      }
      return false;
    },
    [fen]
  );

  const handlePromotionChoose = useCallback(
    (piece: PromotionPiece) => {
      if (!pendingPromotion) return;
      const result = tryApplyPromotionMove(
        fen,
        pendingPromotion.from,
        pendingPromotion.to,
        piece
      );
      if (result) {
        setFen(result.newFen);
        setLastMove({
          from: pendingPromotion.from,
          to: pendingPromotion.to,
        });
        setHistory((prev) => [...prev, result.san]);
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
    isWhitePiece(fen, pendingPromotion.from);

  return {
    fen,
    turn,
    isGameOver,
    gameResult,
    lastMove,
    draggingFrom,
    setDraggingFrom,
    history,
    pendingPromotion,
    isWhitePromotion,
    onPieceDrop,
    handlePromotionChoose,
    handlePromotionCancel,
  };
}
