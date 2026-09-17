import React, { useState } from 'react';
import { Sparkles, Check, Copy, RefreshCw, Layers, CheckCircle, Flame, Heart, Zap, Info } from 'lucide-react';

interface AIPresentationCopilotProps {
  category: 'house' | 'apartment' | 'villa' | 'office' | 'plot';
  onApply: (title: string, highlights: string) => void;
  city?: string;
  locality?: string;
}

interface TemplatePreset {
  id: string;
  title: string;
  highlights: string;
  tag: string;
}

const TEMPLATE_PRESETS: Record<string, TemplatePreset[]> = {
  apartment: [
    {
      id: 'apt-1',
      title: 'Premium Vastu-Compliant 3 BHK Apartment near Metro Station',
      highlights: '• 100% Vastu compliant East-facing entry\n• Only 2 minutes walking distance from Mansarovar Metro\n• Semi-furnished with designer modular kitchen & wardrobes\n• Dedicated basement parking with EV charging station\n• Excellent cross-ventilation with 3 wide balconies',
      tag: 'Most Popular'
    },
    {
      id: 'apt-2',
      title: 'Ultra Luxury 2 BHK High-Rise Flat with Stunning Skyline View',
      highlights: '• Premium wooden flooring in master bedroom\n• Modern modular kitchen with chimney & piped gas connection\n• High-tech 3-tier security with video door phone\n• Proximity to world-class hospitals & shopping malls\n• Round-the-clock water supply and 100% power backup',
      tag: 'Premium Luxury'
    },
    {
      id: 'apt-3',
      title: 'Affordable Gated 2 BHK Apartment with Modular Amenities',
      highlights: '• Low maintenance society with active community hall\n• Lush green central park with kids play arena\n• Safe and friendly family environment\n• Walking distance to major premium schools\n• Approved from major nationalized banks for home loans',
      tag: 'Best Budget'
    }
  ],
  house: [
    {
      id: 'house-1',
      title: 'Elegant Multi-Story Independent House on Gated Main Road Sector',
      highlights: '• Independent freehold registry with JDA approved lease\n• Ground plus two floors built with premium red stone\n• Large private portico & porch for 2 SUVs\n• Massive underground water storage tank (12,000 Litres)\n• Wide 40-feet front approach road with zero congestion',
      tag: 'Independent'
    },
    {
      id: 'house-2',
      title: 'Modern 3 BHK Independent Duplex with Private Terrace Garden',
      highlights: '• Architect-designed contemporary interior layout\n• Stunning modular kitchen with modern fittings\n• Personal open terrace ideal for evening high-tea & yoga\n• High-safety locks and perimeter security alarms\n• Located in a highly peaceful residential colony',
      tag: 'Family Dream'
    }
  ],
  villa: [
    {
      id: 'villa-1',
      title: 'Magnificent 4 BHK Luxury Gated Duplex Villa with Private Swimming Pool',
      highlights: '• Super ultra-luxury modular finishes & Italian marble flooring\n• Private landscaped green lawns & splash pool\n• Exclusive clubhouse access with gymnasium & indoor sports\n• Fully air-conditioned living spaces and bedrooms\n• Dual modular kitchens with wet/dry separation pantry',
      tag: 'Royal Class'
    },
    {
      id: 'villa-2',
      title: 'Premium Spanish Style 3 BHK Villa in Elite Gated Township',
      highlights: '• Stunning Spanish arches & high-ceiling design aesthetics\n• Gated security with active perimeter CCTV monitoring\n• Dedicated home theater / lounge room on upper deck\n• Abundant continuous natural light & heavy ventilation\n• Strategically located close to Ajmer Road highway',
      tag: 'Exquisite Style'
    }
  ],
  office: [
    {
      id: 'office-1',
      title: 'Grade-A Plug & Play Commercial Office Space in Premier Tech Hub',
      highlights: '• Fully furnished office with 25 workstations & 2 cabins\n• Ready-to-use high speed Wi-Fi infrastructure\n• High-visibility glass facade ideal for brand display\n• Massive continuous high-speed double lift access\n• Dedicated visitor reception desk and pantry',
      tag: 'High ROI'
    },
    {
      id: 'office-2',
      title: 'Prime Road-Facing Retail Showroom Shop with Massive Footfall',
      highlights: '• Strategically situated in highly active market district\n• Grand double-height ceiling for maximum storage\n• Ample outdoor surface parking space for buyers\n• Perfect setup for jewelry, garments, or medical franchise\n• Fully fire-compliant sprinkler systems installed',
      tag: 'Direct Trade'
    }
  ],
  plot: [
    {
      id: 'plot-1',
      title: 'JDA Approved Premium Corner Residential Plot with Double Side Road',
      highlights: '• Dual road accessibility (60 feet and 40 feet wide roads)\n• Fully cleared title with registry & immediate patta ready\n• Highly prime sector ready for fast duplex construction\n• Underground electrical lines & water supply pipelines laid\n• Outstanding high-growth zone with fast value appreciation',
      tag: 'JDA Cleared'
    },
    {
      id: 'plot-2',
      title: 'Affordable Plotted Scheme Plot near Main National Highway Corridor',
      highlights: '• Located inside gated boundary with fully secure main gate\n• Individual water connection pipeline for every plot\n• Only 5 minutes distance from connecting national expressway\n• Green boundary plantation with jogging tracks\n• Seamless documentation assistance with direct registry',
      tag: 'Top Investment'
    }
  ]
};

// Generates simulated smart AI listings based on custom one-liners
function generateAISuggestion(
  oneLiner: string, 
  cat: string, 
  city: string = 'Jaipur', 
  locality: string = 'Vaishali Nagar'
) {
  const normalized = oneLiner.toLowerCase();
  const loc = locality || 'Vaishali Nagar';
  
  // Custom smart keyword parsing
  const isVastu = normalized.includes('vastu') || normalized.includes('facing') || normalized.includes('east');
  const isMetro = normalized.includes('metro') || normalized.includes('station') || normalized.includes('rail');
  const isLuxury = normalized.includes('luxury') || normalized.includes('pool') || normalized.includes('premium') || normalized.includes('villa');
  const isBudget = normalized.includes('cheap') || normalized.includes('budget') || normalized.includes('affordable') || normalized.includes('low');
  const bhkMatch = normalized.match(/(\d)\s*(bhk|bedroom)/i);
  const bhk = bhkMatch ? `${bhkMatch[1]} BHK` : '3 BHK';

  // Generate Titles
  let titles: string[] = [];
  if (cat === 'plot') {
    titles = [
      `JDA Approved ${isVastu ? 'Vastu Compliant' : 'Prime Corner'} Plot in ${loc}, ${city}`,
      `High-Investment Residential Land Plot with Wide Approach Road near ${loc}`,
      `Exclusive Master Planned Plot Scheme with Complete Registry Patta`
    ];
  } else if (cat === 'office') {
    titles = [
      `Grade-A Prime Road-Facing Commercial Space near ${loc}, ${city}`,
      `Fully Furnished Plug & Play Commercial Office with High Visibility`,
      `Ready-to-Move Office Space in Premium Commercial Complex in ${loc}`
    ];
  } else {
    titles = [
      `${isLuxury ? 'Ultra-Luxury' : 'Beautiful'} ${bhk} ${cat === 'villa' ? 'Gated Villa' : 'Modern Apartment'} with Spacious Balcony in ${loc}, ${city}`,
      `${isVastu ? 'Vastu Compliant' : 'Highly Ventilated'} ${bhk} ${cat === 'villa' ? 'Duplex Villa' : 'Premium Flat'} Near ${isMetro ? 'Metro Station' : 'Main Sector Park'}`,
      `Elegant Family-Friendly ${bhk} Home in Gated Community with Modern Amenities`
    ];
  }

  // Generate Highlights
  const bulletPoints = [
    `• Located in highly sought-after, premium block of ${loc}, ${city}`,
    isVastu ? `• 100% Vastu compliant alignment with bright morning sunlight` : `• Beautiful cross-ventilation offering perfect year-round breeze`,
    isMetro ? `• Highly convenient walking distance from the nearest Transit/Metro Hub` : `• Located close to top reputed CBSE schools, hospitals & grocery marts`,
    isLuxury ? `• Upgraded Italian flooring, smart security systems, and private gardens` : `• Semi-furnished layout with modern modular modular kitchen and modular wardrobe setups`,
    isBudget ? `• Extremely affordable pricing with low maintenance charges` : `• Complete JDA clearance & registry documents with direct patta ready`,
    `• Active community spaces, secure compound gates, and dedicated parking spaces`
  ];

  return {
    titles,
    highlights: bulletPoints.slice(0, 5).join('\n')
  };
}

export const AIPresentationCopilot: React.FC<AIPresentationCopilotProps> = ({
  category,
  onApply,
  city = 'Jaipur',
  locality = 'Vaishali Nagar'
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'templates'>('prompt');
  const [oneLiner, setOneLiner] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{ titles: string[]; highlights: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  const presets = TEMPLATE_PRESETS[category] || TEMPLATE_PRESETS['apartment'];

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!oneLiner.trim()) return;

    setIsGenerating(true);
    setAppliedIndex(null);
    
    // Simulate smart AI generation delay for premium feel
    setTimeout(() => {
      const res = generateAISuggestion(oneLiner, category, city, locality);
      setGeneratedResult(res);
      setIsGenerating(false);
    }, 550);
  };

  const handleApplyPreset = (preset: TemplatePreset) => {
    onApply(preset.title, preset.highlights);
  };

  const handleApplyGenerated = (title: string, index: number) => {
    if (!generatedResult) return;
    onApply(title, generatedResult.highlights);
    setAppliedIndex(index);
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-2xl relative overflow-hidden space-y-4">
      {/* Background visual elements */}
      <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
        <Sparkles className="w-32 h-32 text-[#C5A059] animate-pulse" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#9A7632]/20 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
              <span>Navikx Real-Estate AI Copilot</span>
              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">Smart AI</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">Generate high-converting listing title & highlights in 1-click</p>
          </div>
        </div>

        {/* Tab Switchers */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('prompt');
              setAppliedIndex(null);
            }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-[#9A7632] text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>⚡ Enter One-Liner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#9A7632] text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>📚 Readymade Presets</span>
          </button>
        </div>
      </div>

      {activeTab === 'prompt' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
              💡 Ek line me batayein (Describe your property in one sentence):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={oneLiner}
                onChange={(e) => setOneLiner(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="e.g. 3 bhk flat in jagatpura near railway station vastu complaint morning sun..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-800 bg-slate-950/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isGenerating || !oneLiner.trim()}
                className="px-4 py-2 bg-[#9A7632] hover:bg-[#b08b47] disabled:opacity-50 text-white text-xs font-black rounded-xl flex items-center gap-1 transition-all cursor-pointer flex-shrink-0"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>Generate</span>
              </button>
            </div>
            <p className="text-[9px] text-slate-400 leading-tight">
              Type keywords like <strong>BHK count, park-facing, near transit, modular kitchen, luxury, JDA, low price</strong> to customize.
            </p>
          </div>

          {/* Prompt result displaying section */}
          {generatedResult && (
            <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-800 space-y-4.5 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">AI-Generated High-ROI Titles (Choose One)</span>
                <div className="space-y-1.5">
                  {generatedResult.titles.map((titleText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyGenerated(titleText, idx)}
                      className={`w-full p-2 rounded-lg text-left text-xs border transition flex items-center justify-between gap-3 cursor-pointer ${
                        appliedIndex === idx 
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300' 
                          : 'border-slate-800 bg-slate-900 hover:border-[#C5A059] text-slate-200'
                      }`}
                    >
                      <span className="font-bold leading-tight">{titleText}</span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded flex-shrink-0 ${
                        appliedIndex === idx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#9A7632]/20 text-amber-300'
                      }`}>
                        {appliedIndex === idx ? 'Applied ✓' : 'Use Title'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-3.5 space-y-2">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">Generated Key Highlights (Bulleted Description)</span>
                <pre className="text-[11px] text-slate-300 font-sans whitespace-pre-line leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/60 select-all">
                  {generatedResult.highlights}
                </pre>
              </div>

              <div className="text-[10px] text-emerald-400 font-bold bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Choose and click a Title above to instantly populate both the Form Title & Highlights!</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
            📚 Ready-made Professional Presets for {category.toUpperCase()}:
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {presets.map((preset) => (
              <div 
                key={preset.id} 
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] font-black text-[#9A7632] uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {preset.tag}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500">Premium Real-Estate Layout</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-100 leading-snug">{preset.title}</h5>
                  <pre className="text-[10px] text-slate-400 font-sans whitespace-pre-line mt-2 leading-tight">
                    {preset.highlights}
                  </pre>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full py-1.5 bg-slate-900 group-hover:bg-[#9A7632] hover:bg-[#b08b47] text-white text-[10px] font-black rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Apply Readymade Template (फॉर्म में भरें)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
