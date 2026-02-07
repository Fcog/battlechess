import { describe, expect, it } from "vitest";
import { Chess } from "chess.js";
import { getGameResult } from "@/lib/chess";

describe("getGameResult", () => {
  it("returns null for starting position", () => {
    const game = new Chess();
    expect(getGameResult(game)).toBeNull();
  });

  it('returns "White wins by checkmate" when black is checkmated', () => {
    const game = new Chess();
    game.move("e4");
    game.move("e5");
    game.move("Qh5");
    game.move("Nc6");
    game.move("Bc4");
    game.move("Nf6");
    game.move("Qxf7#");
    expect(getGameResult(game)).toBe("White wins by checkmate");
  });

  it('returns "Black wins by checkmate" when white is checkmated', () => {
    const game = new Chess();
    game.move("f3");
    game.move("e5");
    game.move("g4");
    game.move("Qh4#");
    expect(getGameResult(game)).toBe("Black wins by checkmate");
  });

  it('returns "Stalemate (draw)" for stalemate position', () => {
    const game = new Chess("7k/5Q2/5K2/8/8/8/8/8 b - - 0 1");
    expect(getGameResult(game)).toBe("Stalemate (draw)");
  });
});
