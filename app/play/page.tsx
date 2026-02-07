"use client";

import { useState } from "react";
import Link from "next/link";
import { BoardOrientationToggle } from "@/components/BoardOrientationToggle";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveList } from "@/components/MoveList";
import { useChessGame } from "@/hooks/useChessGame";

export default function PlayPage() {
  const game = useChessGame();
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <header className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Home
        </Link>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Play (local)
        </h1>
        <BoardOrientationToggle
          value={boardOrientation}
          onChange={setBoardOrientation}
        />
      </header>
      <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-auto p-4">
        <div
          className="shrink-0"
          style={{
            width: "min(calc(100vw - 2rem), calc(100dvh - 6rem))",
            aspectRatio: "1",
          }}
        >
          <ChessBoard
            fen={game.fen}
            turn={game.turn}
            isGameOver={game.isGameOver}
            gameResult={game.gameResult}
            lastMove={game.lastMove}
            draggingFrom={game.draggingFrom}
            setDraggingFrom={game.setDraggingFrom}
            pendingPromotion={game.pendingPromotion}
            isWhitePromotion={game.isWhitePromotion}
            boardOrientation={boardOrientation}
            onPieceDrop={game.onPieceDrop}
            handlePromotionChoose={game.handlePromotionChoose}
            handlePromotionCancel={game.handlePromotionCancel}
          />
        </div>
        <section
          className="w-full max-w-[min(calc(100vw-2rem),calc(100dvh-6rem))] shrink-0 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
          aria-label="Move history"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Moves
          </h2>
          <MoveList moves={game.history} />
        </section>
      </div>
    </div>
  );
}
