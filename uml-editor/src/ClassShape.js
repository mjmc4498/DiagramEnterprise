import React from 'react';
import { Group, Rect, Text } from 'react-konva';

const ClassShape = ({ shapeProps, onDragMove, onDragEnd, onClick }) => {
  return (
    <Group
      {...shapeProps}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <Rect
        width={shapeProps.width}
        height={shapeProps.height}
        fill={shapeProps.fill}
        stroke="black"
        strokeWidth={1}
      />
      <Text
        text={shapeProps.type}
        fontSize={16}
        padding={10}
        width={shapeProps.width}
        align="center"
      />
    </Group>
  );
};

export default ClassShape;
