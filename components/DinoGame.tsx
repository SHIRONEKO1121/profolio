
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { SITE_ASSETS } from '../constants';

interface DinoGameProps {
  transparent?: boolean;
}

const DinoGame: React.FC<DinoGameProps> = ({ transparent = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const kittenImgRef = useRef<HTMLImageElement | null>(null);

  // Game state refs for the loop to avoid stale closures
  const gameState = useRef({
    dinoY: 0,
    dinoVelocity: 0,
    obstacles: [] as { x: number; width: number; height: number; color: string }[],
    groundX: 0,
    speed: isMobile ? 15 : 25, // Slower initial speed on mobile
    lastObstacleTime: 0,
    currentScore: 0,
  });

  const GRAVITY = 1.1;
  const JUMP_STRENGTH = -10;
  const GROUND_Y = 160; 
  const DINO_WIDTH = 44;
  const DINO_HEIGHT = 44;

  const OBSTACLE_COLORS = ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa'];

  // Initialize high score and mobile detection
  useEffect(() => {
    const savedHighScore = localStorage.getItem('shironeko_dino_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const img = new Image();
    // Use jumpcat image for the game character
    img.src = '/icon/jumpcat.png'; 
    
    // Add error handler in case external image fails
    img.onerror = () => {
        // Fallback transparent 1x1 pixel or a simple generated SVG data URI could go here
        // For now, we'll handle the missing image in the draw function by drawing a rect
        kittenImgRef.current = null;
    }
    
    img.onload = () => {
      kittenImgRef.current = img;
    };
  }, []);

  const resetGame = () => {
    gameState.current = {
      dinoY: 0,
      dinoVelocity: 0,
      obstacles: [],
      groundX: 0,
      speed: isMobile ? 15 : 20, // Slower initial speed on mobile
      lastObstacleTime: 0,
      currentScore: 0,
    };
    setScoreDisplay(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const jump = () => {
    if (gameState.current.dinoY === 0) {
      gameState.current.dinoVelocity = JUMP_STRENGTH;
    }
  };

  const endGame = () => {
    const finalScore = Math.floor(gameState.current.currentScore);
    setIsGameOver(true);
    setIsPlaying(false);
    
    setHighScore(prev => {
      const newHigh = Math.max(prev, finalScore);
      localStorage.setItem('shironeko_dino_highscore', newHigh.toString());
      return newHigh;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent game from hijacking keys when typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!isPlaying && !isGameOver) {
          setIsPlaying(true);
        } else if (isGameOver) {
          resetGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  const getCanvasWidth = () => canvasRef.current?.width ?? (isMobile ? 360 : 800);

  const update = (time: number) => {
    if (!isPlaying || isGameOver) return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Update Dino
    gameState.current.dinoVelocity += GRAVITY;
    gameState.current.dinoY += gameState.current.dinoVelocity;

    if (gameState.current.dinoY > 0) {
      gameState.current.dinoY = 0;
      gameState.current.dinoVelocity = 0;
    }

    // Update Ground
    gameState.current.groundX -= gameState.current.speed;
    if (gameState.current.groundX <= -100) gameState.current.groundX = 0;

    // Spawn Obstacles (Wool balls)
    // Reduce randomness slightly to make it more consistent at high speeds
    if (time - gameState.current.lastObstacleTime > (isMobile ? 2000 : 1200) + Math.random() * 800) {
      const size = 25 + Math.random() * 15;
      gameState.current.obstacles.push({
        x: getCanvasWidth() + 20,
        width: size,
        height: size,
        color: OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)]
      });
      gameState.current.lastObstacleTime = time;
    }

    // Update Obstacles & Collision
    let collision = false;
    gameState.current.obstacles.forEach((obs) => {
      obs.x -= gameState.current.speed;
      
      const dinoLeft = 50;
      const dinoRight = 50 + DINO_WIDTH;
      const dinoBottom = GROUND_Y + gameState.current.dinoY;
      const obsLeft = obs.x;
      const obsRight = obs.x + obs.width;
      const obsTop = GROUND_Y - obs.height;

      // Hitbox padding for fairness
      if (
        dinoRight > obsLeft + 10 &&
        dinoLeft < obsRight - 10 &&
        dinoBottom > obsTop + 10
      ) {
        collision = true;
      }
    });

    if (collision) {
      endGame();
      return;
    }

    gameState.current.obstacles = gameState.current.obstacles.filter(obs => obs.x > -100);
    gameState.current.speed += 0.002; // Increased acceleration from 0.001 to 0.002
    gameState.current.currentScore += 0.25; // Score increases faster too
    
    // Sync to display state for rendering
    setScoreDisplay(Math.floor(gameState.current.currentScore));

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Dino
    const dinoX = 50;
    const dinoYPos = GROUND_Y + gameState.current.dinoY - DINO_HEIGHT;

    if (kittenImgRef.current) {
      ctx.drawImage(kittenImgRef.current, dinoX, dinoYPos, DINO_WIDTH, DINO_HEIGHT);
    } else {
      // Fallback rect if image failed to load or is loading
      ctx.fillStyle = '#64748b';
      // Draw a simple cat shape instead of a plain rect
      ctx.beginPath();
      ctx.rect(dinoX, dinoYPos + 10, DINO_WIDTH, DINO_HEIGHT - 10); // Body
      ctx.moveTo(dinoX, dinoYPos + 10);
      ctx.lineTo(dinoX + 10, dinoYPos); // Left Ear
      ctx.lineTo(dinoX + 20, dinoYPos + 10);
      ctx.lineTo(dinoX + 30, dinoYPos); // Right Ear
      ctx.lineTo(dinoX + 40, dinoYPos + 10);
      ctx.fill();
    }

    // Draw Obstacles
    gameState.current.obstacles.forEach(obs => {
      const centerX = obs.x + obs.width / 2;
      const centerY = GROUND_Y - obs.height / 2;
      const radius = obs.width / 2;

      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Yarn patterns
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, Math.PI, Math.PI * 2);
      ctx.stroke();
    });
  };

  useEffect(() => {
    if (isPlaying && !isGameOver) {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, isGameOver]);

  const containerClasses = transparent 
    ? "w-full rounded-2xl overflow-hidden relative cursor-pointer select-none border border-gray-100 dark:border-slate-700/50"
    : "w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-3 sm:p-4 shadow-sm overflow-hidden relative cursor-pointer select-none";

  const canvasWidth = isMobile ? 360 : 800;
  const canvasHeight = isMobile ? 180 : 200;

  return (
    <div 
      className={containerClasses}
      style={{ touchAction: 'manipulation' }}
      onClick={() => {
        if (!isPlaying && !isGameOver) setIsPlaying(true);
        else if (isGameOver) resetGame();
        else jump();
      }}
    >
      <div className="absolute top-4 right-4 sm:right-6 flex flex-col items-end font-mono text-gray-600 dark:text-gray-400 z-20">
        <div className="text-[10px] sm:text-xs tracking-wider opacity-70 font-bold">HI {highScore.toString().padStart(5, '0')}</div>
        <div className="text-lg sm:text-xl font-black text-blue-500 dark:text-blue-400">{scoreDisplay.toString().padStart(5, '0')}</div>
      </div>

      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 dark:bg-black/20 z-10 p-3 sm:p-4">
          <div className="text-center max-w-[90vw]">
            <p className="text-gray-800 dark:text-gray-200 font-bold text-base sm:text-xl mb-1 drop-shadow-sm uppercase">MEOW! {isMobile ? 'TAP' : 'SPACE'} TO START</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-snug">Help the kitten jump over the yarn balls!</p>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40 z-30 p-3 sm:p-4">
          <div className="text-center bg-white dark:bg-slate-900 p-3 sm:p-5 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 animate-in zoom-in duration-300 w-[90%] max-w-[320px]">
            <p className="text-red-500 font-black text-lg sm:text-2xl mb-1 italic tracking-tighter">O O P S !</p>
            <div className="mb-3 sm:mb-4">
              <p className="text-gray-600 dark:text-gray-300 text-[10px] sm:text-xs font-bold">Kitten got tangled!</p>
              <p className="text-blue-500 font-bold text-xs sm:text-base">Score: {scoreDisplay}</p>
            </div>
            <button 
              className="px-5 sm:px-6 py-2 bg-blue-500 text-white rounded-xl font-bold text-xs hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 active:scale-95 w-full sm:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
              }}
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        width={canvasWidth} 
        height={canvasHeight}
        className="w-full h-auto block"
      />
      
      <div className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest font-bold">
        {isMobile ? 'Tap screen to Jump' : 'Space / Up to Jump'}
      </div>
    </div>
  );
};

export default DinoGame;
    
