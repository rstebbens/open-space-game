import styles from "@/styles/gamestyles";

export default function PlayerSeat({ hostId, player, index, total, plays, cardInfo, vote }) {
  // Work out where this player sits around the table.
  // ELI5: we place players around an invisible oval.
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;

  const radiusX = 42;
  const radiusY = 34;

  const left = 50 + Math.cos(angle) * radiusX;
  const top = 50 + Math.sin(angle) * radiusY;

  // Only show the last 4 cards this player played.
  const visiblePlays = plays.slice(-4);

  return (
    <div
      style={{
        ...styles.playerSeat,
        left: `${left}%`,
        top: `${top}%`,
      }}
    >
      <div
        style={{
          ...styles.playerAvatar,
          background: player.isYou ? "#3498db" : "#555",
        }}
      >
        {player.name?.[0]?.toUpperCase()}
      </div>

      <div style={styles.playerName}>
        {player.name}
        {player.isYou ? " (You)" : ""}
        {player.name === hostId && <span style={{ marginLeft: 6 }}>👑</span>}
      </div>

      <div style={styles.playerVoteBadge}>
        {vote === undefined || vote === null ? "Waiting…" : `Vote: ${vote}`}
      </div>

      <div style={styles.playedCardContainer}>
        {visiblePlays.map((play, cardIndex) => (
          <PlayedCard
            key={play.id}
            play={play}
            info={cardInfo[play.cardType]}
            cardIndex={cardIndex}
          />
        ))}
      </div>
    </div>
  );
}

function PlayedCard({ play, info, cardIndex }) {
  // ELI5: give each card a tiny tilt so they feel like real cards on a table.
  const rotation = (cardIndex - 1.5) * 4;

  return (
    <div
      style={{
        ...styles.playedCard,
        background: info?.colour || "#444",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div style={styles.playedCardType}>{play.cardType}</div>

      <div style={styles.playedCardTitle}>{info?.title}</div>

      {play.customTopic ? (
        <div style={styles.playedCardHandwritten}>
          {play.customTopic}
        </div>
      ) : (
        <div style={styles.playedCardSubtitle}>{info?.subtitle}</div>
      )}

      <div style={styles.playedCardPlayer}>{play.player}</div>
    </div>
  );
}