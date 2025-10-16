// Pure functions for game logic
const transpose = (matrix) => 
  matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));

const reverse = (matrix) => 
  matrix.map(row => [...row].reverse());

const deepCopy = (matrix) => 
  matrix.map(row => [...row]);

// Functional programming helper: compose functions
const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);

module.exports = {
  transpose,
  reverse,
  deepCopy,
  compose
};