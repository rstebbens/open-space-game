import type { CSSProperties } from "react";
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    height: "100dvh",
    background: "#151515",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" ,
  },

  header: {
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    borderBottom: "1px solid #333",
  },

  room: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },

  topic: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: "center",
    flex: 1,
  },

  newRoundButton: {
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    background: "#f1c40f",
    color: "#111",
    fontWeight: 900,
    cursor: "pointer",
  },

  mainArea: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 20,
    padding: "16px 24px 0",
    flex: 1,
    minHeight: 0,
  },

  historyPanel: {
    background: "#181818",
    borderRadius: 20,
    padding: 18,
    overflowY: "auto",
    boxShadow: "inset 0 0 30px rgba(0,0,0,0.35)",
  },

  historyTitle: {
    margin: "0 0 14px",
    fontSize: 18,
  },

  historyItem: {
    fontSize: 13,
    lineHeight: 1.35,
    marginBottom: 6,
    color: "#ddd",
  },

  cooldownPanel: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  customTopicPanel: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  customTopicHeader: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#eee",
  },

  customTopicTextarea: {
    width: "100%",
    minHeight: 120,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    fontSize: 14,
    padding: 12,
    resize: "vertical",
    marginBottom: 10,
  },

  customTopicButton: {
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    background: "#2980b9",
    color: "white",
    cursor: "pointer",
    width: "100%",
    fontWeight: 700,
  },

  customTopicError: {
    color: "#e74c3c",
    marginBottom: 10,
    fontSize: 13,
  },

  customTopicHint: {
    marginBottom: 10,
    fontSize: 12,
    color: "#bbb",
  },

  customTopicText: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 1.5,
    color: "#ddd",
  },

  customTopicList: {
    maxHeight: 160,
    overflowY: "auto",
    marginBottom: 10,
    display: "grid",
    gap: 6,
  },

  customTopicItem: {
    fontSize: 13,
    lineHeight: 1.4,
    padding: "8px 10px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    color: "#eef",
  },

  cooldownTitle: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  cooldownText: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 6,
  },

  cooldownReady: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: 600,
  },

  estimateButton: {
    marginTop: 12,
    border: 0,
    borderRadius: 10,
    padding: "10px 14px",
    background: "#4aa3ff",
    color: "white",
    fontWeight: 800,
    width: "100%",
  },

  cooldownTrack: {
    width: "100%",
    height: 8,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    overflow: "hidden",
  },

  cooldownFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2ecc71, #f1c40f, #e74c3c)",
    borderRadius: 999,
    transition: "width 50ms linear",
  },

  tableOuter: {
    padding: 18,
    borderRadius: 70,
    background: "linear-gradient(145deg, #5a3b1e, #2e1c0f)",
    boxShadow: "0 25px 80px rgba(0,0,0,0.7)",
    minHeight: 0,
  },

  table: {
    position: "relative",
    height: "100%",
    borderRadius: 60,
    background:
      "radial-gradient(circle at 50% 40%, #2f5f3a 0%, #1e3d28 60%, #162c1f 100%)",
    boxShadow:
      "inset 0 0 80px rgba(0,0,0,0.6), inset 0 8px 20px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.6)",
    border: "2px solid rgba(255,255,255,0.05)",
    overflow: "hidden",
  },

  tableTitle: {
    position: "absolute",
    top: 18,
    left: "50%",
    transform: "translateX(-50%)",
    margin: 0,
    fontSize: 18,
    opacity: 0.7,
    zIndex: 2,
  },

  topicTableArea: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    gap: 32,
    zIndex: 3,
    perspective: 1000,
  },

  selectedTopicArea: {
    display: "flex",
    flexDirection: "column" ,
    alignItems: "center",
    gap: 8,
  },

  selectedTopicLabel: {
    fontSize: 14,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#ddd",
    opacity: 0.8,
    letterSpacing: 0.8,
  },

  selectedTopicLabelBack: {
    display: "flex",
    fontSize: 14,
    fontWeight: 800,
    height: 50,
    textTransform: "uppercase",
    color: "#ddd",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedTopicCard: {
    width: 170,
    height: 230,
    borderRadius: 16,
    border: "2px solid rgba(255,255,255,0.25)",
    padding: 12,
    color: "white",
    background: "linear-gradient(160deg, #475569, #1e293b)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
    boxSizing: "border-box",
    textAlign: "left",
  },

  topicCard: {
    width: 170,
    height: 230,
    borderRadius: 16,
    border: 0,
    padding: 12,
    color: "white",
    background: "linear-gradient(160deg, #34495e, #22313f)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
    cursor: "pointer",
    boxSizing: "border-box",
    textAlign: "left",
    transition: "transform 0.25s ease",
  },

  topicCardBack: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.85,
    textAlign: "center",
  },

  topicCardHint: {
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.65,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  topicCardType: {
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.8,
    textTransform: "uppercase",
  },

  topicCardTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 900,
    lineHeight: 1.05,
  },

  topicCardPrompt: {
    marginTop: 18,
    fontSize: 12,
    lineHeight: 1.15,
    opacity: 0.9,
  },

  topicDeckArea: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 3,
  },

  players: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
  },

  playerSeat: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    width: 240,
  },

  playerAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    margin: "0 auto 6px",
  },

  playerName: {
    fontSize: 12,
    color: "#ddd",
    marginBottom: 4,
  },

  playerVoteBadge: {
    fontSize: 11,
    color: "#fefefe",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 999,
    padding: "4px 8px",
    display: "inline-block",
    marginBottom: 8,
  },

  playedCardContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    minHeight: 130,
    flexWrap: "wrap",
    maxWidth: 240,
    margin: "0 auto",
  },

  playedCard: {
    width: 90,
    height: 125,
    borderRadius: 10,
    color: "white",
    padding: 8,
    boxShadow: "0 10px 25px rgba(0,0,0,0.45)",
    fontSize: 10,
    display: "flex",
    flexDirection: "column" ,
    justifyContent: "space-between",
    boxSizing: "border-box",
  },

  playedCardType: {
    fontWeight: 800,
    fontSize: 10,
  },

  playedCardTitle: {
    fontWeight: 900,
    fontSize: 13,
  },

  playedCardSubtitle: {
    fontSize: 9,
    opacity: 0.85,
  },

  playedCardHandwritten: {
    fontFamily: "cursive",
    fontSize: 10,
    lineHeight: 1.1,
  },

  playedCardPlayer: {
    fontSize: 8,
    opacity: 0.8,
  },

  handArea: {
    padding: "8px 0 20px",
    minHeight: 100,
    textAlign: "center",
  },

  pokerArea: {
    marginTop: 16,
    padding: "10px 16px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    display: "inline-block",
    minWidth: 420,
  },

  pokerLabel: {
    fontSize: 14,
    fontWeight: 800,
    color: "#ddd",
    marginBottom: 10,
  },

  pokerVoteRow: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  pokerVoteButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    border: "1px solid #555",
    fontWeight: 900,
    cursor: "pointer",
  },

  pokerHint: {
    marginTop: 10,
    fontSize: 12,
    color: "#bbb",
  },

  handLabel: {
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.8,
    marginBottom: 6,
  },

  hand: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 120,
    overflow: "visible",
  },

  emptyHand: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 10,
  },

  card: {
    width: 120,
    height: 170,
    borderRadius: 16,
    border: 0,
    color: "white",
    padding: 12,
    boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
    cursor: "pointer",
    transition: "transform 0.15s ease, margin 0.15s ease",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  cardType: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
  },

  cardTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: 900,
  },

  cardSubtitle: {
    marginTop: 18,
    fontSize: 10,
  },

  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  modal: {
    width: 420,
    padding: 24,
    borderRadius: 20,
    background: "#252525",
    boxShadow: "0 20px 80px rgba(0,0,0,0.7)",
    color: "white",
  },

  textarea: {
    width: "100%",
    height: 120,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #555",
    background: "#111",
    color: "white",
    resize: "none",
    fontSize: 16,
    boxSizing: "border-box",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },

  voteMissing: {
    marginTop: 6,
    color: "#f5b7b1",
    fontSize: 12,
    lineHeight: 1.4,
  },

};

export default styles;