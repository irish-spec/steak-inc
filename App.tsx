import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, Upgrade, DerivedStats, UpgradeType } from './types';
import { INITIAL_STATE, BASE_STEAK_VALUE, BASE_HOUSING, BASE_SHIPPING, TICK_RATE_MS, BASE_COW_PRODUCTION, UPGRADES, COW_TYPES } from './constants';
import StatBar from './components/StatBar';
import VisualFarm from './components/VisualFarm';
import BigButton from './components/BigButton';
import UpgradePanel from './components/UpgradePanel';
import NewsTicker from './components/NewsTicker';
import CowSelectionModal from './components/CowSelectionModal';
import MenuModal from './components/MenuModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [visualCowTrigger, setVisualCowTrigger] = useState(0);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Cow Prestige Modal
  const [activeMenu, setActiveMenu] = useState<UpgradeType | null>(null); // Bottom Menus

  // --- Calculations ---
  const calculateStats = useCallback((state: GameState): DerivedStats => {
    let housingAdd = 0;
    let shippingAdd = 0;
    let valueMult = 1;
    let hatchAdd = 0;

    const currentCow = COW_TYPES[state.currentCowIndex] || COW_TYPES[0];
    const cowBaseMult = currentCow.valueMultiplier;

    const { purchasedUpgrades } = state;
    
    Object.entries(purchasedUpgrades).forEach(([id, level]) => {
      const upgrade = (UPGRADES as Upgrade[]).find(u => u.id === id);
      if (!upgrade) return;

      const totalEffect = upgrade.effectValue * level;

      if (upgrade.target === 'housing') housingAdd += totalEffect;
      if (upgrade.target === 'shipping') shippingAdd += totalEffect;
      if (upgrade.target === 'value' && upgrade.effectType === 'multiply') valueMult *= (1 + upgrade.effectValue * level);
      if (upgrade.target === 'hatchRate') hatchAdd += totalEffect;
    });

    const housingCapacity = BASE_HOUSING + housingAdd;
    const shippingCapacity = BASE_SHIPPING + shippingAdd;
    const steakValue = BASE_STEAK_VALUE * cowBaseMult * valueMult;
    const cowProductionRate = BASE_COW_PRODUCTION; 

    const potentialProduction = state.cows * cowProductionRate;
    const actualShipped = Math.min(potentialProduction, shippingCapacity);
    const incomePerSecond = actualShipped * steakValue;

    return {
      incomePerSecond,
      steakValue,
      housingCapacity,
      shippingCapacity,
      cowProductionRate,
      hatchRate: hatchAdd
    };
  }, []);

  const stats = useMemo(() => calculateStats(gameState), [gameState, calculateStats]);
  const currentCow = COW_TYPES[gameState.currentCowIndex] || COW_TYPES[0];

  // --- Game Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const currentStats = calculateStats(prev);
        const incomePerTick = currentStats.incomePerSecond * (TICK_RATE_MS / 1000);
        
        return {
          ...prev,
          money: prev.money + incomePerTick,
          lifetimeEarnings: prev.lifetimeEarnings + incomePerTick
        };
      });
    }, TICK_RATE_MS);
    return () => clearInterval(interval);
  }, [calculateStats]);

  // --- Interactions ---
  const handleHatch = () => {
    setGameState(prev => {
      const s = calculateStats(prev);
      if (prev.cows >= s.housingCapacity) return prev;

      return {
        ...prev,
        cows: Math.min(prev.cows + 1 + s.hatchRate, s.housingCapacity)
      };
    });
    setVisualCowTrigger(prev => prev + 1);
  };

  const handlePurchase = (upgrade: Upgrade, cost: number) => {
    setGameState(prev => {
      if (prev.money < cost) return prev;

      const newUpgrades = { ...prev.purchasedUpgrades };
      newUpgrades[upgrade.id] = (newUpgrades[upgrade.id] || 0) + 1;

      return {
        ...prev,
        money: prev.money - cost,
        purchasedUpgrades: newUpgrades
      };
    });
  };

  const handleCowUpgrade = () => {
    setGameState(prev => {
        const nextIndex = prev.currentCowIndex + 1;
        if (nextIndex >= COW_TYPES.length) return prev;
        return {
            ...INITIAL_STATE,
            currentCowIndex: nextIndex,
            lifetimeEarnings: prev.lifetimeEarnings, 
            money: 0 
        };
    });
    setIsUpgradeModalOpen(false);
  };

  // --- Menu Buttons Def ---
  const renderMenuButton = (type: UpgradeType, icon: string, label: string, colorClass: string) => (
      <button 
        onClick={() => setActiveMenu(type)}
        className={`
            w-14 h-14 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.3)] flex flex-col items-center justify-center 
            transition-transform active:translate-y-[4px] active:shadow-none border-2 border-white/10
            ${colorClass}
        `}
      >
          <span className="text-2xl drop-shadow-sm">{icon}</span>
      </button>
  );

  return (
    <div className="h-screen w-full bg-slate-950 text-white overflow-hidden font-sans relative flex flex-col">
      
      {/* 1. Header Area */}
      {/* Moved NewsTicker to very top, slightly smaller or overlay */}
      <div className="absolute top-0 w-full z-30">
        <NewsTicker gameState={gameState} />
      </div>

      <StatBar 
        money={gameState.money} 
        cows={gameState.cows} 
        stats={stats} 
        cowType={currentCow}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
      />

      {/* 2. Background Visuals (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <VisualFarm 
          newCows={visualCowTrigger} 
          cowType={currentCow} 
          gameState={gameState} 
        />
      </div>

      {/* 3. Bottom Controls Overlay */}
      <div className="absolute bottom-0 w-full z-20 flex flex-col p-4 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
         {/* Circular Menu Buttons Row */}
         <div className="flex justify-start gap-4 mb-2 pl-2">
            {renderMenuButton(UpgradeType.RESEARCH, '⚗️', 'Lab', 'bg-blue-500 hover:bg-blue-400')}
            {renderMenuButton(UpgradeType.TRANSPORT, '🚚', 'Depot', 'bg-yellow-500 hover:bg-yellow-400')}
            {renderMenuButton(UpgradeType.HABITAT, '🛖', 'Habitats', 'bg-green-600 hover:bg-green-500')}
         </div>

         {/* Big Hatch Button */}
         <BigButton onHatch={handleHatch} disabled={gameState.cows >= stats.housingCapacity} />
      </div>

      {/* 4. Modals */}
      
      {/* Cow Prestige Modal */}
      {isUpgradeModalOpen && (
        <CowSelectionModal 
            currentCowIndex={gameState.currentCowIndex} 
            currentMoney={gameState.money}
            onUpgradeCow={handleCowUpgrade}
            onClose={() => setIsUpgradeModalOpen(false)}
        />
      )}

      {/* Bottom Sheet Menus */}
      {activeMenu && (
        <MenuModal 
            title={activeMenu === UpgradeType.HABITAT ? 'Habitats' : activeMenu === UpgradeType.TRANSPORT ? 'Shipping Depot' : 'Research Lab'}
            icon={activeMenu === UpgradeType.HABITAT ? '🛖' : activeMenu === UpgradeType.TRANSPORT ? '🚚' : '⚗️'}
            onClose={() => setActiveMenu(null)}
        >
            <UpgradePanel 
                gameState={gameState} 
                onPurchase={handlePurchase} 
                filterType={activeMenu}
            />
        </MenuModal>
      )}

    </div>
  );
};

export default App;