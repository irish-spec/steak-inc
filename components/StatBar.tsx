import React from 'react';
import { formatMoney, formatNumber } from '../utils';
import { DerivedStats, CowDefinition } from '../types';

interface StatBarProps {
  money: number;
  cows: number;
  stats: DerivedStats;
  cowType: CowDefinition;
  onOpenUpgrade: () => void;
}

const StatBar: React.FC<StatBarProps> = ({ money, cows, stats, cowType, onOpenUpgrade }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 z-20 flex flex-col pointer-events-none">
      {/* Top Row */}
      <div className="flex justify-between items-start pt-2">
        {/* Prestige / Cow Button (Top Left) */}
        <div className="pointer-events-auto" onClick={onOpenUpgrade}>
          <div className="w-16 h-16 rounded-full border-4 border-slate-200/20 shadow-xl relative overflow-hidden bg-slate-900/80 backdrop-blur-sm transition-transform active:scale-95 group">
            <img 
                src={cowType.image} 
                alt={cowType.name} 
                className="w-full h-full object-contain p-1 group-hover:scale-110 transition-transform" 
            />
            {/* Optional Progress Ring - Aesthetic only for now */}
            <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-transparent opacity-50 rotate-45"></div>
          </div>
          <div className="mt-1 text-center bg-slate-900/50 rounded-full px-2 py-0.5 backdrop-blur-md">
             <span className="text-[10px] font-bold text-white uppercase tracking-wider block">{cowType.name}</span>
          </div>
        </div>

        {/* Money Center */}
        <div className="flex flex-col items-center flex-1 mx-4 pointer-events-auto mt-1">
          <div className="text-3xl font-black text-white drop-shadow-md font-mono tracking-tighter">
            {formatMoney(money)}
          </div>
          <div className="flex items-center gap-1 bg-slate-900/40 px-3 py-0.5 rounded-full backdrop-blur-sm">
            <span className="text-xs font-bold text-slate-300">{formatMoney(stats.incomePerSecond)}/sec</span>
          </div>
        </div>

        {/* Home/Menu Button (Top Right) */}
        <div className="pointer-events-auto">
           <div className="w-12 h-12 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg border-4 border-purple-400/30 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
           </div>
        </div>
      </div>

      {/* Status Pills (Floating below) */}
      <div className="flex flex-col gap-2 mt-2 items-start w-full pointer-events-none">
        {/* Population Pill */}
        <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-r-full border-l-4 border-blue-500 shadow-md flex items-center gap-3 -ml-4 pl-6">
          <span className="text-lg">🛖</span>
          <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-200 uppercase leading-none mb-0.5">Habitats</span>
              <span className={`text-xs font-mono font-bold ${cows >= stats.housingCapacity ? 'text-red-400' : 'text-white'}`}>
                {formatNumber(cows)} <span className="text-slate-400 text-[10px]">/ {formatNumber(stats.housingCapacity)}</span>
              </span>
          </div>
        </div>
        
        {/* Shipping Pill */}
        <div className="bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-r-full border-l-4 border-yellow-500 shadow-md flex items-center gap-3 -ml-4 pl-6">
          <span className="text-lg">🚚</span>
          <div className="flex flex-col">
              <span className="text-[10px] font-bold text-yellow-200 uppercase leading-none mb-0.5">Shipping</span>
              <span className="text-xs font-mono font-bold text-white">
                {formatNumber(stats.shippingCapacity)} <span className="text-slate-400 text-[10px]">/sec</span>
              </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatBar;