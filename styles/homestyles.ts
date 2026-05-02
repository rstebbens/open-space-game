import type { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100dvh",
    background: "#121212",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
  },

  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 60,
    maxWidth: 1100,
    width: "100%",
    padding: 40,
  },

  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  title: {
    fontSize: 42,
    fontWeight: 900,
    marginBottom: 10,
  },

  tagline: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 30,
  },

  card: {
    background: "#1a1a1a",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #333",
    background: "#111",
    color: "white",
    fontSize: 14,
  },

  primaryButton: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "none",
    background: "#2c3e50",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },

  joinRow: {
    display: "flex",
    gap: 10,
  },

  divider: {
    textAlign: "center",
    opacity: 0.5,
    margin: "8px 0",
  },

  info: {
    marginTop: 24,
    fontSize: 14,
    opacity: 0.8,
  },

  right: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  previewGlow: {
    position: "absolute",
    width: 400,
    height: 400,
    background:
      "radial-gradient(circle, rgba(46,204,113,0.25), transparent 70%)",
    filter: "blur(40px)",
  },

  preview: {
    width: "100%",
    maxWidth: 480,
    borderRadius: 20,
    transform: "rotate(-2deg) scale(1.02)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
    transition: "transform 0.3s ease",
  },
};

export default styles;