import React, { useState, useEffect, useRef } from 'react';
import { Group, Rect, Text } from 'react-konva';

const ClassShape = ({ shapeProps, onDragMove, onDragEnd, onClick, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(shapeProps.type);
  const textInput = useRef(null);

  useEffect(() => {
    if (isEditing) {
      // focus the text input
      textInput.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    onTextChange(shapeProps.id, text);
  };

  const handleTextKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onTextChange(shapeProps.id, text);
    }
  };

  return (
    <Group
      {...shapeProps}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onDblClick={handleDoubleClick}
    >
      <Rect
        width={shapeProps.width}
        height={shapeProps.height}
        fill={shapeProps.fill}
        stroke="black"
        strokeWidth={1}
      />
      {isEditing ? (
        <foreignObject x={0} y={0} width={shapeProps.width} height={shapeProps.height}>
          <textarea
            ref={textInput}
            value={text}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            style={{
              width: `${shapeProps.width}px`,
              height: `${shapeProps.height}px`,
              border: 'none',
              padding: '10px',
              margin: '0',
              background: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '16px',
              textAlign: 'center',
            }}
          />
        </foreignObject>
      ) : (
        <Text
          text={text}
          fontSize={16}
          padding={10}
          width={shapeProps.width}
          align="center"
        />
      )}
    </Group>
  );
};

export default ClassShape;
