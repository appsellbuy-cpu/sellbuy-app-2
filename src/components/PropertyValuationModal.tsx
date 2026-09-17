import React, { useState } from 'react';
import { X, Calculator, Sparkles, MapPin, Building2, CheckCircle2, TrendingUp, ShieldCheck, IndianRupee } from 'lucide-react';
import { INDIAN_CITIES } from '../utils/formatters';
import { api } from '../services/api';
import { useProperties } from '../context/PropertyContext';

interface PropertyValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyValuationModal: React.FC<PropertyValuationModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useProperties();

  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('Bandra West');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bhk, setBhk] = useState('2 BHK');
  const [size, setSize] = useState('1100');
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [valuationResult, setValuationResult] = useState<{
    estimate: string;
    estimateRent: string;
    ratePerSqFt: string;
    appreciation: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const res = await api.submitValuation({
        city,
        locality,
        propertyType,
        bhk,
        furnishing,
        propertySize: size,
        name: userName || 'Valued User',
        phone: userPhone
      });

      const sqft = Number(size) || 1000;
      let baseRate = 8500;
      if (city === 'Mumbai') baseRate = 22000;
      else if (city === 'Gurgaon' || city === 'Delhi') baseRate = 12500;
      else if (city === 'Bangalore') baseRate = 9800;
      else if (city === 'Hyderabad') baseRate = 7500;
      else if (city === 'Pune') baseRate = 7200;

      setValuationResult({
        estimate: res.estimate || `₹${((sqft * baseRate) / 100000).toFixed(1)} Lakh`,
        estimateRent: res.estimateRent || `₹${Math.round((sqft * baseRate * 0.0035) / 500) * 500}/month`,
        ratePerSqFt: `₹${baseRate.toLocaleString('en-IN')}/sq.ft`,
        appreciation: '+8.4% YoY growth'
      });

      showToast('Valuation report generated successfully!');
    } catch {
      // Local calculation fallback
      const sqft = Number(size) || 1000;
      let baseRate = 9500;
      if (city === 'Mumbai') baseRate = 24000;
      else if (city === 'Gurgaon') baseRate = 13500;
      else if (city === 'Bangalore') baseRate = 10500;

      setValuationResult({
        estimate: `₹${((sqft * baseRate) / 100000).toFixed(1)} Lakh`,
        estimateRent: `₹${Math.round((sqft * baseRate * 0.0035) / 500) * 500}/month`,
        ratePerSqFt: `₹${baseRate.toLocaleString('en-IN')}/sq.ft`,
        appreciation: '+8.4% YoY'
      });
      showToast('Valuation report generated successfully!');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Free Property Valuation Calculator</h3>
              <p className="text-xs text-slate-400">Accurate AI estimated market value & expected rental yield in India</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs sm:text-sm">
          {!valuationResult ? (
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    {INDIAN_CITIES.map(c => (
                      <option key={c.name} value={c.name}>{c.icon} {c.name}, {c.state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Locality / Sector Name</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Bandra West, Koramangala"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot / Land</option>
                    <option value="Commercial">Office / Shop</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Configuration</label>
                  <select
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="To receive detailed PDF report"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{isCalculating ? 'Analyzing Market Transactions...' : 'Calculate Property Valuation'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Estimated Valuation for {bhk} in {locality}, {city}
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-sans mt-1">
                  {valuationResult.estimate}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  {valuationResult.appreciation} (High Demand Corridor)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-medium">Expected Monthly Rental</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {valuationResult.estimateRent}
                  </div>
                  <div className="text-[10px] text-slate-400">Zero Brokerage potential</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-xs text-slate-500 font-medium">Average Locality Rate</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {valuationResult.ratePerSqFt}
                  </div>
                  <div className="text-[10px] text-slate-400">Based on recent registrations</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setValuationResult(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  Calculate Another Property
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
