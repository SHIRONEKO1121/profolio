
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Volume1 } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

const TRACKS: Track[] = [
  {
    title: "花人局",
    artist: "Yorushika",
    cover: "https://p2.music.126.net/033ZocR9XnX1MdcXCWW_iQ==/109951165180340452.jpg?param=130y130",
    audioUrl: "/Music/flower-and-badger-game.mp3"
  },
  {
    title: "春泥棒",
    artist: "Yorushika",
    cover: "https://p2.bahamut.com.tw/HOME/creationCover/82/0006016482.JPG?w=180",
    audioUrl: "/Music/spring_thief.mp3"
  },
  {
    title: "八月、某、月明かり",
    artist: "Yorushika",
    cover: "https://p2.music.126.net/AVhYLte6khAcd3wOO65avw==/109951170245162530.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0",
    audioUrl: "/Music/moonlight.mp3"
  },
  {
    title: "夏、バス停、君を待つ",
    artist: "Yorushika",
    cover: "https://blog-imgs-119.fc2.com/a/l/i/alicepika/yorushikamakeinu.jpg",
    audioUrl: "/Music/bustop.mp3"
  }
];

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.35);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const track = TRACKS[currentTrackIdx];

  // Initialize Audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(track.audioUrl);
    }

    const audio = audioRef.current;
    audio.volume = volume;
    audio.muted = isMuted;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIdx]);

  // Handle Play/Pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Playback blocked:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIdx]);

  // Sync Volume/Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const nextTrack = () => {
    const nextIdx = (currentTrackIdx + 1) % TRACKS.length;
    setCurrentTrackIdx(nextIdx);
    if (audioRef.current) {
      audioRef.current.src = TRACKS[nextIdx].audioUrl;
    }
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIdx(prevIdx);
    if (audioRef.current) {
      audioRef.current.src = TRACKS[prevIdx].audioUrl;
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current && duration) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percentage = x / width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-400">
            <Music size={14} />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500">Now Playing</span>
        </div>
        {/* Timer display removed */}
      </div>

      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 transition-all duration-500 border-2 border-white/50 ${isPlaying ? 'rotate-6 scale-110 shadow-blue-200 dark:shadow-blue-900/20' : ''}`}>
          <img src={track.cover} alt="Album Art" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{track.title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artist}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Progress Bar (Interactive) */}
        <div 
          ref={progressBarRef}
          onClick={handleProgressClick}
          className="relative h-2 w-full bg-gray-200 dark:bg-slate-700/50 rounded-full cursor-pointer group"
        >
          <div 
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-100" 
            style={{ width: `${progressPercent}%` }} 
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progressPercent}% - 6px)` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={prevTrack}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors transform active:scale-90"
            title="Previous"
          >
            <SkipBack size={18} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/20 active:scale-90 transition-all"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors transform active:scale-90"
            title="Next"
          >
            <SkipForward size={18} fill="currentColor" />
          </button>

          <div 
            className="relative flex items-center gap-2 group/volume"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button 
              onClick={toggleMute}
              className="text-gray-400 dark:text-gray-600 hover:text-blue-400 cursor-pointer transition-colors"
            >
              <VolumeIcon size={16} />
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 flex items-center ${showVolumeSlider ? 'w-20 opacity-100 mr-1' : 'w-0 opacity-0'}`}>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
