import React, { useState } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, Download, Printer, Stamp, Building } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

interface RentAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RentAgreementModal: React.FC<RentAgreementModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useProperties();

  const [landlordName, setLandlordName] = useState('Vikramaditya Singhania');
  const [tenantName, setTenantName] = useState('Alexander Wright');
  const [monthlyRent, setMonthlyRent] = useState('35000');
  const [deposit, setDeposit] = useState('70000');
  const [propertyAddress, setPropertyAddress] = useState('Flat 402, Sea Green Heights, Bandra West, Mumbai - 400050');
  const [agreementDuration, setAgreementDuration] = useState('11');
  const [noticePeriod, setNoticePeriod] = useState('1');
  const [draftGenerated, setDraftGenerated] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landlordName || !tenantName || !monthlyRent || !propertyAddress) {
      showToast('Please fill in all agreement details');
      return;
    }
    setDraftGenerated(true);
    showToast('Rent Agreement Draft generated with legal clauses!');
  };

  const stampDutyEstimate = Math.round(Number(monthlyRent || 0) * 12 * 0.0025 + 500);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Online Rent Agreement & E-Stamp</h3>
              <p className="text-xs text-slate-400">Government approved 11-month legal rental agreement draft</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {!draftGenerated ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Landlord / Owner Name</label>
                  <input
                    type="text"
                    value={landlordName}
                    onChange={(e) => setLandlordName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tenant / Renter Name</label>
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Complete Property Address</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Deposit (₹)</label>
                  <input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Duration (Months)</label>
                  <select
                    value={agreementDuration}
                    onChange={(e) => setAgreementDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="11">11 Months</option>
                    <option value="22">22 Months</option>
                    <option value="33">33 Months</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Notice (Months)</label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-900">Estimated Government Stamp Duty & Registration</div>
                  <div className="text-xs text-amber-700 mt-0.5">Includes legal e-stamp certificate and door-step biometric verification</div>
                </div>
                <div className="text-lg font-extrabold text-amber-900">
                  ₹{stampDutyEstimate.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition"
              >
                Generate Legal Rent Agreement Draft
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-300 font-serif text-slate-800 space-y-4 max-h-72 overflow-y-auto">
                <div className="text-center font-bold uppercase tracking-wider text-sm border-b pb-2">
                  RESIDENTIAL LEASE & LICENSE AGREEMENT
                </div>
                <p className="text-xs leading-relaxed">
                  THIS AGREEMENT is entered on this day by and between <strong>{landlordName}</strong> (hereinafter referred to as the "LICENSOR/LANDLORD") and <strong>{tenantName}</strong> (hereinafter referred to as the "LICENSEE/TENANT").
                </p>
                <p className="text-xs leading-relaxed">
                  <strong>1. PROPERTY:</strong> The Licensor grants leave and license to the Licensee to occupy the residential premises located at: <em>{propertyAddress}</em>.
                </p>
                <p className="text-xs leading-relaxed">
                  <strong>2. RENT & DEPOSIT:</strong> The monthly license fee is fixed at <strong>₹{Number(monthlyRent).toLocaleString('en-IN')}</strong> payable in advance. An interest-free refundable security deposit of <strong>₹{Number(deposit).toLocaleString('en-IN')}</strong> is acknowledged.
                </p>
                <p className="text-xs leading-relaxed">
                  <strong>3. TENURE & NOTICE:</strong> The license is granted for a period of <strong>{agreementDuration} Months</strong> with a mandatory notice period of <strong>{noticePeriod} Month(s)</strong> by either party.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => showToast('Printing draft agreement...')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => {
                    showToast('Biometric doorstep appointment scheduled!');
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Order E-Stamp Delivery (₹{stampDutyEstimate})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
