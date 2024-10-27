import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface Note {
  id: number;
  text: string;
  color: string;
  rotation: number;
  position: { x: number; y: number };
}

const sunsetAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const HeaderContainer = styled.div`
  position: relative;
  text-align: center;
  padding: 20px 0;
  margin-bottom: 40px;
  z-index: 1;
`;

const Title = styled.h1`
  font-family: "Playfair Display", "Georgia", serif;
  font-size: 4rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3),
    -2px -2px 8px rgba(255, 255, 255, 0.1);
  margin: 0;
  letter-spacing: 2px;
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    -45deg,
    #ff7e5f,
    #feb47b,
    #ff9966,
    #ff5e62,
    #ff9966
  );
  background-size: 400% 400%;
  animation: ${sunsetAnimation} 15s ease infinite;
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 20px;
  overflow: hidden;
`;

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
    <ContentWrapper>
      <BackgroundContainer />
      <HeaderContainer>
        <Title>Pareen Khanna</Title>
        <Title style={{ fontSize: "3rem" }}> और उसके</Title>
        <Title style={{ fontSize: "2rem" }}>인용 부호 </Title>
      </HeaderContainer>

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
    </ContentWrapper>
  );
};

export default App;
