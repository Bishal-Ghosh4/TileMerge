import React, { useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import Controls from './components/Controls';
import useGame from './hooks/useGame';
import './styles/App.css';

function App() {
  const { gameState, loading, error, makeMove, restartGame, initializeGame } = useGame();

  // Handle keyboard events
  const handleKeyPress = useCallback((event) => {
    if (!gameState || gameState.gameOver || gameState.won) return;

    const keyHandlers = {
      ArrowLeft: () => makeMove('left'),
      ArrowRight: () => makeMove('right'),
      ArrowUp: () => makeMove('up'),
      ArrowDown: () => makeMove('down'),
    };

    const handler = keyHandlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, [gameState, makeMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleRestart = () => {
    restartGame();
  };

  const handleSizeChange = (size) => {
    initializeGame(size);
  };

  if (loading && !gameState) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!gameState) {
    return <div className="loading">Initializing game...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>2048 Game</h1>
        <p>Join the numbers and get to the <strong>2048</strong> tile!</p>
      </header>

      <div className="game-container">
        <div className="game-header">
          <ScoreBoard 
            score={gameState.score} 
            gameOver={gameState.gameOver}
            won={gameState.won}
          />
          <Controls 
            onRestart={handleRestart}
            onSizeChange={handleSizeChange}
            currentSize={gameState.size}
          />
        </div>

        <GameBoard 
          board={gameState.board} 
          size={gameState.size}
        />

        <div className="instructions">
          <h3>How to Play:</h3>
          <p>Use <strong>arrow keys</strong> to move tiles</p>
          <p>When two tiles with the same number touch, they merge into one!</p>
        </div>
      </div>
    </div>
  );
}

export default App;