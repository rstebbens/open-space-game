"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  function createSession() {
    if (!name.trim()) return;

    const roomId = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

    router.push(`/room/${roomId}?name=${name}`);
  }

  function joinSession() {
    if (!name.trim() || !code.trim()) return;

    router.push(`/room/${code}?name=${name}`);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* LEFT SIDE */}
        <div style={styles.left}>
          <h1 style={styles.title}>Open Space Card Game</h1>

          <p style={styles.tagline}>
            Flip a topic. Play a card. Shift the room.
          </p>

          <div style={styles.card}>
            <input
              style={styles.input}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={createSession}
              style={{
                ...styles.primaryButton,
                opacity: name ? 1 : 0.5,
                cursor: name ? "pointer" : "not-allowed",
              }}
            >
              🎴 Host a Session
            </button>

            <div style={styles.divider}>or</div>

            <div style={styles.joinRow}>
              <input
                style={styles.input}
                placeholder="Session code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />

              <button
                onClick={joinSession}
                style={{
                  ...styles.secondaryButton,
                  opacity: name && code ? 1 : 0.5,
                  cursor: name && code ? "pointer" : "not-allowed",
                }}
              >
                Join
              </button>
            </div>
          </div>

          <div style={styles.info}>
            <strong>How it works</strong>
            <ul>
              <li>Host flips a topic</li>
              <li>Players use cards to guide discussion</li>
              <li>ELMO = 60 seconds to wrap up</li>
              <li>Keep things flowing, not looping</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE (PREVIEW) */}
        <div style={styles.right}>
          <div style={styles.previewGlow} />

          <img
            src="/table-preview.png" // 👈 drop a screenshot in /public
            alt="Game preview"
            style={styles.preview}
          />
        </div>
      </div>
    </main>
  );
}

const styles = {
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