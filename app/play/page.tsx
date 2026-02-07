"use client";

import Link from "next/link";
import { ChessBoard } from "@/components/ChessBoard";

export default function PlayPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      <header className="flex shrink-0 items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Home
        </Link>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Play (local)
        </h1>
        <div className="w-12" />
      </header>
      <div className="flex min-h-0 flex-1 items-center justify-center p-4">
        <div
          className="shrink-0"
          style={{
            width: "min(calc(100vw - 2rem), calc(100dvh - 6rem))",
            aspectRatio: "1",
          }}
        >
          <ChessBoard />
        </div>
      </div>
    </div>
  );
}
