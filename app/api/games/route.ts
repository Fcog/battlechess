import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const games = await prisma.game.findMany({
    where: {
      OR: [{ whiteId: session.user.id }, { blackId: session.user.id }],
      ...(status ? { status } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(games);
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const game = await prisma.game.create({
    data: {
      whiteId: session.user.id,
      status: "waiting",
    },
  });

  return NextResponse.json(game, { status: 201 });
}
