import React, { useState, useMemo } from 'react';
import { 
  Map, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Building, 
  ArrowRight, 
  Layers, 
  Compass, 
  TrendingUp, 
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export interface JDAProject {
  id: string;
  name: string;
  scheme: string;
  zoneId: string;
  status: 'Approved' | 'Under Construction' | 'Completed' | 'Proposed';
  category: 'Residential' | 'Commercial' | 'Infrastructure' | 'Institutional';
  reraId?: string;
  approvedDate: string;
  coordinates: { x: number; y: number }; // Percentage offset for pin positioning
  totalArea: string;
  highlights: string[];
  description: string;
}

export interface JDAZone {
  id: string;
  name: string;
  description: string;
  keyAreas: string[];
  officerInCharge: string;
  color: string;
  svgPath: string; // Coordinate simulation path
}

const JDA_ZONES: JDAZone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1 (Vidhyadhar Nagar & Sikar Road)',
    description: 'Northern hub of Jaipur featuring dense planned residential sectors and legacy trade zones.',
    keyAreas: ['Vidhyadhar Nagar', 'Murlipura', 'Sikar Road', 'Chomu Bypass'],
    officerInCharge: 'Sh. Rajesh Sharma (Dy. Commissioner)',
    color: 'fill-sky-500/10 stroke-sky-500 hover:fill-sky-500/20',
    svgPath: 'M 40,30 L 160,30 L 140,90 L 30,80 Z'
  },
  {
    id: 'zone-7',
    name: 'Zone 7 (Vaishali Nagar & Ajmer Road)',
    description: 'Premium Western corridor showcasing rapid luxury developments, flyovers, and modern shopping complexes.',
    keyAreas: ['Vaishali Nagar', 'Ajmer Road', 'Sirsi Road', 'Kanaka Vrindavan'],
    officerInCharge: 'Smt. Pooja Meena (Dy. Commissioner)',
    color: 'fill-emerald-500/10 stroke-emerald-500 hover:fill-emerald-500/20',
    svgPath: 'M 30,80 L 140,90 L 120,160 L 20,140 Z'
  },
  {
    id: 'zone-9',
    name: 'Zone 9 (Jagatpura & Mahal Road)',
    description: 'High-growth South-Eastern tech and premium high-rise hub. Houses prominent hospitals and residential towers.',
    keyAreas: ['Jagatpura', 'Mahal Road', 'NRI Colony', 'Bombay Hospital Road'],
    officerInCharge: 'Sh. Amit Kumar (Dy. Commissioner)',
    color: 'fill-amber-500/10 stroke-amber-500 hover:fill-amber-500/20',
    svgPath: 'M 240,80 L 360,90 L 370,170 L 230,160 Z'
  },
  {
    id: 'zone-11',
    name: 'Zone 11 (Mansarovar & Sanganer)',
    description: 'Central-Southern residential mega-colony. High infrastructure density, Metro access, and educational academies.',
    keyAreas: ['Mansarovar', 'New Sanganer Road', 'Sanganer Town', 'Muhana Mandi'],
    officerInCharge: 'Sh. Vinay Pal (Dy. Commissioner)',
    color: 'fill-indigo-500/10 stroke-indigo-500 hover:fill-indigo-500/20',
    svgPath: 'M 120,160 L 230,160 L 210,240 L 110,230 Z'
  },
  {
    id: 'zone-14',
    name: 'Zone 14 (Vatika Road & Tonk Road)',
    description: 'Rapidly emerging Southern master planned corridor. Massive JDA plotted schemes and integrated farmhouses.',
    keyAreas: ['Vatika Road', 'Tonk Road Corridor', 'Chokhi Dhani Area', 'JDA Saligrampura'],
    officerInCharge: 'Sh. Mahendra Soni (Dy. Commissioner)',
    color: 'fill-rose-500/10 stroke-rose-500 hover:fill-rose-500/20',
    svgPath: 'M 210,240 L 370,170 L 350,280 L 190,270 Z'
  }
];

const JDA_PROJECTS: JDAProject[] = [
  {
    id: 'proj-1',
    name: 'Siddharth Vihar Block A & B',
    scheme: 'Vaishali West Premium Plotted Scheme',
    zoneId: 'zone-7',
    status: 'Approved',
    category: 'Residential',
    reraId: 'RAJ/P/2025/1192',
    approvedDate: 'Oct 14, 2025',
    coordinates: { x: 22, y: 38 },
    totalArea: '14.5 Hectares',
    highlights: ['JDA Approved Patta', '80-Feet wide approach roads', 'Integrated underground sewage system', 'Vastu-compliant park boundaries'],
    description: 'A premium JDA approved plotted scheme situated in Vaishali West near Sirsi Road corridor. Offers modern electricity connections, water pipelines, and lush green common parks.'
  },
  {
    id: 'proj-2',
    name: 'JDA Gokul Nagar Industrial Cum Residential Phase I',
    scheme: 'Sikar Road Logistic Corridor Project',
    zoneId: 'zone-1',
    status: 'Under Construction',
    category: 'Commercial',
    approvedDate: 'Jan 05, 2026',
    coordinates: { x: 28, y: 15 },
    totalArea: '32 Hectares',
    highlights: ['Gated commercial zoning', 'RERA registration pending', '3-Phase electrical sub-station', 'Dedicated loading bays'],
    description: 'Located along Chomu Bypass, Sikar Road. This dual-zoned JDA master plan serves logistics operators and commercial wholesalers with heavy vehicle accessibility.'
  },
  {
    id: 'proj-3',
    name: 'Jagatpura Double Decker Overpass',
    scheme: 'Mahal Road decongestion project',
    zoneId: 'zone-9',
    status: 'Completed',
    category: 'Infrastructure',
    approvedDate: 'May 20, 2025',
    coordinates: { x: 74, y: 35 },
    totalArea: '4.2 Kilometers',
    highlights: ['LED Smart Street Lighting', 'Cycle Tracks', 'Seismic proof piers', 'CCTV automated surveillance'],
    description: 'High speed double-decker flyover connecting Jagatpura railway station and Mahal Road crossing to reduce peak-hour traffic delays.'
  },
  {
    id: 'proj-4',
    name: 'Mahal Residential Enclave Phase IV',
    scheme: 'JDA Jagatpura Sector 24 Scheme',
    zoneId: 'zone-9',
    status: 'Approved',
    category: 'Residential',
    reraId: 'RAJ/P/2026/0248',
    approvedDate: 'Feb 10, 2026',
    coordinates: { x: 80, y: 44 },
    totalArea: '18 Hectares',
    highlights: ['Water harvesting chambers', '24x7 security kiosks', 'Commercial grocery complex zone', 'Dedicated kids playground'],
    description: 'An eco-friendly JDA scheme with 180 planned residential plots. Close proximity to Bombay Hospital and prominent IT campuses.'
  },
  {
    id: 'proj-5',
    name: 'Mansarovar Metro Park Expansion',
    scheme: 'Zone 11 Public Amenities Scheme',
    zoneId: 'zone-11',
    status: 'Under Construction',
    category: 'Institutional',
    approvedDate: 'Nov 12, 2025',
    coordinates: { x: 42, y: 64 },
    totalArea: '8.5 Hectares',
    highlights: ['Open-air amphitheater', 'Jogging tracks with premium tiles', 'Solar power charging benches', 'Fountain plaza'],
    description: 'A master planned open park adjacent to Mansarovar Metro Depot. Funded by JDA to promote recreational outdoor amenities for Jaipur families.'
  },
  {
    id: 'proj-6',
    name: 'Vatika Smart Green Valley',
    scheme: 'JDA Saligrampura Extension',
    zoneId: 'zone-14',
    status: 'Proposed',
    category: 'Residential',
    approvedDate: 'Pending Committee Review',
    coordinates: { x: 68, y: 76 },
    totalArea: '45 Hectares',
    highlights: ['Proposed electric grid', 'Sewer treatment plant site', 'Wide peripheral plantation', 'Primary school reserved plots'],
    description: 'Future mega JDA residential plotted layout on Vatika Road. Currently undergoing zone-change approval and environment clearance audits.'
  },
  {
    id: 'proj-7',
    name: 'Muhana Terminal Commercial Arcade',
    scheme: 'Sanganer Wholesale Market Complex',
    zoneId: 'zone-11',
    status: 'Completed',
    category: 'Commercial',
    approvedDate: 'Jul 15, 2025',
    coordinates: { x: 34, y: 72 },
    totalArea: '9 Hectares',
    highlights: ['Fire-safety sprinkler lines', 'Basement parking for 400 cars', 'High-speed goods lifts', 'JDA registry patta ready'],
    description: 'Ready-to-occupy wholesale commercial shops and storage terminal next to Muhana Mandi, improving farm produce distribution efficiency.'
  }
];

export const JDADevelopmentMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('zone-7');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<JDAProject | null>(JDA_PROJECTS[0]);

  // Handle stats counts dynamically
  const stats = useMemo(() => {
    const zoneProjects = JDA_PROJECTS.filter(p => p.zoneId === selectedZone);
    return {
      total: zoneProjects.length,
      approved: zoneProjects.filter(p => p.status === 'Approved').length,
      underConstruction: zoneProjects.filter(p => p.status === 'Under Construction').length,
      completed: zoneProjects.filter(p => p.status === 'Completed').length,
      proposed: zoneProjects.filter(p => p.status === 'Proposed').length
    };
  }, [selectedZone]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return JDA_PROJECTS.filter(p => {
      const matchZone = p.zoneId === selectedZone;
      const matchCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchStatus = selectedStatus === 'all' || p.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.scheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchZone && matchCategory && matchStatus && matchSearch;
    });
  }, [selectedZone, selectedCategory, selectedStatus, searchQuery]);

  const activeZoneDetails = useMemo(() => {
    return JDA_ZONES.find(z => z.id === selectedZone);
  }, [selectedZone]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Title Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 text-white relative">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Compass className="w-48 h-48 text-amber-500 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
              <Map className="w-3 h-3 text-amber-400" /> JDA GIS Spatial Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
              Jaipur Development Authority Development Map
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Verify sector plans, authorized JDA residential schemes, public parks, flyovers, and land use clearances dynamically across all Jaipur metropolitan zones.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-[10px] font-semibold text-slate-400 uppercase">JDA Master Plan Year</span>
            <span className="text-sm font-black text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-lg border border-amber-500/30">
              2026-2027 Approved
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Side: Dynamic SVG Interactive Map Layout (7 Columns) */}
        <div className="lg:col-span-7 p-6 border-r border-slate-200/60 bg-slate-50 flex flex-col justify-between min-h-[460px] relative">
          
          {/* Zone Selector Pills */}
          <div className="space-y-2 mb-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
              1. Toggle JDA Development Zone
            </span>
            <div className="flex flex-wrap gap-2">
              {JDA_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone.id);
                    // Select first project of new zone
                    const newProj = JDA_PROJECTS.find(p => p.zoneId === zone.id);
                    setSelectedProject(newProj || null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                    selectedZone === zone.id
                      ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    selectedZone === zone.id ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'
                  }`} />
                  <span>{zone.name.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Visual Interactive Map Stage */}
          <div className="relative flex-1 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-inner flex items-center justify-center min-h-[300px] overflow-hidden">
            
            {/* Compass rose */}
            <div className="absolute top-3 right-3 text-slate-300 flex flex-col items-center gap-0.5">
              <Compass className="w-7 h-7" />
              <span className="text-[8px] font-bold">N</span>
            </div>

            {/* Simulated GIS map grid background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-40" />

            {/* Jaipur Metro Line overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
              {/* Pink City Outer walls */}
              <circle cx="200" cy="150" r="15" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
              <text x="200" y="142" fill="#f43f5e" fontSize="6" fontWeight="bold" textAnchor="middle" opacity="0.6">PINK CITY</text>

              {/* Metro East-West corridor */}
              <path d="M 40,160 L 120,160 L 200,150 L 280,110 L 360,110" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5,3" opacity="0.4" />
              {/* NH-8 Ajmer Road highway */}
              <path d="M 20,130 Q 110,130 180,150 L 380,260" fill="none" stroke="#94a3b8" strokeWidth="4" opacity="0.2" />
            </svg>

            {/* JDA Dynamic Zone SVG Regions */}
            <svg className="w-full h-full max-h-[300px] select-none" viewBox="0 0 400 300">
              {JDA_ZONES.map((zone) => (
                <path
                  key={zone.id}
                  d={zone.svgPath}
                  onClick={() => {
                    setSelectedZone(zone.id);
                    const newProj = JDA_PROJECTS.find(p => p.zoneId === zone.id);
                    setSelectedProject(newProj || null);
                  }}
                  className={`transition-all duration-300 cursor-pointer stroke-2 ${zone.color} ${
                    selectedZone === zone.id 
                      ? 'fill-amber-500/25 stroke-amber-500 shadow-md scale-[1.01]' 
                      : 'stroke-slate-400/40'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              ))}
            </svg>

            {/* Interactive Pins on Map (Active list pins) */}
            {JDA_PROJECTS.filter(p => p.zoneId === selectedZone).map((proj) => {
              const isActive = selectedProject?.id === proj.id;
              
              let pinColor = 'bg-amber-500 text-slate-950 border-white';
              if (proj.status === 'Completed') pinColor = 'bg-emerald-500 text-white border-white';
              if (proj.status === 'Under Construction') pinColor = 'bg-blue-500 text-white border-white';
              if (proj.status === 'Proposed') pinColor = 'bg-rose-500 text-white border-white';

              return (
                <button
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  style={{ top: `${proj.coordinates.y}%`, left: `${proj.coordinates.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin flex items-center justify-center p-1.5 rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-125 cursor-pointer ${pinColor} ${
                    isActive ? 'ring-4 ring-amber-400 scale-120' : ''
                  }`}
                  title={proj.name}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  
                  {/* Pin Hover Indicator */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-950 text-white text-[9px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover/pin:opacity-100 transition whitespace-nowrap pointer-events-none z-30 flex flex-col items-center gap-0.5">
                    <span>{proj.name}</span>
                    <span className="text-[8px] text-amber-400 font-medium">({proj.status})</span>
                  </div>
                </button>
              );
            })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 text-white p-2 px-3 rounded-xl shadow-lg text-[9px] font-bold border border-white/15 flex flex-wrap gap-x-4 gap-y-1.5 max-w-xs sm:max-w-md">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Approved Scheme</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Under Construction</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Proposed / Pending</span>
              </div>
            </div>
          </div>

          {/* Interactive Zone Summary Card footer */}
          {activeZoneDetails && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF9F7] border border-[#C5A059]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] font-black tracking-wider text-[#9A7632] uppercase">ACTIVE ZONE PROFILE</span>
                <h3 className="text-sm font-black text-slate-800">{activeZoneDetails.name}</h3>
                <p className="text-[11px] text-slate-600 mt-1 max-w-xl">{activeZoneDetails.description}</p>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-3 sm:pt-0 sm:pl-4 flex-shrink-0 text-left">
                <span className="text-[8px] font-bold text-slate-500 uppercase block">ZONE OFFICER IN CHARGE</span>
                <span className="text-[11px] font-black text-slate-800">{activeZoneDetails.officerInCharge.split(' (')[0]}</span>
                <span className="text-[9px] text-[#9A7632] font-semibold block">{activeZoneDetails.officerInCharge.split(' (')[1]?.replace(')', '') || 'JDA dy. Commissioner'}</span>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Filters & Projects List Manager (5 Columns) */}
        <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-6">
          
          <div className="space-y-4">
            
            {/* Search and Filters panel */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
                2. Filter & Search Approved JDA Projects
              </span>

              {/* Text Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search JDA schemes, land sites, corridors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#C5A059] transition"
                />
              </div>

              {/* Double Category Dropdown Row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Use Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="all">All Uses</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="institutional">Institutional / Park</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[8px] font-black uppercase text-slate-400 block mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="approved">Approved</option>
                    <option value="under construction">In-Progress</option>
                    <option value="completed">Completed</option>
                    <option value="proposed">Proposed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Stats row */}
            <div className="grid grid-cols-4 gap-2 py-1.5">
              <div className="p-2 rounded-xl bg-[#FAF9F7] border border-amber-500/10 text-center">
                <span className="text-base font-black text-[#9A7632] block">{stats.total}</span>
                <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider block">Zone Total</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 text-center">
                <span className="text-base font-black text-emerald-600 block">{stats.completed}</span>
                <span className="text-[7px] text-emerald-700 font-bold uppercase tracking-wider block">Completed</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 text-center">
                <span className="text-base font-black text-blue-600 block">{stats.underConstruction}</span>
                <span className="text-[7px] text-blue-700 font-bold uppercase tracking-wider block">In-Progress</span>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 text-center">
                <span className="text-base font-black text-rose-600 block">{stats.proposed}</span>
                <span className="text-[7px] text-rose-700 font-bold uppercase tracking-wider block">Proposed</span>
              </div>
            </div>

            {/* List of projects of current selected Zone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  3. Select Approved Scheme ({filteredProjects.length})
                </span>
                {filteredProjects.length === 0 && (
                  <span className="text-[8px] font-bold text-red-500 uppercase">No matches found</span>
                )}
              </div>

              <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {filteredProjects.map((proj) => {
                  const isSelected = selectedProject?.id === proj.id;
                  
                  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                  if (proj.status === 'Completed') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  if (proj.status === 'Under Construction') badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                  if (proj.status === 'Proposed') badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';

                  return (
                    <button
                      key={proj.id}
                      type="button"
                      onClick={() => setSelectedProject(proj)}
                      className={`w-full p-2.5 rounded-xl text-left border transition flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FAF9F7] border-[#C5A059] ring-2 ring-[#C5A059]/10' 
                          : 'bg-white border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${
                          isSelected ? 'bg-amber-100 text-[#9A7632]' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Building className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{proj.name}</h4>
                          <p className="text-[9px] text-slate-500 mt-0.5">{proj.scheme}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border uppercase ${badgeColor}`}>
                          {proj.status.replace('Under Construction', 'Active')}
                        </span>
                        <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-[#C5A059]' : 'text-slate-300'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Card: Details of Selected Project */}
          {selectedProject ? (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-xl border border-slate-800 animate-in fade-in duration-300">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[8px] font-black bg-[#9A7632] text-white px-2 py-0.5 rounded uppercase tracking-widest block w-max mb-1">
                    {selectedProject.category} JDA Project
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-white">{selectedProject.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedProject.scheme}</p>
                </div>
                
                <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase flex-shrink-0 ${
                  selectedProject.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  selectedProject.status === 'Under Construction' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  selectedProject.status === 'Proposed' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                  'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {selectedProject.status}
                </span>
              </div>

              <p className="text-[10px] text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                {selectedProject.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/20 p-1.5 px-2 rounded-lg border border-slate-800/40">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">Approved Date</span>
                    <span className="font-bold">{selectedProject.approvedDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950/20 p-1.5 px-2 rounded-lg border border-slate-800/40">
                  <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                  <div>
                    <span className="text-[8px] text-slate-400 block uppercase">Total Land Area</span>
                    <span className="font-bold">{selectedProject.totalArea}</span>
                  </div>
                </div>
              </div>

              {selectedProject.reraId && (
                <div className="flex items-center justify-between text-[9px] bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl text-amber-300">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                    <strong>RERA Approved Project ID</strong>
                  </span>
                  <span className="font-mono bg-slate-950 px-2 py-0.5 rounded font-black">{selectedProject.reraId}</span>
                </div>
              )}

              {/* Bullet highlights list */}
              <div className="space-y-1 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">KEY JDA COMPLIANCE HIGHLIGHTS</span>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] text-slate-300">
                  {selectedProject.highlights.map((high, index) => (
                    <li key={index} className="flex items-center gap-1 leading-snug">
                      <span className="text-[#C5A059]">•</span>
                      <span>{high}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auxiliary Quick Action buttons */}
              <div className="flex gap-2 pt-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => alert(`Redirecting to download JDA Approved Lease Document/Patta for ${selectedProject.name}`)}
                  className="flex-1 py-2 rounded-lg bg-[#C5A059] hover:bg-[#b08b47] text-slate-950 text-center cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download Layout Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.open('https://jda.urban.rajasthan.gov.in', '_blank', 'noreferrer')}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center justify-center gap-1 cursor-pointer transition"
                  title="Verify on JDA Official Portal"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center flex flex-col items-center justify-center gap-2">
              <Info className="w-8 h-8 text-slate-400" />
              <p className="text-xs font-bold text-slate-600">No project selected</p>
              <p className="text-[10px] text-slate-400">Select an approved layout scheme to view complete JDA parameters.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
