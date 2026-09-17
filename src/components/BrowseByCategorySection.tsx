import React from 'react';
import { Building2, Home, Briefcase, Users, Compass, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface BrowseByCategorySectionProps {
  onSelectCategory: (tab: 'rent' | 'buy' | 'commercial' | 'pg' | 'plot', subCategory?: string) => void;
}

export const BrowseByCategorySection: React.FC<BrowseByCategorySectionProps> = ({
  onSelectCategory
}) => {
  const categories = [
    {
      id: 'rent',
      title: 'Properties For Rent',
      badge: 'Zero Brokerage',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Find verified apartments, builder floors, and gated society flats with zero brokerage.',
      count: '55,000+ Listings',
      price: 'From ₹10,000/month',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
      sublinks: ['1 BHK Flats', '2 BHK & 3 BHK', 'Furnished Homes', 'Studio Apartments']
    },
    {
      id: 'buy',
      title: 'Properties For Sale',
      badge: 'RERA Approved',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Explore new launch projects, ready-to-move apartments, and luxury villas across top cities.',
      count: '82,000+ Listings',
      price: 'From ₹35 Lakh',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
      sublinks: ['Ready to Move', 'Under Construction', 'Luxury Penthouses', 'Gated Villas']
    },
    {
      id: 'commercial',
      title: 'Commercial & Retail',
      badge: 'High ROI',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description: 'Grade-A IT parks, furnished office spaces, showrooms, and retail shop investments.',
      count: '18,500+ Spaces',
      price: 'From ₹45,000/month',
      icon: Briefcase,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
      sublinks: ['Office Spaces', 'Retail Showrooms', 'Co-Working Desks', 'Warehouses']
    },
    {
      id: 'pg',
      title: 'PG & Co-Living',
      badge: 'Meals & WiFi',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Modern student and working professional co-living with housekeeping and home-style meals.',
      count: '12,400+ Beds',
      price: 'From ₹8,500/month',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
      sublinks: ['Private Rooms', 'Twin Sharing', 'Working Women PG', 'Coliving Hubs']
    },
    {
      id: 'plot',
      title: 'Plots & Gated Land',
      badge: 'Immediate Registration',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      description: 'Freehold residential plots, villa layout developments, and farmland investment properties.',
      count: '9,200+ Plots',
      price: 'From ₹20 Lakh',
      icon: Compass,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop',
      sublinks: ['Gated Communities', 'Corner Plots', 'Highway Facing', 'Farm Land']
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Curated Marketplace
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-serif tracking-tight">
            Browse Properties by Category
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Whether you want to rent a zero-brokerage home, buy a dream villa, or lease a modern tech office.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as any)}
                className="group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Header with Icon and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Sub-links */}
                  <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                    {cat.sublinks.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 group-hover:border-amber-300 transition"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Price and Action */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">{cat.count}</div>
                    <div className="text-sm font-extrabold text-slate-900">{cat.price}</div>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
