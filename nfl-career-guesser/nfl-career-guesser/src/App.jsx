import React, { useState, useMemo, useRef, useEffect, useCallback, useId } from "react";
import PLAYERS from "./data/players.json";
import { TEAM_COLORS } from "./teamMeta.js";

const POSITION_NAMES = {
  QB: "Quarterback", RB: "Running Back", FB: "Fullback", WR: "Wide Receiver",
  TE: "Tight End", DE: "Defensive End", DT: "Defensive Tackle", DL: "Defensive Line",
  NT: "Nose Tackle", LB: "Linebacker", ILB: "Inside Linebacker", OLB: "Outside Linebacker",
  MLB: "Middle Linebacker", CB: "Cornerback", DB: "Defensive Back", S: "Safety",
  FS: "Free Safety", SS: "Strong Safety", K: "Kicker", P: "Punter", LS: "Long Snapper",
  KR: "Kick Returner", PR: "Punt Returner", SPEC: "Special Teams",
};

// The extensions we'll try, in order, when looking for public/logos/<CODE>.<ext>
const IMAGE_EXTENSIONS = ["png", "svg", "webp", "jpg", "jpeg"];

/* ---------- Helpers ---------- */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s) {
  return s.toLowerCase().replace(/[.\-']/g, "").replace(/\s+/g, " ").trim();
}

// Boustrophedon (snake) layout across a 2-column grid.
// Returns { col, row } for each index: even rows go left->right, odd rows go right->left.
function snakePosition(i) {
  const row = Math.floor(i / 2);
  const posInRow = i % 2;
  const col = row % 2 === 0 ? posInRow : 1 - posInRow;
  return { row, col };
}

/* ---------- Team badge ---------- */
// Tries public/logos/<CODE>.png, then .svg, .webp, .jpg, .jpeg.
// If none of those exist, falls back to a colored shield with the team
// abbreviation so the game still works before you've added your own art.
// Custom images are clipped to the same shield shape so everything looks
// consistent regardless of the source image's own shape/background.
const SHIELD_PATH = "M50 2 L94 16 V54 C94 82 76 100 50 110 C24 100 6 82 6 54 V16 Z";

function TeamBadge({ team, order }) {
  const [extIndex, setExtIndex] = useState(0);
  const usingFallback = extIndex >= IMAGE_EXTENSIONS.length;
  const c = TEAM_COLORS[team.c] || { bg: "#334155", fg: "#F1F5F9" };
  const years =
    team.s === team.e
      ? `'${String(team.s).slice(2)}`
      : `'${String(team.s).slice(2)}-${String(team.e).slice(2)}`;
  const clipId = useId();

  return (
    <div style={styles.badgeWrap}>
      <div style={{ position: "relative", width: 88, height: 98 }}>
        <svg viewBox="0 0 100 112" width="100%" height="100%" style={styles.badgeSvg}>
          {!usingFallback ? (
            <>
              <defs>
                <clipPath id={clipId}>
                  <path d={SHIELD_PATH} />
                </clipPath>
              </defs>
              <path d={SHIELD_PATH} fill="#1E293B" />
              <image
                key={team.c + extIndex}
                href={`${import.meta.env.BASE_URL}logos/${team.c}.${IMAGE_EXTENSIONS[extIndex]}`}
                x="0"
                y="0"
                width="100"
                height="112"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
                onError={() => setExtIndex((i) => i + 1)}
              />
              <path
                d={SHIELD_PATH}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
            </>
          ) : (
            <>
              <path
                d={SHIELD_PATH}
                fill={c.bg}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
              <text
                x="50"
                y="66"
                textAnchor="middle"
                fontSize="30"
                fontWeight="800"
                fill={c.fg}
                fontFamily="Arial, sans-serif"
              >
                {team.c}
              </text>
            </>
          )}
        </svg>
        <span style={styles.badgeOrder}>{order}</span>
      </div>
      <span style={styles.badgeYears}>{years}</span>
    </div>
  );
}

/* ---------- Component ---------- */
export default function App() {
  const [deck, setDeck] = useState(() => shuffle(PLAYERS));
  const [deckPos, setDeckPos] = useState(0);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hintLevel, setHintLevel] = useState(0); // 0 none, 1 side, 2 position
  const [result, setResult] = useState(null); // null | 'correct' | 'wrong' | 'gaveup'
  const [stats, setStats] = useState({ correct: 0, played: 0, streak: 0, bestStreak: 0 });
  const inputRef = useRef(null);

  const current = deck[deckPos];

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalize(query);
    return PLAYERS.filter((p) => normalize(p.name).includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [deckPos]);

  const nextPlayer = useCallback(() => {
    let pos = deckPos + 1;
    let d = deck;
    if (pos >= d.length) {
      d = shuffle(PLAYERS);
      pos = 0;
      setDeck(d);
    }
    setDeckPos(pos);
    setQuery("");
    setSelectedId(null);
    setShowDropdown(false);
    setHintLevel(0);
    setResult(null);
  }, [deck, deckPos]);

  const submitGuess = (guessId) => {
    if (result) return;
    const correct = guessId === current.id;
    setResult(correct ? "correct" : "wrong");
    setStats((s) => {
      const streak = correct ? s.streak + 1 : 0;
      return {
        correct: s.correct + (correct ? 1 : 0),
        played: s.played + 1,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
      };
    });
  };

  const handleSelectSuggestion = (p) => {
    setSelectedId(p.id);
    setQuery(p.name);
    setShowDropdown(false);
  };

  const handleGiveUp = () => {
    if (result) return;
    setResult("gaveup");
    setStats((s) => ({ ...s, played: s.played + 1, streak: 0 }));
  };

  const handleHint = () => {
    if (result) return;
    setHintLevel((h) => Math.min(h + 1, 2));
  };

  if (!current) return null;

  const teams = current.teams;
  const numRows = Math.ceil(teams.length / 2);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes flipIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes popScore { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
        @keyframes drawArrow { from { opacity: 0; } to { opacity: 1; } }
        .badge-in { animation: flipIn 0.4s cubic-bezier(.2,.9,.3,1.2) backwards; }
        .arrow-in { animation: drawArrow 0.3s ease backwards; }
        .score-pop { animation: popScore 0.4s ease; }
        input::placeholder { color: #64748B; }
        .suggestion-item:hover { background: #1E293B; }
      `}</style>

      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>NFL · CAREER TRACE</div>
            <h1 style={styles.title}>Name The Player</h1>
          </div>
          <div style={styles.scoreBox} key={stats.played} className={stats.played ? "score-pop" : ""}>
            <div style={styles.scoreMain}>{stats.correct}<span style={styles.scoreDivider}>/</span>{stats.played}</div>
            <div style={styles.scoreLabel}>Correct</div>
          </div>
        </header>

        <p style={styles.instructions}>
          Every team below belonged to one NFL player, in order. Figure out who, in as few hints as possible.
        </p>

        {/* Career card */}
        <div style={styles.card}>
          <div style={styles.cardHeaderRow}>
            <span style={styles.cardHeaderLabel}>Career Path</span>
            <span style={styles.streakBadge}>Streak {stats.streak}</span>
          </div>

          <div
            style={{
              ...styles.snakeGrid,
              gridTemplateRows: `repeat(${numRows}, auto auto)`,
            }}
          >
            {Array.from({ length: numRows }).map((_, r) => {
              const idxA = r * 2;
              const idxB = r * 2 + 1;
              const teamA = teams[idxA];
              const teamB = teams[idxB];
              const posA = snakePosition(idxA);
              const posB = teamB ? snakePosition(idxB) : null;
              const rowEven = r % 2 === 0;
              const hasNextRow = teams[(r + 1) * 2] !== undefined;
              const endingCol = teamB ? posB.col : posA.col;

              let leftTeam = null, leftOrder = null, rightTeam = null, rightOrder = null;
              if (posA.col === 0) {
                leftTeam = teamA; leftOrder = idxA + 1;
              } else {
                rightTeam = teamA; rightOrder = idxA + 1;
              }
              if (teamB) {
                if (posB.col === 0) {
                  leftTeam = teamB; leftOrder = idxB + 1;
                } else {
                  rightTeam = teamB; rightOrder = idxB + 1;
                }
              }

              return (
                <React.Fragment key={r}>
                  <div
                    style={{ ...styles.gridCell, gridColumn: 1, gridRow: r * 2 + 1 }}
                    className="badge-in"
                  >
                    {leftTeam && (
                      <TeamBadge key={`${leftTeam.c}-${leftTeam.s}-${leftTeam.e}`} team={leftTeam} order={leftOrder} />
                    )}
                  </div>
                  <div
                    style={{ ...styles.gridCell, gridColumn: 3, gridRow: r * 2 + 1 }}
                    className="badge-in"
                  >
                    {rightTeam && (
                      <TeamBadge key={`${rightTeam.c}-${rightTeam.s}-${rightTeam.e}`} team={rightTeam} order={rightOrder} />
                    )}
                  </div>

                  {teamB && (
                    <div
                      style={{ ...styles.arrowCellH, gridColumn: 2, gridRow: r * 2 + 1 }}
                      className="arrow-in"
                    >
                      {rowEven ? "→" : "←"}
                    </div>
                  )}

                  {hasNextRow && (
                    <div
                      style={{
                        ...styles.arrowCellV,
                        gridColumn: endingCol === 0 ? 1 : 3,
                        gridRow: r * 2 + 2,
                      }}
                      className="arrow-in"
                    >
                      ↓
                    </div>
                  )}
                  {hasNextRow && (
                    <div style={{ gridColumn: endingCol === 0 ? 3 : 1, gridRow: r * 2 + 2 }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {hintLevel >= 1 && (
            <div style={styles.hintRow} className="badge-in">
              <span style={styles.hintTag}>HINT 1</span>
              <span>Played on <strong>{current.side}</strong></span>
            </div>
          )}
          {hintLevel >= 2 && (
            <div style={styles.hintRow} className="badge-in">
              <span style={styles.hintTag}>HINT 2</span>
              <span>Position: <strong>{POSITION_NAMES[current.pos] || current.pos}</strong></span>
            </div>
          )}
        </div>

        {!result && (
          <div style={styles.guessArea}>
            <div style={styles.inputWrap}>
              <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder="Start typing a player's name…"
                style={styles.input}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedId(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (selectedId) submitGuess(selectedId);
                    else if (suggestions.length === 1) submitGuess(suggestions[0].id);
                  }
                }}
              />
              {showDropdown && suggestions.length > 0 && (
                <ul style={styles.dropdown}>
                  {suggestions.map((p) => (
                    <li
                      key={p.id}
                      className="suggestion-item"
                      style={styles.suggestionItem}
                      onMouseDown={() => handleSelectSuggestion(p)}
                    >
                      <span>{p.name}</span>
                      <span style={styles.suggestionMeta}>{p.pos} · {p.teams[p.teams.length - 1].c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={styles.buttonRow}>
              <button
                style={{ ...styles.secondaryBtn, opacity: hintLevel >= 2 ? 0.5 : 1 }}
                disabled={hintLevel >= 2}
                onClick={handleHint}
              >
                💡 Hint {hintLevel < 2 ? `(${hintLevel + 1}/2)` : ""}
              </button>
              <button style={styles.giveUpBtn} onClick={handleGiveUp}>
                🏳️ Give Up
              </button>
              <button
                style={{ ...styles.submitBtn, opacity: selectedId ? 1 : 0.4 }}
                disabled={!selectedId}
                onClick={() => submitGuess(selectedId)}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {result && (
          <div
            className="badge-in"
            style={{
              ...styles.resultBanner,
              borderColor: result === "correct" ? "#2F5D3A" : "#B3432B",
              background: result === "correct" ? "rgba(47,93,58,0.18)" : "rgba(179,67,43,0.16)",
            }}
          >
            <div style={styles.resultText}>
              {result === "correct" && <>✅ Correct — it was <strong>{current.name}</strong>.</>}
              {result === "wrong" && <>❌ Not quite — the answer was <strong>{current.name}</strong>.</>}
              {result === "gaveup" && <>🏳️ The answer was <strong>{current.name}</strong>.</>}
            </div>
            <button style={styles.nextBtn} onClick={nextPlayer}>
              Next Player →
            </button>
          </div>
        )}

        <footer style={styles.footer}>Best streak: {stats.bestStreak}</footer>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0F172A",
    backgroundImage:
      "radial-gradient(circle at 20% 0%, rgba(212,162,76,0.06), transparent 40%), radial-gradient(circle at 80% 100%, rgba(47,93,58,0.10), transparent 45%)",
    display: "flex",
    justifyContent: "center",
    padding: "28px 16px 60px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#F1F5F9",
  },
  container: { width: "100%", maxWidth: 480 },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.14em",
    color: "#D4A24C",
    fontWeight: 700,
    marginBottom: 4,
  },
  title: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "-0.01em",
    lineHeight: 1.05,
  },
  scoreBox: { textAlign: "right" },
  scoreMain: { fontSize: 26, fontWeight: 800, lineHeight: 1 },
  scoreDivider: { color: "#64748B", margin: "0 2px", fontWeight: 500 },
  scoreLabel: { fontSize: 10, letterSpacing: "0.08em", color: "#94A3B8", marginTop: 2 },
  instructions: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 1.5,
    margin: "10px 0 18px",
  },
  card: {
    background: "#111C33",
    border: "1px solid #1E293B",
    borderRadius: 10,
    padding: "18px 14px 16px",
    marginBottom: 18,
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    padding: "0 4px",
  },
  cardHeaderLabel: { fontSize: 12, letterSpacing: "0.08em", color: "#64748B", fontWeight: 700 },
  streakBadge: {
    fontSize: 11,
    color: "#D4A24C",
    background: "rgba(212,162,76,0.12)",
    padding: "3px 8px",
    borderRadius: 20,
    fontWeight: 700,
  },
  snakeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 40px 1fr",
    alignItems: "center",
    justifyItems: "center",
    rowGap: 2,
    columnGap: 4,
  },
  gridCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
  },
  badgeWrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  badgeSvg: { display: "block" },
  badgeImg: { display: "block", objectFit: "contain" },
  badgeYears: {
    fontSize: 13,
    fontWeight: 700,
    color: "#94A3B8",
    letterSpacing: "0.02em",
  },
  badgeOrder: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#D4A24C",
    color: "#0F172A",
    fontSize: 11,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowCellH: {
    fontSize: 22,
    color: "#475569",
    fontWeight: 700,
  },
  arrowCellV: {
    fontSize: 22,
    color: "#475569",
    fontWeight: 700,
    padding: "2px 0",
  },
  hintRow: {
    marginTop: 12,
    padding: "8px 10px",
    background: "rgba(212,162,76,0.08)",
    borderRadius: 6,
    fontSize: 13,
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  hintTag: {
    fontSize: 10,
    fontWeight: 800,
    color: "#0F172A",
    background: "#D4A24C",
    padding: "2px 6px",
    borderRadius: 4,
    letterSpacing: "0.05em",
  },
  guessArea: {},
  inputWrap: { position: "relative", marginBottom: 10 },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    fontSize: 15,
    borderRadius: 8,
    border: "1px solid #2A3B5C",
    background: "#0B1526",
    color: "#F1F5F9",
    outline: "none",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    background: "#0F1E36",
    border: "1px solid #2A3B5C",
    borderRadius: 8,
    maxHeight: 240,
    overflowY: "auto",
    zIndex: 10,
    listStyle: "none",
    margin: 0,
    padding: 4,
    boxShadow: "0 12px 28px rgba(0,0,0,0.4)",
  },
  suggestionItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "9px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
  },
  suggestionMeta: { color: "#64748B", fontSize: 12, fontWeight: 600 },
  buttonRow: { display: "flex", gap: 8 },
  secondaryBtn: {
    flex: 1,
    padding: "12px 8px",
    borderRadius: 8,
    border: "1px solid #2A3B5C",
    background: "transparent",
    color: "#D4A24C",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  giveUpBtn: {
    flex: 1,
    padding: "12px 8px",
    borderRadius: 8,
    border: "1px solid #4A2A28",
    background: "transparent",
    color: "#E08A73",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
  submitBtn: {
    flex: 1,
    padding: "12px 8px",
    borderRadius: 8,
    border: "none",
    background: "#2F5D3A",
    color: "#F1F5F9",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
  },
  resultBanner: {
    border: "1px solid",
    borderRadius: 10,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  resultText: { fontSize: 15, lineHeight: 1.4 },
  nextBtn: {
    alignSelf: "flex-start",
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#D4A24C",
    color: "#0F172A",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  footer: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 12,
    color: "#475569",
  },
};
