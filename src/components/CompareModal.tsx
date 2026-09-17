import React from 'react';
import { X, Scale, Trash2, CheckCircle2, ShieldCheck, MapPin, Calendar, Phone } from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { formatIndianCurrency, formatRentPrice } from '../utils/formatters';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (p: Property) => void;
  onOpenBooking: (p: Property) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  onOpenBooking
}) => {
  const { compareList, removeFromCompare, clearCompare } = useProperties();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Side-by-Side Property Comparison</h3>
              <p className="text-xs text-slate-400">Comparing {compareList.length} of max 3 properties</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Clear All
              </button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {compareList.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <Scale className="w-12 h-12 mx-auto text-slate-300" />
              <div className="font-bold text-slate-700">No properties in comparison list</div>
              <p className="text-xs max-w-sm mx-auto">
                Click the Compare button on any property card across the marketplace to evaluate prices, carpet area, and amenities side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-40 font-bold text-slate-400 uppercase tracking-wider bg-slate-50">Feature</th>
                    {compareList.map(p => (
                      <th key={p.id} className="p-3 min-w-[220px] font-bold text-slate-900">
                        <div className="flex items-start justify-between gap-2">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-28 object-cover rounded-xl border mb-2 cursor-pointer hover:opacity-90"
                            onClick={() => {
                              onClose();
                              onSelectProperty(p);
                            }}
                          />
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div 
                          className="font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-amber-600"
                          onClick={() => {
                            onClose();
                            onSelectProperty(p);
                          }}
                        >
                          {p.title}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Pricing</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 font-extrabold text-amber-600 text-sm">
                        {p.listingType === 'rent'
                          ? (p.priceDisplay || formatRentPrice(p.price))
                          : (p.priceDisplay || formatIndianCurrency(p.price))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Listing Type</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 font-bold uppercase text-slate-700">
                        {p.listingType}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Location</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.locality ? `${p.locality}, ` : ''}{p.city || p.location}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">BHK / Config</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 text-slate-900 font-bold">
                        {p.beds ? `${p.beds} BHK` : p.category}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Carpet Area</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.carpetArea ? `${p.carpetArea} sq.ft` : `${p.sqft} sq.ft`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Furnishing</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3 text-slate-700">
                        {p.furnishing || 'Semi-Furnished'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Zero Brokerage</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">
                        {p.zeroBrokerage ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Yes (0% Brokerage)
                          </span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 bg-slate-50">Actions</td>
                    {compareList.map(p => (
                      <td key={p.id} className="p-3">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenBooking(p);
                          }}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
                        >
                          Book Tour
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
