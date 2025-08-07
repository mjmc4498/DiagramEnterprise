import React from 'react';

const Palette = ({ onAddShape }) => {
  return (
    <div className="palette">
      <h3>Class Diagram</h3>
      <button onClick={() => onAddShape('Class')}>Add Class</button>
      <button onClick={() => onAddShape('Interface')}>Add Interface</button>
      <button onClick={() => onAddShape('Package')}>Add Package</button>
    </div>
  );
};

export default Palette;
