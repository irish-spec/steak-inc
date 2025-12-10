import React from 'react';

interface MenuModalProps {
  title: string;
  icon?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const MenuModal: React.FC<MenuModalProps> = ({ title, icon, onClose, children }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center sm:justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      ></div>

      {/* Content */}
      <div className="w-full sm:max-w-md h-[70vh] sm:h-[80vh] bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-slate-950 border-b border-slate-800">
           <div className="flex items-center gap-3">
               {icon && <span className="text-2xl">{icon}</span>}
               <h2 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h2>
           </div>
           <button 
             onClick={onClose}
             className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
           >
             &times;
           </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-hidden relative">
            {children}
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default MenuModal;