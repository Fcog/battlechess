"use client";

import Link from "next/link";
import { ChessBoard } from "@/components/ChessBoard";

export default function PlayPage() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 p-6 dark:bg-zinc-900">
      <header className="flex w-full max-w-[560px] items-center justify-between">
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
      <div className="flex justify-center">
        <ChessBoard />
      </div>
    </div>
  );
}
