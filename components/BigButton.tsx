import React, { useRef, useState } from 'react';

interface BigButtonProps {
  onHatch: () => void;
  disabled: boolean;
}

const BigButton: React.FC<BigButtonProps> = ({ onHatch, disabled }) => {
  const [isPressed, setIsPressed] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startHatching = () => {
    if (disabled) return;
    setIsPressed(true);
    onHatch(); // Immediate hatch
    
    // Auto hatch while holding
    intervalRef.current = window.setInterval(onHatch, 100);
  };

  const stopHatching = () => {
    setIsPressed(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="w-full px-4 pb-6 pt-2 select-none">
      <button
        className={`
            w-full h-24 rounded-3xl border-b-8 border-red-800 
            flex items-center justify-center relative overflow-hidden
            transition-all duration-75 touch-manipulation
            ${isPressed 
                ? 'bg-red-700 translate-y-[4px] border-b-4' 
                : 'bg-red-600 shadow-lg hover:brightness-110 active:translate-y-[4px] active:border-b-4'}
            ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        `}
        onMouseDown={startHatching}
        onMouseUp={stopHatching}
        onMouseLeave={stopHatching}
        onTouchStart={(e) => { e.preventDefault(); startHatching(); }}
        onTouchEnd={(e) => { e.preventDefault(); stopHatching(); }}
      >
        <div className="flex flex-col items-center">
            <span className="text-4xl filter drop-shadow-md">🐮</span>
            {/* Using Chicken emoji because it looks funnier/better than cow emoji on red background usually, but prompt said Cow game. Let's switch back to Cow if preferred, or keep Chicken as "Steak Inc" irony. Let's use Cow Face. */}
             {/* Reverting to Cow Face for consistency */}
        </div>
        
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
      </button>
    </div>
  );
};

export default BigButton;