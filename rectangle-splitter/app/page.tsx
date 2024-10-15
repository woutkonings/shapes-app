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
        border: '1px solid #fff',
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

  // Function to split a rectangle into two
  const splitRectangle = (id: number) => {
    setRectangles((prevRectangles) => {
      const rectToSplit = prevRectangles.find((r) => r.id === id);

      if (!rectToSplit) return prevRectangles;

      // Remove the rectangle to be split
      const newRects = prevRectangles.filter((r) => r.id !== id);

      const splitHorizontal = Math.random() > 0.5;
      const newRectangles: RectangleType[] = [];

      if (splitHorizontal) {
        // Split horizontally into two rectangles
        newRectangles.push({
          id: prevRectangles.length + 1,
          x: rectToSplit.x,
          y: rectToSplit.y,
          width: rectToSplit.width,
          height: rectToSplit.height / 2,
          color: getRandomColor(),
        });

        newRectangles.push({
          id: prevRectangles.length + 2,
          x: rectToSplit.x,
          y: rectToSplit.y + rectToSplit.height / 2,
          width: rectToSplit.width,
          height: rectToSplit.height / 2,
          color: getRandomColor(),
        });
      } else {
        // Split vertically into two rectangles
        newRectangles.push({
          id: prevRectangles.length + 1,
          x: rectToSplit.x,
          y: rectToSplit.y,
          width: rectToSplit.width / 2,
          height: rectToSplit.height,
          color: getRandomColor(),
        });

        newRectangles.push({
          id: prevRectangles.length + 2,
          x: rectToSplit.x + rectToSplit.width / 2,
          y: rectToSplit.y,
          width: rectToSplit.width / 2,
          height: rectToSplit.height,
          color: getRandomColor(),
        });
      }

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
