import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CowDefinition, GameState } from '../types';
import { UPGRADES } from '../constants';

interface VisualFarmProps {
  newCows: number; // Trigger animation when this increases
  cowType: CowDefinition;
  gameState: GameState; // Needed to determine building tiers
}

interface VisualCow {
  id: number;
  progress: number; // 0 to 1
  startOffset: number; // Randomize start y slightly
  targetOffset: number; // Randomize end location slightly
}

const VisualFarm: React.FC<VisualFarmProps> = ({ newCows, cowType, gameState }) => {
  const [cows, setCows] = useState<VisualCow[]>([]);
  const requestRef = useRef<number>(0);
  const cowIdRef = useRef(0);
  const [walkFrame, setWalkFrame] = useState(0); // 0: Still, 1: Right, 2: Still, 3: Left

  // --- Asset Determination ---

  const getBarnImage = useMemo(() => {
    const upgrades = gameState.purchasedUpgrades;
    if (upgrades['hab_tower'] >= 1) return 'assets/bovineskyscraper.png';
    if (upgrades['hab_feedlot'] >= 1) return 'assets/megafeedlot.png';
    if (upgrades['hab_warehouse'] >= 1) return 'assets/cowwarehouse.png';
    if (upgrades['hab_barn'] >= 1) return 'assets/redbarn.png';
    return 'assets/woodenbarn.png';
  }, [gameState.purchasedUpgrades]);

  const getTruckImage = useMemo(() => {
    const upgrades = gameState.purchasedUpgrades;
    if (upgrades['trans_rocket'] >= 1) return 'assets/futuristictruck.png';
    if (upgrades['trans_train'] >= 1) return 'assets/semitruck.png';
    if (upgrades['trans_semi'] >= 1) return 'assets/largetruck.png';
    if (upgrades['trans_pickup'] >= 1) return 'assets/smalltruck.png';
    return 'assets/trike.png';
  }, [gameState.purchasedUpgrades]);

  // --- Cow Walking Animation Frame Cycle ---
  useEffect(() => {
    const interval = setInterval(() => {
      setWalkFrame(prev => (prev + 1) % 4);
    }, 200); // Change frame every 200ms
    return () => clearInterval(interval);
  }, []);

  const getCowSprite = () => {
    if (walkFrame === 0 || walkFrame === 2) return 'assets/cowstill.png';
    if (walkFrame === 1) return 'assets/cowright.png';
    return 'assets/cowleft.png';
  };

  // --- Animation Loop ---

  useEffect(() => {
    if (newCows > 0) {
      addCows(newCows);
    }
  }, [newCows]);

  const addCows = (count: number) => {
    const newVisualCows: VisualCow[] = [];
    for (let i = 0; i < count; i++) {
        if (cows.length + newVisualCows.length > 40) break;
        
        newVisualCows.push({
            id: cowIdRef.current++,
            progress: 0,
            startOffset: (Math.random() * 10) - 5,
            targetOffset: (Math.random() * 20) - 10
        });
    }
    setCows(prev => [...prev, ...newVisualCows]);
  };

  const animate = () => {
    setCows(prevCows => {
      const nextCows = prevCows.map(cow => {
        // Move from Coop (Right side) to Barns (Top/Left side)
        const speed = 0.003; 
        const newProgress = cow.progress + speed;
        
        if (newProgress >= 1) return null; // Remove cow

        return { ...cow, progress: newProgress };
      }).filter((c): c is VisualCow => c !== null);
      
      return nextCows;
    });
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="relative flex-grow w-full h-full overflow-hidden bg-slate-900">
      {/* Background Map */}
      <img 
        src="assets/map.png" 
        alt="Farm Map" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* --- Structures --- */}

      {/* Coop: Mid-Right */}
      <div className="absolute z-10 w-[20%] aspect-square" style={{ top: '40%', right: '5%' }}>
          <img src="assets/coop.png" alt="Coop" className="w-full h-full object-contain drop-shadow-lg" />
      </div>

      {/* Truck Depot: Mid-Left */}
      <div className="absolute z-10 w-[25%] aspect-[4/3]" style={{ top: '42%', left: '15%' }}>
          <img src="assets/truckdepot.png" alt="Depot" className="w-full h-full object-contain drop-shadow-2xl" />
      </div>

      {/* Barns (Warehouses): Top Left and Top Center */}
      <div className="absolute z-10 w-[22%] aspect-square" style={{ top: '15%', left: '10%' }}>
          <img src={getBarnImage} alt="Barn 1" className="w-full h-full object-contain drop-shadow-xl" />
      </div>
      <div className="absolute z-10 w-[22%] aspect-square" style={{ top: '8%', left: '45%' }}>
          <img src={getBarnImage} alt="Barn 2" className="w-full h-full object-contain drop-shadow-xl" />
      </div>

      {/* --- Vehicles --- */}
      {/* Truck Animation Container */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="absolute w-24 h-16 animate-truck-path">
              <img src={getTruckImage} alt="Truck" className="w-full h-full object-contain drop-shadow-md transform -scale-x-100" />
          </div>
      </div>

      {/* --- Cows --- */}
      {cows.map(cow => {
          // Path Logic:
          // Start: Coop (approx Right: 15%, Top: 50%) -> x: 85%, y: 50%
          // End: Barns (approx Left: 30%, Top: 20%) -> x: 30%, y: 20%
          
          const startX = 85; 
          const startY = 50 + cow.startOffset;
          const endX = 30 + cow.targetOffset; 
          const endY = 20 + cow.targetOffset;

          const currentX = startX + (endX - startX) * cow.progress;
          const currentY = startY + (endY - startY) * cow.progress;

          return (
            <div 
                key={cow.id}
                className="absolute w-8 h-8 z-30 transition-transform"
                style={{ 
                    left: `${currentX}%`, 
                    top: `${currentY}%`,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <img 
                    src={getCowSprite()} 
                    alt="Cow" 
                    className="w-full h-full object-contain" 
                />
            </div>
          );
      })}

      <style>{`
        @keyframes truck-path {
            /* Start Bottom Right */
            0% { left: 100%; top: 90%; opacity: 0; }
            5% { left: 90%; top: 85%; opacity: 1; }
            
            /* Drive to Depot */
            40% { left: 35%; top: 55%; transform: translateX(0) translateY(0) scaleX(-1); }
            
            /* Stop at Depot */
            45% { left: 35%; top: 55%; transform: translateX(0) translateY(0) scaleX(-1); }
            55% { left: 35%; top: 55%; transform: translateX(0) translateY(0) scaleX(-1); }

            /* Drive Away (Up/Left) */
            100% { left: -20%; top: 25%; transform: translateX(0) translateY(0) scaleX(-1); }
        }
        .animate-truck-path {
            animation: truck-path 12s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VisualFarm;