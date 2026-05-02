"use client";

import React from "react";
import { useMutation, useStorage } from "@liveblocks/react";

function getOrCreatePlayerId(roomId) {
  const key = `open-space-player-id:${roomId}`;

  let playerId = window.localStorage.getItem(key);

  if (!playerId) {
    playerId = crypto.randomUUID();
    window.localStorage.setItem(key, playerId);
  }

  return playerId;
}

export function useRoomHost(roomId) {
  const [playerId, setPlayerId] = React.useState(null);

  const hostState = useStorage((root) => ({
    hostId: root.hostId,
  }));

  const storageReady = hostState !== null && hostState !== undefined;
  const hostId = storageReady ? hostState.hostId : null;

  React.useEffect(() => {
    if (!roomId) return;
    setPlayerId(getOrCreatePlayerId(roomId));
  }, [roomId]);

  const claimHost = useMutation(({ storage }, idToClaim) => {
    const existingHostId = storage.get("hostId");

    if (!existingHostId) {
      storage.set("hostId", idToClaim);
    }
  }, []);

  React.useEffect(() => {
    if (!storageReady) return;
    if (!playerId) return;
    if (hostId) return;

    claimHost(playerId);
  }, [storageReady, playerId, hostId, claimHost]);

  return {
    playerId,
    hostId,
    isHost: Boolean(playerId && hostId && playerId === hostId),
    storageReady,
  };
}