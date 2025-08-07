import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Palette from './Palette';
import ClassShape from './ClassShape';
import PropertiesPanel from './PropertiesPanel';

function App() {
  // =================================================================
  // Model
  // =================================================================
  const [diagramType, setDiagramType] = useState('ClassDiagram');
  const [rectangles, setRectangles] = useState(() => {
    const savedRectangles = localStorage.getItem('uml-editor-rectangles');
    return savedRectangles ? JSON.parse(savedRectangles) : [];
  });
  const [connectors, setConnectors] = useState(() => {
    const savedConnectors = localStorage.getItem('uml-editor-connectors');
    return savedConnectors ? JSON.parse(savedConnectors) : [];
  });
  const [connectorMode, setConnectorMode] = useState(false);
  const [pendingConnector, setPendingConnector] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [history, setHistory] = useState([]);
  const stageRef = useRef(null);

  // =================================================================
  // Controller
  // =================================================================
  useEffect(() => {
    localStorage.setItem('uml-editor-rectangles', JSON.stringify(rectangles));
    localStorage.setItem('uml-editor-connectors', JSON.stringify(connectors));
  }, [rectangles, connectors]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveState();
      } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        if (history.length > 0) {
          const previousState = history[history.length - 1];
          setRectangles(previousState);
          setHistory(history.slice(0, history.length - 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rectangles, connectors]);

  const saveState = () => {
    localStorage.setItem('uml-editor-rectangles', JSON.stringify(rectangles));
    localStorage.setItem('uml-editor-connectors', JSON.stringify(connectors));
    alert('Diagram saved!');
  };

  const loadState = () => {
    const savedRectangles = localStorage.getItem('uml-editor-rectangles');
    if (savedRectangles) {
      setRectangles(JSON.parse(savedRectangles));
    }
    const savedConnectors = localStorage.getItem('uml-editor-connectors');
    if (savedConnectors) {
      setConnectors(JSON.parse(savedConnectors));
    }
    alert('Diagram loaded!');
  };

  const exportAsPNG = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'diagram.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addShape = (shapeType) => {
    setHistory([...history, rectangles]);
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

  // =================================================================
  // View
  // =================================================================
  return (
    <div className="App">
      <Palette onAddShape={addShape} />
      <div className="main-content">
        <div className="toolbar">
          <button onClick={() => setConnectorMode(!connectorMode)}>
            {connectorMode ? 'Cancel Connector' : 'Add Connector'}
          </button>
          <button onClick={saveState}>Save</button>
          <button onClick={loadState}>Load</button>
          <button onClick={exportAsPNG}>Export as PNG</button>
        </div>
        <Stage ref={stageRef} width={window.innerWidth - 400} height={window.innerHeight}>
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
