// lib/useelmotimer.js
"use client";

import React from "react";
import { useMutation, useStorage } from "@liveblocks/react";

const ELMO_DURATION_MS = 30_000;

export function useElmoTimer() {
  const elmoTimerEndsAt = useStorage((root) => root.elmoTimerEndsAt);
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = elmoTimerEndsAt
    ? Math.max(0, elmoTimerEndsAt - now)
    : 0;

  const isElmoActive = remainingMs > 0;

  const progress = isElmoActive
    ? Math.max(0, Math.min(100, (remainingMs / ELMO_DURATION_MS) * 100))
    : 0;

  const startElmoTimer = useMutation(({ storage }) => {
    storage.set("elmoTimerEndsAt", Date.now() + ELMO_DURATION_MS);
  }, []);

  const clearElmoTimer = useMutation(({ storage }) => {
    storage.set("elmoTimerEndsAt", null);
  }, []);

  return {
    isElmoActive,
    remainingMs,
    progress,
    startElmoTimer,
    clearElmoTimer,
  };
}