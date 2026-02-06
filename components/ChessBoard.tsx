"use client";

import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const STARTING_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function ChessBoard() {
  const [fen, setFen] = useState(STARTING_FEN);

  const game = new Chess(fen);
  const isGameOver = game.isGameOver();

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => {
      const gameInstance = new Chess(fen);
      const move = gameInstance.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      } as { from: string; to: string; promotion?: string });
      if (move) {
        setFen(gameInstance.fen());
        return true;
      }
      return false;
    },
    [fen]
  );

  return (
    <Chessboard
      options={{
        position: fen,
        onPieceDrop: ({ sourceSquare, targetSquare }) =>
          sourceSquare != null && targetSquare != null
            ? onPieceDrop(sourceSquare, targetSquare)
            : false,
        boardOrientation: "white",
        allowDragging: !isGameOver,
      }}
    />
  );
}
