
import * as React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Map as MapIcon, Loader2, Globe, AlertCircle } from 'lucide-react';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import { TRAVELLED_COUNTRIES } from '../constants';

const TravelMap: React.FC = () => {
  const [landFeatures, setLandFeatures] = useState<any>(null);
  const [geographies, setGeographies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const width = 800;
  const height = 450;

  // Globe rotation state [lambda, phi]
  const [rotation, setRotation] = useState<[number, number]>([0, -10]);
  // Zoom state
  const [scale, setScale] = useState(height / 2.2);
  
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const requestRef = useRef<number>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchDistanceRef = useRef<number | null>(null);
  const baseScaleRef = useRef<number>(scale);

  const CURRENT_LOCATION_ID = 'HK';

  // Mapping from ISO 2-letter codes to ISO 3166-1 numeric codes used in world-atlas
  const COUNTRY_ID_MAP: Record<string, string> = {
    'CN': '156', // China
    'HK': '344', // Hong Kong
    'JP': '392', // Japan
    'TH': '764', // Thailand
    'SG': '702', // Singapore
    'KR': '410', // South Korea
    'US': '840', // USA
    'MY': '458', // Malaysia
    'GB': '826', // United Kingdom
    'AU': '036', // Australia
    'TW': '158', // Taiwan
  };

  const visitedIds = useMemo(() => {
    return new Set(TRAVELLED_COUNTRIES.map(c => COUNTRY_ID_MAP[c.id]));
  }, []);

  // Fetch World Atlas Topology
  useEffect(() => {
    // Switching to unpkg which is often more reliable for this dataset
    fetch('https://unpkg.com/world-atlas@2.0.2/countries-110m.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load map data');
        return response.json();
      })
      .then(topology => {
        // @ts-ignore
        const land = topojson.feature(topology, topology.objects.land);
        // @ts-ignore
        const countries = topojson.feature(topology, topology.objects.countries).features;
        
        setLandFeatures(land);
        setGeographies(countries);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Map loading error:", err);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (isDragging) return;
    
    const animate = () => {
      setRotation(prev => [prev[0] + 0.2, prev[1]]);
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDragging]);

  // Handle native wheel event to prevent scroll
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const sensitivity = 0.5;
      setScale(prevScale => {
        const newScale = prevScale - e.deltaY * sensitivity;
        const minScale = 100;
        const maxScale = 1000;
        return Math.max(minScale, Math.min(maxScale, newScale));
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // 3D Orthographic Projection configuration
  const projection = useMemo(() => {
    return d3.geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate([rotation[0], rotation[1]])
      .clipAngle(90);
  }, [rotation, scale, width, height]);

  const pathGenerator = useMemo(() => d3.geoPath().projection(projection), [projection]);
  const graticuleGenerator = useMemo(() => d3.geoGraticule(), []);

  // Drag Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !lastMousePos.current) return;
    
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    // Sensitivity factor
    const sensitivity = 0.5;
    
    setRotation(prev => [prev[0] + dx * sensitivity, Math.max(-85, Math.min(85, prev[1] - dy * sensitivity))]);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastMousePos.current = null;
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    lastMousePos.current = null;
  };

  const updatePointerPosition = (e: React.PointerEvent) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };

  const pointerDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  };

  const getActivePoints = (): Array<{ x: number; y: number }> => {
    return Array.from(activePointers.current.values());
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    mapContainerRef.current?.setPointerCapture?.(e.pointerId);
    updatePointerPosition(e);

    if (activePointers.current.size === 1) {
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else if (activePointers.current.size === 2) {
      const points = getActivePoints();
      pinchDistanceRef.current = pointerDistance(points[0], points[1]);
      baseScaleRef.current = scale;
      setIsDragging(false);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!mapContainerRef.current) return;
    updatePointerPosition(e);

    // Two-finger pinch to zoom
    if (activePointers.current.size === 2 && pinchDistanceRef.current) {
      const points = getActivePoints();
      const newDistance = pointerDistance(points[0], points[1]);
      const ratio = newDistance / pinchDistanceRef.current;
      const minScale = 100;
      const maxScale = 1000;
      setScale(Math.max(minScale, Math.min(maxScale, baseScaleRef.current * ratio)));
      return;
    }

    // Single finger drag to rotate
    if (activePointers.current.size === 1 && isDragging && lastMousePos.current) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const sensitivity = 0.5;
      setRotation(prev => [prev[0] + dx * sensitivity, Math.max(-85, Math.min(85, prev[1] - dy * sensitivity))]);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) {
      pinchDistanceRef.current = null;
    }
    if (activePointers.current.size === 0) {
      setIsDragging(false);
      lastMousePos.current = null;
    }
  };

  // Visibility check for pins (backface culling)
  const isVisible = (lng: number, lat: number) => {
     const center = projection.invert?.([width/2, height/2]);
     if (!center) return false;
     return d3.geoDistance([lng, lat], center) < 1.57; // ~Pi/2
  };

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-blue-50 dark:border-slate-700 overflow-hidden relative flex flex-col justify-between h-[280px] sm:h-[360px] select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
            <Globe size={14} />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">travel footprint</span>
        </div>
        {!isLoading && !hasError && <div className="text-[9px] font-bold text-gray-400 bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">DRAG & SCROLL</div>}
      </div>

      {/* Map Content */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 flex items-center justify-center top-4 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-blue-400">
            <Loader2 size={32} className="animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Loading Globe...</span>
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <AlertCircle size={32} className="opacity-50" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Map Data Unavailable</span>
          </div>
        ) : (
          <svg 
            width="100%" 
            height="100%" 
            viewBox={`0 0 ${width} ${height}`} 
            className="w-full h-full max-w-[340px]"
            style={{ overflow: 'visible' }}
          >
            {/* Ocean / Globe Background */}
            <circle cx={width/2} cy={height/2} r={projection.scale()} className="fill-blue-50 dark:fill-slate-900/40 transition-all duration-300 ease-out" />

            {/* Graticule Grid */}
            <path 
              d={pathGenerator(graticuleGenerator()) || ''} 
              className="stroke-blue-200/40 dark:stroke-slate-700/40 stroke-[0.5] fill-none"
            />

            {/* Countries */}
            <g>
              {geographies.map((geo) => {
                const isVisited = visitedIds.has(geo.id);
                return (
                  <path
                    key={geo.id}
                    d={pathGenerator(geo) || ''}
                    className={`
                      stroke-white/40 dark:stroke-slate-800/40 stroke-[0.5] transition-colors duration-300
                      ${isVisited 
                        ? 'fill-blue-500 dark:fill-blue-600' 
                        : 'fill-blue-200/60 dark:fill-slate-600'
                      }
                    `}
                  />
                );
              })}
            </g>

            {/* Globe Atmosphere / Outline */}
            <circle 
              cx={width/2} 
              cy={height/2} 
              r={projection.scale()} 
              className="fill-none stroke-blue-100 dark:stroke-slate-700 stroke-2 pointer-events-none transition-all duration-300 ease-out" 
            />
            
            {/* Glow effect */}
            <circle 
              cx={width/2} 
              cy={height/2} 
              r={projection.scale()} 
              className="fill-none stroke-blue-400/10 dark:stroke-blue-400/5 stroke-[10] transition-all duration-300 ease-out" 
            />

            {/* Pins */}
            {TRAVELLED_COUNTRIES.map((country) => {
              // Only render if on the visible side of the globe
              if (!isVisible(country.lng, country.lat)) return null;

              const projected = projection([country.lng, country.lat]);
              if (!projected) return null;
              
              const [x, y] = projected;
              const isCurrentLocation = country.id === CURRENT_LOCATION_ID;

              return (
                <g 
                  key={country.id} 
                  transform={`translate(${x}, ${y})`}
                  style={{ pointerEvents: 'none' }}
                >
                  {isCurrentLocation ? (
                    <>
                      {/* Shining/Pulsing Effect for Current Location */}
                      <circle 
                        r="16" 
                        className="fill-green-500/50 animate-ping" 
                      />
                      <circle 
                        r="6" 
                        className="fill-green-500 stroke-white dark:stroke-slate-900 stroke-2 shadow-sm" 
                      />
                    </>
                  ) : (
                    /* Regular Pins */
                    <circle 
                      r="3" 
                      className="fill-blue-500 stroke-white dark:stroke-slate-900 stroke-2 shadow-sm" 
                    />
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="flex items-end justify-between z-10 pointer-events-none">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 italic leading-tight max-w-[60%] font-medium">
          "The world is a book and those who do not travel read only one page."
        </p>
        
        <div className="flex items-baseline gap-1">
           <span className="text-3xl font-black text-blue-500 leading-none">
             {TRAVELLED_COUNTRIES.length}
           </span>
           <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Stops</span>
        </div>
      </div>
    </div>
  );
};

export default TravelMap;
    
