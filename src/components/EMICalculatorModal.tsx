import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Percent, Calendar, CheckCircle2, ShieldCheck, ArrowRight, Building } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

interface EMICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EMICalculatorModal: React.FC<EMICalculatorModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useProperties();

  const [loanAmount, setLoanAmount] = useState<number>(6000000); // 60 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years
  const [appliedBank, setAppliedBank] = useState<string | null>(null);

  if (!isOpen) return null;

  // Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
  const P = loanAmount;
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;

  const emi = P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  const principalPercent = Math.round((P / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  const handleApply = (bankName: string) => {
    setAppliedBank(bankName);
    showToast(`Home Loan inquiry submitted to ${bankName}! Relationship manager will call you shortly.`);
  };

  const banks = [
    { name: 'State Bank of India (SBI)', rate: '8.40%', fee: '0.35%', emiPerLakh: '₹861' },
    { name: 'HDFC Bank', rate: '8.50%', fee: '0.50%', emiPerLakh: '₹868' },
    { name: 'ICICI Bank', rate: '8.55%', fee: '0.50%', emiPerLakh: '₹871' },
    { name: 'Axis Bank', rate: '8.60%', fee: '0.40%', emiPerLakh: '₹874' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Home Loan EMI Calculator</h3>
              <p className="text-xs text-slate-400">Accurate monthly payment calculation with top bank rates in India</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Top Result KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="text-xs font-semibold text-amber-800">Monthly EMI</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-sans">
                ₹{Math.round(emi).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5">Per month for {tenureYears} years</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Total Interest Payable</div>
              <div className="text-xl font-bold text-slate-800 mt-1 font-sans">
                ₹{Math.round(totalInterest).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">{interestPercent}% of total payment</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-semibold text-slate-500">Total Amount (P + I)</div>
              <div className="text-xl font-bold text-slate-800 mt-1 font-sans">
                ₹{Math.round(totalPayment).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across {tenureYears * 12} months</div>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Principal: {principalPercent}% (₹{(loanAmount / 100000).toFixed(1)} Lakhs)</span>
              <span>Interest: {interestPercent}% (₹{(totalInterest / 100000).toFixed(1)} Lakhs)</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div style={{ width: `${principalPercent}%` }} className="bg-amber-500 transition-all duration-300" />
              <div style={{ width: `${interestPercent}%` }} className="bg-slate-700 transition-all duration-300" />
            </div>
          </div>

          {/* Sliders Area */}
          <div className="space-y-5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
            {/* Loan Amount */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm">Loan Amount</label>
                <div className="text-sm font-extrabold text-amber-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  ₹{(loanAmount / 100000).toFixed(1)} Lakhs (₹{loanAmount.toLocaleString('en-IN')})
                </div>
              </div>
              <input
                type="range"
                min={500000}
                max={50000000}
                step={100000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹5 Lakhs</span>
                <span>₹2.5 Crore</span>
                <span>₹5.0 Crore</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm">Interest Rate (% p.a.)</label>
                <div className="text-sm font-extrabold text-amber-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  {interestRate}% p.a.
                </div>
              </div>
              <input
                type="range"
                min={7.5}
                max={15.0}
                step={0.05}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>7.5% (Lowest)</span>
                <span>10.0%</span>
                <span>15.0%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold text-slate-800 text-xs sm:text-sm">Loan Tenure (Years)</label>
                <div className="text-sm font-extrabold text-amber-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                  {tenureYears} Years ({tenureYears * 12} Months)
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>
          </div>

          {/* Partner Bank Offers */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs sm:text-sm flex items-center justify-between">
              <span>Compare Pre-Approved Bank Rates in India</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Zero Processing Fee on Selected Banks</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {banks.map(b => (
                <div
                  key={b.name}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between gap-2 shadow-sm hover:border-amber-400 transition"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{b.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Rate: <strong className="text-amber-700">{b.rate}</strong> • Fee: {b.fee}
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(b.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Tax Benefits under Sec 80C (Principal) & Sec 24b (Interest) apply</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
