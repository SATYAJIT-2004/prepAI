import React, { useState, useEffect } from "react";

import "../battle.scss";

import socket from "../../../socket";
import { useAuth } from "../hooks/useAuth";

const ROOM_CODE = "BTLE-4892";

// ── RankBadge ─────────────────────────────────────────────────────────────────
const RankBadge = ({ rank }) => {
  const medals = {
    1: "🥇",
    2: "🥈",
    3: "🥉",
  };

  return medals[rank] ? (
    <span className="rank-badge">{medals[rank]}</span>
  ) : (
    <span className="rank-badge rank-badge--num">#{rank}</span>
  );
};

// ── PlayerRow ─────────────────────────────────────────────────────────────────
const PlayerRow = ({ player, isMe }) => (
  <div className={`player-row ${isMe ? "player-row--me" : ""}`}>
    <RankBadge rank={player.rank} />

    <div className="player-row__avatar">
      {player.avatar || "P"}

      <span className={`dot dot--${player.status || "active"}`} />
    </div>

    <div className="player-row__info">
      <span className="player-row__name">
        {player.name}

        {isMe && <span className="you-tag">YOU</span>}
      </span>

      <div className="player-row__bar-wrap">
        <div
          className="player-row__bar"
          style={{
            width: `${(player.score / 2400) * 100}%`,
          }}
        />
      </div>
    </div>

    <div className="player-row__right">
      <span className="player-row__score">{player.score.toLocaleString()}</span>

      <span className="player-row__acc">{player.accuracy}% acc</span>
    </div>
  </div>
);

// ── QuestionPanel ─────────────────────────────────────────────────────────────
const QuestionPanel = ({ question }) => {
  const [selected, setSelected] = useState(null);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [question.id]);

  const pct = (question.timeLeft / 10) * 100;

  const isUrgent = question.timeLeft <= 5;

  const handleSubmit = () => {
    if (selected === null || submitted) return;

    setSubmitted(true);

    socket.emit(
      "submit-answer",

      {
        roomCode: ROOM_CODE,

        answer: selected,

        timeTaken: 10 - question.timeLeft,
      },
    );
  };

  return (
    <div className="question-panel">
      <div className="question-panel__top">
        <span className="q-label">
          Q{question.id}
          <span className="q-label__total">/ {question.total}</span>
        </span>

        <div className={`timer ${isUrgent ? "timer--urgent" : ""}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="14"
            height="14"
          >
            <circle cx="12" cy="12" r="10" />

            <polyline points="12 6 12 12 16 14" />
          </svg>
          {question.timeLeft}s
        </div>
      </div>

      <div className="timer-bar">
        <div
          className={`timer-bar__fill ${
            isUrgent ? "timer-bar__fill--urgent" : ""
          }`}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>

      <p className="question-text">{question.text}</p>

      <div className="options-grid">
        {question.options.map((opt, i) => (
          <button
            key={i}
            disabled={submitted}
            className={`option-btn ${
              selected === i ? "option-btn--selected" : ""
            } ${submitted ? "option-btn--locked" : ""}`}
            onClick={() => {
              if (submitted) return;

              setSelected(i);
            }}
          >
            <span className="option-btn__letter">
              {String.fromCharCode(65 + i)}
            </span>

            {opt}
          </button>
        ))}
      </div>

      <button
        className="submit-btn"
        disabled={selected === null || submitted}
        onClick={handleSubmit}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        Lock In Answer
      </button>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Interviewbattle = () => {
  const [tab, setTab] = useState("battle");

  const [players, setPlayers] = useState([]);

  const [question, setQuestion] = useState(null);

  const [timeLeft, setTimeLeft] = useState(10);

  const [joined, setJoined] = useState(false);

  const [battleStarted, setBattleStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalLeaderboard, setFinalLeaderboard] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    socket.emit(
      "join-room",

      {
        roomCode: ROOM_CODE,

        user: {
          name: user.username,
        },
      },
    );

    socket.on(
      "joined-success",

      () => {
        console.log("Joined successfully");

        setJoined(true);
      },
    );

    socket.on(
      "update-leaderboard",

      (data) => {
        setPlayers(data);
      },
    );

    socket.on(
      "new-question",

      (data) => {
        setQuestion({
          id: data.index,

          total: data.total,

          text: data.question,

          options: data.options,

          timeLeft: 10,
        });

        setTimeLeft(10);
      },
    );

    socket.on(
      "timer",

      (time) => {
        setTimeLeft(time);
      },
    );
    socket.on("battle-started", () => {
      setBattleStarted(true);
    });
    socket.on(
      "battle-ended",

      (data) => {
        setBattleStarted(false);

        if (data?.leaderboard?.length > 0) {
          setFinalLeaderboard(data.leaderboard);
        }

        setShowResult(true);
      },
    );
    return () => {
      socket.off("joined-success");

      socket.off("update-leaderboard");

      socket.off("new-question");

      socket.off("timer");

      socket.off("battle-started");

      socket.off("battle-ended");
    };
  }, []);

  return (
    <div className="battle-page">
      <div className="battle-bg">
        <div className="battle-bg__orb battle-bg__orb--1" />

        <div className="battle-bg__orb battle-bg__orb--2" />
      </div>

      {/* Header */}
      <header className="battle-header">
        <div className="battle-header__brand">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            width="16"
            height="16"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Interview Battle
        </div>

        <div className="room-pill">
          <span className="room-pill__label">Room</span>

          <span className="room-pill__code">{ROOM_CODE}</span>
        </div>

        <div className="battle-header__meta">
          <span className="live-dot" />
          Round 1 · {players.length} players
        </div>

        <button
          className="login-btn"
          disabled={!joined || battleStarted}
          onClick={() => {
            if (!joined || battleStarted) return;

            socket.emit(
              "start-battle",

              {
                roomCode: ROOM_CODE,
              },
            );
          }}
        >
          {!joined
            ? "Joining Room..."
            : battleStarted
              ? "Battle Started"
              : "Start Battle"}
        </button>
      </header>

      {/* Mobile Tabs */}
      <div className="battle-tabs">
        <button
          className={`battle-tab ${
            tab === "battle" ? "battle-tab--active" : ""
          }`}
          onClick={() => setTab("battle")}
        >
          Arena
        </button>

        <button
          className={`battle-tab ${
            tab === "leaderboard" ? "battle-tab--active" : ""
          }`}
          onClick={() => setTab("leaderboard")}
        >
          Leaderboard
        </button>
      </div>

      <main className="battle-main">
        {showResult && (
          <div className="result-overlay">
            <div className="result-modal">
              <div className="result-header">
                <h1>🏆 Battle Finished</h1>

                <p>Great job warriors!</p>
              </div>

              <div className="result-top3">
                {finalLeaderboard.slice(0, 3).map((player, index) => (
                  <div
                    key={player.id}
                    className={`winner-card winner-card--${index + 1}`}
                  >
                    <div className="winner-rank">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>

                    <h3>{player.name}</h3>

                    <p>{player.score} pts</p>

                    <span>{player.accuracy}% Accuracy</span>
                  </div>
                ))}
              </div>

              <div className="result-actions">
                <button
                  className="play-again-btn"
                  onClick={() => {
                    setShowResult(false);

                    socket.emit("start-battle", {
                      roomCode: ROOM_CODE,
                    });
                  }}
                >
                  Play Again
                </button>

                <button
                  className="dashboard-btn"
                  onClick={() => window.location.reload()}
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Leaderboard */}
        <aside
          className={`leaderboard-panel ${
            tab === "leaderboard" ? "leaderboard-panel--visible" : ""
          }`}
        >
          <div className="leaderboard-panel__head">
            Leaderboard
            <span className="live-badge">
              <span />
              LIVE
            </span>
          </div>

          {players.map((p, index) => (
            <PlayerRow
              key={p.id}
              player={{
                ...p,
                rank: index + 1,
              }}
              isMe={p.id === socket.id}
            />
          ))}

          <div className="leaderboard-footer">
            <div className="lb-stat">
              <b>{players.length}</b>
              <span>Players</span>
            </div>

            <div className="lb-stat">
              <b>
                {question?.id}/{question?.total}
              </b>
              <span>Question</span>
            </div>

            <div className="lb-stat">
              <b>~4m</b>
              <span>Left</span>
            </div>
          </div>
        </aside>

        {/* Arena */}
        <section
          className={`arena-panel ${
            tab === "battle" ? "arena-panel--visible" : ""
          }`}
        >
          <div className="progress-pips">
            {Array.from({
              length: question?.total || 0,
            }).map((_, i) => (
              <div
                key={i}
                className={`pip ${
                  i < question?.id - 1
                    ? "pip--done"
                    : i === question?.id - 1
                      ? "pip--active"
                      : ""
                }`}
              />
            ))}
          </div>

          {!question ? (
            <div className="battle-waiting">
  <div className="battle-ring">
    <div className="pulse-circle"></div>
    <div className="pulse-circle delay"></div>

    <div className="battle-content">
      <h2>⚔️ Let's start the Battle</h2>
      <p>Preparing the challenge...</p>

      <div className="battle-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
</div>
          ) : (
            <QuestionPanel
              question={{
                ...question,
                timeLeft,
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default Interviewbattle;
