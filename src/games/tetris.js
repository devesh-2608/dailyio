import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './tetris.css';


const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
};

const COLORS = [
  '#FF6B6B',  
  '#4ECDC4',  
  '#45B7D1',  
  '#96C93D',  
  '#FFD93D',  
  '#FF8A5B',  
  '#6A5ACD'   
];

// Board dimensions
const BOARD_ROWS = 18;
const BOARD_COLS = 10;

const Tetris = () => {
  const [board, setBoard] = useState(
    Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Deep copy utility
  const deepCopy = (arr) => arr.map(row => [...row]);

  const createPiece = useCallback(() => {
    const shapeKeys = Object.keys(SHAPES);
    const randomShape = SHAPES[shapeKeys[Math.floor(Math.random() * shapeKeys.length)]];
    return {
      shape: randomShape,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    };
  }, []);

  // Move canMove above getWallKickPosition
  const canMove = useCallback((shape, board, offsetX, offsetY) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = offsetX + x;
          const newY = offsetY + y;
          if (
            newX < 0 ||
            newX >= BOARD_COLS ||
            newY >= BOARD_ROWS ||
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  // Wall kick logic for rotation
  const getWallKickPosition = useCallback((shape, board, x, y) => {
    // Try original position
    if (canMove(shape, board, x, y)) return { x, y };
    // Try left and right by 1
    if (canMove(shape, board, x - 1, y)) return { x: x - 1, y };
    if (canMove(shape, board, x + 1, y)) return { x: x + 1, y };
    // Try up by 1 (for floor kicks)
    if (canMove(shape, board, x, y - 1)) return { x, y: y - 1 };
    return null;
  }, [canMove]);

  const lockPiece = useCallback(() => {
    const newBoard = deepCopy(board);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = currentPosition.y + y;
          const boardX = currentPosition.x + x;
          if (boardY >= 0 && boardY < BOARD_ROWS && boardX >= 0 && boardX < BOARD_COLS) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });
    // Clear lines
    let linesCleared = 0;
    const clearedBoard = newBoard.filter(row => {
      if (row.every(cell => cell)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    while (clearedBoard.length < BOARD_ROWS) {
      clearedBoard.unshift(Array(BOARD_COLS).fill(0));
    }
    setScore(prev => prev + linesCleared * 100);
    setBoard(clearedBoard);
    // Spawn new piece
    const newPiece = createPiece();
    const startX = Math.floor((BOARD_COLS - newPiece.shape[0].length) / 2);
    if (!canMove(newPiece.shape, clearedBoard, startX, 0)) {
      setGameOver(true);
    } else {
      setCurrentPiece(newPiece);
      setCurrentPosition({ x: startX, y: 0 });
    }
  }, [board, currentPiece, currentPosition, canMove, createPiece]);

  useEffect(() => {
    const newPiece = createPiece();
    setCurrentPiece(newPiece);
    setCurrentPosition({ x: Math.floor((BOARD_COLS - newPiece.shape[0].length) / 2), y: 0 });
  }, [createPiece]);

  useEffect(() => {
    if (gameOver) return;
    const movePieceDown = () => {
      setCurrentPosition(prev => {
        if (!canMove(currentPiece.shape, board, prev.x, prev.y + 1)) {
          lockPiece();
          return prev;
        }
        return { ...prev, y: prev.y + 1 };
      });
    };
    const gameLoop = setInterval(movePieceDown, 500);
    return () => clearInterval(gameLoop);
  }, [currentPiece, gameOver, board, canMove, lockPiece]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowLeft':
          if (canMove(currentPiece.shape, board, currentPosition.x - 1, currentPosition.y)) {
            setCurrentPosition(prev => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (canMove(currentPiece.shape, board, currentPosition.x + 1, currentPosition.y)) {
            setCurrentPosition(prev => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case 'ArrowDown':
          if (canMove(currentPiece.shape, board, currentPosition.x, currentPosition.y + 1)) {
            setCurrentPosition(prev => ({ ...prev, y: prev.y + 1 }));
          }
          break;
        case 'ArrowUp': {
          // Rotate with wall kick
          const rotatedShape = currentPiece.shape[0].map((val, index) =>
            currentPiece.shape.map(row => row[index]).reverse()
          );
          const kick = getWallKickPosition(rotatedShape, board, currentPosition.x, currentPosition.y);
          if (kick) {
            setCurrentPiece(prev => ({ ...prev, shape: rotatedShape }));
            setCurrentPosition(kick);
          }
          break;
        }
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, currentPosition, gameOver, board, canMove, getWallKickPosition]);

  const restartGame = () => {
    setBoard(Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(0)));
    setGameOver(false);
    setScore(0);
    const newPiece = createPiece();
    setCurrentPiece(newPiece);
    setCurrentPosition({ x: Math.floor((BOARD_COLS - newPiece.shape[0].length) / 2), y: 0 });
  };

  const renderBoard = useMemo(() => {
    const displayBoard = deepCopy(board);
    if (currentPiece && !gameOver) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_ROWS && boardX >= 0 && boardX < BOARD_COLS) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        });
      });
    }
    return displayBoard;
  }, [board, currentPiece, currentPosition, gameOver]);

  return (
    <div className="tetris-game-container">
      <div className="game-info">
        <div>Score: {score}</div>
      </div>
      <div className="tetris-board">
        {renderBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="board-cell"
                style={{
                  backgroundColor: cell || 'transparent',
                  border: cell ? '2px solid #222' : '1px solid rgba(255,255,255,0.15)',
                  boxShadow: cell ? '0 0 6px 2px rgba(0,0,0,0.2)' : 'none',
                  transition: 'background 0.1s',
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="tetris-overlay">
          <div className="tetris-overlay-content">
            <div className="game-over">Game Over!</div>
            <button onClick={restartGame}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tetris;