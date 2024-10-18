'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Type definitions for rectangle properties
type RectangleProps = {
  rect: RectangleType;
  splitRectangle: (id: number) => void;
};

type RectangleType = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

// Helper function to get a random color
function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Rectangle component
function Rectangle({ rect, splitRectangle }: RectangleProps) {
  const { id, x, y, width, height, color } = rect;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent clicks from propagating to other rectangles
    splitRectangle(id);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        backgroundColor: color,
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    />
  );
}

// Main component (the dynamically loaded Home)
function Home() {
  // State to keep track of all rectangles
  const [rectangles, setRectangles] = useState<RectangleType[]>([
    { id: 1, x: 0, y: 0, width: 100, height: 100, color: getRandomColor() },
  ]);

  // A counter to keep track of unique ids
  const [rectIdCounter, setRectIdCounter] = useState(2); // Starting from 2 as the first rectangle has id 1

  // Function to split a rectangle into two
  const splitRectangle = (id: number) => {
    setRectangles((prevRectangles) => {
      const rectToSplit = prevRectangles.find((r) => r.id === id);

      if (!rectToSplit) return prevRectangles;

      // Remove the rectangle to be split
      const newRects = prevRectangles.filter((r) => r.id !== id);

      const splitHorizontal = Math.random() > 0.5;
      const splitInThrees = Math.random() > 0.5;
      const increment = splitInThrees ? 3 : 2;
      const newRectangles: RectangleType[] = [];

      // Use rectIdCounter to ensure unique ids
      const newId1 = rectIdCounter;
      const newId2 = rectIdCounter + 1;
      const newId3 = rectIdCounter + 2;

      if (splitHorizontal) {
        // Split horizontally into two rectangles
        newRectangles.push({
          id: newId1,
          x: rectToSplit.x,
          y: rectToSplit.y,
          width: rectToSplit.width,
          height: rectToSplit.height / increment,
          color: getRandomColor(),
        });

        newRectangles.push({
          id: newId2,
          x: rectToSplit.x,
          y: rectToSplit.y + rectToSplit.height / increment,
          width: rectToSplit.width,
          height: rectToSplit.height / increment,
          color: getRandomColor(),
        });

        if (splitInThrees) {
          newRectangles.push({
            id: newId3,
            x: rectToSplit.x,
            y: rectToSplit.y + (rectToSplit.height * 2) / increment,
            width: rectToSplit.width,
            height: rectToSplit.height / increment,
            color: getRandomColor(),
          });
        }
      } else {
        // Split vertically into two rectangles
        newRectangles.push({
          id: newId1,
          x: rectToSplit.x,
          y: rectToSplit.y,
          width: rectToSplit.width / increment,
          height: rectToSplit.height,
          color: getRandomColor(),
        });

        newRectangles.push({
          id: newId2,
          x: rectToSplit.x + rectToSplit.width / increment,
          y: rectToSplit.y,
          width: rectToSplit.width / increment,
          height: rectToSplit.height,
          color: getRandomColor(),
        });

        if (splitInThrees) {
          newRectangles.push({
            id: newId3,
            x: rectToSplit.x + (rectToSplit.width * 2) / increment,
            y: rectToSplit.y,
            width: rectToSplit.width / increment,
            height: rectToSplit.height,
            color: getRandomColor(),
          });
        }
      }

      // Increment the rectIdCounter by 2 to account for the two new rectangles
      setRectIdCounter(rectIdCounter + increment);

      return [...newRects, ...newRectangles];
    });
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {rectangles.map((rect) => (
        <Rectangle key={rect.id} rect={rect} splitRectangle={splitRectangle} />
      ))}
    </div>
  );
}

// Export Home component dynamically
export default dynamic(() => Promise.resolve(Home), { ssr: false });
