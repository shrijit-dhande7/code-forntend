import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Floating code symbols
const floatingSymbols = ["{", "}", "<", ">", "=", ";", "/", "*", "+", "-", "!", "?"];

// Falling icons/images
const fallingImages = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg",
];

// Motivational quotes
const motivationalQuotes = [
  "Keep coding, keep growing.",
  "Every bug teaches you something.",
  "Small steps lead to big code.",
  "Code a little every day.",
  "Believe in your logic.",
];

// Typing text component with continuous loop
function TypingTextLoop({ lines, speed = 45, pause = 1500 }) {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const charIndexRef = useRef(0);

  useEffect(() => {
    if (charIndexRef.current < lines[index].length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + lines[index][charIndexRef.current]);
        charIndexRef.current += 1;
      }, speed);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        charIndexRef.current = 0;
        setDisplayedText("");
        setIndex((prev) => (prev + 1) % lines.length);
      }, pause);
      return () => clearTimeout(timer);
    }
  }, [displayedText, index, lines, speed, pause]);

  return (
    <h1
      style={{
        fontFamily: "'Fira Code', monospace",
        fontSize: "2.6rem",
        color: "#eee",
        lineHeight: 1.4,
        whiteSpace: "pre-wrap",
        userSelect: "none",
        textShadow: "0 0 6px #19fccbbb",
        minHeight: "3.8rem",
        margin: 0,
      }}
    >
      {displayedText}
      <span
        style={{
          marginLeft: 5,
          color: "#19fccb",
          animation: "blink 1.2s steps(2, start) infinite",
          fontWeight: "bold",
        }}
      >
        |
      </span>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </h1>
  );
}

export default function FixedSizeLandingAnimation() {
  const [fallIdx, setFallIdx] = useState(0);

  // Cycle falling images every 2500 ms
  useEffect(() => {
    const interval = setInterval(() => {
      setFallIdx((i) => (i + 1) % fallingImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const symbolCount = 25;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 24,
        backgroundColor: "#09121a",
        minHeight: "100vh",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 1200,
          height: 600,
          position: "relative",
          backgroundColor: "#09121a", // Same as page bg
          overflow: "hidden",
          borderRadius: 20,
          padding: 32,
          display: "flex",
          gap: 40,
          color: "#eee",
          fontFamily: "'Fira Code', monospace",
          userSelect: "none",
          alignItems: "center",
        }}
      >
        {/* Background animations */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          {/* Floating symbols */}
          {[...Array(symbolCount)].map((_, i) => (
            <motion.div
              key={"floatSym-" + i}
              className="font-mono"
              style={{
                position: "absolute",
                top: `${Math.random() * 90}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${12 + Math.random() * 16}px`,
                color: "rgba(200, 200, 200, 0.15)",
                userSelect: "none",
              }}
              animate={{
                y: [0, 20, 0],
                rotate: [0, 360],
                x: [0, 15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 10,
              }}
            >
              {floatingSymbols[Math.floor(Math.random() * floatingSymbols.length)]}
            </motion.div>
          ))}

          {/* Falling images */}
          {fallingImages.map((src, idx) => {
            const delay = (idx * 1.2) % (fallingImages.length * 1.2);
            return (
              <motion.img
                key={"fallBgImg-" + idx}
                src={src}
                alt={`falling-bg-${idx}`}
                draggable={false}
                style={{
                  position: "absolute",
                  width: 70 + (idx % 3) * 20,
                  left: `${(idx * 12 + 10)}%`,
                  borderRadius: 12,
                  filter: "drop-shadow(0 0 6px #00ffee33)",
                  userSelect: "none",
                  zIndex: 0,
                  pointerEvents: "none",
                  opacity: 0.2,
                }}
                initial={{ y: -150 }}
                animate={{ y: ["-150%", "110%"] }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay,
                }}
              />
            );
          })}
        </div>

        {/* Left side text */}
        <div
          style={{
            width: "55%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            paddingRight: 20,
          }}
        >
          <TypingTextLoop lines={motivationalQuotes} speed={45} pause={1800} />
        </div>

        {/* Right side content */}
        <div
          style={{
            width: "45%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
            zIndex: 2,
          }}
        >
          {/* Falling main icon */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={fallIdx}
              src={fallingImages[fallIdx]}
              alt={`falling-img-${fallIdx}`}
              style={{
                width: 180,
                height: 180,
                objectFit: "contain",
                borderRadius: 20,
                filter: "drop-shadow(0 0 16px #00ffe0aa)",
                background: "#09121a", // same as page bg
                padding: 16,
                zIndex: 2,
              }}
              initial={{ y: -200, opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{
                y: 200,
                opacity: 0,
                scale: 0.5,
                rotate: 30,
                transition: { duration: 0.8 },
              }}
              transition={{ duration: 1 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Decorative transparent frame */}
          <motion.div
            style={{
              width: 260,
              height: 260,
              borderRadius: 20,
              overflow: "hidden",
              userSelect: "none",
              pointerEvents: "none",
              filter: "drop-shadow(0 0 12px #19fccb88)",
              backgroundColor: "#09121a", // same as page bg
            }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <img
              src="https://img.lovepik.com/element/45011/1373.png_860.png"
              alt="decorative transparent"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 20,
                opacity: 0.5,
              }}
              draggable={false}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
