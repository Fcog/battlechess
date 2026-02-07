import { describe, expect, it } from "vitest";
import { STARTING_FEN } from "@/lib/chess";
import {
  isPromotionMove,
  tryApplyMove,
  tryApplyPromotionMove,
  isWhitePiece,
  getLegalTargetSquares,
} from "@/lib/chessMoves";

describe("isPromotionMove", () => {
  it("returns true for white pawn e7 to e8", () => {
    const fen = "4k3/4P3/8/8/8/8/8/4K3 w - - 0 1";
    expect(isPromotionMove(fen, "e7", "e8")).toBe(true);
  });

  it("returns true for black pawn e2 to e1", () => {
    const fen = "4k3/8/8/8/8/8/4p3/4K3 b - - 0 1";
    expect(isPromotionMove(fen, "e2", "e1")).toBe(true);
  });

  it("returns false for e2 to e4", () => {
    expect(isPromotionMove(STARTING_FEN, "e2", "e4")).toBe(false);
  });

  it("returns false for knight move", () => {
    expect(isPromotionMove(STARTING_FEN, "g1", "f3")).toBe(false);
  });
});

describe("tryApplyMove", () => {
  it("returns new FEN and SAN for e2-e4", () => {
    const result = tryApplyMove(STARTING_FEN, "e2", "e4");
    expect(result).not.toBeNull();
    expect(result!.san).toBe("e4");
    expect(result!.newFen).not.toBe(STARTING_FEN);
  });

  it("returns null for invalid move", () => {
    expect(tryApplyMove(STARTING_FEN, "e2", "e5")).toBeNull();
  });
});

describe("tryApplyPromotionMove", () => {
  it("returns new FEN and SAN for e7-e8=Q", () => {
    const fen = "5k2/4P3/8/8/8/8/8/4K3 w - - 0 1";
    const result = tryApplyPromotionMove(fen, "e7", "e8", "q");
    expect(result).not.toBeNull();
    expect(result!.san).toMatch(/e8=Q/);
  });

  it("returns null for invalid promotion (invalid move)", () => {
    expect(tryApplyPromotionMove(STARTING_FEN, "e2", "e5", "q")).toBeNull();
  });
});

describe("isWhitePiece", () => {
  it("returns true for e2 in starting position", () => {
    expect(isWhitePiece(STARTING_FEN, "e2")).toBe(true);
  });

  it("returns false for e7 in starting position", () => {
    expect(isWhitePiece(STARTING_FEN, "e7")).toBe(false);
  });
});

describe("getLegalTargetSquares", () => {
  it("returns e3 and e4 for e2 pawn in starting position", () => {
    const squares = getLegalTargetSquares(STARTING_FEN, "e2");
    expect(squares).toContain("e3");
    expect(squares).toContain("e4");
    expect(squares).toHaveLength(2);
  });

  it("returns empty array for empty square", () => {
    const squares = getLegalTargetSquares(STARTING_FEN, "e4");
    expect(squares).toEqual([]);
  });
});
