"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/homestyles";

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
