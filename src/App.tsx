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

  const calculateNoteLayout = () => {
    const headerHeight =
      document
        .querySelector(`.${styles.HeaderContainer}`)
        ?.getBoundingClientRect().height || 200;
    const safeMargin = window.innerWidth < 768 ? 30 : 50;
    const minY = headerHeight + safeMargin;

    const shuffledQuotes = shuffleArray(quotes);

    // Adjust note spacing for different screen sizes
    const noteWidth = window.innerWidth < 768 ? 150 : 200;
    const noteMargin = window.innerWidth < 768 ? 10 : 20;

    const availableWidth = window.innerWidth - (noteWidth + noteMargin * 2);
    const availableHeight =
      window.innerHeight - minY - (noteWidth + noteMargin * 2);

    const initialNotes: Note[] = shuffledQuotes.map((quote, index) => ({
      id: index,
      text: quote,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation:
        Math.random() * (window.innerWidth < 768 ? 6 : 10) -
        (window.innerWidth < 768 ? 3 : 5),
      position: {
        x: noteMargin + Math.random() * availableWidth,
        y: minY + Math.random() * availableHeight,
      },
    }));
    setNotes(initialNotes);
  };

  useEffect(() => {
    calculateNoteLayout();
    window.addEventListener("resize", calculateNoteLayout);
    return () => window.removeEventListener("resize", calculateNoteLayout);
  }, []);

  return (
    <div className={styles.ContentWrapper}>
      <div className={styles.BackgroundContainer} />
      <div className={styles.HeaderContainer}>
        <h1 className={styles.Title}>Pareen Khanna</h1>
        <h1
          className={styles.Title}
          style={{ fontSize: "clamp(1.5rem, 4.5vw, 3rem)" }}
        >
          और उसके
        </h1>
        <h1
          className={styles.Title}
          style={{ fontSize: "clamp(1rem, 3vw, 2rem)" }}
        >
          인용 부호
        </h1>
      </div>

      {notes.map((note) => (
        <div
          key={note.id}
          className={styles.Note}
          draggable
          onDragStart={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offset_x = e.clientX - rect.left;
            const offset_y = e.clientY - rect.top;
            e.dataTransfer.setData("text/plain", note.id.toString());
            e.dataTransfer.setData("offset_x", offset_x.toString());
            e.dataTransfer.setData("offset_y", offset_y.toString());
          }}
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

          const headerHeight =
            document
              .querySelector(`.${styles.HeaderContainer}`)
              ?.getBoundingClientRect().height || 200;
          const safeMargin = window.innerWidth < 768 ? 30 : 50;
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
