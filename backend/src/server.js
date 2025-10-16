const express = require('express');
const cors = require('cors');
const Game2048 = require('./game');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Store games in memory (in production, use a database)
const games = new Map();

app.post('/api/game', (req, res) => {
  const { size = 4 } = req.body;
  const gameId = Date.now().toString();
  const game = new Game2048(size);
  
  games.set(gameId, game);
  
  res.json({
    gameId,
    ...game.getState()
  });
});

app.post('/api/game/:gameId/move', (req, res) => {
  const { gameId } = req.params;
  const { direction } = req.body;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const validDirections = ['left', 'right', 'up', 'down'];
  if (!validDirections.includes(direction)) {
    return res.status(400).json({ error: 'Invalid direction' });
  }

  const state = game.makeMove(direction);
  res.json(state);
});

app.post('/api/game/:gameId/restart', (req, res) => {
  const { gameId } = req.params;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const state = game.restart();
  res.json(state);
});

app.get('/api/game/:gameId', (req, res) => {
  const { gameId } = req.params;
  
  const game = games.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json(game.getState());
});

app.listen(port, () => {
  console.log(`🚀 2048 Game server running on port ${port}`);
});