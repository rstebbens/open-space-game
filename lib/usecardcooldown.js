"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const COOLDOWN_LEVELS = [2000, 5000, 10000];

export function useCardCooldown() {
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [cooldownMs, setCooldownMs] = useState(COOLDOWN_LEVELS[0]);
  const [now, setNow] = useState(Date.now());

  const penaltyIndexRef = useRef(0);

  // ticking clock
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 50);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = Math.max(0, cooldownUntil - now);
  const isCoolingDown = remainingMs > 0;

  // ✅ RESET PENALTY WHEN COOLDOWN FINISHES
  useEffect(() => {
    if (!isCoolingDown && cooldownUntil !== 0) {
      penaltyIndexRef.current = 0;
      setCooldownMs(COOLDOWN_LEVELS[0]);
    }
  }, [isCoolingDown, cooldownUntil]);

  const progress = useMemo(() => {
    if (!isCoolingDown) return 0;
    return Math.max(0, Math.min(100, (remainingMs / cooldownMs) * 100));
  }, [isCoolingDown, remainingMs, cooldownMs]);

  function tryCardAction(action) {
    const currentTime = Date.now();

    // 🚫 clicked during cooldown → escalate
    if (cooldownUntil > currentTime) {
      penaltyIndexRef.current = Math.min(
        penaltyIndexRef.current + 1,
        COOLDOWN_LEVELS.length - 1
      );

      const penalty = COOLDOWN_LEVELS[penaltyIndexRef.current];

      setCooldownMs(penalty);
      setCooldownUntil(currentTime + penalty);

      return false;
    }

    // ✅ allowed action
    action?.();

    const nextCooldown = COOLDOWN_LEVELS[penaltyIndexRef.current];

    setCooldownMs(nextCooldown);
    setCooldownUntil(currentTime + nextCooldown);

    return true;
  }

  return {
    isCoolingDown,
    remainingMs,
    progress,
    cooldownMs,
    tryCardAction,
  };
}