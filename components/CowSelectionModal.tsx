import React from 'react';
import { CowDefinition } from '../types';
import { COW_TYPES } from '../constants';
import { formatMoney } from '../utils';

interface CowSelectionModalProps {
  currentCowIndex: number;
  currentMoney: number;
  onUpgradeCow: () => void;
  onClose: () => void;
}

const CowSelectionModal: React.FC<CowSelectionModalProps> = ({ currentCowIndex, currentMoney, onUpgradeCow, onClose }) => {
  const currentCow = COW_TYPES[currentCowIndex];
  const nextCow = COW_TYPES[currentCowIndex + 1];
  const isMaxLevel = !nextCow;
  const canAfford = nextCow && currentMoney >= nextCow.unlockCost;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Farm Upgrade</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Cow */}
          <div className="flex flex-col items-center opacity-75">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Current Farm</h3>
            <div className="w-32 h-32 rounded-full border-4 border-slate-600 bg-slate-800 shadow-lg mb-2 flex items-center justify-center overflow-hidden p-2">
              <img src={currentCow.image} alt={currentCow.name} className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-bold text-white">{currentCow.name}</h2>
            <p className="text-sm text-slate-400 text-center">{currentCow.description}</p>
            <div className="mt-2 bg-slate-800 px-3 py-1 rounded text-sm text-blue-400">
              Value Multiplier: <span className="font-bold">x{currentCow.valueMultiplier}</span>
            </div>
          </div>

          <div className="flex justify-center">
            <span className="text-slate-600 text-2xl">⬇️</span>
          </div>

          {/* Next Cow */}
          {isMaxLevel ? (
            <div className="text-center text-yellow-500 font-bold py-8">
              MAXIMUM TECHNOLOGY ACHIEVED
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h3 className="text-yellow-500 text-xs font-bold uppercase mb-2">Next Upgrade</h3>
               <div className="w-40 h-40 rounded-full border-4 border-yellow-500 bg-slate-800 shadow-[0_0_30px_rgba(234,179,8,0.3)] mb-2 flex items-center justify-center overflow-hidden p-2">
                <img src={nextCow.image} alt={nextCow.name} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-white">{nextCow.name}</h2>
              <p className="text-sm text-slate-400 text-center px-4 mb-4">{nextCow.description}</p>
              <div className="bg-yellow-900/30 border border-yellow-700/50 px-4 py-2 rounded text-yellow-400 mb-4">
                New Multiplier: <span className="font-bold text-lg">x{nextCow.valueMultiplier}</span>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg w-full text-center mb-2">
                 <div className="text-xs text-slate-500 uppercase mb-1">Required Funds</div>
                 <div className={`text-xl font-mono font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                    {formatMoney(nextCow.unlockCost)}
                 </div>
              </div>

              <div className="text-xs text-slate-500 text-center mb-4 italic">
                Warning: Upgrading will sell your current farm. You will lose all cows, habitats, and money, but keep your new specialized breed.
              </div>

              <button
                onClick={onUpgradeCow}
                disabled={!canAfford}
                className={`
                  w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider shadow-lg transition-all
                  ${canAfford 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:scale-105 hover:shadow-green-500/20' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                `}
              >
                {canAfford ? 'UPGRADE FARM' : 'INSUFFICIENT FUNDS'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CowSelectionModal;