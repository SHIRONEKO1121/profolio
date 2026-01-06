
import * as React from 'react';
import { ProjectCard } from '../types';

interface CardProps {
  data: ProjectCard;
}

const Card: React.FC<CardProps> = ({ data }) => {
  const isImageUrl = data.icon.startsWith('http') || data.icon.startsWith('/') || data.icon.includes('.');
  const isTripPlanner = data.title.toLowerCase().includes('trip');

  return (
    <a 
      href={data.link}
      className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between overflow-hidden relative border border-white/20 dark:border-slate-700/50"
    >
      <div className="flex flex-col gap-1 z-10 flex-1 pr-4">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base">{data.title}</h3>
        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{data.description}</p>
      </div>
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center z-10 transition-all duration-300 transform group-hover:scale-110">
        {isImageUrl ? (
          <div className="p-1.5 bg-white/40 dark:bg-slate-700/40 rounded-2xl border border-white/50 dark:border-slate-600 shadow-sm">
            <img
              src={data.icon}
              alt={data.title}
              className={`w-12 h-12 object-contain rounded-xl ${isTripPlanner ? 'dark:invert dark:brightness-200' : ''}`}
            />
          </div>
        ) : (
          <span className="text-3xl sm:text-5xl">{data.icon}</span>
        )}
      </div>
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 pointer-events-none transition-colors" />
    </a>
  );
};

export default Card;
