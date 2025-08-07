import './App.css';
import React, { useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Palette from './Palette';
import ClassShape from './ClassShape';
import PropertiesPanel from './PropertiesPanel';

function App() {
  const [diagramType, setDiagramType] = useState('ClassDiagram');
  const [rectangles, setRectangles] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [connectorMode, setConnectorMode] = useState(false);
  const [pendingConnector, setPendingConnector] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);

  const addShape = (shapeType) => {
    const newShape = {
      type: shapeType,
      text: shapeType,
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200),
      width: 150,
      height: 100,
      fill: 'white',
      id: `shape${rectangles.length + 1}`,
    };
    setRectangles([...rectangles, newShape]);
  };

  const handleTextChange = (shapeId, newText) => {
    const newRects = rectangles.map((rect) => {
      if (rect.id === shapeId) {
        return { ...rect, text: newText };
      }
      return rect;
    });
    setRectangles(newRects);
  };

  const getCenter = (shape) => {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    };
  };

  const handleShapeClick = (shapeId) => {
    if (connectorMode) {
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
    } else {
      const shape = rectangles.find((r) => r.id === shapeId);
      setSelectedShape(shape);
    }
  };

  return (
    <div className="App">
      <Palette onAddShape={addShape} />
      <div className="main-content">
        <button onClick={() => setConnectorMode(!connectorMode)}>
          {connectorMode ? 'Cancel Connector' : 'Add Connector'}
        </button>
        <Stage width={window.innerWidth - 400} height={window.innerHeight}>
          <Layer>
            {connectors.map((conn) => (
            <Line
              key={conn.id}
              points={conn.points}
              stroke="black"
            />
          ))}
          {rectangles.map((rect, i) => {
            const shapeProps = {
              key: rect.id,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              fill: rect.fill,
              type: rect.type,
              id: rect.id,
            };

            const onDragMove = (e) => {
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
              };

            const onDragEnd = (e) => {
                const newRects = rectangles.slice();
                newRects[i] = {
                  ...rect,
                  x: e.target.x(),
                  y: e.target.y(),
                };
                setRectangles(newRects);
              };

            if (rect.type === 'Class') {
              return (
                <ClassShape
                  shapeProps={shapeProps}
                  onDragMove={onDragMove}
                  onDragEnd={onDragEnd}
                  onClick={() => handleShapeClick(rect.id)}
                  onTextChange={handleTextChange}
                />
              );
            }

            return (
              <Rect
                {...shapeProps}
                draggable
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onClick={() => handleShapeClick(rect.id)}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
    <PropertiesPanel
      selectedShape={selectedShape}
      onTextChange={handleTextChange}
    />
  </div>
  );
}

export default App;
