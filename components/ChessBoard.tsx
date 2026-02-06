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
        from: sourceSquare as Parameters<typeof gameInstance.move>[0]["from"],
        to: targetSquare as Parameters<typeof gameInstance.move>[0]["to"],
        promotion: "q",
      });
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
          onPieceDrop(sourceSquare, targetSquare),
        boardOrientation: "white",
        allowDragging: !isGameOver,
      }}
    />
  );
}
