import React from 'react';
import Tile from './Tile';
import './GameBoard.css';

const GameBoard = ({ board, size = 4 }) => {
  return (
    <div className="game-board">
      <div 
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`
        }}
      >
        {board.flat().map((value, index) => (
          <div key={index} className="grid-cell">
            <Tile value={value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;