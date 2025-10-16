import React from 'react';
import './Controls.css';

const Controls = ({ onRestart, onSizeChange, currentSize }) => {
  return (
    <div className="controls">
      <button className="restart-btn" onClick={onRestart}>
        New Game
      </button>
      <div className="size-controls">
        <label>Board Size:</label>
        <select 
          value={currentSize} 
          onChange={(e) => onSizeChange(parseInt(e.target.value))}
        >
          <option value={3}>3x3</option>
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
          <option value={6}>6x6</option>
        </select>
      </div>
    </div>
  );
};

export default Controls;