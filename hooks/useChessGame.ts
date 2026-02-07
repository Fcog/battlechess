"use client";

import { useState, useCallback, useEffect } from "react";
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

export type UseChessGameOptions = {
  onMove?: () => void;
  /** When provided, game state is initialized and synced from this FEN (e.g. from API). */
  initialFen?: string | null;
};

export function useChessGame(options?: UseChessGameOptions) {
  const onMove = options?.onMove;
  const initialFen = options?.initialFen;
  const [fen, setFen] = useState(initialFen ?? STARTING_FEN);

  useEffect(() => {
    if (initialFen != null && initialFen !== "") {
      setFen(initialFen);
    }
  }, [initialFen]);
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
        onMove?.();
        return true;
      }
      return false;
    },
    [fen, onMove]
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
        onMove?.();
      }
      setPendingPromotion(null);
    },
    [fen, pendingPromotion, onMove]
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
