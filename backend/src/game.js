const { transpose, reverse, deepCopy } = require('./utils');

class Game2048 {
  constructor(size = 4) {
    this.size = size;
    this.board = this.initializeBoard();
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  // Pure function: initialize empty board
  initializeBoard() {
    return Array(this.size).fill().map(() => 
      Array(this.size).fill(0)
    );
  }

  // Pure function: get empty cells
  getEmptyCells(board) {
    const emptyCells = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }

  // Side effect: add random tile
  addRandomTile() {
    const emptyCells = this.getEmptyCells(this.board);
    if (emptyCells.length === 0) return;

    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  // Pure function: move and merge a single row
  moveRow(row) {
    // Filter out zeros
    let newRow = row.filter(cell => cell !== 0);
    let mergedRow = [];
    let score = 0;

    // Merge tiles
    for (let i = 0; i < newRow.length; i++) {
      if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
        const mergedValue = newRow[i] * 2;
        mergedRow.push(mergedValue);
        score += mergedValue;
        i++; // Skip next tile
      } else {
        mergedRow.push(newRow[i]);
      }
    }

    // Pad with zeros
    while (mergedRow.length < this.size) {
      mergedRow.push(0);
    }

    return { row: mergedRow, score };
  }

  // Pure function: move board in a direction
  move(direction) {
    let board = deepCopy(this.board);
    let totalScore = 0;

    const operations = {
      left: () => board.map(row => {
        const { row: newRow, score } = this.moveRow(row);
        totalScore += score;
        return newRow;
      }),
      right: () => board.map(row => {
        const { row: newRow, score } = this.moveRow([...row].reverse());
        totalScore += score;
        return newRow.reverse();
      }),
      up: () => {
        board = transpose(board);
        board = board.map(row => {
          const { row: newRow, score } = this.moveRow(row);
          totalScore += score;
          return newRow;
        });
        return transpose(board);
      },
      down: () => {
        board = transpose(board);
        board = board.map(row => {
          const { row: newRow, score } = this.moveRow([...row].reverse());
          totalScore += score;
          return newRow.reverse();
        });
        return transpose(board);
      }
    };

    const newBoard = operations[direction]();
    
    return {
      board: newBoard,
      score: totalScore,
      moved: !this.boardsEqual(board, newBoard)
    };
  }

  // Pure function: check if boards are equal
  boardsEqual(board1, board2) {
    return JSON.stringify(board1) === JSON.stringify(board2);
  }

  // Pure function: check if game is over
  checkGameOver(board) {
    // Check for empty cells
    if (this.getEmptyCells(board).length > 0) return false;

    // Check for possible merges
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = board[row][col];
        if (
          (col < this.size - 1 && current === board[row][col + 1]) ||
          (row < this.size - 1 && current === board[row + 1][col])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  // Pure function: check if won
  checkWin(board) {
    return board.some(row => row.some(cell => cell === 2048));
  }

  // Main move handler
  makeMove(direction) {
    if (this.gameOver) return this.getState();

    const { board: newBoard, score, moved } = this.move(direction);
    
    if (moved) {
      this.board = newBoard;
      this.score += score;
      
      if (this.checkWin(this.board)) {
        this.won = true;
      } else {
        this.addRandomTile();
        
        if (this.checkGameOver(this.board)) {
          this.gameOver = true;
        }
      }
    }

    return this.getState();
  }

  getState() {
    return {
      board: deepCopy(this.board),
      score: this.score,
      gameOver: this.gameOver,
      won: this.won,
      size: this.size
    };
  }

  restart() {
    this.board = this.initializeBoard();
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.addRandomTile();
    this.addRandomTile();
    return this.getState();
  }
}

module.exports = Game2048;