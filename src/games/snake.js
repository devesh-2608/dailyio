import React, { useState, useEffect, useCallback } from 'react';
import './snake.css';

const Snake = () => {
  
  const GRID_SIZE = 20;
  const CELL_SIZE = 20;
  
  
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  
  
  const colors = {
    snake: '#7868E6',
    food: '#FF70B0',
    gameOver: '#FFB961',
    text: '#FFFFFF'
  };

  
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * (GRID_SIZE - 1)) + 1,
      y: Math.floor(Math.random() * (GRID_SIZE - 1)) + 1
    };
    
    
    for (const segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        return generateFood();
      }
    }
    
    return newFood;
  }, [snake]);
  
  
  const checkCollision = useCallback((head) => {
    
    if (
      head.x < 0 || 
      head.y < 0 || 
      head.x >= GRID_SIZE || 
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    
    
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  }, [snake]);
  
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setPaused(!paused);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameOver, paused]);
  
  
  useEffect(() => {
    if (gameOver || paused) return;
    
    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      
      
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }
      
      
      if (checkCollision(head)) {
        setGameOver(true);
        return;
      }
      
      
      newSnake.unshift(head);
      
      
      if (head.x === food.x && head.y === food.y) {
        setScore(score + 10);
        setFood(generateFood());
        
        
        if (score % 50 === 0 && speed > 50) {
          setSpeed(prevSpeed => prevSpeed - 10);
        }
      } else {
        
        newSnake.pop();
      }
      
      setSnake(newSnake);
    };
    
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [snake, food, direction, gameOver, paused, score, speed, generateFood, checkCollision]);
  
  
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(150);
    setPaused(false);
  };
  
  
  const renderCell = (i, j) => {
    const isSnakeCell = snake.some(segment => segment.x === j && segment.y === i);
    const isFoodCell = food.x === j && food.y === i;
    
    let backgroundColor = 'transparent';
    if (isSnakeCell) backgroundColor = colors.snake;
    if (isFoodCell) backgroundColor = colors.food;
    
    return (
      <div
        key={`${i}-${j}`}
        className="snake-game-cell"
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor
        }}
      />
    );
  };
  
  const renderGrid = () => {
    const grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        row.push(renderCell(i, j));
      }
      grid.push(
        <div key={i} className="snake-game-row" style={{ display: 'flex' }}>
          {row}
        </div>
      );
    }
    return grid;
  };
  return (
    <div className="snake-game-container">
      <h1 className="snake-game-title">Snake Game</h1>
      <div className="snake-game-score">Score: {score}</div>
      <div className="snake-game-board">
        {renderGrid()}
        {gameOver && (
          <div className="snake-game-overlay">
            <div className="snake-game-over">Game Over!</div>
            <button className="snake-game-reset-btn" onClick={resetGame} tabIndex={0}>
              Play Again
            </button>
          </div>
        )}
        {paused && !gameOver && (
          <div className="snake-game-overlay">
            <div className="snake-game-paused">Paused</div>
          </div>
        )}
      </div>
      <div className="snake-game-controls">
        <p>Use arrow keys to move</p>
        <p>Press space to pause/resume</p>
      </div>
    </div>
  );
};

export default Snake;