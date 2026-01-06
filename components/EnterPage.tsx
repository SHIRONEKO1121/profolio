
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { SITE_ASSETS } from '../constants';

interface EnterPageProps {
  onEnter: () => void;
}

const EnterPage: React.FC<EnterPageProps> = ({ onEnter }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Check for global config override first
    const globalConfig = (window as any).shironekoConfig?.entranceBackgrounds;
    const backgrounds = (globalConfig && globalConfig.length > 0) 
      ? globalConfig 
      : SITE_ASSETS.entranceBackgrounds;
      
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBgImage(randomBg);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (buttonRef.current && !isMobile) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        // Magnetic effect radius
        if (distance < 250) {
          const power = (250 - distance) / 250;
          setMagneticPos({
            x: distX * 0.12 * power,
            y: distY * 0.12 * power
          });
        } else {
          setMagneticPos({ x: 0, y: 0 });
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  /**
   * Renders a ring of icons that "bloom" outwards.
   * By default opacity is 0 or very low, and they scale/move on hover.
   */
  const renderRing = (count: number, innerRadius: number, outerRadius: number, opacity: number, rotateSpeed: string) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * 360;
      const currentRadius = isHovering ? (isMobile ? outerRadius * 0.7 : outerRadius) : (isMobile ? innerRadius * 0.7 : innerRadius);
      
      return (
        <div
          key={i}
          className="absolute transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            // The effect is shown after the mouse is hanged on it
            opacity: isHovering ? opacity : 0,
            transform: `
              translate(-50%, -50%) 
              rotate(${angle}deg) 
              translateY(${-currentRadius}px)
              rotate(45deg)
              scale(${isHovering ? 1 : 0.4})
            `,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="drop-shadow-md">
            <path d="M21 3L3 10.53V11.51L9.81 14.19L12.49 21H13.47L21 3Z" />
          </svg>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 select-none">
      
      {/* Background Image Layer - REMOVED */}

      {/* Overlay to ensure text readability and blend with original aesthetic */}
      <div className="absolute inset-0 bg-[#b5b1cc]/40 backdrop-blur-[8px]">
        {/* Soft Multi-color Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#b5b1cc]/80 via-[#d8a0b5]/80 to-[#88a6d4]/80 opacity-90 transition-opacity duration-1000 mix-blend-overlay" />
        
        {/* Dynamic Blur Blobs */}
        <div 
          className="absolute w-[160%] h-[160%] -left-[30%] -top-[30%] blur-[130px] opacity-40 transition-transform duration-[15s] ease-in-out mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #f9a8d4 0%, transparent 70%)',
            transform: `translate(${mousePos.x * 0.03}px, ${mousePos.y * 0.03}px)`
          }}
        />
        <div 
          className="absolute w-[140%] h-[140%] -right-[20%] -bottom-[20%] blur-[110px] opacity-35 mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, #60a5fa 0%, transparent 65%)',
            transform: `translate(${-mousePos.x * 0.02}px, ${-mousePos.y * 0.02}px)`
          }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center z-10">
        
        {/* Radial Icons (The "Effect") */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer Ring */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
             <div className="absolute inset-0 animate-slow-spin" style={{ animationDuration: '60s' }}>
                {renderRing(24, 180, 240, 0.25, '60s')}
             </div>
          </div>
          
          {/* Middle Ring */}
          <div className={`absolute inset-0 transition-opacity duration-1000 delay-75 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 animate-slow-spin" style={{ animationDirection: 'reverse', animationDuration: '80s' }}>
               {renderRing(16, 120, 170, 0.4, '80s')}
            </div>
          </div>

          {/* Inner Ring */}
          <div className={`absolute inset-0 transition-opacity duration-1000 delay-150 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 animate-slow-spin" style={{ animationDuration: '50s' }}>
               {renderRing(10, 80, 110, 0.6, '50s')}
            </div>
          </div>
        </div>

        {/* Center Button */}
        <button
          ref={buttonRef}
          onClick={onEnter}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setMagneticPos({ x: 0, y: 0 });
          }}
          className="relative px-10 py-4 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 text-white font-medium text-base sm:text-lg tracking-tight transition-all duration-700 hover:bg-white/25 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] active:scale-95 group shadow-lg"
          style={{
            transform: `translate(${magneticPos.x}px, ${magneticPos.y}px)`,
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Dreaming
          </span>
          
          {/* Subtle Glow blooming from behind the button */}
          <div className={`absolute inset-0 rounded-full bg-white/20 blur-2xl transition-opacity duration-1000 ${isHovering ? 'opacity-100' : 'opacity-0'}`} />
        </button>
      </div>

      {/* Footer Signature */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-bold tracking-[0.5em] uppercase drop-shadow-sm">
        SHIRONEKO • 2026
      </div>
    </div>
  );
};

export default EnterPage;
    
