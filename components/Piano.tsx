
import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Music } from 'lucide-react';

const NOTES = [
  { note: 'C4', freq: 261.63, isBlack: false },
  { note: 'C#4', freq: 277.18, isBlack: true },
  { note: 'D4', freq: 293.66, isBlack: false },
  { note: 'D#4', freq: 311.13, isBlack: true },
  { note: 'E4', freq: 329.63, isBlack: false },
  { note: 'F4', freq: 349.23, isBlack: false },
  { note: 'F#4', freq: 369.99, isBlack: true },
  { note: 'G4', freq: 392.00, isBlack: false },
  { note: 'G#4', freq: 415.30, isBlack: true },
  { note: 'A4', freq: 440.00, isBlack: false },
  { note: 'A#4', freq: 466.16, isBlack: true },
  { note: 'B4', freq: 493.88, isBlack: false },
  { note: 'C5', freq: 523.25, isBlack: false },
  { note: 'C#5', freq: 554.37, isBlack: true },
  { note: 'D5', freq: 587.33, isBlack: false },
  { note: 'D#5', freq: 622.25, isBlack: true },
  { note: 'E5', freq: 659.25, isBlack: false },
  { note: 'F5', freq: 698.46, isBlack: false },
  { note: 'F#5', freq: 739.99, isBlack: true },
  { note: 'G5', freq: 783.99, isBlack: false },
  { note: 'G#5', freq: 830.61, isBlack: true },
  { note: 'A5', freq: 880.00, isBlack: false },
  { note: 'A#5', freq: 932.33, isBlack: true },
  { note: 'B5', freq: 987.77, isBlack: false },
];

interface PianoProps {
  transparent?: boolean;
}

const Piano: React.FC<PianoProps> = ({ transparent = false }) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNote = useCallback((freq: number, note: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.2);
    
    setActiveNote(note);
    setTimeout(() => setActiveNote(prev => prev === note ? null : prev), 150);
  }, []);

  const whiteNotes = NOTES.filter(n => !n.isBlack);
  const whiteKeyWidth = 100 / whiteNotes.length;

  const containerClasses = transparent
    ? "w-full rounded-2xl p-3 border border-gray-100 dark:border-slate-700/50 flex items-center gap-4 bg-white/20 dark:bg-slate-700/20"
    : "w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-4 shadow-sm border border-blue-100 dark:border-slate-700 flex items-center gap-4";

  return (
    <div className={containerClasses}>
      <div className="hidden sm:flex flex-col items-center justify-center text-blue-400 px-3 border-r border-blue-50 dark:border-slate-700">
        <Music size={22} />
        <span className="text-[10px] font-bold uppercase tracking-tighter mt-1">Piano</span>
      </div>

      <div className="relative flex h-28 sm:h-40 flex-1 select-none touch-none">
        {/* White Keys */}
        {whiteNotes.map((n) => (
          <button
            key={n.note}
            onMouseDown={() => playNote(n.freq, n.note)}
            onTouchStart={(e) => { e.preventDefault(); playNote(n.freq, n.note); }}
            className={`
              relative flex-1 border border-gray-100 dark:border-slate-700 rounded-b-lg transition-all duration-75
              ${activeNote === n.note ? 'bg-blue-100 dark:bg-blue-900 translate-y-0.5' : 'bg-white dark:bg-slate-200 shadow-[inset_0_-4px_0_rgba(0,0,0,0.05)]'}
              first:rounded-tl-lg last:rounded-tr-lg
            `}
            title={n.note}
          />
        ))}

        {/* Black Keys Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {NOTES.map((n, i) => {
            if (!n.isBlack) return null;
            
            // Calculate position: find index of white key immediately before this black key
            const whiteKeyIndexBefore = NOTES.slice(0, i).filter(x => !x.isBlack).length;
            const leftOffset = (whiteKeyIndexBefore * whiteKeyWidth) - (whiteKeyWidth * 0.35);

            return (
              <button
                key={n.note}
                onMouseDown={(e) => { e.stopPropagation(); playNote(n.freq, n.note); }}
                onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); playNote(n.freq, n.note); }}
                className={`
                  absolute h-[60%] rounded-b-md transition-all duration-75 pointer-events-auto
                  ${activeNote === n.note ? 'bg-blue-600 scale-95' : 'bg-slate-800 dark:bg-slate-900 shadow-md'}
                `}
                style={{ 
                  left: `${leftOffset}%`, 
                  width: `${whiteKeyWidth * 0.7}%`,
                  zIndex: 10 
                }}
                title={n.note}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Piano;
