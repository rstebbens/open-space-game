// lib/useroomlimit.js

import { useOthers } from "@liveblocks/react";

const MAX_PLAYERS = 10;

export function useRoomLimit() {
  const others = useOthers();

  const playerCount = others.length + 1;
  const isRoomFull = playerCount > MAX_PLAYERS;

  return {
    others,
    playerCount,
    maxPlayers: MAX_PLAYERS,
    isRoomFull,
  };
}