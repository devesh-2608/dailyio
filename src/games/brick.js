import React, { useEffect, useRef, useState } from 'react';
import "./brick.css";
import { FaHeart } from 'react-icons/fa';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 520;
const BRICK_ROW_COUNT = 5;
const BRICK_HEIGHT = 24;
const BRICK_PADDING = 12;
const BRICK_OFFSET_TOP = 40;
const BRICK_OFFSET_LEFT = 32;
const PADDLE_WIDTH = 120;
const PADDLE_HEIGHT = 14;
const PADDLE_COLOR = '#FFD93D';
const PADDLE_BORDER = '#FF6B6B';
const BALL_RADIUS = 12;
const BALL_COLOR = '#55D6D2';
const BALL_SPEED = 4;
const LIVES_INIT = 3;

// Move this function outside the component
function initBricks(BRICK_COLUMN_COUNT, BRICK_ROW_COUNT) {
  const colors = ['#7868E6', '#FF70B0', '#55D6D2', '#FFB961', '#80E6C7'];
  const newBricks = [];
  for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    newBricks[c] = [];
    for (let r = 0; r < BRICK_ROW_COUNT; r++) {
      newBricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r % colors.length] };
    }
  }
  return newBricks;
}

const BrickBreaker = () => {
  const canvasRef = useRef(null);
  // UI state
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES_INIT);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [waitingForServe, setWaitingForServe] = useState(true);

  // Mutable refs for animation
  const ballRef = useRef({ x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT-60, dx: BALL_SPEED, dy: -BALL_SPEED });
  const paddleXRef = useRef((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const bricksRef = useRef([]);
  const rightPressedRef = useRef(false);
  const leftPressedRef = useRef(false);

  // Calculate columns and brick width to fit canvas
  const BRICK_COLUMN_COUNT = Math.floor((CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT + BRICK_PADDING) / (70 + BRICK_PADDING));
  const BRICK_WIDTH = ((CANVAS_WIDTH - 2 * BRICK_OFFSET_LEFT + BRICK_PADDING) / BRICK_COLUMN_COUNT) - BRICK_PADDING;
  
  useEffect(() => {
    bricksRef.current = initBricks(BRICK_COLUMN_COUNT, BRICK_ROW_COUNT);
  }, [BRICK_COLUMN_COUNT]);

  // Keyboard controls
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressedRef.current = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressedRef.current = true;
    };
    const keyUpHandler = (e) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressedRef.current = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressedRef.current = false;
    };
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  // Mouse controls
  useEffect(() => {
    const mouseMoveHandler = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      if (relativeX > 0 && relativeX < CANVAS_WIDTH) {
        paddleXRef.current = Math.max(0, Math.min(relativeX - PADDLE_WIDTH / 2, CANVAS_WIDTH - PADDLE_WIDTH));
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    return () => document.removeEventListener('mousemove', mouseMoveHandler);
  }, []);

  // Main game loop
  useEffect(() => {
    if (!gameStarted || gameOver || gameWon || waitingForServe) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const drawBricks = () => {
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          if (bricksRef.current[c][r].status === 1) {
            const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
            const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
            bricksRef.current[c][r].x = brickX;
            bricksRef.current[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            ctx.fillStyle = bricksRef.current[c][r].color;
            ctx.shadowColor = '#222';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    };

    const drawPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleXRef.current, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = PADDLE_COLOR;
      ctx.strokeStyle = PADDLE_BORDER;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };

    const drawBall = () => {
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = BALL_COLOR;
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;
    };
    
    const drawScore = () => {
      ctx.font = '18px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(`Score: ${score}`, 24, 28);
    };
    const drawLives = () => {
      ctx.font = '18px Poppins, Arial, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(`Lives: ${lives}`, CANVAS_WIDTH - 110, 28);
    };
    
    const collisionDetection = () => {
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          const b = bricksRef.current[c][r];
          if (b.status === 1) {
            if (
              ballRef.current.x > b.x && ballRef.current.x < b.x + BRICK_WIDTH &&
              ballRef.current.y > b.y && ballRef.current.y < b.y + BRICK_HEIGHT
            ) {
              ballRef.current.dy = -ballRef.current.dy;
              bricksRef.current[c][r].status = 0;
              setScore(s => s + 1);
            }
          }
        }
      }
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBricks();
      drawPaddle();
      drawBall();
      drawScore();
      drawLives();
      collisionDetection();
      
      // Ball movement
      if (ballRef.current.x + ballRef.current.dx > CANVAS_WIDTH - BALL_RADIUS || ballRef.current.x + ballRef.current.dx < BALL_RADIUS) ballRef.current.dx = -ballRef.current.dx;
      if (ballRef.current.y + ballRef.current.dy < BALL_RADIUS) ballRef.current.dy = -ballRef.current.dy;
      else if (ballRef.current.y + ballRef.current.dy > CANVAS_HEIGHT - BALL_RADIUS - PADDLE_HEIGHT - 10) {
        if (ballRef.current.x > paddleXRef.current && ballRef.current.x < paddleXRef.current + PADDLE_WIDTH) {
          // Ball hits paddle
          let hitPos = (ballRef.current.x - paddleXRef.current) / PADDLE_WIDTH;
          let angle = (hitPos - 0.5) * Math.PI / 2 + (Math.random() - 0.5) * 0.05;
          let speed = Math.sqrt(ballRef.current.dx * ballRef.current.dx + ballRef.current.dy * ballRef.current.dy);
          ballRef.current.dx = speed * Math.sin(angle);
          ballRef.current.dy = -Math.abs(speed * Math.cos(angle));
        } else {
          // Missed paddle
          setLives(l => {
            if (l - 1 <= 0) {
            setGameOver(true);
            setGameStarted(false);
              setWaitingForServe(false);
              return 0;
          } else {
              setWaitingForServe(true);
              ballRef.current = { x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT-60, dx: BALL_SPEED, dy: -BALL_SPEED };
              paddleXRef.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
              return l - 1;
          }
          });
          return;
        }
      }

      // Paddle movement
      if (rightPressedRef.current && paddleXRef.current < CANVAS_WIDTH - PADDLE_WIDTH) paddleXRef.current += 10;
      if (leftPressedRef.current && paddleXRef.current > 0) paddleXRef.current -= 10;

      ballRef.current.x += ballRef.current.dx;
      ballRef.current.y += ballRef.current.dy;

      // Win check
      let allBricksGone = true;
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          if (bricksRef.current[c][r].status === 1) allBricksGone = false;
        }
      }
      if (allBricksGone) {
        setGameWon(true);
        setGameStarted(false);
        setWaitingForServe(false);
        return;
      }

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, gameOver, gameWon, waitingForServe, score, lives, BRICK_COLUMN_COUNT, BRICK_WIDTH]);

  // Serve on click
    const handleCanvasClick = () => {
    if (gameOver || gameWon) return;
    if (waitingForServe) {
      setWaitingForServe(false);
        setGameStarted(true);
      }
    };
    
  // Restart
  const handleRestart = () => {
    setScore(0);
    setLives(LIVES_INIT);
    setGameOver(false);
    setGameWon(false);
    setWaitingForServe(true);
    ballRef.current = { x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT-60, dx: BALL_SPEED, dy: -BALL_SPEED };
    paddleXRef.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    bricksRef.current = initBricks(BRICK_COLUMN_COUNT, BRICK_ROW_COUNT);
    };
  
  useEffect(() => {
    document.body.classList.add('brick-breaker-active');
    return () => {
      document.body.classList.remove('brick-breaker-active');
    };
  }, []);

  return (
    <div className="brick-breaker-page"> 
      <div className="brick-breaker-container">
        <h2 className="brick-breaker-title">Brick Breaker</h2>
        <div style={{display:'flex',justifyContent:'center',gap:24,marginBottom:16}}>
          <span className="badge"><span style={{marginRight:6,color:'#FF6B6B'}}><FaHeart /></span> {lives}</span>
          <span className="badge">Score: {score}</span>
        </div>
        <div className="brick-breaker-canvas-container" style={{position:'relative',width:'100%',maxWidth:CANVAS_WIDTH}}>
        <canvas 
          ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
          className="brick-breaker-canvas"
            style={{width:'100%',height:'auto',backgroundColor:'rgba(0,0,0,0.2)',borderRadius:8}}
          />
          {waitingForServe && !gameOver && !gameWon && (
            <div className="brick-breaker-overlay" onClick={handleCanvasClick} style={{cursor:'pointer'}}>
              <h3>Click to Serve!</h3>
              <p>Use your mouse or arrow keys to move the paddle.<br/>Don't let the ball fall below the paddle or you'll lose a life.</p>
            </div>
          )}
          {(gameOver || gameWon) && (
            <div className="brick-breaker-overlay">
              <h3>{gameWon ? 'Congratulations! You Won!' : 'Game Over!'}</h3>
              <p>Final Score: {score}</p>
              <button className="brick-breaker-restart-btn" onClick={handleRestart}>Restart</button>
            </div>
          )}
      </div>
    </div>
    </div>
  );
};

export default BrickBreaker;