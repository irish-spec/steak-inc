import React, { useState, useEffect } from 'react';
import { Upgrade, UpgradeType, GameState } from '../types';
import { UPGRADES } from '../constants';
import { calculateCost, formatMoney } from '../utils';

interface UpgradePanelProps {
  gameState: GameState;
  onPurchase: (upgrade: Upgrade, cost: number) => void;
  filterType?: UpgradeType; // If provided, only shows this type and hides tabs
}

const UpgradePanel: React.FC<UpgradePanelProps> = ({ gameState, onPurchase, filterType }) => {
  const [activeTab, setActiveTab] = useState<UpgradeType>(filterType || UpgradeType.HABITAT);

  // Update active tab if filterType changes
  useEffect(() => {
    if (filterType) setActiveTab(filterType);
  }, [filterType]);

  const getFilteredUpgrades = (type: UpgradeType) => {
    return UPGRADES.filter(u => u.type === type).sort((a, b) => a.baseCost - b.baseCost);
  };

  const renderUpgradeItem = (upgrade: Upgrade) => {
    const currentLevel = gameState.purchasedUpgrades[upgrade.id] || 0;
    const cost = calculateCost(upgrade.baseCost, upgrade.costMultiplier, currentLevel);
    const canAfford = gameState.money >= cost;

    return (
      <div key={upgrade.id} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg border border-slate-700 mb-2 shadow-sm">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-200 text-sm">{upgrade.name}</h4>
            <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 rounded border border-slate-600">Lvl {currentLevel}</span>
          </div>
          <p className="text-xs text-slate-500 leading-tight mt-1">{upgrade.description}</p>
          <p className="text-xs text-blue-400 mt-1 font-mono">
            {upgrade.effectType === 'add' ? '+' : 'x'}{upgrade.effectValue} {upgrade.target}
          </p>
        </div>
        
        <button
          onClick={() => onPurchase(upgrade, cost)}
          disabled={!canAfford}
          className={`
            px-3 py-3 rounded-lg font-mono text-xs font-bold min-w-[85px] text-center transition-all active:scale-95
            flex flex-col items-center justify-center gap-1
            ${canAfford 
              ? 'bg-green-600 text-white hover:bg-green-500 shadow-md border-b-4 border-green-800 active:border-b-0 active:translate-y-[4px]' 
              : 'bg-slate-700 text-slate-500 cursor-not-allowed border-b-4 border-slate-800'}
          `}
        >
          <span>Buy</span>
          <span>{formatMoney(cost)}</span>
        </button>
      </div>
    );
  };

  const tabs = [
    { id: UpgradeType.HABITAT, label: 'Habitats', icon: '🏠' },
    { id: UpgradeType.TRANSPORT, label: 'Transport', icon: '🚚' },
    { id: UpgradeType.RESEARCH, label: 'Research', icon: '🔬' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-t-xl overflow-hidden">
      {/* Show Tabs only if no filter is provided */}
      {!filterType && (
        <div className="flex border-b border-slate-700 bg-slate-950">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-3 text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1
                ${activeTab === tab.id 
                  ? 'bg-slate-900 text-white border-b-2 border-blue-500' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {getFilteredUpgrades(activeTab).length === 0 ? (
            <div className="text-center text-slate-500 mt-10">No upgrades available in this category yet.</div>
        ) : (
            getFilteredUpgrades(activeTab).map(renderUpgradeItem)
        )}
      </div>
    </div>
  );
};

export default UpgradePanel;