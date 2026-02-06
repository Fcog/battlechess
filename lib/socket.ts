"use client";

import { io } from "socket.io-client";

/**
 * Socket.io client connected to the same host (e.g. window.location.origin).
 * Only created in the browser; safe to use in client components.
 */
export const socket = typeof window !== "undefined" ? io() : (null as unknown as ReturnType<typeof io>);
