import './App.css';
import React, { useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';

function App() {
  const [rectangles, setRectangles] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [connectorMode, setConnectorMode] = useState(false);
  const [pendingConnector, setPendingConnector] = useState(null);

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

  const getCenter = (shape) => {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    };
  };

  const handleShapeClick = (shapeId) => {
    if (!connectorMode) return;

    if (!pendingConnector) {
      setPendingConnector(shapeId);
    } else {
      const fromShape = rectangles.find((r) => r.id === pendingConnector);
      const toShape = rectangles.find((r) => r.id === shapeId);
      const fromCenter = getCenter(fromShape);
      const toCenter = getCenter(toShape);

      const newConnector = {
        id: `conn${connectors.length + 1}`,
        from: pendingConnector,
        to: shapeId,
        points: [fromCenter.x, fromCenter.y, toCenter.x, toCenter.y],
      };

      setConnectors([...connectors, newConnector]);
      setPendingConnector(null);
      setConnectorMode(false);
    }
  };

  return (
    <div className="App">
      <button onClick={addRectangle}>Add Class</button>
      <button onClick={() => setConnectorMode(!connectorMode)}>
        {connectorMode ? 'Cancel Connector' : 'Add Connector'}
      </button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {connectors.map((conn) => (
            <Line
              key={conn.id}
              points={conn.points}
              stroke="black"
            />
          ))}
          {rectangles.map((rect, i) => (
            <Rect
              key={rect.id}
              onClick={() => handleShapeClick(rect.id)}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill={rect.fill}
              draggable
              onDragMove={(e) => {
                const newRects = rectangles.slice();
                newRects[i] = {
                  ...rect,
                  x: e.target.x(),
                  y: e.target.y(),
                };
                setRectangles(newRects);

                const newConnectors = connectors.map((conn) => {
                  if (conn.from === rect.id) {
                    const fromCenter = getCenter(newRects[i]);
                    return {
                      ...conn,
                      points: [fromCenter.x, fromCenter.y, conn.points[2], conn.points[3]],
                    };
                  } else if (conn.to === rect.id) {
                    const toCenter = getCenter(newRects[i]);
                    return {
                      ...conn,
                      points: [conn.points[0], conn.points[1], toCenter.x, toCenter.y],
                    };
                  }
                  return conn;
                });
                setConnectors(newConnectors);
              }}
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
