import React, { useState, useEffect, useCallback } from 'react';

const Game2048 = () => {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [lastMove, setLastMove] = useState(null); // for animation
  
  const tileColors = {
    2: { background: '#EEE4DA', text: '#776E65' },
    4: { background: '#EDE0C8', text: '#776E65' },
    8: { background: '#F2B179', text: '#FFF' },
    16: { background: '#F59563', text: '#FFF' },
    32: { background: '#F67C5F', text: '#FFF' },
    64: { background: '#F65E3B', text: '#FFF' },
    128: { background: '#EDCF72', text: '#FFF' },
    256: { background: '#EDCC61', text: '#FFF' },
    512: { background: '#EDC850', text: '#FFF' },
    1024: { background: '#EDC53F', text: '#FFF' },
    2048: { background: '#EDC22E', text: '#FFF' },
  };

  
  const initializeBoard = () => {
    const newBoard = Array(4).fill().map(() => Array(4).fill(0));
    return addRandomTile(addRandomTile(newBoard));
  };

  const addRandomTile = useCallback((board) => {
    const clonedBoard = JSON.parse(JSON.stringify(board));
    const emptyCells = [];
    

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (clonedBoard[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }
    
    if (emptyCells.length === 0) return clonedBoard;
    

    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    

    clonedBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    
    return clonedBoard;
  }, []);


  const startNewGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setGameStarted(true);
  };

 
const continueGame = () => {
    setWon(false);
  };


  const checkGameOver = (board) => {
 
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    
 
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === board[i][j + 1]) return false;
      }
   }
    
 
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === board[i + 1][j]) return false;
      }
    }
    
    return true;
  };

 
  const moveLeft = useCallback((board) => {
    let clonedBoard = JSON.parse(JSON.stringify(board));
    let newScore = score;
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let row = clonedBoard[i].filter(val => val !== 0);
      let newRow = [];
      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const merged = row[j] * 2;
          newRow.push(merged);
          newScore += merged;
          if (merged === 2048) setWon(true);
          j++;
          moved = true;
        } else {
          newRow.push(row[j]);
        }
      }
      while (newRow.length < 4) {
        newRow.push(0);
      }
      if (JSON.stringify(clonedBoard[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      clonedBoard[i] = newRow;
    }
    if (moved) {
      clonedBoard = addRandomTile(clonedBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048BestScore', newScore);
      }
    }
    return { newBoard: clonedBoard, moved };
  }, [score, bestScore, addRandomTile, setScore, setBestScore, setWon]);

  const moveRight = useCallback((board) => {
    let clonedBoard = JSON.parse(JSON.stringify(board));
    let newScore = score;
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let row = clonedBoard[i].filter(val => val !== 0);
      let newRow = [];
      for (let j = row.length - 1; j >= 0; j--) {
        if (j > 0 && row[j] === row[j - 1]) {
          const merged = row[j] * 2;
          newRow.unshift(merged);
          newScore += merged;
          if (merged === 2048) setWon(true);
          j--;
          moved = true;
        } else {
          newRow.unshift(row[j]);
        }
      }
      while (newRow.length < 4) {
        newRow.unshift(0);
      }
      if (JSON.stringify(clonedBoard[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      clonedBoard[i] = newRow;
    }
    if (moved) {
      clonedBoard = addRandomTile(clonedBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048BestScore', newScore);
      }
    }
    return { newBoard: clonedBoard, moved };
  }, [score, bestScore, addRandomTile, setScore, setBestScore, setWon]);

  const moveUp = useCallback((board) => {
    let clonedBoard = JSON.parse(JSON.stringify(board));
    let newScore = score;
    let moved = false;
    for (let j = 0; j < 4; j++) {
      let column = [];
      for (let i = 0; i < 4; i++) {
        if (clonedBoard[i][j] !== 0) {
          column.push(clonedBoard[i][j]);
        }
      }
      let newColumn = [];
      for (let i = 0; i < column.length; i++) {
        if (i < column.length - 1 && column[i] === column[i + 1]) {
          const merged = column[i] * 2;
          newColumn.push(merged);
          newScore += merged;
          if (merged === 2048) setWon(true);
          i++;
          moved = true;
        } else {
          newColumn.push(column[i]);
        }
      }
      while (newColumn.length < 4) {
        newColumn.push(0);
      }
      let newColumnValues = [...newColumn];
      for (let i = 0; i < 4; i++) {
        if (clonedBoard[i][j] !== newColumnValues[i]) {
          moved = true;
        }
        clonedBoard[i][j] = newColumnValues[i];
      }
    }
    if (moved) {
      clonedBoard = addRandomTile(clonedBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048BestScore', newScore);
      }
    }
    return { newBoard: clonedBoard, moved };
  }, [score, bestScore, addRandomTile, setScore, setBestScore, setWon]);

  const moveDown = useCallback((board) => {
    let clonedBoard = JSON.parse(JSON.stringify(board));
    let newScore = score;
    let moved = false;
    for (let j = 0; j < 4; j++) {
      let column = [];
      for (let i = 0; i < 4; i++) {
        if (clonedBoard[i][j] !== 0) {
          column.push(clonedBoard[i][j]);
        }
      }
      let newColumn = [];
      for (let i = column.length - 1; i >= 0; i--) {
        if (i > 0 && column[i] === column[i - 1]) {
          const merged = column[i] * 2;
          newColumn.unshift(merged);
          newScore += merged;
          if (merged === 2048) setWon(true);
          i--;
          moved = true;
        } else {
          newColumn.unshift(column[i]);
        }
      }
      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }
      let newColumnValues = [...newColumn];
      newColumnValues.reverse();
      for (let i = 0; i < 4; i++) {
        if (clonedBoard[i][j] !== newColumnValues[i]) {
          moved = true;
        }
        clonedBoard[i][j] = newColumnValues[i];
      }
    }
    if (moved) {
      clonedBoard = addRandomTile(clonedBoard);
      setScore(newScore);
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048BestScore', newScore);
      }
    }
    return { newBoard: clonedBoard, moved };
  }, [score, bestScore, addRandomTile, setScore, setBestScore, setWon]);

 
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver || (won && e.key !== 'c')) return;
      let result;
      switch (e.key) {
        case 'ArrowLeft':
          result = moveLeft(board);
          setLastMove('left');
          break;
        case 'ArrowRight':
          result = moveRight(board);
          setLastMove('right');
          break;
        case 'ArrowUp':
          result = moveUp(board);
          setLastMove('up');
          break;
        case 'ArrowDown':
          result = moveDown(board);
          setLastMove('down');
          break;
        default:
          return;
      }
      if (result && result.moved) {
        setBoard(result.newBoard);
        if (checkGameOver(result.newBoard)) {
          setGameOver(true);
        }
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, won, board, moveLeft, moveRight, moveUp, moveDown]);

  useEffect(() => {
    const storedBestScore = localStorage.getItem('2048BestScore');
    if (storedBestScore) {
      setBestScore(parseInt(storedBestScore));
    }
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchEnd = () => {
    if (!gameStarted || gameOver) return;
    
    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > 30) { 
        let result;
        if (deltaX > 0) {
          result = moveRight(board);
        } else {
          result = moveLeft(board);
        }
        if (result.moved) {
          setBoard(result.newBoard);
          if (checkGameOver(result.newBoard)) {
            setGameOver(true);
          }
        }
      }
    } else {
      
      if (Math.abs(deltaY) > 30) { 
        let result;
        if (deltaY > 0) {
          result = moveDown(board);
        } else {
          result = moveUp(board);
        }
        if (result.moved) {
          setBoard(result.newBoard);
          if (checkGameOver(result.newBoard)) {
            setGameOver(true);
          }
        }
      }
    }
  };

  const gradientKeyframes = `
    body {
      margin: 0;
      padding: 65px;
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

  const styles = {
    gameContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 10px 20px 10px',
      maxWidth: '340px',
      minWidth: '220px',
      width: '100%',
      margin: '20px auto 0 auto',
      boxSizing: 'border-box',
      fontFamily: 'Poppins, Inter, Arial, sans-serif',
      borderRadius: '15px',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.13)',
      color: 'white',
      background: 'rgba(82, 80, 216, 0.81)',
      maxHeight: 'calc(100vh - 80px)',
      overflowY: 'auto',
    },
    header: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '16px',
      textAlign: 'center',
      fontFamily: 'inherit',
      letterSpacing: '2px',
      textShadow: '0 2px 8px rgba(0,0,0,0.13)'
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '320px',
      marginBottom: '14px',
      gap: '8px',
    },
    statBox: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '7px 12px',
      borderRadius: '10px',
      width: '45%',
      textAlign: 'center',
      fontFamily: 'inherit',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    statTitle: {
      fontSize: '0.9rem',
      marginBottom: '3px',
      fontWeight: 600,
      letterSpacing: '1px',
    },
    statValue: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      fontFamily: 'inherit',
      textShadow: '0 1px 4px rgba(0,0,0,0.10)'
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '6px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '8px',
      borderRadius: '10px',
      width: '100%',
      maxWidth: '320px',
      minWidth: '180px',
      position: 'relative',
      marginBottom: '14px',
      boxShadow: '0 4px 18px rgba(0,0,0,0.10)'
    },
    tile: {
      width: '100%',
      paddingTop: '100%',
      position: 'relative',
      borderRadius: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    },
    tileContent: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
      transition: 'background-color 0.15s, transform 0.15s, color 0.15s',
      animation: lastMove ? 'tilePop 0.18s' : 'none',
    },
    button: {
      backgroundColor: '#ff9f67',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      borderRadius: '30px',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.1s, background-color 0.3s',
      margin: '10px 0',
      outline: 'none',
      fontFamily: 'inherit',
    },
    buttonHover: {
      backgroundColor: '#e88b55',
      transform: 'scale(1.05)'
    },
    instructions: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      padding: '20px',
      borderRadius: '10px',
      marginBottom: '20px',
      textAlign: 'center',
      fontSize: '1.1rem',
      fontFamily: 'inherit',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    gameMessage: {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      zIndex: '10',
      padding: '20px',
      fontFamily: 'inherit',
    },
    messageText: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'inherit',
      textShadow: '0 2px 8px #000',
    },
    controlsInfo: {
      textAlign: 'center',
      marginTop: '15px',
      fontSize: '0.9rem',
      color: 'rgba(255, 255, 255, 0.8)',
      fontFamily: 'inherit',
    }
  };

  const getFontSize = (value) => {
    if (value >= 1000) return '1.2rem';
    if (value >= 100) return '1.6rem';
    return '2rem';
  };

  // --- TILE POP ANIMATION KEYFRAMES ---
  const tilePopKeyframes = `
    @keyframes tilePop {
      0% { transform: scale(1); }
      50% { transform: scale(1.13); }
      100% { transform: scale(1); }
    }
  `;

  return (
    <>
      <style>{gradientKeyframes}</style>
      <style>{tilePopKeyframes}</style>
      
      <div style={styles.gameContainer}>
        <h1 style={styles.header}>2048</h1>
        
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statTitle}>SCORE</div>
            <div style={styles.statValue}>{score}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statTitle}>BEST</div>
            <div style={styles.statValue}>{bestScore}</div>
          </div>
        </div>
        
        {!gameStarted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={styles.instructions}>
              Join the tiles with the same number to reach 2048! Use arrow keys or swipe to move tiles.
            </div>
            <button
              style={{ ...styles.button, display: 'block', margin: '0 auto' }}
              onClick={startNewGame}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                e.currentTarget.style.transform = styles.buttonHover.transform;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Start Game
            </button>
          </div>
        ) : (
          <div
            style={styles.board}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {board.map((row, i) => (
              row.map((cell, j) => (
                <div key={`${i}-${j}`} style={styles.tile}>
                  {cell !== 0 && (
                    <div 
                      style={{
                        ...styles.tileContent,
                        backgroundColor: tileColors[cell]?.background || '#3C3A33',
                        color: tileColors[cell]?.text || '#FFF',
                        fontSize: getFontSize(cell)
                      }}
                    >
                      {cell}
                    </div>
                  )}
                </div>
              ))
            ))}
            
            {won && !gameOver && (
              <div style={styles.gameMessage}>
                <div style={styles.messageText}>You Win!</div>
                <button 
                  style={styles.button} 
                  onClick={continueGame}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                    e.currentTarget.style.transform = styles.buttonHover.transform;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Continue Playing
                </button>
              </div>
            )}
            
            {gameOver && (
              <div style={styles.gameMessage}>
                <div style={styles.messageText}>Game Over!</div>
                <button 
                  style={styles.button} 
                  onClick={startNewGame}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
                    e.currentTarget.style.transform = styles.buttonHover.transform;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
        
        {gameStarted && (
          <div style={styles.controlsInfo}>
            Use arrow keys to move tiles or swipe on touch devices
          </div>
        )}
        
        {gameStarted && (
          <button 
            style={styles.button} 
            onClick={startNewGame}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
              e.currentTarget.style.transform = styles.buttonHover.transform;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            New Game
          </button>
        )}
      </div>
    </>
  );
};

export default Game2048;