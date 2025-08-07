import './App.css';
import React, { useState } from 'react';
import { Stage, Layer, Rect } from 'react-konva';

function App() {
  const [rectangles, setRectangles] = useState([]);

  const addRectangle = () => {
    const newRectangle = {
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      width: 100,
      height: 100,
      fill: 'lightblue',
      id: `rect${rectangles.length + 1}`,
    };
    setRectangles([...rectangles, newRectangle]);
  };

  return (
    <div className="App">
      <button onClick={addRectangle}>Add Class</button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {rectangles.map((rect, i) => (
            <Rect
              key={rect.id}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              draggable
              onDragEnd={(e) => {
                const newRects = rectangles.slice();
                newRects[i] = {
                  ...rect,
                  x: e.target.x(),
                  y: e.target.y(),
                };
                setRectangles(newRects);
              }}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
