"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { BoardOrientationToggle } from "@/components/BoardOrientationToggle";
import { ChessBoard } from "@/components/ChessBoard";
import { MoveList } from "@/components/MoveList";
import { useChessGame } from "@/hooks/useChessGame";
import { playMoveSound } from "@/lib/moveSound";

type Game = {
  id: string;
  fen: string;
  status: string;
  winner: string | null;
  whiteId: string | null;
  blackId: string | null;
};

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const id = typeof params.id === "string" ? params.id : "";
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">("white");

  const isPlayer = game && session?.user?.id && (game.whiteId === session.user.id || game.blackId === session.user.id);
  const canJoin = game?.status === "waiting" && !game.blackId && game.whiteId !== session?.user?.id;

  useEffect(() => {
    if (!id || sessionStatus === "loading") return;
    if (sessionStatus === "unauthenticated") {
      router.replace("/auth/signin?callbackUrl=" + encodeURIComponent("/game/" + id));
      return;
    }
    let cancelled = false;
    fetch("/api/games/" + id, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Game not found");
          if (res.status === 403) throw new Error("You can’t access this game");
          throw new Error("Failed to load game");
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setGame(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? "Something went wrong");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, sessionStatus, router]);

  async function handleJoinAsBlack() {
    if (!id || !session?.user || joining) return;
    setJoining(true);
    try {
      const res = await fetch("/api/games/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join: true }),
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to join");
      }
      const updated = await res.json();
      setGame(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join");
    } finally {
      setJoining(false);
    }
  }

  const chess = useChessGame({
    initialFen: game?.fen ?? null,
    onMove: playMoveSound,
  });

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <p className="text-zinc-500">Loading game…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-50 p-4 dark:bg-zinc-900">
        <p className="text-center text-zinc-700 dark:text-zinc-300">{error}</p>
        <Link
          href="/"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          ← Home
        </Link>
      </div>
    );
  }

  if (!game) {
    return null;
  }

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
          Game {game.status === "waiting" ? "(waiting)" : game.status === "active" ? "" : `(${game.status})`}
        </h1>
        <BoardOrientationToggle value={boardOrientation} onChange={setBoardOrientation} />
      </header>

      {game.status === "waiting" && (
        <div className="shrink-0 px-4 pb-2">
          {isPlayer && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
              Waiting for opponent. Share this link to invite someone.
            </p>
          )}
          {canJoin && (
            <button
              type="button"
              onClick={handleJoinAsBlack}
              disabled={joining}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {joining ? "Joining…" : "Join as black"}
            </button>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-auto p-4">
        <div
          className="shrink-0"
          style={{
            width: "min(calc(100vw - 2rem), calc(100dvh - 8rem))",
            aspectRatio: "1",
          }}
        >
          <ChessBoard
            fen={chess.fen}
            turn={chess.turn}
            isGameOver={chess.isGameOver}
            gameResult={chess.gameResult}
            lastMove={chess.lastMove}
            draggingFrom={chess.draggingFrom}
            setDraggingFrom={chess.setDraggingFrom}
            pendingPromotion={chess.pendingPromotion}
            isWhitePromotion={chess.isWhitePromotion}
            boardOrientation={boardOrientation}
            onPieceDrop={chess.onPieceDrop}
            handlePromotionChoose={chess.handlePromotionChoose}
            handlePromotionCancel={chess.handlePromotionCancel}
          />
        </div>
        <section
          className="w-full max-w-[min(calc(100vw-2rem),calc(100dvh-8rem))] shrink-0 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
          aria-label="Move history"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Moves
          </h2>
          <MoveList moves={chess.history} />
        </section>
      </div>
    </div>
  );
}
