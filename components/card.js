import styles from "@/styles/gamestyles";

export default function Card({ cardType, info, onClick, index }) {
  const rotations = [-10, -3, 4, 11];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles.card,
        background: info.colour,
        transform: `rotate(${rotations[index] || 0}deg)`,
        marginLeft: index === 0 ? 0 : -36,
      }}
    >
      <div style={styles.cardType}>{cardType}</div>

      <div style={styles.cardTitle}>{info.title}</div>

      <div style={styles.cardSubtitle}>{info.subtitle}</div>
    </button>
  );
}