import React, { useState, useEffect, useCallback } from 'react';

const SlidingPuzzle = () => {
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [size, setSize] = useState(3); 

  
  const initializeGame = useCallback(() => {
    
    const newBoard = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
    
    
    
    let shuffledBoard = [...newBoard];
    let emptyIndex = size * size - 1;
    
    
    for (let i = 0; i < 1000; i++) {
      const possibleMoves = getValidMoves(shuffledBoard, size);
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        
        [shuffledBoard[emptyIndex], shuffledBoard[randomMove]] = 
          [shuffledBoard[randomMove], shuffledBoard[emptyIndex]];
        emptyIndex = randomMove;
      }
    }
    
    setBoard(shuffledBoard);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setEndTime(null);
  }, [size]);

  
  const getValidMoves = (currentBoard, gridSize) => {
    const emptyIndex = currentBoard.indexOf(0);
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;
    const validMoves = [];
    
    
    if (row > 0) validMoves.push(emptyIndex - gridSize);
    
    if (row < gridSize - 1) validMoves.push(emptyIndex + gridSize);
    
    if (col > 0) validMoves.push(emptyIndex - 1);
    
    if (col < gridSize - 1) validMoves.push(emptyIndex + 1);
    
    return validMoves;
  };
  
  
  const checkWin = useCallback((currentBoard) => {
    
    for (let i = 0; i < currentBoard.length - 1; i++) {
      if (currentBoard[i] !== i + 1) return false;
    }
    return currentBoard[currentBoard.length - 1] === 0;
  }, []);

  
  const handleTileClick = (index) => {
    if (gameOver) return;
    
    const emptyIndex = board.indexOf(0);
    
    const validMoves = getValidMoves(board, size);
    
    if (validMoves.includes(index)) {
      
      const newBoard = [...board];
      [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
      
      setBoard(newBoard);
      setMoves(moves + 1);
      
      
      if (checkWin(newBoard)) {
        setGameOver(true);
        setEndTime(Date.now());
      }
    }
  };
  
  
  const changeSize = (newSize) => {
    setSize(newSize);
  };
  
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame, size]);

  
  const formatTime = (milliseconds) => {
    if (!milliseconds) return '00:00';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  
  const elapsedTime = endTime 
    ? endTime - startTime 
    : startTime 
      ? Date.now() - startTime 
      : 0;
      const gradientKeyframes = `
      body {
        margin: 0;
        padding: 0;
        background: linear-gradient(-45deg, #FF6B6B, #4ECDC4, #45B7D1, #96C93D);
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
        min-height: 100vh;
      }
  
      @keyframes gradientBG {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
  
  return (
    <div className="puzzle-container">
      <style jsx>{gradientKeyframes}</style>
      <div className="puzzle-header">
        <h2>Sliding Puzzle</h2>
        <div className="puzzle-stats">
          <span>Moves: {moves}</span>
          <span>Time: {formatTime(elapsedTime)}</span>
        </div>
        <div className="puzzle-controls">
          <button 
            className="puzzle-restart-btn"
            onClick={initializeGame}
          >
            Restart Game
          </button>
          <div className="puzzle-difficulty">
            <button 
              onClick={() => changeSize(3)}
              className={`puzzle-size-btn ${size === 3 ? 'active' : ''}`}
            >
              3×3
            </button>
            <button 
              onClick={() => changeSize(4)}
              className={`puzzle-size-btn ${size === 4 ? 'active' : ''}`}
            >
              4×4
            </button>
            <button 
              onClick={() => changeSize(5)}
              className={`puzzle-size-btn ${size === 5 ? 'active' : ''}`}
            >
              5×5
            </button>
          </div>
        </div>
      </div>
      
      {gameOver && (
        <div className="puzzle-victory">
          <h3>Puzzle Solved!</h3>
          <p>You completed the puzzle in {moves} moves and {formatTime(elapsedTime)}!</p>
        </div>
      )}
      
      <div 
        className="puzzle-grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {board.map((value, index) => (
          <div
            key={index}
            className={`puzzle-tile ${value === 0 ? 'empty' : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {value !== 0 && value}
          </div>
        ))}
      </div>
      
      
      <style jsx>{`
        .puzzle-container {
          padding-top: 24px;
          max-width: 420px;
          margin: 90px auto 0 auto;
          font-family: 'Poppins', 'Inter', Arial, sans-serif;
          background: rgba(30, 36, 50, 0.92);
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.18);
          padding-bottom: 32px;
          position: relative;
        }
        
        .puzzle-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .puzzle-header h2 {
          color: white;
          font-size: 28px;
          margin-bottom: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .puzzle-stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 18px;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .puzzle-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .puzzle-difficulty {
          display: flex;
          gap: 10px;
        }
        
        .puzzle-restart-btn {
          background: linear-gradient(135deg, #6CD0FF 0%, #1A91DA 100%);
          color: #fff;
          border: none;
          padding: 10px 22px;
          border-radius: 22px;
          cursor: pointer;
          font-size: 1em;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        
        .puzzle-restart-btn:hover {
          background: linear-gradient(135deg, #1A91DA 0%, #6CD0FF 100%);
          color: #fff;
          transform: scale(1.07);
        }
        
        .puzzle-size-btn {
          background: rgba(255,255,255,0.18);
          color: #fff;
          border: none;
          padding: 7px 16px;
          border-radius: 16px;
          cursor: pointer;
          font-size: 0.98em;
          font-weight: 500;
          margin: 0 2px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }
        
        .puzzle-size-btn:hover {
          background: rgba(255,255,255,0.32);
          color: #ffe066;
          transform: scale(1.08);
        }
        
        .puzzle-size-btn.active {
          background: linear-gradient(135deg, #6CD0FF 0%, #1A91DA 100%);
          color: #fff;
        }
        
        .puzzle-grid {
          display: grid;
          gap: 8px;
          width: 100%;
          max-width: 340px;
          min-width: 180px;
          margin: 0 auto;
          aspect-ratio: 1/1;
          background: rgba(255,255,255,0.10);
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          position: relative;
        }
        
        .puzzle-tile {
          background: linear-gradient(135deg, #2e466e 60%, #6c7175 100%);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18), 0 1.5px 0 #fff2 inset;
          border: 2.5px solid rgba(255,255,255,0.13);
          transition: transform 0.18s, box-shadow 0.18s;
          animation: tilePop 0.18s;
        }
        
        @keyframes tilePop {
          0% { transform: scale(1); }
          50% { transform: scale(1.10); }
          100% { transform: scale(1); }
        }
        
        .puzzle-tile:hover:not(.empty) {
          transform: scale(0.93);
          box-shadow: 0 6px 24px rgba(0,0,0,0.22);
        }
        
        .puzzle-tile.empty {
          background: none;
          box-shadow: none;
          cursor: default;
        }
        
        .puzzle-victory {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.72);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border-radius: 18px;
          color: #fff;
          text-align: center;
        }
        
        .puzzle-victory h3 {
          color: #ffe066;
          margin-top: 0;
          font-size: 2.1em;
          text-shadow: 0 2px 8px #000;
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
          .puzzle-tile {
            font-size: 16px;
          }
          .puzzle-container {
            padding-top: 16px;
            margin-top: 40px;
            max-width: 98vw;
            border-radius: 10px;
          }
          .puzzle-grid {
            max-width: 98vw;
            min-width: 120px;
            gap: 4px;
          }
        }
        
        @media (max-width: 400px) {
          .puzzle-tile {
            font-size: 12px;
          }
          .puzzle-controls {
            flex-direction: column;
            gap: 8px;
          }
          .puzzle-difficulty {
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default SlidingPuzzle;