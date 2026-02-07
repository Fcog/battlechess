"use client";

type Props = {
  value: "white" | "black";
  onChange: (value: "white" | "black") => void;
};

export function BoardOrientationToggle({ value, onChange }: Props) {
  const toggle = () => onChange(value === "white" ? "black" : "white");

  return (
    <button
      type="button"
      onClick={toggle}
      className="shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
      aria-label={
        value === "white"
          ? "Flip board to black perspective"
          : "Flip board to white perspective"
      }
    >
      Flip board
    </button>
  );
}
