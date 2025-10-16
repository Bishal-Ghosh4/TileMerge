import React from 'react';
import './ScoreBoard.css';

const ScoreBoard = ({ score, gameOver, won }) => {
  return (
    <div className="score-board">
      <div className="score">Score: {score}</div>
      {gameOver && !won && (
        <div className="game-over">Game Over!</div>
      )}
      {won && (
        <div className="game-won">You Win! 🎉</div>
      )}
    </div>
  );
};

export default ScoreBoard;