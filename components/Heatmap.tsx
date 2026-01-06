import * as React from 'react';

const Heatmap: React.FC = () => {
  // Generate a mock grid for 52 weeks (approx 1 year)
  const rows = 7;
  const cols = 52;

  // Function to generate realistic looking heatmap intensities
  const getRandomIntensityClass = () => {
    const r = Math.random();
    if (r > 0.9) return 'bg-green-600 dark:bg-green-400';
    if (r > 0.75) return 'bg-green-500 dark:bg-green-500';
    if (r > 0.5) return 'bg-green-300 dark:bg-green-700';
    if (r > 0.2) return 'bg-green-100 dark:bg-green-900';
    return 'bg-gray-100 dark:bg-slate-800';
  };

  return (
    <div className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 shadow-sm overflow-hidden">
      <div className="flex gap-1 overflow-x-auto hide-scrollbar">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="flex flex-col gap-1 shrink-0">
            {Array.from({ length: rows }).map((_, r) => {
              // Special case for some purple blocks to match UI design
              const isSpecial = c > 10 && c < 15 && r === 3;
              const colorClass = isSpecial ? 'bg-purple-600' : getRandomIntensityClass();
              return (
                <div
                  key={r}
                  className={`w-3 h-3 rounded-sm ${colorClass} transition-colors hover:ring-2 hover:ring-blue-200 cursor-help`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="text-xs text-gray-400 mr-2">Less</div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-400" />
        </div>
        <div className="text-xs text-gray-400 ml-2">More</div>
      </div>
    </div>
  );
};

export default Heatmap;
