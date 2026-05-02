"use client";
import { useRoomHost } from "@/lib/useroomhost";
import React, { useState } from "react";
import {
  RoomProvider,
  useMutation,
  useOthers,
  useStorage,
} from "@liveblocks/react";
import { useSearchParams } from "next/navigation";
import { useCardCooldown } from "@/lib/usecardcooldown";
import { shuffleTopics } from "@/lib/topics";
import Card from "@/components/card";
import PlayerSeat from "@/components/playerseat";
import styles from "@/styles/gamestyles";
import { playCardInStorage } from "@/lib/playcard";

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
      initialPresence={{ name }}
      initialStorage={{
        currentTopic: "What dependencies are blocking us?",
        round: 1,
        plays: [],
	hostID : null,
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
  const [wolfOpen, setWolfOpen] = useState(false);
  const [wolfTopic, setWolfTopic] = useState("");
  const [topicDeck, setTopicDeck] = useState(() => shuffleTopics());
  const [isFlippingTopic, setIsFlippingTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const plays = useStorage((root) => root.plays) || [];
  const currentTopic =
    useStorage((root) => root.currentTopic) ||
    "What dependencies are blocking us?";
  const round = useStorage((root) => root.round) || 1;
  const playerHands = useStorage((root) => root.playerHands);

 const storageReady =
  hostStorageReady &&
  playerHands !== null &&
  playerHands !== undefined;

  const myHand = storageReady
    ? playerHands[name] || STARTING_HAND
    : [];

  const ensureHand = useMutation(({ storage }, playerName) => {
    const hands = storage.get("playerHands") || {};


    if (hands[playerName]) return;

    storage.set("playerHands", {
      ...hands,
      [playerName]: STARTING_HAND,

    });
  }, []);

  React.useEffect(() => {
    if (!storageReady) return;
    ensureHand(name);
  }, [storageReady, ensureHand, name]);

  const playCard = useMutation(
    ({ storage }, playerName, cardType, customTopic = "") => {
      playCardInStorage({
        storage,
        playerName,
        cardType,
        customTopic,
        startingHand: STARTING_HAND,
      });
    },
    []
  );

  const drawTopic = useMutation(({ storage }, topic) => {
    storage.set("currentTopic", topic.title);
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
      drawTopic(nextTopic);
      setTopicDeck(freshDeck.slice(1));
      setIsFlippingTopic(false);
    }, 450);
  }

  const newRound = useMutation(({ storage }) => {
    const hands = storage.get("playerHands") || {};
    const resetHands = {};

    Object.keys(hands).forEach((playerName) => {
      resetHands[playerName] = STARTING_HAND;
    });

    storage.set("playerHands", resetHands);
    storage.set("plays", []);

    const currentRound = storage.get("round") || 1;
    storage.set("round", currentRound + 1);
  }, []);

  function handleCardClick(cardType) {
    if (cardType === "WOLF") {
      setWolfOpen(true);
      return;
    }

    playCard(name, cardType);
  }

  function submitWolf() {
    const topic = wolfTopic.trim();

    if (!topic) return;

    playCard(name, "WOLF", topic);
    setWolfTopic("");
    setWolfOpen(false);
  }

  const players = [
    { name, isYou: true },
    ...others.map((other) => ({
      name: other.presence?.name || "Anonymous",
      isYou: false,
    })),
  ].slice(0, 12);

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
      <div style={{ color: "Gold", fontSize: 16 }}>
        	You are host 👑
	</div>
	  )}

          <h3 style={styles.historyTitle}>Played this round</h3>
	  

          {plays.length === 0 && <p>No cards played yet.</p>}

          {plays.map((play) => (
            <div key={play.id} style={styles.historyItem}>
              {play.player} played {play.cardType}
              {play.customTopic ? `: "${play.customTopic}"` : ""}
            </div>
          ))}
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
  onClick={() =>
    tryCardAction(() => {
      handleDrawTopic();
    })
  }
  style={{
    ...styles.topicCard,
    transform: isFlippingTopic
      ? "rotateY(180deg) scale(1.05)"
      : "rotateY(0deg)",
  }}
>
	    <div style={styles.selectedTopicLabelBack}>Host
		</div>
		<div style={styles.topicCardBack}>
		
		 CLICK TO FLIP               
                </div>


              </button>
            </div>

            <div style={styles.players}>
              {players.map((player, index) => (
                <PlayerSeat
		  hostId={isHost}
                  key={`${player.name}-${index}`}
                  player={player}
                  index={index}
                  total={players.length}
                  plays={plays.filter(
                    (play) => play.player === player.name
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
              key={cardType}
              cardType={cardType}
              info={CARD_INFO[cardType]}
              onClick={() => handleCardClick(cardType)}
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

              <button onClick={submitWolf} disabled={!wolfTopic.trim()}>
                Play WOLF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}