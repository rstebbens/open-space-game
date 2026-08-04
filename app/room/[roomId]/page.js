"use client";

import React, { useState } from "react";
import {
  RoomProvider,
  useMutation,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react";
import { useSearchParams } from "next/navigation";

import { useRoomHost } from "@/lib/useroomhost";
import { useRoomLimit } from "@/lib/useroomlimit";
import { useCardCooldown } from "@/lib/usecardcooldown";
import { useElmoTimer } from "@/lib/useelmotimer";
import {
  shuffleTopics,
  parsePastedTopics,
} from "@/lib/topics";
import { playCardInStorage } from "@/lib/playcard";

import Card from "@/components/card";
import PlayerSeat from "@/components/playerseat";
import styles from "@/styles/gamestyles";

const STARTING_HAND = ["ELMO", "WOLF", "REVERSE", "REDRAW"];
const VOTE_OPTIONS = [1, 2, 3, 5, 8, 13, 21, 34, 55, "?"];

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
        selectedTopic: null,
        topicDeck: shuffleTopics(),
        customTopics: [],
        round: 1,
        plays: [],
        hostId: null,
        playerHands: {},
        roundVotes: {},
        votingClosed: false,
        voteRoundSummary: null,
        elmoTimerEndsAt: null,
      }}
    >
      <Game roomId={roomId} name={name} />
    </RoomProvider>
  );
}

function Game({ roomId, name }) {
  const { others, playerCount, maxPlayers, isRoomFull } = useRoomLimit();

  const updateMyPresence = useUpdateMyPresence();
  const [roundPressed, setRoundPressed] = useState(false);

  const {
    playerId,
    hostId,
    isHost,
    storageReady: hostStorageReady,
  } = useRoomHost(roomId);

  const { isCoolingDown, remainingMs, progress, tryCardAction } =
    useCardCooldown();

  const {
    isElmoActive,
    remainingMs: elmoRemainingMs,
    progress: elmoProgress,
    startElmoTimer,
    clearElmoTimer,
  } = useElmoTimer();

  const [wolfOpen, setWolfOpen] = useState(false);
  const [wolfTopic, setWolfTopic] = useState("");
  const [customTopicOpen, setCustomTopicOpen] = useState(false);
  const selectedTopic = useStorage((root) => root.selectedTopic);
  const topicDeck = useStorage((root) => root.topicDeck) || [];
  const roundVotes = useStorage((root) => root.roundVotes) || {};
  const votingClosed = useStorage((root) => root.votingClosed) || false;
  const voteRoundSummary = useStorage((root) => root.voteRoundSummary);

  const [topicPressed, setTopicPressed] = useState(false);
  const [isFlippingTopic, setIsFlippingTopic] = useState(false);

  const plays = useStorage((root) => root.plays) || [];
  const customTopics = useStorage((root) => root.customTopics) || [];
  const currentTopic =
    useStorage((root) => root.currentTopic) ||
    "What dependencies are blocking us?";
  const round = useStorage((root) => root.round) || 1;
  const playerHands = useStorage((root) => root.playerHands);
  const [customTopicInput, setCustomTopicInput] = useState("");
  const [customTopicError, setCustomTopicError] = useState("");

  React.useEffect(() => {
    if (!playerId) return;

    updateMyPresence({
      name,
      playerId,
    });
  }, [name, playerId, updateMyPresence]);

  const storageReady =
    hostStorageReady &&
    Boolean(playerId) &&
    playerHands !== null &&
    playerHands !== undefined;

  const myHand = storageReady ? playerHands[playerId] || STARTING_HAND : [];
  const myVote = roundVotes[playerId];

  const setCustomTopics = useMutation(({ storage }, topics) => {
    storage.set("customTopics", topics);
    storage.set("selectedTopic", null);
    storage.set("topicDeck", shuffleTopics(topics));
  }, []);

  const resetCustomTopics = useMutation(({ storage }) => {
    storage.set("customTopics", []);
    storage.set("selectedTopic", null);
    storage.set("topicDeck", shuffleTopics([]));
  }, []);

  const cardPlays = plays.filter((play) => play.cardType);
  const historyEvents = plays;

  const ensureHand = useMutation(({ storage }, id) => {
    const hands = storage.get("playerHands") || {};

    if (hands[id]) return;

    storage.set("playerHands", {
      ...hands,
      [id]: STARTING_HAND,
    });
  }, []);

  React.useEffect(() => {
    if (!storageReady || !playerId || isRoomFull) return;
    ensureHand(playerId);
  }, [storageReady, ensureHand, playerId, isRoomFull]);

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

  const drawTopic = useMutation(({ storage }, id, playerName) => {
    const deck = storage.get("topicDeck") || [];
    const freshDeck = deck.length > 0 ? deck : shuffleTopics(storage.get("customTopics") || []);
    const nextTopic = freshDeck[0];

    if (!nextTopic) return;

    storage.set("selectedTopic", nextTopic);
    storage.set("currentTopic", nextTopic.title);
    storage.set("topicDeck", freshDeck.slice(1));

    const existingPlays = storage.get("plays") || [];

    storage.set("plays", [
      ...existingPlays,
      {
        id: `${Date.now()}-${Math.random()}-flip`,
        type: "FLIP",
        playerId: id,
        player: playerName,
        topic: nextTopic.title,
        round: storage.get("round") || 1,
        time: Date.now(),
      },
    ]);
  }, []);

  const castVote = useMutation(({ storage }, id, value) => {
    if (storage.get("votingClosed")) return;

    const nextVotes = storage.get("roundVotes") || {};
    storage.set("roundVotes", {
      ...nextVotes,
      [id]: value,
    });
  }, []);

  const closeVotingRound = useMutation(({ storage }, missingPlayers = []) => {
    const summary = missingPlayers.length
      ? {
          status: "timeout",
          missingPlayers,
          closedAt: Date.now(),
        }
      : {
          status: "complete",
          missingPlayers: [],
          closedAt: Date.now(),
        };

    storage.set("votingClosed", true);
    storage.set("voteRoundSummary", summary);
  }, []);

  const resetRoundVoting = useMutation(({ storage }) => {
    storage.set("roundVotes", {});
    storage.set("votingClosed", false);
    storage.set("voteRoundSummary", null);
  }, []);

  const newRound = useMutation(({ storage }) => {
    const hands = storage.get("playerHands") || {};
    const resetHands = {};

    Object.keys(hands).forEach((id) => {
      resetHands[id] = STARTING_HAND;
    });

    storage.set("playerHands", resetHands);
    storage.set("plays", []);
    storage.set("selectedTopic", null);
    storage.set("topicDeck", shuffleTopics(storage.get("customTopics") || []));
    storage.set("roundVotes", {});
    storage.set("votingClosed", false);
    storage.set("voteRoundSummary", null);
    storage.set("elmoTimerEndsAt", null);

    const currentRound = storage.get("round") || 1;
    storage.set("round", currentRound + 1);
  }, []);

  function handleDrawTopic() {
    if (!isHost || !playerId || isRoomFull) return;

    setIsFlippingTopic(true);

    setTimeout(() => {
      clearElmoTimer();
      startElmoTimer();
      resetRoundVoting();
      drawTopic(playerId, name);
      setIsFlippingTopic(false);
    }, 450);
  }

  function handleHostFlip() {
    if (!isHost || isRoomFull) return;

    setTopicPressed(true);
    setTimeout(() => setTopicPressed(false), 160);

    tryCardAction(handleDrawTopic);
  }

  function closeCustomTopicModal() {
    setCustomTopicOpen(false);
    setCustomTopicInput("");
    setCustomTopicError("");
  }

  function submitCustomTopics() {
    if (!playerId || !isHost || isRoomFull) return;

    const parsedTopics = parsePastedTopics(customTopicInput);

    if (parsedTopics.length === 0) {
      setCustomTopicError(
        "Paste one or more valid topics. Use: Heading | Supporting question or just Heading."
      );
      return;
    }

    setCustomTopics(parsedTopics);
    closeCustomTopicModal();
  }

  function handleCardClick(cardType) {
    if (!playerId || isRoomFull) return;

    if (cardType === "WOLF") {
      setWolfOpen(true);
      return;
    }

    playCard(playerId, cardType, "", name);

    if (cardType === "ELMO") {
      startElmoTimer();
    }
  }

  function submitWolf() {
    if (!playerId || isRoomFull) return;

    const topic = wolfTopic.trim();

    if (!topic) return;

    playCard(playerId, "WOLF", topic, name);
    setWolfTopic("");
    setWolfOpen(false);
  }

  const players = [
    { id: playerId, name, isYou: true },
    ...others.map((other) => ({
      id: other.presence?.playerId || `connection-${other.connectionId}`,
      name: other.presence?.name || "Anonymous",
      isYou: false,
    })),
  ]
    .filter((player) => player.id)
    .slice(0, maxPlayers);

  const voteCount = players.filter((player) => roundVotes[player.id] !== undefined && roundVotes[player.id] !== null).length;
  const missingVoters = players
    .filter((player) => roundVotes[player.id] === undefined || roundVotes[player.id] === null)
    .map((player) => player.name);
  const isEstimationMode = Boolean(selectedTopic && (isElmoActive || votingClosed));

  React.useEffect(() => {
    if (!selectedTopic || votingClosed) return;

    const allVotesIn = players.length > 0 && players.every((player) => {
      const vote = roundVotes[player.id];
      return vote !== undefined && vote !== null;
    });

    if (allVotesIn) {
      clearElmoTimer();
      closeVotingRound([]);
      return;
    }

    if (!isElmoActive) {
      closeVotingRound(missingVoters);
    }
  }, [selectedTopic, votingClosed, players, roundVotes, isElmoActive, clearElmoTimer, closeVotingRound, missingVoters]);

  if (!storageReady) {
    return (
      <main style={styles.page}>
        <div style={{ padding: 40 }}>Loading game...</div>
      </main>
    );
  }

  if (isRoomFull) {
    return (
      <main style={styles.page}>
        <div style={{ padding: 40, textAlign: "center" }}>
          <h1>Room full</h1>
          <p>
            This session already has {maxPlayers} people in it, including the
            host.
          </p>
          <p>Please ask the host to create a new room.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <strong>Open Space Card Game</strong>
          <div style={styles.room}>
            Room: {roomId} · Players: {playerCount}/{maxPlayers}
          </div>
        </div>

        <div style={styles.topic}>
          Round {round}: {currentTopic}
        </div>

        <button
          onClick={() => {
            if (!isHost || isRoomFull) return;

            setRoundPressed(true);
            setTimeout(() => setRoundPressed(false), 160);

            clearElmoTimer();
            newRound();
          }}
          style={{
            ...styles.newRoundButton,
            opacity: isHost ? 1 : 0.4,
            cursor: isHost ? "pointer" : "not-allowed",
            transform: roundPressed
              ? "scale(0.94) translateY(2px)"
              : "scale(1)",
            transition: "transform 0.12s ease",
          }}
        >
          👑 New Round
        </button>
      </header>

      <section style={styles.mainArea}>
        <aside style={styles.historyPanel}>
          {isHost && (
            <>
              <div style={{ color: "gold", fontSize: 16, marginBottom: 10 }}>
                You are host 👑
              </div>
              <button
                type="button"
                onClick={() => setCustomTopicOpen(true)}
                style={styles.customTopicButton}
              >
                Custom topics
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isHost || isRoomFull) return;
                  resetCustomTopics();
                }}
                style={{
                  ...styles.customTopicButton,
                  background: "#666",
                  marginTop: 8,
                }}
              >
                Reset to defaults
              </button>
            </>
          )}

          <div style={styles.cooldownPanel}>
            <div style={styles.cooldownTitle}>Card Cooldown</div>

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

          <div style={styles.cooldownPanel}>
            <div style={styles.cooldownTitle}>ELMO Timer</div>

            {isElmoActive ? (
              <>
                <div style={styles.cooldownText}>
                  Wrap up: {Math.ceil(elmoRemainingMs / 1000)}s
                </div>

                <div style={styles.cooldownTrack}>
                  <div
                    style={{
                      ...styles.cooldownFill,
                      width: `${elmoProgress}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <div style={styles.cooldownReady}>No active ELMO</div>
            )}
          </div>

          <div style={styles.cooldownPanel}>
            <div style={styles.cooldownTitle}>Planning Poker</div>
            <div style={styles.cooldownText}>
              {votingClosed
                ? voteRoundSummary?.status === "timeout"
                  ? "Round ended on timer"
                  : "Everyone voted"
                : `${voteCount}/${players.length} voted`}
            </div>

            {missingVoters.length > 0 && (
              <div style={styles.voteMissing}>
                Missing: {missingVoters.join(", ")}
              </div>
            )}

            {voteRoundSummary?.missingPlayers?.length > 0 && (
              <div style={styles.voteMissing}>
                Timed out: {voteRoundSummary.missingPlayers.join(", ")}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                if (!isHost || isRoomFull) return;

                resetRoundVoting();
                startElmoTimer();
              }}
              disabled={!isHost || isRoomFull}
              style={{
                ...styles.estimateButton,
                opacity: !isHost || isRoomFull ? 0.45 : 1,
                cursor: !isHost || isRoomFull ? "not-allowed" : "pointer",
              }}
            >
              Estimate
            </button>
          </div>

          <h3 style={styles.historyTitle}>Played this round</h3>

          {historyEvents.length === 0 && <p>No cards played yet.</p>}

          {historyEvents.map((play) => {
            if (play.type === "FLIP") {
              return (
                <div key={play.id} style={styles.historyItem}>
                  🎴 {play.player} flipped topic: &quot;{play.topic}&quot;
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
                  <div style={styles.selectedTopicLabel}>Selected Topic</div>

                  <div style={styles.selectedTopicCard}>
                    <div style={styles.topicCardType}>{selectedTopic.type}</div>

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

                <div style={styles.topicCardBack}>CLICK TO FLIP</div>
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
                  vote={roundVotes[player.id]}
                  plays={cardPlays.filter(
                    (play) => play.playerId === player.id
                  )}
                  cardInfo={CARD_INFO}
                />
              ))}
            </div>
          </section>
        </div>
      </section>

      <section style={styles.handArea}>
        {!isEstimationMode && (
          <>
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
              <div style={styles.emptyHand}>No cards left this round.</div>
            )}
          </>
        )}

        {isEstimationMode && (
          <>
            <div style={styles.handLabel}>Planning poker cards</div>

            <div style={styles.hand}>
              {VOTE_OPTIONS.map((option, index) => {
                const isSelected = myVote === option;

                return (
                  <button
                    key={String(option)}
                    type="button"
                    onClick={() => castVote(playerId, option)}
                    disabled={!selectedTopic || votingClosed}
                    style={{
                      ...styles.estimateCard,
                      transform: isSelected ? "translateY(-12px)" : "translateY(0)",
                      opacity: !selectedTopic || votingClosed ? 0.55 : 1,
                      marginLeft: index === 0 ? 0 : -8,
                    }}
                  >
                    <div style={styles.estimateCardValue}>{option}</div>
                  </button>
                );
              })}
            </div>

            <div style={styles.pokerHint}>
              {votingClosed
                ? "Votes are locked for this round."
                : "Pick a number card. The room sees it instantly."}
            </div>
          </>
        )}
      </section>

      {customTopicOpen && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h2>Add custom topics</h2>

            <textarea
              value={customTopicInput}
              onChange={(e) => {
                setCustomTopicInput(e.target.value);
                setCustomTopicError("");
              }}
              placeholder={`Paste one card per line:
Heading | Supporting question`}
              style={styles.textarea}
            />

            <div style={styles.customTopicHint}>
              Use: <strong>Heading | Supporting question</strong> or just <strong>Heading</strong>
            </div>

            <div style={styles.customTopicText}>
              Example:<br />
              Better Refinement | How do we make backlog refinement less painful?<br />
              Daily Stand-ups | What would make our stand-ups less theatre?
            </div>

            {customTopicError ? (
              <div style={styles.customTopicError}>{customTopicError}</div>
            ) : null}

            <div style={styles.modalActions}>
              <button type="button" onClick={closeCustomTopicModal}>
                Cancel
              </button>
              <button type="button" onClick={submitCustomTopics}>
                Add custom topics
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button onClick={() => setWolfOpen(false)}>Cancel</button>

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