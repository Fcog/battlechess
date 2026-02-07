"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { socket } from "@/lib/socket";

export default function Home() {
  const { data: session, status } = useSession();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    if (socket.connected) setIsConnected(true);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-6 p-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Chess App
        </h1>

        {status === "loading" ? (
          <p className="text-zinc-500">Loading…</p>
        ) : session ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Signed in as{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {session.user?.email ?? session.user?.name ?? "User"}
              </span>
            </p>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sign in
          </Link>
        )}

        <Link
          href="/play"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Play locally
        </Link>
        <p className="text-zinc-600 dark:text-zinc-400">
          Socket.io:{" "}
          <span
            className={
              isConnected
                ? "font-medium text-green-600 dark:text-green-400"
                : "font-medium text-amber-600 dark:text-amber-400"
            }
          >
            {isConnected ? "connected" : "disconnected"}
          </span>
        </p>
      </main>
    </div>
  );
}
