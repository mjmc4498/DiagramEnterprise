import React from 'react';

const PropertiesPanel = ({ selectedShape, onTextChange }) => {
  if (!selectedShape) {
    return (
      <div className="properties-panel">
        <p>No shape selected</p>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      <label>Name:</label>
      <input
        type="text"
        value={selectedShape.text}
        onChange={(e) => onTextChange(selectedShape.id, e.target.value)}
      />
    </div>
  );
};

export default PropertiesPanel;
