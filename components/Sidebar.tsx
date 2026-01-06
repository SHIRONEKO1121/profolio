
import * as React from 'react';
import { MapPin, Briefcase, Linkedin, ExternalLink } from 'lucide-react';
import { TIMELINE, SITE_ASSETS } from '../constants';
import MusicPlayer from './MusicPlayer';
import TravelMap from './TravelMap';

export const ProfileCard: React.FC = () => (
  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm flex flex-col items-center border border-white/20">
    <div className="relative group">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg mb-4 animate-float group-hover:scale-105 transition-transform duration-500">
        <img 
          src={SITE_ASSETS.avatar} 
          alt="Profile Avatar" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
    
    <div className="text-center mb-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">SHIRONEKO</h2>
      <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">AI & Finance</p>
    </div>

    <div className="space-y-3 w-full">
      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-white/40 dark:bg-slate-700/40 p-2.5 rounded-xl text-xs font-medium">
        <MapPin size={14} className="text-blue-500" />
        <span>Hong Kong</span>
      </div>
      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-white/40 dark:bg-slate-700/40 p-2.5 rounded-xl text-xs font-medium">
        <Briefcase size={14} className="text-blue-500" />
        <span>University of Hong Kong</span>
      </div>
    </div>
  </div>
);

export const Interests: React.FC = () => (
  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/20">
    <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Tags</h3>
    <div className="flex flex-wrap gap-2">
      {['piano', 'coding', 'badminton', 'music', 'yorushika', 'cat owner', 'gym', 'travel', 'photographer'].map((tag) => (
        <span 
          key={tag} 
          className="flex-grow text-center px-3 py-1.5 bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-wide border border-gray-100 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-600 hover:border-blue-200 hover:text-blue-500 hover:shadow-sm transition-all duration-300 cursor-default select-none flex items-center justify-center"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export const Timeline: React.FC = () => (
  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-white/20">
    <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Timeline</h3>
    <div className="relative pl-6 space-y-8">
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-blue-100 dark:bg-slate-700" />
      {TIMELINE.map((item, idx) => (
        <div key={idx} className="relative">
          <div className={`absolute -left-[1.35rem] top-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-slate-800 ${item.status === 'future' ? 'bg-green-300' : 'bg-blue-400'}`} />
          <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-tight">{item.date}</div>
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-tight">{item.event}</div>
        </div>
      ))}
    </div>
  </div>
);

export const Connect: React.FC = () => (
  <a 
    href="https://linkedin.com/in/deng-lucas-aa041a388" 
    target="_blank" 
    rel="noopener noreferrer"
    className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-4 border border-white/20 hover:border-blue-200 dark:hover:border-blue-900/40"
  >
    <div className="flex items-center justify-between">
      <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
        <Linkedin size={20} fill="currentColor" strokeWidth={0} />
      </div>
      <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Open to work</span>
      </div>
    </div>
    
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">Connect with me</h3>
        <ExternalLink size={12} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        Let's discuss exciting new opportunities in AI & Tech!
      </p>
    </div>
  </a>
);

const Sidebar: React.FC = () => {
  return (
    <div className="w-full lg:w-72 flex flex-col gap-6 order-2 lg:order-1">
      <ProfileCard />
      <Interests />
      <MusicPlayer />
      <TravelMap />
      <Timeline />
      <Connect />
    </div>
  );
};

export default Sidebar;
