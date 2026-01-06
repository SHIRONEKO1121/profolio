
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Instagram, MessageCircle, Moon, Sun, ArrowRight, Shapes, Folder, Zap, Gamepad2 } from 'lucide-react';
import EnterPage from './components/EnterPage';
import Sidebar, { ProfileCard, Interests, Timeline, Connect } from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import TravelMap from './components/TravelMap';
import ContactForm from './components/ContactForm';
import Card from './components/Card';
import Skills from './components/Skills';
import Piano from './components/Piano';
import Gallery from './components/Gallery';
import DinoGame from './components/DinoGame';
import AIChat from './components/AIChat';
import { SITES, PROJECTS, SITE_ASSETS } from './constants';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auto-enable dark mode based on system preference or time of day
  useEffect(() => {
    const calculateDarkMode = () => {
      const now = new Date();
      const hour = now.getHours();
      // Enable dark mode between 7 PM (19) and 6 AM
      const shouldBeDark = hour >= 19 || hour < 6;
      setIsDarkMode(shouldBeDark);
    };

    calculateDarkMode();

    // Check every minute
    const interval = setInterval(calculateDarkMode, 60000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize dark mode with document class for Tailwind dark: prefix support
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  if (!hasEntered) {
    return <EnterPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className={`min-h-screen gradient-bg p-4 md:p-8 lg:p-12 animate-in fade-in zoom-in duration-1000 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-6 md:gap-8 relative">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 space-y-8 sm:space-y-10 order-1 lg:order-2">
          {/* Header Section */}
          <section className="space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-4 flex-1">
                 <h1 className="text-4xl sm:text-6xl md:text-7xl font-zilla font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none break-words">
                   Hello  I'm <span className="text-gray-300 dark:text-gray-600">SHIRO</span><span className="text-blue-500">NEKO</span>
                 </h1>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={toggleDarkMode}
                  className="p-3 sm:p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-sm hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 border border-white/20 shrink-0"
                >
                  {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-bold text-gray-700 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400">Year 3 AI student (double majoring Finance)</span> <span className="text-gray-400 font-normal mx-1">@</span> <span className="text-green-500 dark:text-green-400">HKU</span>
              </div>
              <p className="text-xl sm:text-3xl md:text-4xl font-zilla font-bold italic text-gray-800 dark:text-gray-200 leading-relaxed tracking-wide opacity-90">
                Welcome to my page ꜀(^. .^꜀ )꜆੭ 
              </p>

              {/* Social Icons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                <a href="mailto:lucas20041121@gmail.com" className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-2xl text-gray-400 hover:text-blue-500 transition-all hover:scale-110 shadow-sm border border-white/20"><Mail size={20} /></a>
                <a href="https://www.instagram.com/djs.ncc/" className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-2xl text-gray-400 hover:text-pink-500 transition-all hover:scale-110 shadow-sm border border-white/20"><Instagram size={20} /></a>
                <a href="https://wa.me/67086607" className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-2xl text-gray-400 hover:text-green-500 transition-all hover:scale-110 shadow-sm border border-white/20"><MessageCircle size={20} /></a>
                <a href="https://s.team/p/gdgf-vqkr/vcwjdwvr" className="p-3 bg-white/60 dark:bg-slate-800/60 rounded-2xl text-gray-400 hover:text-purple-500 transition-all hover:scale-110 shadow-sm border border-white/20"><Gamepad2 size={20} /></a>
              </div>
            </div>
          </section>

          {/* Mobile Only: ProfileCard, Interests, Music Player */}
          <div className="lg:hidden space-y-6">
            <ProfileCard />
            <Interests />
            <MusicPlayer />
          </div>

          {/* Interactive Section: Piano & Games */}
          {/* Mobile: Combined Card. Desktop: Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between lg:mb-0 mb-4 lg:hidden">
               <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                 <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-xl text-sm">🎹</span> Playground
               </h2>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden lg:block space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                     <span className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-xl text-sm">🎹</span> Playground
                   </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                   <div className="flex flex-col gap-4">
                      <DinoGame />
                      <Piano />
                   </div>
                   <div className="flex-1 min-h-[350px] lg:min-h-0">
                      <AIChat />
                   </div>
                </div>
            </div>

            {/* Mobile Layout: Combined into one large card container */}
            <div className="lg:hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-4 shadow-sm border border-white/20">
               <div className="space-y-4">
                  <DinoGame transparent />
                  <Piano transparent />
                  <div className="h-[400px]">
                      <AIChat transparent />
                  </div>
               </div>
            </div>
          </section>

          {/* Sites Grid */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Shapes size={20} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} /> Sites
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {SITES.map((site, i) => (
                <Card key={i} data={site} />
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Folder size={20} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} /> Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {PROJECTS.map((project, i) => (
                <Card key={i} data={project} />
              ))}
            </div>
          </section>

          {/* Gallery */}
          <Gallery />

          {/* Skills (Desktop Only here, Mobile moved below) */}
          <section className="hidden lg:block space-y-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" fill="currentColor" strokeWidth={0} /> skills
            </h2>
            <Skills />
          </section>

          {/* Mobile Only: Remaining Sidebar Items (Map, Timeline, Skills, Connect) */}
          <div className="lg:hidden space-y-6">
            <TravelMap />
            <Timeline />
            
            {/* Skills Section for Mobile */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500" fill="currentColor" strokeWidth={0} /> skills
              </h2>
              <Skills />
            </div>

            <Connect />
          </div>

          {/* Contact */}
          <ContactForm />

          {/* Footer */}
          <footer className="pt-8 pb-16 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black tracking-[0.3em] uppercase">
                © 2026 SHIRONEKO • All Right Reserved
              </p>
              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-300 dark:text-gray-700">
                 <div className="h-px w-8 bg-current" />
                 <div className="h-px w-8 bg-current" />
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
