import { useState, useEffect, useCallback } from 'react';

const useGame = () => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:3001/api';

  // Initialize new game
  const initializeGame = useCallback(async (size = 4) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size }),
      });
      
      if (!response.ok) throw new Error('Failed to initialize game');
      
      const data = await response.json();
      setGameState(data);
      localStorage.setItem('2048_gameId', data.gameId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Make a move
  const makeMove = useCallback(async (direction) => {
    if (!gameState?.gameId || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/game/${gameState.gameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction }),
      });
      
      if (!response.ok) throw new Error('Failed to make move');
      
      const data = await response.json();
      setGameState(prev => ({ ...prev, ...data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameState?.gameId, loading]);

  // Restart game
  const restartGame = useCallback(async () => {
    if (!gameState?.gameId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/game/${gameState.gameId}/restart`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to restart game');
      
      const data = await response.json();
      setGameState(prev => ({ ...prev, ...data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [gameState?.gameId]);

  // Load existing game on mount
  useEffect(() => {
    const savedGameId = localStorage.getItem('2048_gameId');
    if (savedGameId) {
      // Try to load existing game
      fetch(`${API_BASE}/game/${savedGameId}`)
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('Game not found');
        })
        .then(data => setGameState({ gameId: savedGameId, ...data }))
        .catch(() => initializeGame());
    } else {
      initializeGame();
    }
  }, [initializeGame]);

  return {
    gameState,
    loading,
    error,
    makeMove,
    restartGame,
    initializeGame,
  };
};

export default useGame;