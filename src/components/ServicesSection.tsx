import React from 'react';
import { 
  Building2, 
  Home, 
  Tag, 
  PlusCircle, 
  Calculator, 
  CheckCircle2, 
  FileCheck, 
  Truck, 
  ArrowRight, 
  ShieldAlert, 
  Percent, 
  FileSpreadsheet,
  Sparkles
} from 'lucide-react';

import valuationImg from '../assets/images/valuation_report_1789623783594.jpg';
import homeLoanImg from '../assets/images/home_loan_keys_1789623798922.jpg';
import rentAgreementImg from '../assets/images/rent_agreement_doc_1789623812326.jpg';
import postPropertyImg from '../assets/images/post_property_free_1789623824873.jpg';
import legalVerificationImg from '../assets/images/legal_title_verify_1789623838040.jpg';
import packersMoversImg from '../assets/images/packers_movers_truck_1789623851388.jpg';

interface ServicesSectionProps {
  onOpenEMICalculator?: () => void;
  onOpenValuation?: () => void;
  onOpenPostProperty?: () => void;
  onOpenRentAgreement?: () => void;
  onNavigate?: (view: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenEMICalculator,
  onOpenValuation,
  onOpenPostProperty,
  onOpenRentAgreement,
  onNavigate
}) => {
  const services = [
    {
      id: 'valuation',
      title: 'Free Property Valuation',
      desc: 'Accurate market rate estimates and rental yield analysis using 2026 registered circle rates.',
      icon: Calculator,
      badge: 'Instant AI Report',
      actionText: 'Check Value Now',
      image: valuationImg,
      action: onOpenValuation
    },
    {
      id: 'home-loans',
      title: 'Home Loans at 8.35%',
      desc: 'Compare pre-approved loan offers from SBI, HDFC, ICICI & Axis Bank with instant sanction.',
      icon: Percent,
      badge: 'Lowest Rates',
      actionText: 'Calculate EMI & Apply',
      image: homeLoanImg,
      action: onOpenEMICalculator
    },
    {
      id: 'agreement',
      title: 'Online Rent Agreement',
      desc: 'Government recognized 11-month agreement with Aadhaar biometric doorstep verification.',
      icon: FileSpreadsheet,
      badge: 'Same-Day Legal Delivery',
      actionText: 'Draft Agreement Now',
      image: rentAgreementImg,
      action: onOpenRentAgreement || (() => onNavigate?.('services'))
    },
    {
      id: 'post-free',
      title: 'Post Property FREE',
      desc: 'Reach over 10M+ active buyers & tenants in India with 0% brokerage and instant leads.',
      icon: PlusCircle,
      badge: '100% Free Listing',
      badgeHighlight: true,
      actionText: 'Post Property Now',
      image: postPropertyImg,
      action: onOpenPostProperty
    },
    {
      id: 'legal',
      title: 'Legal Title Verification',
      desc: '30-year search, encumbrance check, RERA audit & sale deed drafting by top advocates.',
      icon: FileCheck,
      badge: 'Safe Purchase',
      actionText: 'Book Legal Advice',
      image: legalVerificationImg,
      action: () => onNavigate?.('services')
    },
    {
      id: 'movers',
      title: 'Packers & Movers',
      desc: 'Guaranteed safe relocation with professional packing, live GPS tracking, and insurance.',
      icon: Truck,
      badge: 'Best Price Guarantee',
      actionText: 'Get Free Moving Quote',
      image: packersMoversImg,
      action: () => onNavigate?.('services')
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> Full Suite Platform Services
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            HD Role-Based Real Estate Services in India
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Tailored tools for buyers, sellers, landlords, and tenants with instant online processing.
          </p>
        </div>

        {/* Services Grid with HD Image Headers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                onClick={svc.action}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* HD Card Image Header */}
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                    
                    <span className={`absolute top-3 right-3 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md ${
                      svc.badgeHighlight
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-900/80 backdrop-blur-md text-amber-300 border border-amber-500/30'
                    }`}>
                      {svc.badge}
                    </span>

                    <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700 border-t border-slate-100">
                  <span>{svc.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

