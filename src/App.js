import React, { useState, useRef, useCallback } from "react";
import Lottie from "lottie-react";


/*
=====================================================
  Kili Jothidam – Enterprise Frontend (Large Display)
-----------------------------------------------------
  • Stack: React, Groq API, gTTS Backend
  • Features: Tamil Text-to-Speech, Lottie Sync, Song
=====================================================
*/

const TTS_SERVER_URL = "https://erp-mnmjec-backend.onrender.com";

export default function KiliJothidam() {
  // Core State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [finalText, setFinalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const songRef = useRef(null);
  const [isSongPlaying, setIsSongPlaying] = useState(false);

  // Song Logic (Preserved)
  const lastClickRef = useRef(0);

  const toggleSong = () => {
    if (!songRef.current) return;

    const now = Date.now();
    const DOUBLE_CLICK_DELAY = 300;

    if (now - lastClickRef.current < DOUBLE_CLICK_DELAY) {
      songRef.current.currentTime = 0;
      songRef.current.play();
      setIsSongPlaying(true);
    } else {
      if (isSongPlaying) {
        songRef.current.pause();
        setIsSongPlaying(false);
      } else {
        songRef.current.play();
        setIsSongPlaying(true);
      }
    }

    lastClickRef.current = now;
  };

  const isValidName = name.trim().length > 0;
  const isValidAge = age !== "" && Number(age) > 0 && Number(age) <= 80;



  // References
  const audioRef = useRef(null);

  /* ========================================================================
     Logic: Audio Playback (Memoized for Stability)
     ======================================================================== */
  const playTamilAudio = useCallback(async (text) => {
    try {
      const res = await fetch(TTS_SERVER_URL + "/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const blob = await res.blob();
      const audioURL = URL.createObjectURL(blob);

      if (songRef.current && !songRef.current.paused) {
        songRef.current.pause();
        setIsSongPlaying(false);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = audioURL;
        audioRef.current.playbackRate = 1.5;

        setIsTalking(true);

        audioRef.current.onended = () => {
          setIsTalking(false);
        };

        audioRef.current.play();
      }
    } catch (err) {
      console.error("Tamil TTS error:", err);
      setIsTalking(false);
    }
  }, []);

  /* ========================================================================
     Logic: API Interaction (Memoized for Stability)
     ======================================================================== */
  const askKili = useCallback(async () => {
    if (!name.trim() || !age) return;

    setLoading(true);
    setFinalText("");

    try {
      const res = await fetch(TTS_SERVER_URL + "/ask-kili", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age }),
      });

      const data = await res.json();

      const reply =
        data?.reply || "கிலி இன்று பேச மௌனமாக இருக்கிறது…";

      setFinalText(reply);
      playTamilAudio(reply);
    } catch (err) {
      console.error(err);
      setFinalText("கிலிக்கு குழப்பம்… மீண்டும் கேளுங்கள்.");
    } finally {
      setLoading(false);
    }
  }, [name, age, playTamilAudio]);

  /* ========================================================================
     Handler: Form Submission
     ======================================================================== */
  const handleSubmit = (e) => {
    e.preventDefault();
    askKili();
    setTimeout(() => {
      setName("");
      setAge("");
    }, 1500);

  };

  /* ========================================================================
     Render
     ======================================================================== */
  const isInputInvalid = loading || !name.trim() || !age || !isValidName || !isValidAge;


  return (
    <main style={styles.mainContainer}>
      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          <h2
            style={{
              ...styles.title,
              cursor: "pointer",
              position: "relative",
            }}
            onClick={toggleSong}
            aria-pressed={isSongPlaying}
          >
            <span style={styles.title}>kiliyae kiliyae</span>
            <span style={styles.subEmoji}>💚</span>
          </h2>

        </header>

        {/* Layout: Response Output & Avatar */}
        <div style={styles.gridContainer}>
          {/* Output Section */}
          <section
            style={styles.textColumn}
            aria-live="polite"
            role="status"
            aria-label="Kili's Prediction"
          >
            <div style={styles.bubble}>
              <p style={styles.bubbleText}>
                {loading
                  ? "கிலி சிந்திக்கிறது…"
                  : finalText || "உங்கள் எதிர்காலத்தை அறிய கீழே விவரங்களை இடவும்."}
              </p>
            </div>
          </section>

          {/* Visual Feedback Section */}
          <section style={styles.visualColumn} aria-hidden="true">
            <div style={styles.lottieWrapper}>
              <Lottie
                path={`${process.env.PUBLIC_URL}/parrot.json`}
                autoplay={isTalking}
                loop={isTalking}
                style={styles.lottieFile}
              />
            </div>
          </section>
        </div>

        {/* Input Section */}
        <form style={styles.inputGroup} onSubmit={handleSubmit} noValidate>
          {/* NAME */}
          <div style={styles.inputWrapper}>
            <label htmlFor="user-name" style={styles.visuallyHidden}>
              உங்கள் பெயர்
            </label>
            <input
              id="user-name"
              name="name"
              autoComplete="given-name"
              style={styles.input}
              placeholder="உங்கள் பெயர்"
              aria-label="உங்கள் பெயர்"
              value={name}
              disabled={loading}
              onChange={(e) => {
                const value = e.target.value;

                // Allow only letters (Tamil + English) and spaces
                if (/^[a-zA-Z\u0B80-\u0BFF\s]*$/.test(value)) {
                  setName(value);
                }
              }}
            />
          </div>

          {/* AGE */}
          <div style={styles.inputWrapper}>
            <label htmlFor="user-age" style={styles.visuallyHidden}>
              உங்கள் வயது
            </label>
            <input
              id="user-age"
              name="age"
              type="text"          // text to fully control input
              inputMode="numeric"  // mobile numeric keypad
              style={styles.input}
              placeholder="உங்கள் வயது"
              aria-label="உங்கள் வயது"
              value={age}
              disabled={loading}
              onChange={(e) => {
                const value = e.target.value;

                // Only digits
                if (!/^\d*$/.test(value)) return;

                // Max age 80
                if (value === "" || Number(value) <= 80) {
                  setAge(value);
                }
              }}
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: isInputInvalid ? 0.6 : 1,
              cursor: isInputInvalid ? "not-allowed" : "pointer",
            }}
            disabled={isInputInvalid}
          >
            {loading ? "கணித்துக்கொண்டிருக்கிறது..." : "கிலியைக் கேளுங்கள்"}
          </button>
        </form>


        <audio ref={audioRef} hidden />
        <audio ref={songRef} src={`${process.env.PUBLIC_URL}/song.mp3`} />
      </div>
    </main>
  );
}

/* ========================================================================
   Styles: Large Display Optimized
   ======================================================================== */
const styles = {
  mainContainer: {
    minHeight: "100vh",
    backgroundColor: "#FEF9E7", // Warm temple tone
    display: "flex",
    height: "100%",
    overflowY: "auto",
    scrollbarWidth: "none",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px", // Increased padding for large screens
    fontFamily:
      "'Noto Sans Tamil', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#374151",
    boxSizing: "border-box",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "1400px", // Increased max-width for large displays
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    marginBottom: "48px",
    textAlign: "center",
  },
  title: {
    margin: 0,
    fontSize: "48px", // Larger title for big screens
    fontWeight: "800",
    color: "#92400e",
    letterSpacing: "-0.025em",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    userSelect: "none",
  },
  subEmoji: {
    fontSize: "40px",
  },
  gridContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row", // Side-by-side
    alignItems: "center", // Center vertically so parrot stays centered if text is small, but...
    // To solve the "Parrot size" issue:
    // We use a grid-like flex behavior where the visual column takes substantial space
    justifyContent: "center",
    gap: "48px",
    marginBottom: "48px",
    flexWrap: "wrap", // fallback for mobile
  },
  textColumn: {
    flex: "1 1 600px", // Increased basis so text takes priority but leaves room
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
  },
  visualColumn: {
    flex: "1 1 400px", // Increased basis for the parrot
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "300px",
  },
  lottieWrapper: {
    // This wrapper ensures the Lottie fills the available column width
    // The width of the Lottie is driven by the width of this column.
    // As the screen gets bigger, the column gets wider, and the Lottie scales up.
    width: "100%",
    maxWidth: "500px", // Cap it so it doesn't get absurdly huge
    minWidth: "300px", // Ensure it doesn't get too small
  },
  lottieFile: {
    width: "100%",
    height: "auto", // Maintain aspect ratio naturally
    display: "block",
  },
  bubble: {
    width: "100%",
    minHeight: "280px", // Taller default for large screens
    backgroundColor: "#ffffff",
    padding: "40px", // More breathing room
    borderRadius: "32px", // Softer corners
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    border: "2px solid #f3f4f6", // Slightly thicker border
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "left",
    boxSizing: "border-box",
  },
  bubbleText: {
    margin: 0,
    fontSize: "26px", // Large, readable text
    lineHeight: "1.7",
    color: "#1f2937",
    whiteSpace: "pre-line",
    fontWeight: "500",
  },
  inputGroup: {
    width: "100%",
    maxWidth: "800px", // Wider inputs for large screen
    display: "flex",
    flexDirection: "row", // Horizontal inputs on large screens looks professional
    gap: "24px",
    flexWrap: "wrap",
  },
  inputWrapper: {
    flex: "1", // Inputs share space equally
    minWidth: "200px",
  },
  input: {
    width: "100%",
    padding: "20px 24px",
    fontSize: "18px",
    borderRadius: "16px",
    border: "2px solid #d1d5db", // Thicker border for visibility
    backgroundColor: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
    color: "#111827",
  },
  button: {
    flex: "0 0 auto", // Button takes natural size or specific width
    minWidth: "200px",
    padding: "20px 32px",
    fontSize: "20px",
    fontWeight: "700",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#059669",
    color: "#ffffff",
    boxShadow:
      "0 4px 6px -1px rgba(5, 150, 105, 0.2), 0 2px 4px -1px rgba(5, 150, 105, 0.1)",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  },
  visuallyHidden: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
};