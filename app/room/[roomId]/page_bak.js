"use client";

import React, { useState } from "react";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useStorage,
} from "@liveblocks/react";
import { useSearchParams } from "next/navigation";

import { useRoomHost } from "@/lib/useroomhost";
import { useCardCooldown } from "@/lib/usecardcooldown";
import { shuffleTopics } from "@/lib/topics";
import { playCardInStorage } from "@/lib/playcard";

import Card from "@/components/card";
import PlayerSeat from "@/components/playerseat";
import styles from "@/styles/gamestyles";

const STARTING_HAND = ["ELMO", "WOLF", "REVERSE", "REDRAW"];

const CARD_INFO = {
  ELMO: {
    colour: "#E74C3C",
    title: "MOVE ON",
    subtitle: "Conversation is looping",
  },
  WOLF: {
    colour: "#F39C12",
    title: "NEW TOPIC",
    subtitle: "Pitch a topic",
  },
  REVERSE: {
    colour: "#F1C40F",
    title: "FLIP IT",
    subtitle: "What if the opposite is true?",
  },
  REDRAW: {
    colour: "#2ECC71",
    title: "SWAP IT",
    subtitle: "Pick a different topic",
  },
};

export default function RoomPage({ params }) {
  const { roomId } = React.use(params);
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Anonymous";

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        name,
        playerId: null,
      }}
      initialStorage={{
        currentTopic: "What dependencies are blocking us?",
        round: 1,
        plays: [],
        hostId: null,
        playerHands: {},
      }}
    >
      <Game roomId={roomId} name={name} />
    </RoomProvider>
  );
}

function Game({ roomId, name }) {
  const others = useOthers();

  const {
    playerId,
    hostId,
    isHost,
    storageReady: hostStorageReady,
  } = useRoomHost(roomId);

  const {
    isCoolingDown,
    remainingMs,
    progress,
    tryCardAction,
  } = useCardCooldown();

  const [wolfOpen, setWolfOpen] = useState(false);
  const [wolfTopic, setWolfTopic] = useState("");
  const [topicDeck, setTopicDeck] = useState(() => shuffleTopics());
  const [isFlippingTopic, setIsFlippingTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicPressed, setTopicPressed] = useState(false);

  const plays = useStorage((root) => root.plays) || [];
  const currentTopic =
    useStorage((root) => root.currentTopic) ||
    "What dependencies are blocking us?";
  const round = useStorage((root) => root.round) || 1;
  const playerHands = useStorage((root) => root.playerHands);

  const storageReady =
    hostStorageReady &&
    playerId &&
    playerHands !== null &&
    playerHands !== undefined;

  const myHand = storageReady
    ? playerHands[playerId] || STARTING_HAND
    : [];

  const ensureHand = useMutation(({ storage }, id) => {
    const hands = storage.get("playerHands") || {};

    if (hands[id]) return;

    storage.set("playerHands", {
      ...hands,
      [id]: STARTING_HAND,
    });
  }, []);

  React.useEffect(() => {
    if (!storageReady || !playerId) return;
    ensureHand(playerId);
  }, [storageReady, ensureHand, playerId]);

  const playCard = useMutation(
    ({ storage }, id, cardType, customTopic = "", playerName = "Anonymous") => {
      playCardInStorage({
        storage,
        playerId: id,
        playerName,
        cardType,
        customTopic,
        startingHand: STARTING_HAND,
      });
    },
    []
  );

  const drawTopic = useMutation(({ storage }, topic, playerId, playerName) => {
  storage.set("currentTopic", topic.title);

  const existingPlays = storage.get("plays") || [];

  storage.set("plays", [
    ...existingPlays,
    {
      id: `${Date.now()}-flip`,
      type: "FLIP",
      playerId,
      player: playerName,
      topic: topic.title,
      round: storage.get("round") || 1,
      time: Date.now(),
    },
  ]);
}, []);

  const newRound = useMutation(({ storage }) => {
    const hands = storage.get("playerHands") || {};
    const resetHands = {};

    Object.keys(hands).forEach((id) => {
      resetHands[id] = STARTING_HAND;
    });

    storage.set("playerHands", resetHands);
    storage.set("plays", []);

    const currentRound = storage.get("round") || 1;
    storage.set("round", currentRound + 1);
  }, []);

  function handleDrawTopic() {
    if (!isHost) {
      console.log("Not host", { playerId, hostId, isHost });
      return;
    }

    const freshDeck = topicDeck.length > 0 ? topicDeck : shuffleTopics();
    const nextTopic = freshDeck[0];

    setIsFlippingTopic(true);

    setTimeout(() => {
      setSelectedTopic(nextTopic);
      drawTopic(nextTopic, playerId, name);
      setTopicDeck(freshDeck.slice(1));
      setIsFlippingTopic(false);
    }, 450);
  }

  function handleHostFlip() {
    if (!isHost) return;

    setTopicPressed(true);
    setTimeout(() => setTopicPressed(false), 160);

    tryCardAction(handleDrawTopic);
  }

  function handleCardClick(cardType) {
    if (!playerId) return;

    if (cardType === "WOLF") {
      setWolfOpen(true);
      return;
    }

    playCard(playerId, cardType, "", name);
  }

  function submitWolf() {
    if (!playerId) return;

    const topic = wolfTopic.trim();

    if (!topic) return;

    playCard(playerId, "WOLF", topic, name);
    setWolfTopic("");
    setWolfOpen(false);
  }

  const players = [
    { id: playerId, name, isYou: true },
    ...others.map((other) => ({
      id: other.presence?.playerId,
      name: other.presence?.name || "Anonymous",
      isYou: false,
    })),
  ]
    .filter((player) => player.id)
    .slice(0, 12);

  if (!storageReady) {
    return (
      <main style={styles.page}>
        <div style={{ padding: 40 }}>Loading game...</div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <strong>Open Space Card Game</strong>
          <div style={styles.room}>Room: {roomId}</div>
        </div>

        <div style={styles.topic}>
          Round {round}: {currentTopic}
        </div>

        <button onClick={newRound} style={styles.newRoundButton}>
          New Round
        </button>
      </header>

      <section style={styles.mainArea}>
        <aside style={styles.historyPanel}>
          {isHost && (
            <div style={{ color: "gold", fontSize: 16, marginBottom: 10 }}>
              You are host 👑
            </div>
          )}

          <div style={styles.cooldownPanel}>
            <div style={styles.cooldownTitle}>Cooldown</div>

            {isCoolingDown ? (
              <>
                <div style={styles.cooldownText}>
                  {(remainingMs / 1000).toFixed(1)}s
                </div>

                <div style={styles.cooldownTrack}>
                  <div
                    style={{
                      ...styles.cooldownFill,
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={styles.cooldownReady}>Ready</div>
            )}
          </div>

          <h3 style={styles.historyTitle}>Played this round</h3>

          {plays.length === 0 && <p>No cards played yet.</p>}

          {plays.map((play) => {
  if (play.type === "FLIP") {
    return (
      <div key={play.id} style={styles.historyItem}>
        🎴 {play.player} flipped topic: "{play.topic}"
      </div>
    );
  }

  return (
    <div key={play.id} style={styles.historyItem}>
      {play.player} played {play.cardType}
      {play.customTopic ? `: "${play.customTopic}"` : ""}
    </div>
  );
})}
        </aside>

        <div style={styles.tableOuter}>
          <section style={styles.table}>
            <h2 style={styles.tableTitle}>Table</h2>

            <div style={styles.topicTableArea}>
              {selectedTopic && (
                <div style={styles.selectedTopicArea}>
                  <div style={styles.selectedTopicLabel}>
                    Selected Topic
                  </div>

                  <div style={styles.selectedTopicCard}>
                    <div style={styles.topicCardType}>
                      {selectedTopic.type}
                    </div>

                    <div style={styles.topicCardTitle}>
                      {selectedTopic.title}
                    </div>

                    <div style={styles.topicCardPrompt}>
                      {selectedTopic.prompt}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleHostFlip}
                style={{
                  ...styles.topicCard,
                  opacity: !isHost ? 0.45 : isCoolingDown ? 0.6 : 1,
                  cursor: !isHost
                    ? "not-allowed"
                    : isCoolingDown
                    ? "wait"
                    : "pointer",
                  transform: isFlippingTopic
                    ? "rotateY(180deg) scale(1.05)"
                    : topicPressed
                    ? "scale(0.94) translateY(4px)"
                    : "rotateY(0deg)",
                }}
              >
                <div style={styles.selectedTopicLabelBack}>Host</div>

                <div style={styles.topicCardBack}>
                  CLICK TO FLIP
                </div>
              </button>
            </div>

            <div style={styles.players}>
  {players.map((player, index) => (
    <PlayerSeat
      key={`${player.id}-${index}`}
      hostId={hostId}
      player={player}
      index={index}
      total={players.length}
      plays={plays.filter(
        (play) =>
          play.playerId === player.id &&
          play.type !== "FLIP" &&
          play.cardType
      )}
      cardInfo={CARD_INFO}
    />
  ))}
</div>
          </section>
        </div>
      </section>

      <section style={styles.handArea}>
        <div style={styles.handLabel}>Your hand</div>

        <div style={styles.hand}>
          {myHand.map((cardType, index) => (
            <Card
              key={`${cardType}-${index}`}
              cardType={cardType}
              info={CARD_INFO[cardType]}
              onClick={() =>
                tryCardAction(() => {
                  handleCardClick(cardType);
                })
              }
              index={index}
            />
          ))}
        </div>

        {myHand.length === 0 && (
          <div style={styles.emptyHand}>
            No cards left this round.
          </div>
        )}
      </section>

      {wolfOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h2>WOLF: Pitch a topic</h2>

            <textarea
              value={wolfTopic}
              onChange={(e) => setWolfTopic(e.target.value)}
              placeholder="What should the group discuss?"
              style={styles.textarea}
            />

            <div style={styles.modalActions}>
              <button onClick={() => setWolfOpen(false)}>
                Cancel
              </button>

              <button
                onClick={() => tryCardAction(submitWolf)}
                disabled={!wolfTopic.trim()}
              >
                Play WOLF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}