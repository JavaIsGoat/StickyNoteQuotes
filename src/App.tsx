import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import { quotes } from "./quotes";
interface Note {
  id: number;
  text: string;
  color: string;
  rotation: number;
  position: { x: number; y: number };
}
const colors = [
  "#feff9c", // yellow
  "#ff7eb9", // pink
  "#7afcff", // blue
  "#fff740", // bright yellow
  "#ffa07a", // light salmon
  "#98ff98", // mint green
];

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Get header height to avoid placing notes over it
    const headerHeight =
      document
        .querySelector(`.${styles.HeaderContainer}`)
        ?.getBoundingClientRect().height || 200;
    const safeMargin = 50; // Additional margin below header
    const minY = headerHeight + safeMargin;

    // Shuffle the quotes
    const shuffledQuotes = shuffleArray(quotes);

    // Calculate available space for notes
    const availableWidth = window.innerWidth - 300; // 300px for note width + margin
    const availableHeight = window.innerHeight - minY - 200; // 200px for note height

    const initialNotes: Note[] = shuffledQuotes.map((quote, index) => ({
      id: index,
      text: quote,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 10 - 5,
      position: {
        x: 50 + Math.random() * availableWidth,
        y: minY + Math.random() * availableHeight,
      },
    }));
    setNotes(initialNotes);
  }, []);

  return (
    <div className={styles.ContentWrapper}>
      <div className={styles.BackgroundContainer} />
      <div className={styles.HeaderContainer}>
        <h1 className={styles.Title}>Pareen Khanna</h1>
        <h1 className={styles.Title} style={{ fontSize: "3rem" }}>
          और उसके
        </h1>
        <h1 className={styles.Title} style={{ fontSize: "2rem" }}>
          인용 부호
        </h1>
      </div>

      {notes.map((note) => (
        <div
          key={note.id}
          className={styles.Note}
          style={{
            left: `${note.position.x}px`,
            top: `${note.position.y}px`,
            background: note.color,
            transform: `rotate(${note.rotation}deg)`,
          }}
        >
          {note.text}
        </div>
      ))}

      <div
        className={styles.DropArea}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const id = parseInt(e.dataTransfer.getData("text/plain"));
          const offset_x = parseInt(e.dataTransfer.getData("offset_x"));
          const offset_y = parseInt(e.dataTransfer.getData("offset_y"));

          // Get header height to prevent dropping notes over it
          const headerHeight =
            document
              .querySelector(`.${styles.HeaderContainer}`)
              ?.getBoundingClientRect().height || 200;
          const safeMargin = 50;
          const minY = headerHeight + safeMargin;

          const newY = Math.max(minY, e.clientY - offset_y);

          setNotes(
            notes.map((note) =>
              note.id === id
                ? {
                    ...note,
                    position: {
                      x: e.clientX - offset_x,
                      y: newY,
                    },
                  }
                : note
            )
          );
        }}
      />
    </div>
  );
};

export default App;
