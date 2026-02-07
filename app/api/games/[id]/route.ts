import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function canAccessGame(game: { whiteId: string | null; blackId: string | null }, userId: string) {
  return game.whiteId === userId || game.blackId === userId;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const game = await prisma.game.findUnique({ where: { id } });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }
  // Allow access if user is a player, or if game is waiting (so anyone can view and join)
  if (!canAccessGame(game, session.user.id) && game.status !== "waiting") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(game);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const game = await prisma.game.findUnique({ where: { id } });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  // Join as black: allowed when game is waiting, no black yet, and user is not white
  if (body.join === true) {
    if (game.status !== "waiting" || game.blackId != null) {
      return NextResponse.json({ error: "Game is not joinable" }, { status: 400 });
    }
    if (game.whiteId === session.user.id) {
      return NextResponse.json({ error: "Cannot join your own game" }, { status: 400 });
    }
    const updated = await prisma.game.update({
      where: { id },
      data: { blackId: session.user.id, status: "active" },
    });
    return NextResponse.json(updated);
  }

  if (!canAccessGame(game, session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fen = typeof body.fen === "string" ? body.fen : undefined;
  const status =
    typeof body.status === "string" && ["waiting", "active", "finished", "abandoned"].includes(body.status)
      ? body.status
      : undefined;
  const winner =
    typeof body.winner === "string" && ["white", "black", "draw"].includes(body.winner)
      ? body.winner
      : undefined;

  if (fen === undefined && status === undefined && winner === undefined) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.game.update({
    where: { id },
    data: {
      ...(fen !== undefined && { fen }),
      ...(status !== undefined && { status }),
      ...(winner !== undefined && { winner }),
    },
  });

  return NextResponse.json(updated);
}
