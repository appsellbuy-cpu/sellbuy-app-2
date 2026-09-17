import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  MapPin, 
  BarChart3, 
  CheckCircle2, 
  FileText, 
  Coins, 
  ExternalLink,
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';

interface JaipurInsightsSectionProps {
  onSelectLocality?: (localityName: string) => void;
  onOpenValuation?: () => void;
  onOpenEMICalculator?: () => void;
}

export const JaipurInsightsSection: React.FC<JaipurInsightsSectionProps> = ({
  onSelectLocality,
  onOpenValuation,
  onOpenEMICalculator
}) => {
  const [activeTab, setActiveTab] = useState<'developments' | 'jda' | 'rates'>('developments');

  const developments = [
    {
      id: 'dev-1',
      title: 'Jaipur Metro Phase 2 Corridor Expansion',
      locality: 'Tonk Road - Airport - Sitapura',
      impact: '+22% Rental Yield Expected',
      tag: 'INFRASTRUCTURE',
      date: 'Updated March 2026',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop',
      summary: 'Phase 2 connects Sitapura Industrial Area, Jaipur Airport, Tonk Road, and Ambabari, creating high transit-oriented rental demand along south Jaipur.'
    },
    {
      id: 'dev-2',
      title: 'Mahindra World City SEZ Phase 3 IT Expansion',
      locality: 'Ajmer Road Growth Belt',
      impact: '12,000+ New Tech Jobs',
      tag: 'COMMERCIAL HUB',
      date: 'Updated Feb 2026',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
      summary: 'Expansion of Infosys, JCB, and Genpact facilities in Mahindra SEZ has triggered a 15% surge in 2 & 3 BHK apartment purchases along Ajmer Road.'
    },
    {
      id: 'dev-3',
      title: 'Mahal Road Knowledge & Institutional Corridor',
      locality: 'Jagatpura',
      impact: 'Highest Rental Occupancy (94%)',
      tag: 'STUDENT & IT HUB',
      date: 'Updated March 2026',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop',
      summary: 'Proximity to SKIT, Manipal, and Narayana Hospital drives top occupancy for PG hostels and fully furnished rental flats.'
    }
  ];

  const jdaUpdates = [
    {
      id: 'jda-1',
      title: 'Fast-Track JDA Scheme Patta Issuance Portal',
      description: 'Jaipur Development Authority has digitized 90A land conversion and Patta issuance for West Jaipur & Sirsi Road schemes.',
      badge: 'GOVT POLICY',
      benefit: 'Direct online registry & bank loan eligibility'
    },
    {
      id: 'jda-2',
      title: 'RERA Rajasthan Mandatory Escrow Compliance',
      description: 'Strict 70% escrow account compliance enforced for all builder projects across Mansarovar Extension and Gopalpura Bypass.',
      badge: 'BUYER PROTECTION',
      benefit: 'Guaranteed on-time project completion'
    },
    {
      id: 'jda-3',
      title: 'Jaipur Ring Road Township Master Plan 2026',
      description: 'New eco-friendly residential zoning and 100ft sector road layouts declared along Jaipur Ring Road south corridor.',
      badge: 'MASTER PLAN',
      benefit: 'High long-term capital appreciation'
    }
  ];

  const priceIndexData = [
    { locality: 'C-Scheme', avgPrice: '₹11,500 - ₹18,000', unit: 'per sq.ft', change: '+8.2%', rentAvg: '₹45,000/mo', trend: 'up' },
    { locality: 'Vaishali Nagar', avgPrice: '₹6,200 - ₹9,500', unit: 'per sq.ft', change: '+10.5%', rentAvg: '₹18,000/mo', trend: 'up' },
    { locality: 'Malviya Nagar', avgPrice: '₹7,500 - ₹12,000', unit: 'per sq.ft', change: '+9.1%', rentAvg: '₹22,000/mo', trend: 'up' },
    { locality: 'Jagatpura', avgPrice: '₹3,800 - ₹5,800', unit: 'per sq.ft', change: '+12.4%', rentAvg: '₹12,000/mo', trend: 'up' },
    { locality: 'Mansarovar', avgPrice: '₹4,200 - ₹6,500', unit: 'per sq.ft', change: '+7.8%', rentAvg: '₹14,000/mo', trend: 'up' },
    { locality: 'Ajmer Road', avgPrice: '₹3,200 - ₹5,200', unit: 'per sq.ft', change: '+11.0%', rentAvg: '₹15,000/mo', trend: 'up' },
    { locality: 'Bani Park', avgPrice: '₹8,500 - ₹14,000', unit: 'per sq.ft', change: '+6.5%', rentAvg: '₹25,000/mo', trend: 'up' },
    { locality: 'Raja Park', avgPrice: '₹7,200 - ₹11,500', unit: 'per sq.ft', change: '+8.8%', rentAvg: '₹20,000/mo', trend: 'up' },
  ];

  return (
    <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Jaipur Market Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              Jaipur Real Estate Insights
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Trending area developments, JDA project updates, and live market valuation reports specifically for Jaipur homeowners and property buyers.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('developments')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'developments'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Area Developments</span>
            </button>

            <button
              onClick={() => setActiveTab('jda')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'jda'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>JDA & RERA Updates</span>
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'rates'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Locality Rate Index</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AREA DEVELOPMENTS */}
        {activeTab === 'developments' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            {developments.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden hover:border-amber-500/40 transition group flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {item.tag}
                  </span>
                  <span className="absolute bottom-3 left-3 text-xs font-semibold text-slate-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {item.locality}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {item.impact}
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition font-serif">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.date}</span>
                    <button 
                      onClick={() => onSelectLocality?.(item.locality.split(' ')[0])}
                      className="text-amber-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Explore Locality</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: JDA & RERA UPDATES */}
        {activeTab === 'jda' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
            {jdaUpdates.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-950 rounded-2xl p-6 border border-slate-800/80 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20 uppercase">
                      {item.badge}
                    </span>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  
                  <h3 className="font-bold text-base text-white font-serif leading-snug">
                    {item.title}
                  </h3>
                  
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Key Benefit:</strong> {item.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LOCALITY RATE INDEX */}
        {activeTab === 'rates' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800/80 p-5 sm:p-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold">Jaipur Locality Price & Rent Index (Q1 2026)</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Average Capital Growth: +9.2% YoY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {priceIndexData.map((data, idx) => (
                <div 
                  key={idx}
                  onClick={() => onSelectLocality?.(data.locality)}
                  className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white group-hover:text-amber-400 transition">
                      {data.locality}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {data.change}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-300 font-semibold">
                    {data.avgPrice} <span className="text-[10px] text-slate-500 font-normal">{data.unit}</span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Avg Rent: <strong className="text-slate-200">{data.rentAvg}</strong></span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Homeowner & Buyer Action Bar */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Selling or Renting Property in Jaipur?</div>
              <div className="text-xs text-slate-400">Get an instant AI-powered Jaipur property market valuation report & zero brokerage leads.</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onOpenValuation}
              className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
            >
              Free Market Valuation
            </button>
            <button
              onClick={onOpenEMICalculator}
              className="flex-1 sm:flex-initial px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Loan Eligibility Calculator
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
