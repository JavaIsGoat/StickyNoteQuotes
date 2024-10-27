import React, { useState, useEffect } from "react";
import styles from "./App.module.css";

interface Note {
  id: number;
  text: string;
  color: string;
  rotation: number;
  position: { x: number; y: number };
}

const initialQuotes = [
  "Your manager is cash, mentor is credit, networking is investments.",
  "Effort that is not recognized is effort that is not done",
  "So long Hong Kong, catch me for a tea in London with my subtle British accent!",
];

const colors = [
  "#feff9c", // yellow
  "#ff7eb9", // pink
  "#7afcff", // blue
  "#fff740", // bright yellow
  "#ffa07a", // light salmon
  "#98ff98", // mint green
];

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const initialNotes: Note[] = initialQuotes.map((quote, index) => ({
      id: index,
      text: quote,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 10 - 5,
      position: {
        x: 50 + Math.random() * (window.innerWidth - 300),
        y: 50 + Math.random() * (window.innerHeight - 300),
      },
    }));
    setNotes(initialNotes);
  }, []);

  const updateNoteText = (id: number, newText: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  return (
    <div className={styles.ContentWrapper}>
      <div className={styles.BackgroundContainer} />
      <div className={styles.HeaderContainer}>
        <h1 className={styles.Title}>Pareen Khanna</h1>
        <h1 className={styles.Title} style={{ fontSize: "3rem" }}>
          {" "}
          और उसके
        </h1>
        <h1 className={styles.Title} style={{ fontSize: "2rem" }}>
          인용 부호{" "}
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
          onDoubleClick={() => {
            const newText = prompt("Edit note:", note.text);
            if (newText !== null) {
              updateNoteText(note.id, newText);
            }
          }}
          draggable={true}
          onDragStart={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.dataTransfer.setData("text/plain", note.id.toString());
            e.dataTransfer.setData(
              "offset_x",
              (e.clientX - rect.left).toString()
            );
            e.dataTransfer.setData(
              "offset_y",
              (e.clientY - rect.top).toString()
            );
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

          setNotes(
            notes.map((note) =>
              note.id === id
                ? {
                    ...note,
                    position: {
                      x: e.clientX - offset_x,
                      y: e.clientY - offset_y,
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
