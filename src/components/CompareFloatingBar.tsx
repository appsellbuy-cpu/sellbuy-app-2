import React from 'react';
import { useProperties } from '../context/PropertyContext';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export const CompareFloatingBar: React.FC = () => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    openCompareModal,
    isCompareModalOpen 
  } = useProperties();

  if (compareList.length === 0 || isCompareModalOpen) {
    return null;
  }

  return (
    <aside 
      aria-label="Property comparison tray"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-[#0A192F]/95 backdrop-blur-md text-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(10,25,47,0.35)] border border-white/15 animate-in slide-in-from-bottom-6 duration-300"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Summary & Selected Property Thumbnails */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/15">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#C5A059]">
              <Scale className="w-4 h-4" />
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300 block leading-tight">
                Comparison
              </span>
              <span className="text-xs font-bold text-white leading-tight">
                {compareList.length} of 3
              </span>
            </div>
          </div>

          {/* Slots (1, 2, 3) */}
          <div className="flex items-center gap-2">
            {compareList.map((property) => (
              <div 
                key={property.id}
                className="group relative flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl p-1.5 pr-2.5 transition-colors shrink-0 max-w-[160px] sm:max-w-[190px] border border-white/10"
              >
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-8 h-8 rounded-lg object-cover shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">
                    {property.title}
                  </p>
                  <p className="text-[10px] text-[#C5A059] font-medium leading-tight">
                    ${(property.price / 1000).toFixed(0)}k
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCompare(property.id)}
                  className="text-gray-400 hover:text-white p-0.5 rounded-full hover:bg-white/20 transition-colors"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Empty slot indicators */}
            {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
              <div 
                key={`empty-slot-${idx}`}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-white/20 text-gray-400 text-[11px] font-medium shrink-0"
              >
                <span>+ Slot {compareList.length + idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={clearCompare}
            className="px-2.5 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors flex items-center gap-1"
            title="Clear all selected"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            type="button"
            onClick={openCompareModal}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 sm:py-2.5 bg-[#C5A059] hover:bg-[#b08e49] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Compare Now</span>
            <span className="bg-[#0A192F]/20 text-[#0A192F] text-[10px] px-1.5 py-0.2 rounded-full font-sans font-bold">
              {compareList.length}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
