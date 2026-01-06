
import * as React from 'react';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-2 sm:gap-4">
      {SKILLS.map((skill) => (
        <div
          key={skill.name}
          className="group relative flex items-center justify-center aspect-square bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg sm:rounded-2xl p-1.5 sm:p-2 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:z-50"
        >
          <img 
            src={skill.icon} 
            alt={skill.name} 
            className="w-5 h-5 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-110 filter dark:brightness-90"
          />
          {/* Tooltip - Positioned on top, hidden on small touch devices generally as hover isn't natural */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-xl transform group-hover:-translate-y-1 hidden sm:block">
            {skill.name}
            {/* Small arrow for the tooltip */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 dark:bg-gray-700 rotate-45" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
