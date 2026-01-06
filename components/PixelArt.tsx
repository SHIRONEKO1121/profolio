
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Eraser, Trash2, PaintBucket, Pencil, Download } from 'lucide-react';

const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', 
  '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'
];

const GRID_SIZE = 16;

const PixelArt: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#ffffff'))
  );
  const [activeColor, setActiveColor] = useState(COLORS[6]); // Default blue
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'bucket'>('pencil');
  const [isDrawing, setIsDrawing] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePixel = (r: number, c: number) => {
    if (tool === 'bucket') {
      floodFill(r, c);
      return;
    }
    
    const newGrid = [...grid];
    const colorToApply = tool === 'eraser' ? '#ffffff' : activeColor;
    if (newGrid[r][c] === colorToApply) return;
    
    newGrid[r][c] = colorToApply;
    setGrid(newGrid);
  };

  const floodFill = (r: number, c: number) => {
    const targetColor = grid[r][c];
    const replacementColor = activeColor;
    if (targetColor === replacementColor) return;

    const newGrid = grid.map(row => [...row]);
    const stack = [[r, c]];

    while (stack.length > 0) {
      const [currR, currC] = stack.pop()!;
      if (
        currR >= 0 && currR < GRID_SIZE &&
        currC >= 0 && currC < GRID_SIZE &&
        newGrid[currR][currC] === targetColor
      ) {
        newGrid[currR][currC] = replacementColor;
        stack.push([currR + 1, currC], [currR - 1, currC], [currR, currC + 1], [currR, currC - 1]);
      }
    }
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    if (window.confirm('Clear your masterpiece?')) {
      setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('#ffffff')));
    }
  };

  const handleMouseDown = (r: number, c: number) => {
    setIsDrawing(true);
    updatePixel(r, c);
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (isDrawing && tool !== 'bucket') {
      updatePixel(r, c);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-slate-700">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
        
        {/* Canvas Area */}
        <div 
          className="grid gap-px bg-gray-200 dark:bg-slate-700 p-px border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden touch-none"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: '100%',
            maxWidth: '320px',
            aspectRatio: '1/1'
          }}
          onMouseLeave={() => setIsDrawing(false)}
        >
          {grid.map((row, r) => 
            row.map((color, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                className="w-full h-full cursor-crosshair transition-colors duration-75"
                style={{ backgroundColor: color }}
              />
            ))
          )}
        </div>

        {/* Toolbar Area */}
        <div className="flex flex-col gap-6 w-full max-w-[200px]">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tools</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setTool('pencil')}
                className={`p-2 rounded-xl transition-all ${tool === 'pencil' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}
                title="Pencil"
              >
                <Pencil size={18} />
              </button>
              <button 
                onClick={() => setTool('bucket')}
                className={`p-2 rounded-xl transition-all ${tool === 'bucket' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}
                title="Fill Bucket"
              >
                <PaintBucket size={18} />
              </button>
              <button 
                onClick={() => setTool('eraser')}
                className={`p-2 rounded-xl transition-all ${tool === 'eraser' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}
                title="Eraser"
              >
                <Eraser size={18} />
              </button>
              <button 
                onClick={clearCanvas}
                className="p-2 rounded-xl bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Clear All"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => {
                    setActiveColor(color);
                    if (tool === 'eraser') setTool('pencil');
                  }}
                  className={`w-full aspect-square rounded-lg border-2 transition-all transform active:scale-90 ${activeColor === color && tool !== 'eraser' ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
             <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
               Draw a pixel kitten! <br/> Meow-velous art awaits.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelArt;
