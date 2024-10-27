import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface Note {
  id: number;
  text: string;
  color: string;
  rotation: number;
  position: { x: number; y: number };
}

const StyledNote = styled.div<{
  color: string;
  rotation: number;
  left: number;
  top: number;
}>`
  position: absolute;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: 200px;
  min-height: 200px;
  padding: 20px;
  background: ${(props) => props.color};
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  transform: rotate(${(props) => props.rotation}deg);
  cursor: move;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-size: 18px;
  font-family: "Comic Sans MS", cursive;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 2px;
  white-space: pre-wrap;
  z-index: 1;

  &:hover {
    transform: rotate(${(props) => props.rotation}deg) scale(1.05);
    box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.2);
  }
`;

const AddButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 25px;
  border: none;
  background: #4caf50;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;

  &:hover {
    background: #45a049;
  }
`;

const DropArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

const initialQuotes = [
  "Your manager is cash, mentor is credit, networking is investments.",
  "Effort that is not recognized is effort that is not done",
  "This is the best banana bread I’ve ever had",
  "bitches",
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

  const addNote = () => {
    const newNote: Note = {
      id: notes.length,
      text: "Double click to edit...",
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 10 - 5,
      position: {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
      },
    };
    setNotes([...notes, newNote]);
  };

  const updateNoteText = (id: number, newText: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f0f0",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AddButton onClick={addNote}>Add Note</AddButton>

      {notes.map((note) => (
        <StyledNote
          key={note.id}
          color={note.color}
          rotation={note.rotation}
          left={note.position.x}
          top={note.position.y}
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
        </StyledNote>
      ))}

      <DropArea
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
