import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Tag, 
  PlusCircle, 
  Calculator, 
  Percent, 
  FileCheck, 
  FileSpreadsheet, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Map,
  Layers
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { JDADevelopmentMap } from '../components/JDADevelopmentMap';

import valuationImg from '../assets/images/valuation_report_1789623783594.jpg';
import homeLoanImg from '../assets/images/home_loan_keys_1789623798922.jpg';
import rentAgreementImg from '../assets/images/rent_agreement_doc_1789623812326.jpg';
import postPropertyImg from '../assets/images/post_property_free_1789623824873.jpg';
import legalVerificationImg from '../assets/images/legal_title_verify_1789623838040.jpg';
import packersMoversImg from '../assets/images/packers_movers_truck_1789623851388.jpg';

interface ServicesPageProps {
  onOpenEMICalculator: () => void;
  onOpenValuation: () => void;
  onOpenPostProperty: () => void;
  onOpenRentAgreement: () => void;
  onNavigate: (view: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenEMICalculator,
  onOpenValuation,
  onOpenPostProperty,
  onOpenRentAgreement,
  onNavigate
}) => {
  const { showToast } = useProperties();
  const [activeView, setActiveView] = useState<'map' | 'utilities'>('map');

  const services = [
    {
      id: 'valuation',
      title: 'Free Property Valuation',
      desc: 'Accurate market rate estimates and rental yield analysis using 2026 registered circle rates and transaction data across 50+ Indian cities.',
      icon: Calculator,
      cta: 'Check Property Value',
      action: onOpenValuation,
      badge: 'Instant AI Report',
      image: valuationImg,
      roleTag: 'Seller & Owner AI Tool'
    },
    {
      id: 'loan',
      title: 'Home Loans at 8.35%',
      desc: 'Compare pre-approved home loan offers from SBI, HDFC Bank, ICICI Bank & Axis Bank with zero processing fee discounts and instant sanction.',
      icon: Percent,
      cta: 'Calculate EMI & Apply',
      action: onOpenEMICalculator,
      badge: 'Lowest Rates',
      image: homeLoanImg,
      roleTag: 'Buyer Finance Hub'
    },
    {
      id: 'agreement',
      title: 'Online Rent Agreement & E-Stamping',
      desc: 'Government recognized 11-month rental agreement draft with Aadhaar-based biometric doorstep verification and official e-stamp delivery.',
      icon: FileSpreadsheet,
      cta: 'Draft Agreement Now',
      action: onOpenRentAgreement,
      badge: 'Same-Day Legal Delivery',
      image: rentAgreementImg,
      roleTag: 'Tenant & Landlord Portal'
    },
    {
      id: 'post',
      title: 'Post Property FREE',
      desc: 'Reach over 10 Million+ genuine active buyers & tenants in India with 0% brokerage and direct WhatsApp lead notifications.',
      icon: PlusCircle,
      cta: 'Post Property Now',
      action: onOpenPostProperty,
      badge: '100% Free Listing',
      image: postPropertyImg,
      roleTag: 'Direct Owner Selling'
    },
    {
      id: 'legal',
      title: 'Legal Title Verification',
      desc: '30-year ownership search, encumbrance certificate, RERA compliance audit, and sale deed drafting by empanelled real estate advocates.',
      icon: FileCheck,
      cta: 'Book Legal Consultation',
      action: () => showToast('Legal consultation request logged! An advocate will call you.'),
      badge: 'Safe Purchase',
      image: legalVerificationImg,
      roleTag: 'RERA Advocate Verification'
    },
    {
      id: 'movers',
      title: 'Packers & Movers',
      desc: 'Guaranteed safe relocation with professional packing, zero damage promise, live GPS tracking, and insurance cover.',
      icon: Truck,
      cta: 'Get Free Moving Quote',
      action: () => showToast('Packers & Movers quote request submitted! Partner will reach out.'),
      badge: 'Best Price Guarantee',
      image: packersMoversImg,
      roleTag: 'Relocation & Logistics'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-12 border border-slate-800 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64 text-amber-500" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-4 border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Complete Real Estate Ecosystem
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif tracking-tight">
              NavikX Real Estate Services & Solutions
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
              Role-based solutions for Buyers, Sellers, Landlords, and Tenants. Explore HD verified tools, AI valuation, legal clearances, home loans, and doorstep rent agreements.
            </p>
          </div>
        </div>

        {/* Navigation Tabs for Services Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-12 max-w-xl mx-auto bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveView('map')}
            className={`w-full sm:w-1/2 py-3 px-6 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'map'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Map className="w-4 h-4 text-amber-500" />
            <span>JDA Development Map</span>
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-md uppercase animate-pulse">
              New
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveView('utilities')}
            className={`w-full sm:w-1/2 py-3 px-6 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeView === 'utilities'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Core Utility Services</span>
          </button>
        </div>

        {activeView === 'map' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <JDADevelopmentMap />
          </div>
        ) : (
          /* Services Grid with HD Role Images */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  {/* HD Image Banner with Badge Overlays */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30 flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        {svc.roleTag}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 shadow-md">
                        {svc.badge}
                      </span>
                    </div>

                    {/* Icon floating on image */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/90 text-slate-950 flex items-center justify-center font-bold shadow-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5">
                        {svc.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <button
                        onClick={svc.action}
                        className="w-full py-3 bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-white font-bold rounded-xl text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>{svc.cta}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

