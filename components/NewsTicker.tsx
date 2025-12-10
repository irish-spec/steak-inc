import React, { useEffect, useState } from 'react';
import { generateNewsHeadline } from '../services/gemini';
import { GameState } from '../types';

interface NewsTickerProps {
  gameState: GameState;
}

const NewsTicker: React.FC<NewsTickerProps> = ({ gameState }) => {
  const [headline, setHeadline] = useState<string>("Welcome to Steak Inc. Start clicking to build your empire!");
  
  useEffect(() => {
    const fetchNews = async () => {
      const summary = `Money: ${gameState.money}, Cows: ${gameState.cows}`;
      const news = await generateNewsHeadline(summary);
      setHeadline(news);
    };

    // Fetch initial news after a delay
    const initialTimer = setTimeout(fetchNews, 2000);

    // Fetch new news every 45 seconds
    const interval = setInterval(fetchNews, 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []); // Empty dependency array to just set up the interval, relies on current closure state for generic updates or could refactor to use refs if state needs to be fresh in prompt. 
  // *Correction*: To pass fresh state to Gemini, we'd need to include gameState in deps, but that would trigger too often. 
  // We will ignore specific state changes for now and just let the interval run with whatever state it captures or just general prompts. 
  // Actually, to make it robust, let's use a ref for the latest game state so the interval can read it without resetting.
  
  const gameStateRef = React.useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const fetchNews = async () => {
        // Use the ref to get fresh state without resetting the interval
        const current = gameStateRef.current;
        const summary = `Money: ${Math.floor(current.money)}, Total Cows: ${current.cows}`;
        const news = await generateNewsHeadline(summary);
        setHeadline(news);
    };
    
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900 border-b border-slate-700 h-10 overflow-hidden flex items-center relative z-20">
      <div className="bg-red-600 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
        NEWS
      </div>
      <div className="whitespace-nowrap overflow-hidden flex-1 relative">
        <div className="animate-marquee inline-block pl-4 text-sm text-slate-300 font-mono">
          {headline}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
