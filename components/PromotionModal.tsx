"use client";

import { useEffect } from "react";
import type { PromotionPiece } from "@/lib/chess";

const PROMOTION_OPTIONS_WHITE = [
  { piece: "q" as const, symbol: "♕", label: "Queen" },
  { piece: "r" as const, symbol: "♖", label: "Rook" },
  { piece: "b" as const, symbol: "♗", label: "Bishop" },
  { piece: "n" as const, symbol: "♘", label: "Knight" },
];

const PROMOTION_OPTIONS_BLACK = [
  { piece: "q" as const, symbol: "♛", label: "Queen" },
  { piece: "r" as const, symbol: "♜", label: "Rook" },
  { piece: "b" as const, symbol: "♝", label: "Bishop" },
  { piece: "n" as const, symbol: "♞", label: "Knight" },
];

type Props = {
  isWhite: boolean;
  onChoose: (piece: PromotionPiece) => void;
  onCancel: () => void;
};

export function PromotionModal({ isWhite, onChoose, onCancel }: Props) {
  const options = isWhite ? PROMOTION_OPTIONS_WHITE : PROMOTION_OPTIONS_BLACK;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-label="Choose promotion piece"
    >
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-xl dark:bg-zinc-800">
        <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Choose piece
        </p>
        <div className="flex gap-2">
          {options.map(({ piece, symbol, label }) => (
            <button
              key={piece}
              type="button"
              onClick={() => onChoose(piece)}
              className="flex h-14 w-14 flex-col items-center justify-center rounded-lg border-2 border-zinc-200 bg-zinc-50 text-2xl transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-700 dark:hover:border-zinc-500 dark:hover:bg-zinc-600"
              aria-label={label}
            >
              {symbol}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
