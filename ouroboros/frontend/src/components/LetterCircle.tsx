import React from "react";

interface LetterCircleProps {
  letters: string[];
  circleSize: number; // diameter in pixels
  maxPositions?: number; // max slots on the circle
}

const LetterCircle: React.FC<LetterCircleProps> = ({
  letters,
  circleSize,
  maxPositions = 12, // default max positions
}) => {
  const radius = circleSize / 2;
  const angleStep = (2 * Math.PI) / maxPositions;

  // Map each position to the index of the *last* letter assigned there
  const positionToLetterIndex = new Map<number, number>();

  letters.forEach((_, i) => {
    const pos = i % maxPositions;
    // overwrite so last letter at that position stays
    positionToLetterIndex.set(pos, i);
  });

  return (
    <div
      style={{
        position: "relative",
        width: circleSize,
        height: circleSize,
        borderRadius: "50%",
        border: "1px solid gray",
      }}
    >
      {[...positionToLetterIndex.entries()].map(([pos, letterIndex]) => {
        const angle = pos * angleStep - Math.PI / 2; // start top
        const x = radius + radius * Math.cos(angle) - 8; // adjust center letter
        const y = radius + radius * Math.sin(angle) - 8;

        return (
          <div
            key={pos}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              width: 16,
              height: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              pointerEvents: "none", // so overlapping letters don’t block clicks
            }}
          >
            {letters[letterIndex]}
          </div>
        );
      })}
    </div>
  );
};

export default LetterCircle;
