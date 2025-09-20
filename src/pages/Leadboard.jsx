import axiosClient from "../utils/axiosClient";
import React, { useState, useEffect } from "react";

const COLORS = {
  bg: "#0B1120",
  primary: "#0F172A",
  secondary: "#1E293B",
  accent: "#3B82F6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  gray: "#94A3B8",
  highlight: "#A855F7",
};

const CARD_WIDTH = 280; // px width of each card
const FRAME_HEIGHT = 210; // px height of each frame

const CONTESTS = [
  {
    name: "Weekly Contest 34",
    date: "July 27, 2025",
    type: "Weekly",
    theme: COLORS.accent,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Monthly Contest – June",
    date: "June 29, 2025",
    type: "Monthly",
    theme: COLORS.highlight,
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bi-Weekly Contest 17",
    date: "July 13, 2025",
    type: "Bi-Weekly",
    theme: COLORS.success,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Special July Challenge",
    date: "July 5, 2025",
    type: "Special",
    theme: COLORS.warning,
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Quarterly Coding Bash",
    date: "August 15, 2025",
    type: "Quarterly",
    theme: COLORS.danger,
    image:
      "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hackathon Sprint",
    date: "August 30, 2025",
    type: "Hackathon",
    theme: COLORS.primary,
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Summer Code Festival",
    date: "September 10, 2025",
    type: "Festival",
    theme: COLORS.highlight,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Autumn Open Challenge",
    date: "October 5, 2025",
    type: "Open Challenge",
    theme: COLORS.secondary,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
  },
];

// Utility function for cycling indexes in carousel
const cycleIndex = (idx, length) => (idx + length) % length;

const Leaderboard = () => {
  const [centerIdx, setCenterIdx] = useState(0);

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Calculate ranks including ties
  const usersWithRank = (() => {
    let rank = 1,
      prevCount = null,
      skip = 0;
    return users.map((user) => {
      const solvedCount = user.problemSolved?.length || 0;
      if (solvedCount === prevCount) {
        skip++;
      } else {
        rank += skip;
        skip = 1;
      }
      prevCount = solvedCount;
      return { ...user, solvedCount, rank };
    });
  })();

  // Fetch user data once at mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/User/getAllUser");
        data.sort((a, b) => (b.problemSolved?.length || 0) - (a.problemSolved?.length || 0));
        setUsers(data);
      } catch {
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Carousel rotation: change center card every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIdx((i) => cycleIndex(i + 1, CONTESTS.length));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate indexes for left and right frames
  const leftIdx = cycleIndex(centerIdx - 1, CONTESTS.length);
  const rightIdx = cycleIndex(centerIdx + 1, CONTESTS.length);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: COLORS.bg,
        color: "white",
        fontFamily: "Inter, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Contest Carousel */}
      <section
        style={{
          maxWidth: CARD_WIDTH * 3 + 40,
          margin: "0 auto 3rem auto",
          backgroundColor: COLORS.primary,
          borderRadius: 20,
          padding: "1.5rem 1rem 2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.9)",
          userSelect: "none",
          marginTop: 0,
        }}
        aria-label="Upcoming contests rotating carousel"
        role="region"
      >
        <h2
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: 900,
            fontSize: "3rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            marginBottom: 24,
          }}
        >
          Upcoming Contests
        </h2>

        <div style={{ display: "flex", justifyContent: "center", gap: 12, height: FRAME_HEIGHT }}>
          {[leftIdx, centerIdx, rightIdx].map((idx, pos) => {
            const contest = CONTESTS[idx];
            const isCenter = pos === 1;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isCenter) {
                    if (pos === 0) setCenterIdx(cycleIndex(centerIdx - 1, CONTESTS.length));
                    else if (pos === 2) setCenterIdx(cycleIndex(centerIdx + 1, CONTESTS.length));
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Contest card: ${contest.name} on ${contest.date}, ${isCenter ? "center" : "side"} frame`}
                style={{
                  width: CARD_WIDTH,
                  height: FRAME_HEIGHT,
                  borderRadius: 20,
                  overflow: "hidden",
                  backgroundColor: contest.theme,
                  boxShadow: isCenter ? "0 14px 36px rgba(0,0,0,0.9)" : "0 5px 20px rgba(0,0,0,0.6)",
                  border: isCenter ? `3px solid ${COLORS.accent}` : "none",
                  cursor: isCenter ? "default" : "pointer",
                  scale: isCenter ? "1.05" : "1",
                  transition: "all 0.6s ease",
                  display: "flex",
                  flexDirection: "column",
                  userSelect: "none",
                }}
              >
                <img
                  src={contest.image}
                  alt={contest.name}
                  draggable={false}
                  style={{
                    width: "100%",
                    height: isCenter ? 128 : 92,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    objectFit: "cover",
                  }}
                />
                <div
                  style={{
                    backgroundColor: contest.theme,
                    color: "#fff",
                    padding: isCenter ? "1.3rem 1.1rem" : "0.85rem 1rem",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    minHeight: isCenter ? 74 : 50,
                    fontWeight: 700,
                    fontSize: isCenter ? 19 : 14,
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  {isCenter && (
                    <span
                      style={{
                        position: "absolute",
                        top: -28,
                        right: 14,
                        fontSize: 14,
                        fontWeight: 600,
                        padding: "3px 12px",
                        borderRadius: 8,
                        backgroundColor: "#0F172A88",
                        color: "#fff",
                      }}
                    >
                      {contest.type}
                    </span>
                  )}
                  <div
                    style={{
                      fontWeight: 800,
                      marginBottom: isCenter ? 8 : 4,
                      textShadow: "0 1.75px 5px rgba(0,0,0,0.6)",
                    }}
                  >
                    {contest.name}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: isCenter ? 14 : 11,
                      color: "#fffda9",
                    }}
                  >
                    {contest.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination dots */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {CONTESTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCenterIdx(i)}
              aria-label={`Go to contest ${CONTESTS[i].name}`}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: i === centerIdx ? COLORS.accent : COLORS.secondary,
                border: "none",
                boxShadow: i === centerIdx ? `0 0 0 4px ${COLORS.accent}aa` : "none",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* User Leaderboard */}
      <section
        style={{
          maxWidth: 800,
          margin: "0 auto 4rem auto",
          backgroundColor: COLORS.primary,
          borderRadius: 22,
          boxShadow: "0 10px 32px rgba(0,0,0,0.9)",
          padding: "2rem 2.5rem 3rem 2.5rem",
        }}
        aria-label="User leaderboard"
      >
        <h2
          style={{
            color: "#fff",
            fontWeight: 900,
            letterSpacing: 1.5,
            fontSize: "3rem",
            textAlign: "center",
            marginBottom: "3rem",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Leaderboard
        </h2>

        {loading && (
          <div
            style={{
              fontSize: 22,
              textAlign: "center",
              color: COLORS.gray,
              margin: "4rem 0",
            }}
          >
            Loading leaderboard...
          </div>
        )}

        {error && (
          <div
            style={{
              fontSize: 20,
              textAlign: "center",
              color: COLORS.danger,
              margin: "3rem 0",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && usersWithRank.length === 0 && (
          <div
            style={{
              fontSize: 20,
              textAlign: "center",
              color: COLORS.gray,
              margin: "3rem 0",
            }}
          >
            No data available.
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          {usersWithRank.map((user) => (
            <div
              key={user._id}
              className="user-card"
              style={{
                width: "80%",
                backgroundColor: COLORS.secondary,
                borderRadius: 18,
                boxShadow: "0 6px 28px rgba(0,0,0,0.85)",
                padding: "1.3rem 2.2rem",
                color: "white",
                display: "flex",
                alignItems: "center",
                position: "relative",
                fontSize: 19,
                fontWeight: 500,
                transition:
                  "transform 0.3s cubic-bezier(.6, 1.5, .63, 1), box-shadow 0.3s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.95)";
                e.currentTarget.style.zIndex = 10;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.85)";
                e.currentTarget.style.zIndex = "auto";
              }}
            >
              {/* Rank Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: 30,
                  background:
                    user.rank === 1
                      ? COLORS.accent
                      : user.rank === 2
                      ? COLORS.success
                      : user.rank === 3
                      ? COLORS.warning
                      : COLORS.gray,
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 20,
                  padding: "6px 20px",
                  borderRadius: 18,
                  userSelect: "none",
                }}
              >
                #{user.rank}
              </div>

              {/* Avatar or Initial */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  backgroundColor: COLORS.primary,
                  color: COLORS.accent,
                  fontWeight: 900,
                  fontSize: 26,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 28,
                  userSelect: "none",
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      userSelect: "none",
                    }}
                  />
                ) : (
                  (user.firstName ? user.firstName[0].toUpperCase() : "A")
                )}
              </div>

              {/* User Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 22,
                    color: "white",
                    marginBottom: 5,
                    userSelect: "none",
                  }}
                >
                  {user.firstName || "Anonymous"}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: COLORS.gray,
                    fontWeight: 500,
                    userSelect: "none",
                  }}
                >
                  <span style={{ color: COLORS.success, fontWeight: 700 }}>
                    {user.solvedCount}
                  </span>{" "}
                  solved problems
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: COLORS.highlight,
                    fontWeight: 500,
                    marginTop: 4,
                    userSelect: "none",
                  }}
                >
                  Rank: #{user.rank}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;
