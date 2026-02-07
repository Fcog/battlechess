"use client";

/**
 * Renders a list of moves in standard format: "1. e4 e5 2. Nf3 Nc6 ..."
 */
export function MoveList({ moves }: { moves: string[] }) {
  if (moves.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        No moves yet
      </p>
    );
  }

  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push([moves[i], moves[i + 1]]);
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-zinc-700 dark:text-zinc-300">
      {pairs.map(([white, black], index) => (
        <span key={index} className="inline-flex gap-1.5">
          <span className="font-medium text-zinc-500 dark:text-zinc-400">
            {index + 1}.
          </span>
          <span>{white}</span>
          {black != null && <span>{black}</span>}
        </span>
      ))}
    </div>
  );
}
