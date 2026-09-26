import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Home,
  Compass,
  Heart,
  User,
  Mail,
  Search,
  Bell,
  Menu,
  X,
  Bed,
  Bath,
  Square,
  Star,
  MapPin,
  CheckCircle,
  ShieldCheck,
  Building2,
  Key,
  Phone,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  Check,
  ChevronRight,
  HelpCircle,
  Award,
  TrendingUp,
  ExternalLink,
  PlusCircle,
  FileText,
  Clock,
  ShieldAlert,
  Share2,
  Calculator,
  Calendar,
  List,
  Warehouse,
  Factory,
  Briefcase,
  Lock,
  LogIn,
  LogOut,
  Database,
  RefreshCw,
  Sliders,
  CheckCircle2,
  History,
  UserCheck,
  Settings,
  Layers,
  Activity,
  Zap,
  Globe,
  Camera,
  UploadCloud,
  Trash2
} from 'lucide-react';
import { PropertyLeafletMap } from './components/PropertyLeafletMap';
import { CameraCaptureModal, CapturedPhoto } from './components/CameraCaptureModal';
import { DatabaseManagerModal } from './components/DatabaseManagerModal';
import { useAuth } from './context/AuthContext';
import { 
  fetchUserSavedListings, 
  toggleUserSavedListing, 
  isSupabaseConfigured, 
  recordUserActivity, 
  fetchUserActivityHistory,
  savePropertyToSupabase,
  uploadPropertyPhotoToSupabase,
  fetchPropertiesFromSupabase,
  subscribeToPropertiesRealtime,
  createViewingBookingRecord,
  UserActivityRecord 
} from './lib/supabase';

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  priceDisplay: string;
  type: string; // Apartment, Villa, Penthouse, Studio, PG, Office, Commercial, Factory, Godown, Plot
  purpose: 'buy' | 'rent';
  beds: number;
  baths: number;
  area: number; // sqft
  rating: number;
  image: string;
  gallery?: string[];
  description: string;
  featured: boolean;
  reraId?: string;
  possession?: string;
  floor?: string;
  role?: 'family' | 'bachelor' | 'student' | 'working_professional' | 'company_lease' | 'all';
  furnishing?: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Bare Shell' | string;
  deposit?: number;
  coordinates?: { lat: number; lng: number };
}

const mapSupabasePropertyToAppProperty = (property: any): Property => ({
  id: property.id,
  title: property.title,
  location: property.location,
  city: property.city,
  price: Number(property.price || 0),
  priceDisplay: property.priceDisplay || `₹${Number(property.price || 0).toLocaleString('en-IN')}`,
  type: property.category || 'Apartment',
  purpose: property.listingType === 'rent' ? 'rent' : 'buy',
  beds: Number(property.beds || 0),
  baths: Number(property.baths || 0),
  area: Number(property.sqft || 0),
  rating: 4.9,
  image: property.image,
  gallery: property.gallery || [],
  description: property.description || '',
  featured: Boolean(property.featured),
  reraId: property.reraId,
  possession: property.possessionStatus,
  floor: property.floor,
  role: property.role,
  furnishing: property.furnishing,
  deposit: property.deposit == null ? undefined : Number(property.deposit),
  coordinates: property.coordinates
});

const normalizePropertyCategory = (type: string): string => {
  const value = type.toLowerCase();
  if (value.includes('apartment') || value.includes('flat')) return 'apartment';
  if (value.includes('villa')) return 'villa';
  if (value.includes('house')) return 'house';
  if (value.includes('penthouse')) return 'apartment';
  if (value.includes('studio')) return 'apartment';
  if (value.includes('pg') || value.includes('hostel') || value.includes('co-living')) return 'pg';
  if (value.includes('office')) return 'office';
  if (value.includes('commercial') || value.includes('shop') || value.includes('retail')) return 'commercial';
  if (value.includes('factory') || value.includes('industrial')) return 'factory';
  if (value.includes('godown') || value.includes('warehouse') || value.includes('logistics')) return 'godown';
  if (value.includes('plot') || value.includes('land')) return 'plot';
  return 'office';
};

const DEMO_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Grand Vista Luxury Villa with Private Pool',
    location: 'Banjara Hills, Hyderabad',
    city: 'Hyderabad',
    price: 14500000,
    priceDisplay: '₹1.45 Cr',
    type: 'Villa',
    purpose: 'buy',
    beds: 4,
    baths: 5,
    area: 3200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    description: 'An architectural masterpiece featuring double-height ceilings, Italian marble flooring, lush landscaped private garden, and temperature-controlled infinity pool.',
    featured: true,
    reraId: 'RERA-TS-2024-4112',
    possession: 'Ready to Move',
    floor: 'Independent Ground + 2',
    role: 'family'
  },
  {
    id: 'prop-2',
    title: 'Skyline High-Rise Panorama Apartment',
    location: 'Koramangala, Bangalore',
    city: 'Bangalore',
    price: 8500000,
    priceDisplay: '₹85 Lakh',
    type: 'Apartment',
    purpose: 'buy',
    beds: 3,
    baths: 3,
    area: 1750,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
    description: 'Sleek modern 3 BHK apartment in the tech hub of Koramangala. Comes with smart home automation, modular kitchen, and breathtaking sunset views from the 12th floor.',
    featured: true,
    reraId: 'RERA-KA-2024-1902',
    possession: 'Ready to Move',
    floor: '12th of 18 Floors',
    role: 'family'
  },
  {
    id: 'prop-3',
    title: 'Royal Crown Executive Penthouse',
    location: 'DLF Phase 5, Gurgaon',
    city: 'Gurgaon',
    price: 21000000,
    priceDisplay: '₹2.10 Cr',
    type: 'Penthouse',
    purpose: 'buy',
    beds: 4,
    baths: 4,
    area: 2900,
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop',
    description: 'Exclusive top-floor penthouse with private terrace deck, Jacuzzi, private elevator access, and 24/7 concierge service in prime Gurgaon.',
    featured: true,
    reraId: 'RERA-HR-2024-5531',
    possession: 'Ready to Move',
    floor: 'Penthouse (24th)',
    role: 'company_lease'
  },
  {
    id: 'prop-4',
    title: 'Fully Furnished Luxury 2 BHK Rental Suite',
    location: 'Koregaon Park, Pune',
    city: 'Pune',
    price: 35000,
    priceDisplay: '₹35,000 / mo',
    type: 'Apartment',
    purpose: 'rent',
    beds: 2,
    baths: 2,
    area: 1250,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop',
    description: 'Move-in ready rental apartment with premium Scandinavian furniture, high-speed Wi-Fi, modular kitchen, and 24/7 power backup in prime Koregaon Park.',
    featured: true,
    reraId: 'RERA-MH-2024-7721',
    possession: 'Immediate (Lease Ready)',
    floor: '4th of 10 Floors',
    role: 'working_professional'
  },
  {
    id: 'prop-5',
    title: 'Designer Builder Floor for Rent',
    location: 'Vaishali Nagar, Jaipur',
    city: 'Jaipur',
    price: 45000,
    priceDisplay: '₹45,000 / mo',
    type: 'Villa',
    purpose: 'rent',
    beds: 3,
    baths: 3,
    area: 2100,
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    description: 'Spacious independent builder floor with large balconies, wooden flooring, dedicated stilt parking, and peaceful neighborhood.',
    featured: true,
    reraId: 'RERA-RJ-2024-3321',
    possession: 'Immediate (Lease Ready)',
    floor: '2nd of 4 Floors',
    role: 'family'
  },
  {
    id: 'prop-6',
    title: 'Sea-Facing Executive Studio Rental',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    price: 65000,
    priceDisplay: '₹65,000 / mo',
    type: 'Studio',
    purpose: 'rent',
    beds: 1,
    baths: 1,
    area: 680,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
    description: 'Stunning sea-facing studio apartment right on Bandstand promenade. Fully air-conditioned with modern kitchenette and concierge service.',
    featured: true,
    reraId: 'RERA-MH-2024-9988',
    possession: 'Immediate (Lease Ready)',
    floor: '15th of 22 Floors',
    role: 'working_professional'
  },
  {
    id: 'prop-7',
    title: 'Cozy Student PG & Hostel Single Room',
    location: 'Near University Campus, Bangalore',
    city: 'Bangalore',
    price: 5000,
    priceDisplay: '₹5,000 / mo',
    type: 'PG',
    purpose: 'rent',
    beds: 1,
    baths: 1,
    area: 220,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop',
    description: 'Affordable student PG accommodation with high-speed Wi-Fi, 3 meals included, laundry service, and 24/7 security right next to the university zone.',
    featured: false,
    reraId: 'PG-KA-2024-001',
    possession: 'Immediate',
    floor: '2nd Floor',
    role: 'student'
  },
  {
    id: 'prop-8',
    title: 'Affordable Bachelor 1 BHK Co-Living Suite',
    location: 'Hitec City, Hyderabad',
    city: 'Hyderabad',
    price: 12000,
    priceDisplay: '₹12,000 / mo',
    type: 'Apartment',
    purpose: 'rent',
    beds: 1,
    baths: 1,
    area: 600,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    description: 'Semi-furnished 1 BHK apartment tailored for bachelors and tech professionals working in Hitec City. No brokerage, power backup, and easy access to metro.',
    featured: true,
    reraId: 'RERA-TS-2024-8812',
    possession: 'Immediate',
    floor: '3rd Floor',
    role: 'bachelor'
  },
  {
    id: 'prop-9',
    title: 'Student Twin-Sharing PG Room with Meals',
    location: 'Kothrud, Pune',
    city: 'Pune',
    price: 8000,
    priceDisplay: '₹8,000 / mo',
    type: 'PG',
    purpose: 'rent',
    beds: 2,
    baths: 1,
    area: 320,
    rating: 4.65,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop',
    description: 'Well-maintained twin-sharing PG accommodation for college students and interns. Includes study tables, power backup, and housekeeping.',
    featured: false,
    reraId: 'PG-MH-2024-441',
    possession: 'Immediate',
    floor: '1st Floor',
    role: 'student'
  },
  {
    id: 'prop-10',
    title: 'Corporate Guest House / Company Lease Villa',
    location: 'DLF Phase 2, Gurgaon',
    city: 'Gurgaon',
    price: 95000,
    priceDisplay: '₹95,000 / mo',
    type: 'Villa',
    purpose: 'rent',
    beds: 4,
    baths: 4,
    area: 3400,
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    description: 'Premium standalone villa fully licensed and equipped for company lease and executive corporate stay with power backup and security guards.',
    featured: true,
    reraId: 'RERA-HR-2024-9911',
    possession: 'Immediate',
    floor: 'Ground + 1',
    role: 'company_lease',
    furnishing: 'Fully Furnished'
  },
  {
    id: 'prop-11',
    title: 'Plug & Play Grade-A IT Corporate Office (Fully Furnished)',
    location: 'Hitec City, Hyderabad',
    city: 'Hyderabad',
    price: 185000,
    priceDisplay: '₹1.85 Lakh / mo',
    type: 'Office',
    purpose: 'rent',
    beds: 0,
    baths: 4,
    area: 3600,
    rating: 4.95,
    furnishing: 'Fully Furnished',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    description: 'Turnkey fully furnished corporate office suite with 50 ergonomic workstations, 4 executive director cabins, 14-seater boardroom, high-speed leased line, reception lobby, server room, and 100% DG power backup.',
    featured: true,
    reraId: 'RERA-TS-2024-COMM-811',
    possession: 'Immediate (Plug & Play)',
    floor: '6th Floor (Tech Park)',
    role: 'company_lease'
  },
  {
    id: 'prop-12',
    title: 'Modern Glass-Facade Executive Office Space (Semi-Furnished)',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    price: 135000,
    priceDisplay: '₹1.35 Lakh / mo',
    type: 'Office',
    purpose: 'rent',
    beds: 0,
    baths: 3,
    area: 2400,
    rating: 4.88,
    furnishing: 'Semi-Furnished',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop',
    description: 'Semi-furnished corporate office with premium toughened glass cabin partitions, centralized VRF air-conditioning, acoustic modular false ceiling, wet pantry, and 3 reserved basement car parking bays.',
    featured: true,
    reraId: 'RERA-MH-2024-COMM-901',
    possession: 'Immediate Move-In',
    floor: '3rd of 12 Floors',
    role: 'company_lease'
  },
  {
    id: 'prop-13',
    title: 'Prime High-Footfall Commercial Showroom & Retail Space',
    location: 'Vaishali Nagar, Jaipur',
    city: 'Jaipur',
    price: 28000000,
    priceDisplay: '₹2.80 Cr',
    type: 'Commercial',
    purpose: 'buy',
    beds: 0,
    baths: 2,
    area: 3200,
    rating: 4.85,
    furnishing: 'Semi-Furnished',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    description: 'Prominent 50ft main road frontage double-height retail commercial showroom with frameless glass facade, 3-phase commercial electrical sanction, elevator access, and exceptional brand exposure.',
    featured: true,
    reraId: 'RERA-RJ-2024-COMM-332',
    possession: 'Ready to Move',
    floor: 'Ground Floor Frontage',
    role: 'all'
  },
  {
    id: 'prop-14',
    title: 'Heavy Industrial Manufacturing Factory Unit with Crane Gantry',
    location: 'Chomu Bypass, Sikar Road, Jaipur',
    city: 'Jaipur',
    price: 34000000,
    priceDisplay: '₹3.40 Cr',
    type: 'Factory',
    purpose: 'buy',
    beds: 0,
    baths: 4,
    area: 12500,
    rating: 4.82,
    furnishing: 'Bare Shell',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    description: 'Govt-approved industrial factory equipped with 500 KVA transformer sanction, overhead 10-ton EOT crane gantry beams, 35ft ridge height, reinforced RCC floor, staff quarters, and full Fire NOC.',
    featured: true,
    reraId: 'RERA-RJ-2024-IND-552',
    possession: 'Ready to Move',
    floor: 'Industrial Shed + Admin Block',
    role: 'company_lease'
  },
  {
    id: 'prop-15',
    title: 'Grade-A PEB Logistics Godown & Modern Warehouse Facility',
    location: 'Tonk Road, Jaipur',
    city: 'Jaipur',
    price: 95000,
    priceDisplay: '₹95,000 / mo',
    type: 'Godown',
    purpose: 'rent',
    beds: 0,
    baths: 2,
    area: 7800,
    rating: 4.9,
    furnishing: 'Bare Shell',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    description: 'Pre-Engineered Building (PEB) godown & logistics warehouse with 4 hydraulic dock levelers, 30-foot clear stacking height, FM2 laser screed industrial flooring, 24x7 heavy trailer access, and fire sprinkler systems.',
    featured: true,
    reraId: 'RERA-RJ-2024-LOG-102',
    possession: 'Immediate Move-In',
    floor: 'Ground Dock Level',
    role: 'company_lease'
  },
  {
    id: 'prop-16',
    title: 'Corporate Executive Fully Furnished Office Floor',
    location: 'DLF Phase 5, Gurgaon',
    city: 'Gurgaon',
    price: 220000,
    priceDisplay: '₹2.20 Lakh / mo',
    type: 'Office',
    purpose: 'rent',
    beds: 0,
    baths: 3,
    area: 4200,
    rating: 4.93,
    furnishing: 'Fully Furnished',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
    description: 'Fully fitted Grade-A corporate office in prime Cyber City / DLF Phase 5. Complete with 60 workstations, 5 executive cabins, discussion pods, server rack, and modern cafeteria.',
    featured: true,
    reraId: 'RERA-HR-2024-COMM-441',
    possession: 'Immediate (Plug & Play)',
    floor: '9th Floor',
    role: 'company_lease'
  },
  {
    id: 'prop-17',
    title: 'Silicon Hub Fully Furnished Plug & Play Office Suite',
    location: 'Koramangala, Bangalore',
    city: 'Bangalore',
    price: 120000,
    priceDisplay: '₹1.20 Lakh / mo',
    type: 'Office',
    purpose: 'rent',
    beds: 0,
    baths: 3,
    area: 2800,
    rating: 4.91,
    furnishing: 'Fully Furnished',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop',
    description: 'Turnkey fully furnished corporate tech suite in Koramangala. 40 ergonomic desks, 3 director cabins, 12-seater conference room with video conferencing, cafeteria, and 100% DG power backup.',
    featured: true,
    reraId: 'RERA-KA-2024-COMM-772',
    possession: 'Immediate (Plug & Play)',
    floor: '4th Floor (Tech Tower)',
    role: 'company_lease'
  },
  {
    id: 'prop-18',
    title: 'Executive Semi-Furnished IT Office Floor with Acoustic Cabins',
    location: 'Koregaon Park, Pune',
    city: 'Pune',
    price: 75000,
    priceDisplay: '₹75,000 / mo',
    type: 'Office',
    purpose: 'rent',
    beds: 0,
    baths: 2,
    area: 1950,
    rating: 4.87,
    furnishing: 'Semi-Furnished',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
    description: 'Semi-furnished corporate workspace with glass partition cabins, centralized ductable AC, reception area, pantry counter, LED lighting, and 2 dedicated basement car parking spots.',
    featured: true,
    reraId: 'RERA-MH-2024-COMM-612',
    possession: 'Ready to Move',
    floor: '2nd of 7 Floors',
    role: 'company_lease'
  },
  {
    id: 'prop-19',
    title: 'High-Footfall Commercial Double-Height Retail Showroom',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    price: 210000,
    priceDisplay: '₹2.10 Lakh / mo',
    type: 'Commercial',
    purpose: 'rent',
    beds: 0,
    baths: 2,
    area: 2200,
    rating: 4.94,
    furnishing: 'Fully Furnished',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop',
    description: 'Prime Link Road double-height commercial showroom with frameless structural glazing, marble flooring, trial rooms, cashier lounge, and exceptional pedestrian footfall.',
    featured: true,
    reraId: 'RERA-MH-2024-COMM-889',
    possession: 'Immediate Move-In',
    floor: 'Ground + Mezzanine',
    role: 'all'
  },
  {
    id: 'prop-20',
    title: 'Precision Heavy Manufacturing Factory Shed & Plant',
    location: 'Bhosari MIDC, Pune',
    city: 'Pune',
    price: 165000,
    priceDisplay: '₹1.65 Lakh / mo',
    type: 'Factory',
    purpose: 'rent',
    beds: 0,
    baths: 4,
    area: 11000,
    rating: 4.84,
    furnishing: 'Bare Shell',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    description: 'Approved industrial factory unit with 350 KVA industrial power sanction, overhead 5-ton crane rail, heavy trimix flooring, effluent treatment connectivity, and administrative offices.',
    featured: true,
    reraId: 'RERA-MH-2024-IND-302',
    possession: 'Immediate Move-In',
    floor: 'Ground Industrial Shed',
    role: 'company_lease'
  },
  {
    id: 'prop-21',
    title: 'Grade-A PEB Logistics Godown & Modern Fulfillment Center',
    location: 'Bhiwandi, Mumbai',
    city: 'Mumbai',
    price: 140000,
    priceDisplay: '₹1.40 Lakh / mo',
    type: 'Godown',
    purpose: 'rent',
    beds: 0,
    baths: 3,
    area: 9500,
    rating: 4.89,
    furnishing: 'Bare Shell',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    description: 'High-clearance PEB godown & logistics distribution warehouse featuring 5 hydraulic dock levelers, 32ft vertical clearance, laser screed flooring, and wide turning radius for 40ft container trailers.',
    featured: true,
    reraId: 'RERA-MH-2024-LOG-911',
    possession: 'Ready to Move',
    floor: 'Ground Dock Bay',
    role: 'company_lease'
  },
  {
    id: 'prop-22',
    title: 'Plug & Play Boutique Startup Office Space (Fully Furnished)',
    location: 'Vaishali Nagar, Jaipur',
    city: 'Jaipur',
    price: 48000,
    priceDisplay: '₹48,000 / mo',
    type: 'Office',
    purpose: 'rent',
    beds: 0,
    baths: 2,
    area: 1500,
    rating: 4.88,
    furnishing: 'Fully Furnished',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=1200&auto=format&fit=crop',
    description: 'Contemporary boutique office with 20 modular workstations, 2 glass cabins, meeting pod, high-speed optic fiber, pantry, and biometric door access in prime Vaishali Nagar.',
    featured: true,
    reraId: 'RERA-RJ-2024-COMM-514',
    possession: 'Immediate (Plug & Play)',
    floor: '3rd Floor',
    role: 'company_lease'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'rent-properties' | 'saved' | 'profile' | 'contact'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedFurnishing, setSelectedFurnishing] = useState<'All' | 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished'>('All');
  const [selectedPurpose, setSelectedPurpose] = useState<'all' | 'buy' | 'rent'>('all');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [selectedRole, setSelectedRole] = useState<'all' | 'family' | 'bachelor' | 'student' | 'working_professional' | 'company_lease'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'low-to-high' | 'high-to-low'>('default');

  // Properties State (with LocalStorage persistence and auto-merge for demo commercial/industrial properties)
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem('nestify_properties');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((p: any) => p.id));
          const missing = DEMO_PROPERTIES.filter(p => !existingIds.has(p.id));
          if (missing.length > 0) {
            const merged = [...parsed, ...missing];
            localStorage.setItem('nestify_properties', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      }
    } catch {}
    return DEMO_PROPERTIES;
  });

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Post Property Multi-Step Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [postStep, setPostStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Comparison State
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  const comparisonList = useMemo(() => properties.filter(p => compareIds.includes(p.id)), [properties, compareIds]);

  // Supabase Authentication & User Hook
  const {
    user,
    token,
    isAuthenticated,
    isLoading: isAuthLoading,
    isSupabaseActive,
    activityHistory,
    refreshActivityHistory,
    logActivity,
    login,
    register,
    logout,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    switchDemoRole,
    updateUserProfile
  } = useAuth();

  // Modals for Authentication & Profile
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('appsellbuy@gmail.com');
  const [authPassword, setAuthPassword] = useState('password123');
  const [authName, setAuthName] = useState('Alexander Wright');
  const [authPhone, setAuthPhone] = useState('+91 98201 45678');
  const [authRole, setAuthRole] = useState<'user' | 'agent' | 'seller'>('seller');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // User Property Preferences in Supabase
  const [userPreferences, setUserPreferences] = useState({
    preferredCity: 'Mumbai',
    preferredCategory: 'Office',
    preferredFurnishing: 'Fully Furnished',
    budgetRange: '₹50,000 - ₹1,50,000 / mo',
    autoAlerts: true
  });
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);

  const [postForm, setPostForm] = useState({
    title: '',
    location: '',
    city: 'Mumbai',
    price: '',
    purpose: 'buy' as 'buy' | 'rent',
    type: 'Office',
    furnishing: 'Fully Furnished',
    beds: '0',
    baths: '2',
    area: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
    gallery: [] as string[],
    ownerName: '',
    phone: '',
    email: '',
    reraId: 'RERA-MH-2024-COMM-9912',
    possession: 'Ready to Move',
    floor: 'Ground Floor'
  });

  // Saved Property IDs (Synced directly with Supabase Database)
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Load Saved Properties directly from Supabase on user / auth change
  useEffect(() => {
    let isMounted = true;
    const loadSupabaseSaved = async () => {
      if (user?.id) {
        setIsLoadingSaved(true);
        try {
          const supaSaved = await fetchUserSavedListings(user.id);
          if (isMounted) {
            setSavedIds(supaSaved.map(s => s.propertyId));
          }
        } catch (err) {
          console.warn('Supabase saved properties load error:', err);
        } finally {
          if (isMounted) setIsLoadingSaved(false);
        }
      } else if (!isSupabaseActive) {
        // Anonymous guest fallback
        try {
          const guestSaved = localStorage.getItem('nestify_saved_ids');
          setSavedIds(guestSaved ? JSON.parse(guestSaved) : ['prop-1', 'prop-4']);
        } catch {
          setSavedIds(['prop-1', 'prop-4']);
        }
      } else {
        setSavedIds([]);
      }
    };

    loadSupabaseSaved();
    return () => { isMounted = false; };
  }, [user?.id]);

  useEffect(() => {
    if (!isSupabaseActive) return;
    let mounted = true;
    const loadLiveProperties = async () => {
      try {
        const rows = await fetchPropertiesFromSupabase();
        if (mounted) {
          setProperties(rows.map(mapSupabasePropertyToAppProperty));
        }
      } catch (error) {
        console.error('Failed to load live Supabase properties:', error);
      }
    };
    void loadLiveProperties();

    const subscription = subscribeToPropertiesRealtime(
      property => {
        if (!mounted) return;
        setProperties(prev => {
          const next = mapSupabasePropertyToAppProperty(property);
          return [next, ...prev.filter(item => item.id !== next.id)];
        });
      },
      property => {
        if (!mounted) return;
        const next = mapSupabasePropertyToAppProperty(property);
        setProperties(prev => prev.map(item => item.id === next.id ? next : item));
      },
      deletedId => {
        if (!mounted) return;
        setProperties(prev => prev.filter(item => item.id !== deletedId));
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isSupabaseActive]);

  // Modal Detail State & Media Tab
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'virtual_tour' | 'floor_plan' | 'map'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    requirement: 'Rent Property',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Schedule Visit Modal State
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);
  const [visitForm, setVisitForm] = useState({
    name: '',
    phone: '',
    date: '',
    time: '10:00 AM - 11:00 AM',
    type: 'in-person' as 'in-person' | 'video'
  });
  const [visitSubmitted, setVisitSubmitted] = useState(false);
  
  // Toast notification state supporting rich alerts
  interface ActiveToast {
    id: string;
    type: 'info' | 'listing_alert';
    message: string;
    title?: string;
    property?: Property;
  }
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);

  const showToast = (msg: string) => {
    setActiveToast({
      id: String(Date.now()),
      type: 'info',
      message: msg
    });
    setTimeout(() => {
      setActiveToast(prev => (prev?.message === msg ? null : prev));
    }, 3800);
  };

  const showListingAlertToast = (prop: Property) => {
    setActiveToast({
      id: String(Date.now()),
      type: 'listing_alert',
      title: 'New Rental Listing Alert!',
      message: `"${prop.title}" in ${prop.location} just listed for ${prop.priceDisplay} matching your active criteria.`,
      property: prop
    });
    setTimeout(() => {
      setActiveToast(prev => (prev?.property?.id === prop.id ? null : prev));
    }, 8000);
  };

  // 'Remind me of new listings' state for Rental tab
  const [rentalReminderEnabled, setRentalReminderEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('navikx_rental_reminder_enabled') === 'true';
    } catch {
      return false;
    }
  });

  const activeRentalCriteriaSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedCity !== 'All') parts.push(selectedCity);
    if (selectedType !== 'All') parts.push(selectedType);
    if (selectedFurnishing !== 'All') parts.push(selectedFurnishing);
    if (searchQuery.trim()) parts.push(`"${searchQuery.trim()}"`);
    return parts.length > 0 ? parts.join(' • ') : 'All Rental Listings';
  }, [selectedCity, selectedType, selectedFurnishing, searchQuery]);

  const matchesRentalCriteria = (prop: Property) => {
    if (prop.purpose !== 'rent') return false;
    if (selectedCity !== 'All' && prop.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (selectedType !== 'All') {
      const target = selectedType.toLowerCase();
      const pType = (prop.type || '').toLowerCase();
      if (target.includes('office')) {
        if (!pType.includes('office')) return false;
      } else if (target.includes('commercial')) {
        if (!pType.includes('commercial') && !pType.includes('shop')) return false;
      } else if (target.includes('factory')) {
        if (!pType.includes('factory') && !pType.includes('industrial')) return false;
      } else if (target.includes('godown') || target.includes('warehouse')) {
        if (!pType.includes('godown') && !pType.includes('warehouse')) return false;
      } else if (target.includes('plot')) {
        if (!pType.includes('plot')) return false;
      } else if (target.includes('apartment')) {
        if (!pType.includes('apartment') && !pType.includes('flat')) return false;
      } else if (target.includes('villa')) {
        if (!pType.includes('villa') && !pType.includes('house')) return false;
      } else if (!pType.includes(target)) {
        return false;
      }
    }
    if (selectedFurnishing !== 'All') {
      const propFurn = (prop.furnishing || '').toLowerCase();
      const targetFurn = selectedFurnishing.toLowerCase();
      if (targetFurn.includes('full') && !propFurn.includes('full')) return false;
      if (targetFurn.includes('semi') && !propFurn.includes('semi')) return false;
      if (targetFurn.includes('unfurn') && (!propFurn.includes('unfurn') && !propFurn.includes('bare'))) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = prop.title.toLowerCase().includes(q) ||
                    prop.location.toLowerCase().includes(q) ||
                    prop.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  };

  const handleToggleRentalReminder = () => {
    const nextState = !rentalReminderEnabled;
    setRentalReminderEnabled(nextState);
    try {
      localStorage.setItem('navikx_rental_reminder_enabled', String(nextState));
    } catch {}

    if (nextState) {
      showToast(`🔔 'Remind me of new listings' enabled! Watching for: ${activeRentalCriteriaSummary}`);
    } else {
      showToast(`🔕 'Remind me of new listings' turned off.`);
    }
  };

  const simulateNewListingMatch = () => {
    const targetCity = selectedCity !== 'All' ? selectedCity : 'Pune';
    const targetType = selectedType !== 'All' ? selectedType : 'Office';
    const timestamp = Date.now();

    const sampleTitles: Record<string, string> = {
      Apartment: 'Modern High-Rise 2 BHK Rental Suite',
      Villa: 'Independent Luxury 3 BHK Garden Villa',
      Studio: 'Executive Studio Apartment with Smart Amenities',
      Penthouse: 'Skyline Terrace Penthouse with Jacuzzi',
      PG: 'Fully Furnished Premium Co-Living Suite',
      Office: selectedFurnishing === 'Semi-Furnished' 
        ? 'Executive Glass-Facade Modern Office Space (Semi-Furnished)' 
        : 'Plug & Play Turnkey Grade-A IT Corporate Office (Fully Furnished)',
      Commercial: 'High-Footfall Double Height Commercial Retail Space',
      Factory: 'Heavy Industrial Factory with 500 KVA Power & Overhead Crane',
      Godown: 'Grade-A PEB Logistics Godown & Modern Warehouse Facility',
      Plot: 'Prime Commercial / Industrial Approved Plot'
    };

    const sampleLocations: Record<string, string> = {
      Pune: 'Koregaon Park, Pune',
      Jaipur: 'Vaishali Nagar, Jaipur',
      Mumbai: 'Bandra West, Mumbai',
      Bangalore: 'Koramangala, Bangalore',
      Hyderabad: 'Hitec City, Hyderabad',
      Gurgaon: 'DLF Phase 5, Gurgaon'
    };

    const samplePrices: Record<string, number> = {
      Apartment: 38000,
      Villa: 65000,
      Studio: 28000,
      Penthouse: 95000,
      PG: 11000,
      Office: selectedFurnishing === 'Semi-Furnished' ? 85000 : 165000,
      Commercial: 130000,
      Factory: 175000,
      Godown: 98000,
      Plot: 45000
    };

    const title = sampleTitles[targetType] || `Furnished ${targetType} for Rent`;
    const location = sampleLocations[targetCity] || `${targetCity} Central`;
    const price = samplePrices[targetType] || 45000;
    const furnishing = selectedFurnishing !== 'All' 
      ? selectedFurnishing 
      : targetType === 'Office' 
      ? 'Fully Furnished' 
      : targetType === 'Godown' || targetType === 'Factory' 
      ? 'Bare Shell' 
      : 'Semi-Furnished';
    const sampleImage = targetType === 'Office'
      ? (furnishing === 'Semi-Furnished' 
          ? 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop')
      : targetType === 'Commercial'
      ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'
      : targetType === 'Factory'
      ? 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop'
      : targetType === 'Godown'
      ? 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop';

    const newListing: Property = {
      id: `prop-alert-${timestamp}`,
      title: `${title} (Just Listed!)`,
      location,
      city: targetCity,
      price,
      priceDisplay: `₹${price.toLocaleString()} / mo`,
      type: targetType,
      purpose: 'rent',
      beds: targetType === 'Studio' ? 1 : targetType === 'Villa' ? 3 : targetType === 'Office' || targetType === 'Godown' || targetType === 'Factory' ? 0 : 2,
      baths: targetType === 'Studio' ? 1 : targetType === 'Office' || targetType === 'Factory' ? 3 : 2,
      area: targetType === 'Studio' ? 650 : targetType === 'Villa' ? 2200 : targetType === 'Office' ? 3200 : targetType === 'Factory' ? 8500 : targetType === 'Godown' ? 6000 : 1250,
      rating: 4.9,
      furnishing,
      image: sampleImage,
      description: `Brand new verified ${targetType.toLowerCase()} rental listing in ${location}. Features high-speed connectivity, verified commercial/industrial sanctions, and instant move-in lease agreement with zero brokerage.`,
      featured: true,
      reraId: `RERA-RENT-${timestamp.toString().slice(-4)}`,
      possession: 'Immediate Move-In',
      floor: targetType === 'Godown' ? 'Ground Dock' : targetType === 'Office' ? '5th Floor' : '8th Floor',
      role: 'company_lease'
    };

    setProperties(prev => {
      const updated = [newListing, ...prev];
      try {
        localStorage.setItem('nestify_properties', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    showListingAlertToast(newListing);
  };

  const toggleSave = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetProp = properties.find(p => p.id === id);
    const wasSaved = savedIds.includes(id);
    const nextSaved = wasSaved ? savedIds.filter(item => item !== id) : [...savedIds, id];
    setSavedIds(nextSaved);

    if (user?.id && targetProp) {
      try {
        await toggleUserSavedListing(user.id, targetProp);
        showToast(
          wasSaved
            ? `Removed "${targetProp.title}" from Supabase database`
            : `Saved "${targetProp.title}" directly to Supabase cloud database!`
        );
        refreshActivityHistory();
      } catch (err) {
        console.warn('Failed to update Supabase saved listing:', err);
        showToast(wasSaved ? 'Removed from saved properties' : 'Saved to favorites');
      }
    } else {
      try {
        localStorage.setItem('nestify_saved_ids', JSON.stringify(nextSaved));
      } catch {}
      showToast(
        wasSaved
          ? 'Removed from saved properties'
          : 'Saved! Sign in with Supabase to sync across all devices.'
      );
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        await login(authEmail, authPassword);
        showToast(`Welcome back! Authenticated with Supabase database.`);
      } else {
        await register(authName, authEmail, authPassword, authRole, authPhone, userPreferences.preferredCity);
        showToast(`Account created in Supabase database! Welcome, ${authName}.`);
      }
      setShowSignInModal(false);
      closeAuthModal();
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleQuickLogin = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    setAuthSubmitting(true);
    setAuthEmail(email);
    setAuthPassword(pass);
    try {
      await login(email, pass);
      showToast(`Signed in as ${name} (Supabase Connected)`);
      setShowSignInModal(false);
      closeAuthModal();
    } catch (err: any) {
      setAuthError(err?.message || 'Quick login failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      if (user?.id) {
        await logActivity(
          'filter_search',
          `Updated property preferences: ${userPreferences.preferredCity} • ${userPreferences.preferredCategory} • ${userPreferences.preferredFurnishing}`
        );
        await updateUserProfile({
          city: userPreferences.preferredCity
        });
      }
      showToast('Saved property preferences to Supabase database!');
    } catch (err) {
      console.warn('Failed to save preferences to Supabase:', err);
      showToast('Preferences updated locally.');
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const toggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompareIds(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from property comparison');
        return prev.filter(item => item !== id);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 properties at once.');
          return prev;
        }
        showToast('Added to property comparison!');
        return [...prev, id];
      }
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      showToast('Please fill in all required fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      showToast('Please enter a valid email address.');
      return;
    }
    const phoneRegex = /^[0-9+\s()-]{10,15}$/;
    if (!phoneRegex.test(contactForm.phone)) {
      showToast('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    setContactSubmitted(true);
    showToast('Your inquiry has been submitted successfully!');
  };

  const resetContactForm = () => {
    setContactForm({
      name: '',
      email: '',
      phone: '',
      requirement: 'Rent Property',
      message: ''
    });
    setContactSubmitted(false);
  };

  const handlePostPropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.location || !postForm.price || !postForm.ownerName || !postForm.phone) {
      showToast('Please fill in all required property & contact details.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (postForm.email && !emailRegex.test(postForm.email)) {
      showToast('Please enter a valid email address.');
      return;
    }
    const phoneRegex = /^[0-9+\s()-]{10,15}$/;
    if (!phoneRegex.test(postForm.phone)) {
      showToast('Please enter a valid phone number (at least 10 digits).');
      return;
    }
    const numPrice = Number(postForm.price);
    const formattedPrice = postForm.purpose === 'buy' 
      ? (numPrice >= 10000000 ? `₹${(numPrice / 10000000).toFixed(2)} Cr` : `₹${(numPrice / 100000).toFixed(1)} Lakh`)
      : `₹${Number(postForm.price).toLocaleString()} / mo`;

    const finalGallery = postForm.gallery && postForm.gallery.length > 0 
      ? postForm.gallery 
      : [postForm.image];

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: postForm.title,
      location: postForm.location,
      city: postForm.city,
      price: Number(postForm.price),
      priceDisplay: formattedPrice,
      type: postForm.type,
      purpose: postForm.purpose,
      beds: Number(postForm.beds) || 2,
      baths: Number(postForm.baths) || 2,
      area: Number(postForm.area) || 1200,
      rating: 4.9,
      image: postForm.image,
      gallery: finalGallery,
      description: postForm.description || 'Verified property listed with zero brokerage, camera-verified photos, and clear RERA title.',
      featured: true,
      reraId: postForm.reraId,
      possession: postForm.possession,
      floor: postForm.floor,
      furnishing: postForm.furnishing || 'Fully Furnished'
    };

    if (isSupabaseActive && !user?.id) {
      showToast('Please sign in before posting a property.');
      return;
    }

    try {
      const saved = await savePropertyToSupabase({
        id: newProp.id,
        title: newProp.title,
        location: newProp.location,
        city: newProp.city,
        price: newProp.price,
        priceDisplay: newProp.priceDisplay,
        category: normalizePropertyCategory(newProp.type),
        listingType: newProp.purpose,
        beds: newProp.beds,
        baths: newProp.baths,
        sqft: newProp.area,
        carpetArea: newProp.area,
        furnishing: newProp.furnishing,
        image: newProp.image,
        gallery: newProp.gallery,
        description: newProp.description,
        featured: newProp.featured,
        reraId: newProp.reraId,
        possessionStatus: newProp.possession,
        floor: newProp.floor,
        role: newProp.role,
        deposit: newProp.deposit,
        ownerId: user?.id,
        ownerName: postForm.ownerName,
        ownerPhone: postForm.phone,
        verified: true,
        zeroBrokerage: true,
        postedBy: 'Owner',
        status: 'active'
      } as any, user);

      const savedAppProperty = mapSupabasePropertyToAppProperty(saved);
      setProperties(prev => [savedAppProperty, ...prev.filter(item => item.id !== savedAppProperty.id)]);
      try {
        localStorage.setItem('nestify_properties', JSON.stringify([savedAppProperty, ...properties.filter(item => item.id !== savedAppProperty.id)]));
      } catch {}

      if (user?.id) {
        await recordUserActivity(
          user.id,
          'post_property',
          'Listed "' + savedAppProperty.title + '" with ' + finalGallery.length + ' camera photos in Supabase',
          saved as any
        );
        await refreshActivityHistory();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to save listing to Supabase database.');
      return;
    }

    if (rentalReminderEnabled && newProp.purpose === 'rent' && matchesRentalCriteria(newProp)) {
      showListingAlertToast(newProp);
    } else {
      showToast('Property & Camera Photos successfully listed in Supabase database!');
    }
    setShowPostModal(false);
    setCapturedPhotos([]);
    setPostStep(1);
    setPostForm({
      title: '',
      location: '',
      city: 'Mumbai',
      price: '',
      purpose: 'buy',
      type: 'Office',
      furnishing: 'Fully Furnished',
      beds: '0',
      baths: '2',
      area: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      gallery: [],
      ownerName: '',
      phone: '',
      email: '',
      reraId: 'RERA-MH-2024-COMM-9912',
      possession: 'Ready to Move',
      floor: 'Ground Floor'
    });
  };

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    const list = properties.filter(prop => {
      // If activeTab is 'rent-properties', force purpose to rent
      if (activeTab === 'rent-properties' && prop.purpose !== 'rent') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(q);
        const matchesLoc = prop.location.toLowerCase().includes(q);
        const matchesCity = prop.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCity) return false;
      }
      // Purpose (Buy / Rent)
      if (activeTab !== 'rent-properties' && selectedPurpose !== 'all' && prop.purpose !== selectedPurpose) return false;
      // City
      if (selectedCity !== 'All' && prop.city !== selectedCity) return false;
      // Type (support Office, Commercial, Factory, Godown, Plot, Apartment, Villa, PG)
      if (selectedType !== 'All') {
        const targetType = selectedType.toLowerCase();
        const propType = (prop.type || '').toLowerCase();
        if (targetType.includes('office')) {
          if (!propType.includes('office')) return false;
        } else if (targetType.includes('commercial')) {
          if (!propType.includes('commercial') && !propType.includes('shop') && !propType.includes('retail')) return false;
        } else if (targetType.includes('factory')) {
          if (!propType.includes('factory') && !propType.includes('industrial')) return false;
        } else if (targetType.includes('godown') || targetType.includes('warehouse')) {
          if (!propType.includes('godown') && !propType.includes('warehouse') && !propType.includes('logistics')) return false;
        } else if (targetType.includes('plot') || targetType.includes('land')) {
          if (!propType.includes('plot') && !propType.includes('land')) return false;
        } else if (targetType.includes('penthouse')) {
          if (!propType.includes('penthouse')) return false;
        } else if (targetType.includes('studio')) {
          if (!propType.includes('studio')) return false;
        } else if (targetType.includes('pg') || targetType.includes('co-living')) {
          if (!propType.includes('pg') && !propType.includes('hostel') && !propType.includes('co-living')) return false;
        } else if (targetType.includes('apartment') || targetType.includes('flat')) {
          if (!propType.includes('apartment') && !propType.includes('flat')) return false;
        } else if (targetType.includes('villa') || targetType.includes('house')) {
          if (!propType.includes('villa') && !propType.includes('house') && !propType.includes('bungalow')) return false;
        } else if (!propType.includes(targetType)) {
          return false;
        }
      }
      // Furnishing (Fully Furnished, Semi-Furnished, Unfurnished/Bare Shell)
      if (selectedFurnishing !== 'All') {
        const propFurn = (prop.furnishing || '').toLowerCase();
        const targetFurn = selectedFurnishing.toLowerCase();
        if (targetFurn.includes('full') && !propFurn.includes('full')) return false;
        if (targetFurn.includes('semi') && !propFurn.includes('semi')) return false;
        if (targetFurn.includes('unfurn') && (!propFurn.includes('unfurn') && !propFurn.includes('bare'))) return false;
      }
      // Role / Requirement
      if (selectedRole !== 'all' && prop.role && prop.role !== 'all' && prop.role !== selectedRole) return false;
      // Budget
      if (selectedBudget !== 'All') {
        if (selectedBudget === 'Under 15K' && (prop.purpose !== 'rent' || prop.price >= 15000)) return false;
        if (selectedBudget === '15K - 30K' && (prop.purpose !== 'rent' || prop.price < 15000 || prop.price > 30000)) return false;
        if (selectedBudget === '30K - 60K' && (prop.purpose !== 'rent' || prop.price < 30000 || prop.price > 60000)) return false;
        if (selectedBudget === 'Above 60K' && (prop.purpose !== 'rent' || prop.price <= 60000)) return false;
        if (selectedBudget === 'Under 75L' && (prop.purpose !== 'buy' || prop.price >= 7500000)) return false;
        if (selectedBudget === '75L - 1.5Cr' && (prop.purpose !== 'buy' || prop.price < 7500000 || prop.price > 15000000)) return false;
        if (selectedBudget === 'Above 1.5Cr' && (prop.purpose !== 'buy' || prop.price <= 15000000)) return false;
      }

      return true;
    });

    if (sortBy === 'low-to-high') {
      return [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [properties, searchQuery, selectedPurpose, selectedCity, selectedType, selectedFurnishing, selectedRole, selectedBudget, activeTab, sortBy]);

  const savedPropertiesList = useMemo(() => {
    return properties.filter(p => savedIds.includes(p.id));
  }, [properties, savedIds]);

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 text-slate-900 font-sans pb-24 md:pb-12 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {activeToast && (
        <div 
          className={`fixed top-20 right-4 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 flex items-start gap-3.5 ${
            activeToast.type === 'listing_alert'
              ? 'bg-slate-950 text-white border-amber-500/70 ring-2 ring-amber-500/30 shadow-amber-500/10'
              : 'bg-slate-900 text-white border-amber-500/30'
          }`}
        >
          <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
            activeToast.type === 'listing_alert'
              ? 'bg-amber-500 text-slate-950 shadow-md animate-bounce'
              : 'bg-slate-800 text-amber-400'
          }`}>
            {activeToast.type === 'listing_alert' ? <Bell className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>

          <div className="flex-1 min-w-0 pr-1">
            {activeToast.title && (
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 mb-0.5 tracking-wide">
                <span>{activeToast.title}</span>
              </div>
            )}
            <p className="text-xs font-medium text-slate-200 leading-snug">
              {activeToast.message}
            </p>
            {activeToast.property && (
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (activeToast.property) {
                      setSelectedProperty(activeToast.property);
                      setActiveToast(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] transition shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details & Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition -mr-1 -mt-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top App Bar with Dedicated Rent Properties Tab */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 text-lg">
              N
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">Nestify</h1>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Real Estate</span>
            </div>
          </div>

          {/* Header Navigation with Dedicated Rent Properties Tab */}
          <div className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-700">
            <button onClick={() => setActiveTab('home')} className={`hover:text-amber-600 transition ${activeTab === 'home' ? 'text-amber-600 font-bold' : ''}`}>Home</button>
            
            <button 
              onClick={() => { setSelectedPurpose('buy'); setActiveTab('explore'); }} 
              className="hover:text-amber-600 transition flex items-center gap-1 font-semibold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-xl text-xs"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" /> Buy
            </button>

            {/* Dedicated Rent Properties Tab */}
            <button 
              onClick={() => setActiveTab('rent-properties')} 
              className={`hover:text-amber-600 transition flex items-center gap-1 font-semibold px-3 py-1.5 rounded-xl text-xs ${activeTab === 'rent-properties' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Key className="w-3.5 h-3.5 text-amber-600" /> Rent Properties
            </button>

            <button onClick={() => setActiveTab('explore')} className={`hover:text-amber-600 transition ${activeTab === 'explore' ? 'text-amber-600 font-bold' : ''}`}>Explore</button>
            <button onClick={() => setActiveTab('saved')} className={`hover:text-amber-600 transition flex items-center gap-1 ${activeTab === 'saved' ? 'text-amber-600 font-bold' : ''}`}>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Saved ({savedIds.length})
            </button>
            <button 
              onClick={() => setShowDatabaseModal(true)} 
              className="hover:text-emerald-600 transition flex items-center gap-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl text-xs font-bold border border-emerald-200 cursor-pointer"
              title="Open Supabase Database Management & Schema Center"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Database</span>
            </button>
            <button onClick={() => setActiveTab('contact')} className={`hover:text-amber-600 transition ${activeTab === 'contact' ? 'text-amber-600 font-bold' : ''}`}>Contact</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowDatabaseModal(true)}
              className="sm:hidden p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center cursor-pointer"
              title="Supabase Database Center"
            >
              <Database className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowPostModal(true)}
              className="hidden sm:flex px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property</span>
            </button>
            
            {user ? (
              <button 
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition border border-slate-200/80 cursor-pointer"
                title="Supabase Authenticated Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-none text-slate-900 truncate max-w-[110px]">{user.name || 'Account'}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-semibold text-emerald-700 leading-none">Supabase Sync</span>
                  </div>
                </div>
              </button>
            ) : (
              <button 
                onClick={() => { setAuthMode('signin'); setShowSignInModal(true); }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 pt-6">

        {/* ================= HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-14 shadow-2xl flex flex-col justify-center min-h-[420px]">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop" 
                  alt="Hero Luxury Property" 
                  className="w-full h-full object-cover opacity-35 scale-105 transform hover:scale-100 transition duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              </div>

              <div className="relative z-10 max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black tracking-wider uppercase backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> India's Zero-Brokerage Proptech Platform
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight">
                  Discover Verified Homes & Rental Suites
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Explore 100% RERA verified properties, instant digital lease agreements, and side-by-side comparative analysis with zero brokerage fees.
                </p>

                {/* Search Bar in Hero */}
                <div className="bg-white p-2.5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 max-w-xl">
                  <div className="flex items-center gap-2 px-3 py-2 w-full bg-slate-50 rounded-xl">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search city, locality, or apartment title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('explore'); }}
                      className="w-full text-xs font-semibold text-slate-900 bg-transparent outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition shrink-0"
                  >
                    Search Homes
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Category Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: 'Explore All', desc: 'Browse verified listings', icon: Compass, tab: 'explore', purpose: 'all' },
                { title: 'Buy Properties', desc: 'Luxury villas & apartments', icon: Building2, tab: 'explore', purpose: 'buy' },
                { title: 'Rent Properties', desc: 'Move-in ready rentals', icon: Key, tab: 'rent-properties', purpose: 'rent' },
                { title: 'Post Listing', desc: 'Sell or rent out free', icon: PlusCircle, action: () => setShowPostModal(true) },
              ].map((cat, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    if (cat.action) {
                      cat.action();
                    } else {
                      if (cat.purpose) setSelectedPurpose(cat.purpose as any);
                      setActiveTab(cat.tab as any);
                    }
                  }}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition cursor-pointer group space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition">
                    <cat.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition">{cat.title}</h4>
                  <p className="text-[11px] text-slate-500">{cat.desc}</p>
                </div>
              ))}
            </div>

            {/* Featured Properties Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">Featured Verified Properties</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Handpicked RERA-approved properties with exceptional ROI and amenities</p>
                </div>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map(property => (
                  <div 
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                      
                      {/* Save Button */}
                      <button
                        onClick={(e) => toggleSave(property.id, e)}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                          savedIds.includes(property.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${savedIds.includes(property.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Compare Button */}
                      <button
                        onClick={(e) => toggleCompare(property.id, e)}
                        className={`absolute top-3 right-14 px-2.5 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md transition shadow-md flex items-center gap-1 ${
                          compareIds.includes(property.id)
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        {compareIds.includes(property.id) ? 'Comparing' : 'Compare'}
                      </button>

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                        {property.purpose === 'buy' ? <Building2 className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                        <span>For {property.purpose.toUpperCase()}</span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-white">{property.type}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <p className="text-lg font-black text-amber-400">{property.priceDisplay}</p>
                          <p className="text-[11px] text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" /> {property.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition">{property.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{property.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                        {property.type === 'Office' || property.type === 'Commercial' || property.type === 'Factory' || property.type === 'Godown' ? (
                          <>
                            <span className="flex items-center gap-1 text-amber-700 font-bold truncate max-w-[140px]" title={property.furnishing || 'Furnished'}>
                              <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                              <span>{property.furnishing || (property.type === 'Office' ? 'Fully Furnished' : 'Bare Shell')}</span>
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-900">
                              <Square className="w-3.5 h-3.5 text-slate-400" /> {property.area} sqft
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider">
                              {property.type}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-slate-400" /> {property.beds} Beds</span>
                            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-slate-400" /> {property.baths} Baths</span>
                            <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5 text-slate-400" /> {property.area} sqft</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        View Details & Virtual Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ================= DEDICATED RENT PROPERTIES TAB ================= */}
        {activeTab === 'rent-properties' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Rent Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5" /> Dedicated Rental Portal
                </div>
                <h3 className="text-2xl sm:text-4xl font-black font-serif">Verified Rental Homes & Apartments</h3>
                <p className="text-slate-950/80 text-xs sm:text-sm font-medium leading-relaxed">
                  Move-in ready rental properties with zero brokerage options, instant digital lease agreements, and transparent security deposit terms.
                </p>
                <div className="flex items-center gap-4 pt-2 text-xs font-bold text-slate-950">
                  <span className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-xl"><FileText className="w-4 h-4" /> Instant Lease Agreement</span>
                  <span className="flex items-center gap-1 bg-white/40 px-3 py-1.5 rounded-xl"><Clock className="w-4 h-4" /> 24h Move-in Ready</span>
                </div>
              </div>
              <div className="w-full md:w-72 aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-amber-400/30">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop" 
                  alt="Rent Properties" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Filter Bar for Rental Properties */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search rental location or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none font-medium"
                />
              </div>

              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Rental Cities</option>
                <option value="Pune">Pune</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>

              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Property Types</option>
                <option value="Office">🏢 Office Space (Full / Semi-Furnished)</option>
                <option value="Commercial">🏬 Commercial Space & Showroom</option>
                <option value="Factory">🏭 Factory / Industrial Plant</option>
                <option value="Godown">📦 Godown / Warehouse</option>
                <option value="Apartment">🏠 Apartment / Flat</option>
                <option value="Villa">🏡 Villa / Independent House</option>
                <option value="Penthouse">🏙️ Penthouse</option>
                <option value="Studio">🛋️ Studio Apartment</option>
                <option value="Plot">📐 Plot / Land</option>
                <option value="PG">🛏️ PG / Co-Living</option>
              </select>

              <select 
                value={selectedFurnishing} 
                onChange={(e) => setSelectedFurnishing(e.target.value as any)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Furnishings</option>
                <option value="Fully Furnished">✨ Fully Furnished (Office/Home)</option>
                <option value="Semi-Furnished">🛋️ Semi-Furnished</option>
                <option value="Unfurnished">🧱 Unfurnished / Bare Shell</option>
              </select>
            </div>

            {/* Remind Me of New Listings Notification Bar */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              rentalReminderEnabled 
                ? 'bg-amber-500/10 border-amber-500/40 shadow-xs' 
                : 'bg-white border-slate-200/80 shadow-xs'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  rentalReminderEnabled 
                    ? 'bg-amber-500 text-slate-950 shadow-md ring-4 ring-amber-500/20' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <Bell className={`w-5 h-5 ${rentalReminderEnabled ? 'animate-bounce' : ''}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Remind me of new listings
                    </h4>
                    {rentalReminderEnabled && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Alerts Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate sm:whitespace-normal">
                    {rentalReminderEnabled ? (
                      <span>
                        Monitoring: <strong className="text-amber-800 font-semibold">{activeRentalCriteriaSummary}</strong> &bull; Toast alerts will notify you whenever matching rentals arrive.
                      </span>
                    ) : (
                      'Toggle ON to receive instant toast notifications whenever new rental properties match your active filter criteria.'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
                {rentalReminderEnabled && (
                  <button
                    type="button"
                    onClick={simulateNewListingMatch}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    title="Simulate an incoming listing match to trigger toast notification"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Test Match Alert</span>
                  </button>
                )}
                
                {/* Toggle Button / Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={rentalReminderEnabled}
                  onClick={handleToggleRentalReminder}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    rentalReminderEnabled ? 'bg-amber-500' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={rentalReminderEnabled ? 'Click to disable reminders' : 'Click to enable reminders for new listings'}
                >
                  <span className="sr-only">Remind me of new listings</span>
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      rentalReminderEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Showing <strong className="text-slate-900">{filteredProperties.length}</strong> verified rental properties</span>
              {(selectedCity !== 'All' || selectedType !== 'All' || selectedFurnishing !== 'All' || searchQuery) && (
                <button 
                  onClick={() => { setSelectedCity('All'); setSelectedType('All'); setSelectedFurnishing('All'); setSearchQuery(''); }}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Rental Cards Grid */}
            {filteredProperties.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                <p className="text-slate-500 text-sm">No rental properties found matching your criteria.</p>
                <button 
                  onClick={() => { setSelectedCity('All'); setSelectedType('All'); setSelectedFurnishing('All'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <div 
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                      
                      {/* Save Button */}
                      <button
                        onClick={(e) => toggleSave(property.id, e)}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                          savedIds.includes(property.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${savedIds.includes(property.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Compare Button */}
                      <button
                        onClick={(e) => toggleCompare(property.id, e)}
                        className={`absolute top-3 right-14 px-2.5 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md transition shadow-md flex items-center gap-1 ${
                          compareIds.includes(property.id)
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        {compareIds.includes(property.id) ? 'Comparing' : 'Compare'}
                      </button>

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Key className="w-3 h-3" />
                        <span>For RENT</span>
                        <span className="text-slate-950/60">&bull;</span>
                        <span>{property.type}</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <p className="text-lg font-black text-amber-400">{property.priceDisplay}</p>
                          <p className="text-[11px] text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" /> {property.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition">{property.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{property.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                        {property.type === 'Office' || property.type === 'Commercial' || property.type === 'Factory' || property.type === 'Godown' ? (
                          <>
                            <span className="flex items-center gap-1 text-amber-700 font-bold truncate max-w-[140px]" title={property.furnishing || 'Furnished'}>
                              <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                              <span>{property.furnishing || (property.type === 'Office' ? 'Fully Furnished' : 'Bare Shell')}</span>
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-900">
                              <Square className="w-3.5 h-3.5 text-slate-400" /> {property.area} sqft
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider">
                              {property.type}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-slate-400" /> {property.beds} Beds</span>
                            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-slate-400" /> {property.baths} Baths</span>
                            <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5 text-slate-400" /> {property.area} sqft</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        View Details & Virtual Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= EXPLORE PROPERTIES TAB ================= */}
        {activeTab === 'explore' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">Explore Properties</h3>
                <p className="text-xs sm:text-sm text-slate-500">Browse verified properties for Buy and Rent with advanced filters</p>
              </div>

              {/* Buy / Rent Toggle Tabs */}
              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl">
                <button 
                  onClick={() => setSelectedPurpose('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedPurpose === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setSelectedPurpose('buy')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${selectedPurpose === 'buy' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Building2 className="w-3.5 h-3.5" /> Buy
                </button>
                <button 
                  onClick={() => { setSelectedPurpose('rent'); setActiveTab('rent-properties'); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 text-slate-600 hover:text-slate-900`}
                >
                  <Key className="w-3.5 h-3.5" /> Rent Tab
                </button>
              </div>
            </div>

            {/* Role / Requirement Selector Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 rounded-2xl shadow-md text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Select Your Role / Requirement</h4>
                  <p className="text-[11px] text-slate-300">Tailor property recommendations to your specific tenant or buyer profile</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {[
                  { id: 'all', label: 'All Roles' },
                  { id: 'student', label: 'Student (PG/Hostel)' },
                  { id: 'bachelor', label: 'Bachelor (1 BHK/Coliving)' },
                  { id: 'working_professional', label: 'Working Professional' },
                  { id: 'family', label: 'Family' },
                  { id: 'company_lease', label: 'Company Lease' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedRole === r.id
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none font-medium"
                />
              </div>

              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Cities</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Pune">Pune</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Mumbai">Mumbai</option>
              </select>

              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Property Types</option>
                <option value="Office">🏢 Office Space</option>
                <option value="Commercial">🏬 Commercial Space</option>
                <option value="Factory">🏭 Factory / Industrial</option>
                <option value="Godown">📦 Godown / Warehouse</option>
                <option value="Apartment">🏠 Apartment / Flat</option>
                <option value="Villa">🏡 Villa / House</option>
                <option value="Penthouse">🏙️ Penthouse</option>
                <option value="Studio">🛋️ Studio</option>
                <option value="Plot">📐 Plot / Land</option>
                <option value="PG">🛏️ PG / Hostel</option>
              </select>

              <select 
                value={selectedFurnishing} 
                onChange={(e) => setSelectedFurnishing(e.target.value as any)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Furnishings</option>
                <option value="Fully Furnished">✨ Fully Furnished (Office/Home)</option>
                <option value="Semi-Furnished">🛋️ Semi-Furnished</option>
                <option value="Unfurnished">🧱 Unfurnished / Bare Shell</option>
              </select>

              <select 
                value={selectedBudget} 
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Budgets (₹5k - ₹2.5Cr+)</option>
                <option value="Under 15K">Under ₹15,000 / mo</option>
                <option value="15K - 30K">₹15,000 - ₹30,000 / mo</option>
                <option value="30K - 60K">₹30,000 - ₹60,000 / mo</option>
                <option value="Above 60K">Above ₹60,000 / mo</option>
                <option value="Under 75L">Buy: Under ₹75 Lakh</option>
                <option value="75L - 1.5Cr">Buy: ₹75 Lakh - ₹1.5 Cr</option>
                <option value="Above 1.5Cr">Buy: Above ₹1.5 Cr</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="default">Sort by: Default</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Found <strong className="text-slate-900">{filteredProperties.length}</strong> verified properties</span>
              {(selectedCity !== 'All' || selectedType !== 'All' || selectedFurnishing !== 'All' || selectedBudget !== 'All' || selectedPurpose !== 'all' || searchQuery) && (
                <button 
                  onClick={() => { setSelectedCity('All'); setSelectedType('All'); setSelectedFurnishing('All'); setSelectedBudget('All'); setSelectedPurpose('all'); setSearchQuery(''); }}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Property Cards Grid */}
                        {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 my-8">
                <div className="w-12 h-12 mb-4 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                  🔍
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">No Matching Properties Found</h3>
                <p className="text-sm text-slate-400 max-w-md mb-4">
                  Try adjusting your price range, location, or property category to see more available listings.
                </p>
                <button
                  onClick={() => { setSelectedCity('All'); setSelectedType('All'); setSelectedBudget('All'); setSelectedPurpose('all'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-md hover:bg-amber-400 transition-all text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <div 
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                      
                      {/* Save Button */}
                      <button
                        onClick={(e) => toggleSave(property.id, e)}
                        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
                          savedIds.includes(property.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${savedIds.includes(property.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Compare Button */}
                      <button
                        onClick={(e) => toggleCompare(property.id, e)}
                        className={`absolute top-3 right-14 px-2.5 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md transition shadow-md flex items-center gap-1 ${
                          compareIds.includes(property.id)
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        {compareIds.includes(property.id) ? 'Comparing' : 'Compare'}
                      </button>

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                        {property.purpose === 'buy' ? <Building2 className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                        For {property.purpose.toUpperCase()}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <p className="text-lg font-black text-amber-400">{property.priceDisplay}</p>
                          <p className="text-[11px] text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" /> {property.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition">{property.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{property.description}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                        {property.type === 'Office' || property.type === 'Commercial' || property.type === 'Factory' || property.type === 'Godown' ? (
                          <>
                            <span className="flex items-center gap-1 text-amber-800 font-bold truncate max-w-[150px]" title={property.furnishing || 'Furnished'}>
                              {property.type === 'Office' ? <Briefcase className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> : <Building2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
                              <span>{property.furnishing || (property.type === 'Office' ? 'Fully Furnished' : 'Bare Shell')}</span>
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-slate-900">
                              <Square className="w-3.5 h-3.5 text-slate-400" /> {property.area} sqft
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wider">
                              {property.type}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-slate-400" /> {property.beds} Beds</span>
                            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-slate-400" /> {property.baths} Baths</span>
                            <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5 text-slate-400" /> {property.area} sqft</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        View Details & Virtual Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SAVED PROPERTIES TAB ================= */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold font-serif text-slate-900">Saved Properties</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-extrabold border border-rose-200">
                    {savedIds.length} Saved
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Directly synced with Supabase PostgreSQL database table <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-700">saved_properties</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDatabaseModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold cursor-pointer transition"
                  title="Open Supabase Database Manager"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Supabase Database Center</span>
                </button>
                {!user && (
                  <button
                    onClick={() => { setAuthMode('signin'); setShowSignInModal(true); }}
                    className="px-3.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sign In to Sync</span>
                  </button>
                )}
              </div>
            </div>

            {!user && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-950">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-xs font-medium">
                    <strong className="font-bold">Guest Mode:</strong> Sign in with Supabase to securely save your shortlisted properties across all devices and browsers.
                  </p>
                </div>
                <button
                  onClick={() => { setAuthMode('signin'); setShowSignInModal(true); }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl whitespace-nowrap shadow-xs transition"
                >
                  Sign In with Supabase
                </button>
              </div>
            )}

            {savedPropertiesList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto font-bold">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">No saved properties yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any property card to save it directly to your Supabase cloud wishlist.
                </p>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  Explore Properties Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPropertiesList.map(property => (
                  <div 
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                      
                      {/* Save Button */}
                      <button
                        onClick={(e) => toggleSave(property.id, e)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md bg-rose-500 text-white"
                        title="Remove from Supabase saved properties"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      {/* Compare Button */}
                      <button
                        onClick={(e) => toggleCompare(property.id, e)}
                        className={`absolute top-3 right-14 px-2.5 py-1.5 rounded-full text-[10px] font-bold backdrop-blur-md transition shadow-md flex items-center gap-1 ${
                          compareIds.includes(property.id)
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-white/90 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        {compareIds.includes(property.id) ? 'Comparing' : 'Compare'}
                      </button>

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/90 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                        <Database className="w-3 h-3 text-emerald-400" />
                        <span>Supabase Synced</span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <p className="text-lg font-black text-amber-400">{property.priceDisplay}</p>
                          <p className="text-[11px] text-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" /> {property.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{property.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{property.description}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProperty(property);
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        View Details & Virtual Tour
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= PROFILE TAB ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
            {user ? (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-md shadow-amber-500/20">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900">{user.name || 'User Account'}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            {user.role?.toUpperCase() || 'MEMBER'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email} • {user.phone || '+91 98201 45678'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                            <Database className="w-3 h-3 text-emerald-600" /> UID: {user.id.slice(0, 14)}...
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Zap className="w-3 h-3 text-emerald-600" /> Supabase Real-time Sync Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          logout();
                          showToast('Signed out of Supabase successfully.');
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>

                  {/* Supabase Database Storage Metrics */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-amber-600" /> Supabase Database Persistence
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div 
                        onClick={() => setActiveTab('saved')}
                        className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 transition cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 font-medium">Saved Properties</p>
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        </div>
                        <p className="text-xl font-black text-slate-900">{savedIds.length}</p>
                        <p className="text-[10px] text-slate-400">Stored in <code className="font-mono text-slate-600">saved_properties</code> table</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 font-medium">Database Status</p>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-sm font-bold text-emerald-700">Connected</p>
                        <p className="text-[10px] text-slate-400">PostgreSQL Cloud DB</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500 font-medium">Activity Logs</p>
                          <History className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="text-xl font-black text-slate-900">{activityHistory.length || 4}</p>
                        <p className="text-[10px] text-slate-400">Audit trail in <code className="font-mono text-slate-600">activity_history</code></p>
                      </div>
                    </div>
                  </div>

                  {/* Property Preferences Form */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Custom Property Preferences</h4>
                        <p className="text-xs text-slate-500">Configure your investment and tenant preferences to persist in Supabase</p>
                      </div>
                      <button
                        onClick={handleSavePreferences}
                        disabled={isSavingPreferences}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingPreferences ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        <span>Save to Supabase</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Preferred Location / City</label>
                        <select
                          value={userPreferences.preferredCity}
                          onChange={(e) => setUserPreferences({ ...userPreferences, preferredCity: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 outline-none"
                        >
                          <option value="Mumbai">Mumbai (BKC, Bandra, Andheri)</option>
                          <option value="Bangalore">Bangalore (Koramangala, Indiranagar, Whitefield)</option>
                          <option value="Pune">Pune (Hinjewadi, Viman Nagar, Kharadi)</option>
                          <option value="Jaipur">Jaipur (Vaishali Nagar, Mansarovar, Malviya Nagar)</option>
                          <option value="Hyderabad">Hyderabad (Hitec City, Banjara Hills)</option>
                          <option value="Delhi NCR">Delhi NCR (Gurgaon Cyber Hub, Noida)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Preferred Category</label>
                        <select
                          value={userPreferences.preferredCategory}
                          onChange={(e) => setUserPreferences({ ...userPreferences, preferredCategory: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 outline-none"
                        >
                          <option value="Office">Office Space (Plug & Play / Bare Shell)</option>
                          <option value="Commercial">Commercial Shop / Retail Showroom</option>
                          <option value="Factory">Factory / Industrial Shed</option>
                          <option value="Godown">Godown / Warehouse Logistics Hub</option>
                          <option value="Apartment">Luxury Apartment / High-Rise Flat</option>
                          <option value="Villa">Independent Villa / Bungalow</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Furnishing Preference</label>
                        <select
                          value={userPreferences.preferredFurnishing}
                          onChange={(e) => setUserPreferences({ ...userPreferences, preferredFurnishing: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 outline-none"
                        >
                          <option value="Fully Furnished">Fully Furnished (Turnkey Ready)</option>
                          <option value="Semi-Furnished">Semi-Furnished (Partially Fitted)</option>
                          <option value="Unfurnished">Unfurnished / Raw Shell</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Monthly Budget Range</label>
                        <select
                          value={userPreferences.budgetRange}
                          onChange={(e) => setUserPreferences({ ...userPreferences, budgetRange: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 outline-none"
                        >
                          <option value="₹25,000 - ₹50,000 / mo">₹25,000 - ₹50,000 / mo</option>
                          <option value="₹50,000 - ₹1,50,000 / mo">₹50,000 - ₹1,50,000 / mo</option>
                          <option value="₹1,50,000 - ₹5,00,000 / mo">₹1,50,000 - ₹5,00,000 / mo</option>
                          <option value="₹5,00,000+ / mo">₹5,00,000+ / mo (Commercial / Industrial)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Switch Demo Role Quick Buttons */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Account Role</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => switchDemoRole('seller')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          user.role === 'seller' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Seller Profile
                      </button>
                      <button
                        onClick={() => switchDemoRole('user')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          user.role === 'user' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Buyer / Tenant
                      </button>
                      <button
                        onClick={() => switchDemoRole('agent')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          user.role === 'agent' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Verified Agent
                      </button>
                      <button
                        onClick={() => switchDemoRole('admin')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          user.role === 'admin' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Admin Portal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Supabase Activity Logs */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-amber-600" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">Recent Supabase Activity Log</h4>
                        <p className="text-xs text-slate-500">Real-time audit trail stored in Supabase PostgreSQL</p>
                      </div>
                    </div>
                    <button
                      onClick={refreshActivityHistory}
                      className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
                      title="Refresh activity logs"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {activityHistory.slice(0, 6).map((item, idx) => (
                      <div key={item.id || idx} className="py-3 flex items-start justify-between gap-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0 mt-0.5">
                            {item.action === 'save_property' ? (
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            ) : item.action === 'remove_saved' ? (
                              <Heart className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <Activity className="w-3.5 h-3.5 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{item.title}</p>
                            {item.details && <p className="text-slate-500 text-[11px] mt-0.5">{item.details}</p>}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Signed Out State in Profile Tab */
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-serif text-slate-900">Sign In to Your Supabase Profile</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    Connect your account to securely store saved properties in PostgreSQL, receive automated property match alerts, and schedule zero-brokerage site tours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <p className="text-xs font-bold text-slate-900">Cloud Wishlist</p>
                    <p className="text-[11px] text-slate-500">Stored in Supabase database</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <Bell className="w-4 h-4 text-amber-600" />
                    <p className="text-xs font-bold text-slate-900">Realtime Alerts</p>
                    <p className="text-[11px] text-slate-500">Instant rental match notices</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <p className="text-xs font-bold text-slate-900">RERA Verified</p>
                    <p className="text-[11px] text-slate-500">100% Secure authentication</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setAuthMode('signin'); setShowSignInModal(true); }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-amber-400" />
                    <span>Sign In to Account</span>
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setShowSignInModal(true); }}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= CONTACT TAB ================= */}
        {activeTab === 'contact' && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-bold font-serif text-slate-900">Contact Support & Site Visits</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Our real estate advisors are available 24/7 to assist you</p>
              </div>

              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">Inquiry Received Successfully!</h4>
                  <p className="text-xs text-emerald-700">An expert advisor will call you within 15 minutes to schedule your site visit.</p>
                  <button 
                    onClick={resetContactForm}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email Address *</label>
                      <input 
                        type="email"
                        placeholder="priya@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input 
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Requirement</label>
                    <select 
                      value={contactForm.requirement}
                      onChange={(e) => setContactForm({ ...contactForm, requirement: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value="Buy Property">Buy Property / Villa</option>
                      <option value="Rent Property">Rent Apartment / Suite</option>
                      <option value="Schedule Site Visit">Schedule Site Visit</option>
                      <option value="List Property">List Property for Free</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Message / Preferred Time</label>
                    <textarea 
                      rows={3}
                      placeholder="Let us know any specific questions or preferred site visit times..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ================= COMPARE FLOATING DRAWER ================= */}
      {comparisonList.length > 0 && !showCompareModal && !showComparisonModal && (
        <div className="fixed bottom-16 md:bottom-6 left-3 right-3 sm:left-6 sm:right-6 max-w-4xl mx-auto z-40 bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-amber-500/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-1 max-w-[calc(100%-140px)] sm:max-w-none scrollbar-none">
            <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-xl text-xs font-black shrink-0 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{comparisonList.length}/4</span>
              <span className="hidden sm:inline">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              {comparisonList.map(prop => (
                <div key={prop.id} className="flex items-center gap-2 bg-slate-800/90 px-2.5 py-1.5 rounded-xl border border-slate-700/80 shrink-0 shadow-sm">
                  <img src={prop.image} alt={prop.title} className="w-7 h-7 rounded-lg object-cover" />
                  <span className="text-xs font-semibold max-w-[95px] sm:max-w-[130px] truncate">{prop.title}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleCompare(prop.id); }} 
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full transition"
                    title="Remove from comparison"
                    aria-label="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCompareIds([])}
              className="text-xs font-medium text-slate-400 hover:text-rose-400 px-2 py-1 transition hidden sm:block"
            >
              Clear
            </button>
            <button 
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= PROPERTY COMPARISON MODAL ================= */}
      {(showCompareModal || showComparisonModal) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-6xl w-full h-[94vh] sm:h-[90vh] shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-serif leading-tight">Property Side-by-Side Comparison</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Comparing {comparisonList.length} of 4 properties with pinned headers & complete specifications
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {comparisonList.length > 0 && (
                  <button
                    onClick={() => setCompareIds([])}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition hidden sm:inline-block"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={() => { setShowCompareModal(false); setShowComparisonModal(false); }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition shadow-sm"
                  aria-label="Close Comparison"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile / Screen Horizontal Scroll Indicator */}
            {comparisonList.length > 0 && (
              <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-transparent border-b border-amber-200/50 flex items-center justify-between text-xs text-amber-950 shrink-0">
                <div className="flex items-center gap-2 font-medium">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span className="text-[11px] sm:text-xs">
                    <strong className="font-semibold">Horizontal Comparison:</strong> Swipe or scroll horizontally to inspect columns side-by-side.
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200/60 shrink-0">
                  <span>← Swipe Columns →</span>
                </div>
              </div>
            )}

            {/* Modal Body / Table Container */}
            {comparisonList.length === 0 ? (
              <div className="p-8 sm:p-12 text-center my-auto flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">No Properties Selected for Comparison</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                  Click the "Compare" button on any property card across the app to add up to 4 properties and compare prices, areas, amenities, and role suitability side-by-side.
                </p>
                <button
                  onClick={() => {
                    setShowCompareModal(false);
                    setShowComparisonModal(false);
                    setActiveTab('explore');
                  }}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
                >
                  Explore Properties Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto flex-1 relative overscroll-contain select-text">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {/* Top-Left Corner: Features Header (Sticky Top and Sticky Left) */}
                      <th className="sticky top-0 left-0 z-30 bg-slate-900 text-white p-3.5 sm:p-4 text-xs font-extrabold uppercase tracking-wider border-b-2 border-r border-slate-800 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_2px_5px_rgba(0,0,0,0.15)]">
                        <div className="flex flex-col gap-1">
                          <span className="text-amber-400">Specifications</span>
                          <span className="text-[10px] text-slate-400 font-normal normal-case">
                            {comparisonList.length} of 4 Properties
                          </span>
                        </div>
                      </th>

                      {/* Property Column Headers (Sticky Top) */}
                      {comparisonList.map(prop => (
                        <th
                          key={prop.id}
                          className="sticky top-0 z-20 bg-white p-3.5 sm:p-4 align-top border-b-2 border-r border-slate-200 shadow-sm w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px]"
                        >
                          <div className="space-y-2">
                            {/* Property Image & Thumbnail Badges */}
                            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 relative shadow-sm group">
                              <img
                                src={prop.image}
                                alt={prop.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/85 backdrop-blur-sm text-white text-[10px] font-bold rounded-md shadow">
                                {prop.purpose === 'rent' ? 'For Rent' : prop.type === 'PG' ? 'PG / Hostel' : 'For Sale'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCompare(prop.id);
                                }}
                                className="absolute top-2 right-2 w-7 h-7 bg-slate-900/85 hover:bg-rose-600 text-white rounded-full flex items-center justify-center text-xs transition shadow-md"
                                title="Remove from comparison"
                                aria-label="Remove property"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Title & Location */}
                            <div className="space-y-0.5">
                              <h4
                                className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-tight h-8 sm:h-9"
                                title={prop.title}
                              >
                                {prop.title}
                              </h4>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                <span className="truncate">{prop.location}, {prop.city}</span>
                              </div>
                            </div>

                            {/* Price / Rate Display */}
                            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                              <div>
                                <span className="text-sm sm:text-base font-black text-amber-600">
                                  {prop.priceDisplay || `₹${prop.price.toLocaleString()}`}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">
                                ₹{Math.round(prop.price / (prop.area || 1000)).toLocaleString()}/sqft
                              </span>
                            </div>

                            {/* Quick Action Buttons inside Sticky Header */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                onClick={() => setSelectedProperty(prop)}
                                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-[11px] font-bold transition text-center truncate shadow-sm"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setVisitProperty(prop);
                                  setShowVisitModal(true);
                                }}
                                className="py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[11px] font-black transition text-center truncate shadow-sm"
                              >
                                Book Tour
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {/* Row 1: Price / Monthly Rent */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Price / Monthly Rent
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <span className="text-xs sm:text-sm font-black text-slate-900">{prop.priceDisplay || `₹${prop.price.toLocaleString()}`}</span>
                          {prop.purpose === 'rent' && <span className="text-[10px] text-slate-500 font-medium ml-1">/ month</span>}
                        </td>
                      ))}
                    </tr>

                    {/* Row 2: Price per sqft */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Price per Sq. Ft.
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 font-bold border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          ₹{Math.round(prop.price / (prop.area || 1000)).toLocaleString()} / sqft
                        </td>
                      ))}
                    </tr>

                    {/* Row 3: Security Deposit */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Security Deposit
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          {prop.purpose === 'rent' || prop.type === 'PG' ? (
                            <span className="font-semibold text-slate-900">
                              ₹{(prop.deposit || prop.price * 2).toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">(2 Months Rent)</span>
                            </span>
                          ) : (
                            <span className="text-slate-600">10% - 20% Initial Booking Token</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Row 4: Maintenance Charges */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Maintenance Charges
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          {prop.purpose === 'rent' || prop.type === 'PG' ? (
                            <span>₹{Math.max(1200, Math.round((prop.area || 1000) * 2.5)).toLocaleString()} / month</span>
                          ) : (
                            <span>₹{Math.round((prop.area || 1000) * 3.5).toLocaleString()} / month (Society dues)</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Row 5: Role Suitability */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Role Suitability
                      </td>
                      {comparisonList.map(prop => {
                        const role = prop.role;
                        let badge = (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            ✨ Open For All
                          </span>
                        );
                        if (role === 'family') {
                          badge = (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              👨‍👩‍👧 Family Friendly
                            </span>
                          );
                        } else if (role === 'bachelor') {
                          badge = (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              🧑 Bachelors Welcome
                            </span>
                          );
                        } else if (role === 'student') {
                          badge = (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                              🎓 Students / Interns
                            </span>
                          );
                        } else if (role === 'working_professional') {
                          badge = (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                              💼 Working Professionals
                            </span>
                          );
                        } else if (role === 'company_lease') {
                          badge = (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                              🏢 Corporate / Company
                            </span>
                          );
                        }
                        return (
                          <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                            {badge}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 6: Property Type & Purpose */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Purpose & Type
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <span className="font-bold text-slate-900">{prop.type}</span>
                          <span className="text-slate-400 mx-1.5">•</span>
                          <span className="capitalize font-medium text-slate-600">
                            {prop.purpose === 'rent' ? 'Rental Property' : prop.type === 'PG' ? 'Co-Living / PG' : 'Outright Sale'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 7: Bedrooms & Baths */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Bedrooms & Baths
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <span className="inline-flex items-center gap-1">
                              <Bed className="w-3.5 h-3.5 text-amber-600" /> {prop.beds} {prop.beds === 1 ? 'Bed' : 'Beds'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Bath className="w-3.5 h-3.5 text-amber-600" /> {prop.baths} {prop.baths === 1 ? 'Bath' : 'Baths'}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 8: Area */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Total Area
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <p className="font-extrabold text-slate-900">{prop.area} sqft</p>
                          <p className="text-[10px] text-slate-400 font-medium">Carpet Area: ~{Math.round(prop.area * 0.82)} sqft</p>
                        </td>
                      ))}
                    </tr>

                    {/* Row 9: Possession Status */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Possession Status
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            {prop.possession || 'Ready to Move'}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 10: Location / City */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Location / City
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <p className="font-semibold text-slate-900">{prop.location}</p>
                          <p className="text-[11px] text-slate-500">{prop.city}</p>
                        </td>
                      ))}
                    </tr>

                    {/* Row 11: Floor Number */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Floor Level
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 font-medium border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          {prop.floor || '5th of 16 Floors'}
                        </td>
                      ))}
                    </tr>

                    {/* Row 12: Facing Direction */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Facing & Vastu
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          {prop.type === 'PG' ? 'East-North Cross Ventilation' : 'East Facing (Vastu Compliant)'}
                        </td>
                      ))}
                    </tr>

                    {/* Row 13: Furnishing */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Furnishing Status
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          {prop.type === 'PG' ? (
                            <span className="font-semibold text-slate-900">Fully Furnished (Bed, Desk & Wardrobe)</span>
                          ) : prop.type === 'Studio' ? (
                            <span className="font-semibold text-slate-900">Fully Furnished Designer Suite</span>
                          ) : prop.purpose === 'rent' ? (
                            <span>Semi-Furnished (Modular Kitchen & Storage)</span>
                          ) : (
                            <span>Unfurnished / Raw Construction</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Row 14: RERA Registration */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        RERA Registration
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold font-mono text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{prop.reraId || 'RERA-MH-2024-8891'}</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 15: Rating & Reviews */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Rating & Reviews
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <div className="flex items-center gap-1 font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{prop.rating} / 5.0</span>
                            <span className="text-[10px] text-slate-400 font-normal">({Math.round(prop.rating * 12 + 10)} reviews)</span>
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Row 16: Brokerage */}
                    <tr className="hover:bg-amber-50/10 bg-slate-50/30">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Brokerage Fee
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 text-xs text-slate-800 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <Check className="w-3.5 h-3.5" /> Zero Brokerage Direct
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Row 17: Key Amenities */}
                    <tr className="hover:bg-amber-50/10">
                      <td className="sticky left-0 z-10 bg-slate-50/95 backdrop-blur-sm p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Key Amenities
                      </td>
                      {comparisonList.map(prop => {
                        const amenitiesList = [
                          '24/7 Security',
                          'Power Backup',
                          prop.type === 'PG' ? 'High-Speed Wi-Fi' : 'Covered Parking',
                          prop.type === 'PG' ? 'Housekeeping & Meals' : 'Elevator',
                          prop.beds >= 3 ? 'Swimming Pool & Gym' : 'Water Softener'
                        ];
                        return (
                          <td key={prop.id} className="p-3 sm:p-3.5 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                            <div className="flex flex-wrap gap-1">
                              {amenitiesList.map((am, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-semibold">
                                  {am}
                                </span>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Row 18: Direct Actions */}
                    <tr className="bg-slate-50/50">
                      <td className="sticky left-0 z-10 bg-slate-100 p-3 sm:p-3.5 font-bold text-slate-700 text-xs border-b border-r border-slate-200 w-36 min-w-[135px] sm:w-52 sm:min-w-[190px] shadow-[2px_0_4px_rgba(0,0,0,0.04)]">
                        Take Action
                      </td>
                      {comparisonList.map(prop => (
                        <td key={prop.id} className="p-3 sm:p-3.5 border-b border-r border-slate-100 align-middle w-64 min-w-[245px] sm:w-72 sm:min-w-[280px] max-w-[285px] bg-white">
                          <div className="flex flex-col sm:flex-row gap-1.5">
                            <button
                              onClick={() => setSelectedProperty(prop)}
                              className="flex-1 py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition text-center shadow-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setVisitProperty(prop);
                                setShowVisitModal(true);
                              }}
                              className="flex-1 py-2 px-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition text-center shadow-sm"
                            >
                              Book Tour
                            </button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {comparisonList.length > 0 && (
                  <button 
                    onClick={() => setCompareIds([])}
                    className="px-3 sm:px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    Clear All Comparisons
                  </button>
                )}
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {comparisonList.length < 4 ? `You can add ${4 - comparisonList.length} more properties to compare` : 'Maximum 4 properties reached'}
                </span>
              </div>
              <button 
                onClick={() => { setShowCompareModal(false); setShowComparisonModal(false); }}
                className="px-5 sm:px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-md"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= POST PROPERTY MULTI-STEP MODAL ================= */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 my-8">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-serif">Post Property / List Rental</h3>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Step {postStep} of 4</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPostModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePostPropertySubmit} className="p-6 space-y-5">
              {postStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Basic Property Details</h4>
                  
                  <div className="space-y-1 relative">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <List className="w-3.5 h-3.5 text-amber-600" />
                      Property Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Search for a property..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500 bg-white"
                      required
                    />
                    {showDropdown && searchTerm && (
                      <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto">
                        {properties
                          .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map(p => (
                            <div
                              key={p.id}
                              className="px-3.5 py-2 text-xs hover:bg-slate-100 cursor-pointer"
                              onClick={() => {
                                setPostForm({
                                  ...postForm,
                                  title: p.title,
                                  location: p.location,
                                  city: p.city,
                                  price: p.price.toString(),
                                  type: p.type,
                                  beds: p.beds.toString(),
                                  baths: p.baths.toString(),
                                  area: p.area.toString()
                                });
                                setSearchTerm(p.title);
                                setShowDropdown(false);
                              }}
                            >
                              {p.title}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">City *</label>
                      <select 
                        value={postForm.city}
                        onChange={(e) => setPostForm({ ...postForm, city: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Pune">Pune</option>
                        <option value="Jaipur">Jaipur</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Locality / Area *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Banjara Hills"
                        value={postForm.location}
                        onChange={(e) => setPostForm({ ...postForm, location: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Property Type</label>
                      <select 
                        value={postForm.type}
                        onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="Office">🏢 Office Space</option>
                        <option value="Commercial">🏬 Commercial Space / Shop</option>
                        <option value="Factory">🏭 Factory / Industrial Plant</option>
                        <option value="Godown">📦 Godown / Warehouse</option>
                        <option value="Apartment">🏠 Apartment / Flat</option>
                        <option value="Villa">🏡 Villa / House</option>
                        <option value="Penthouse">🏙️ Penthouse</option>
                        <option value="Studio">🛋️ Studio</option>
                        <option value="Plot">📐 Plot / Land</option>
                        <option value="PG">🛏️ PG / Co-Living</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Furnishing</label>
                      <select 
                        value={postForm.furnishing}
                        onChange={(e) => setPostForm({ ...postForm, furnishing: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="Fully Furnished">✨ Fully Furnished (Plug & Play)</option>
                        <option value="Semi-Furnished">🛋️ Semi-Furnished (Partially Fitted)</option>
                        <option value="Unfurnished">🧱 Unfurnished / Bare Shell</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {postForm.type === 'Office' ? 'Workstations / Cabins' : postForm.type === 'Factory' || postForm.type === 'Godown' ? 'Industrial Units' : 'Bedrooms'}
                      </label>
                      <select 
                        value={postForm.beds}
                        onChange={(e) => setPostForm({ ...postForm, beds: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        {postForm.type === 'Office' || postForm.type === 'Commercial' || postForm.type === 'Factory' || postForm.type === 'Godown' || postForm.type === 'Plot' ? (
                          <>
                            <option value="0">Open Commercial Floor (0 Beds)</option>
                            <option value="1">1 Cabin / Meeting Room</option>
                            <option value="2">2 Director Cabins</option>
                            <option value="4">4+ Executive Cabins</option>
                          </>
                        ) : (
                          <>
                            <option value="1">1 Bed</option>
                            <option value="2">2 Beds</option>
                            <option value="3">3 Beds</option>
                            <option value="4">4+ Beds</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Washrooms</label>
                      <select 
                        value={postForm.baths}
                        onChange={(e) => setPostForm({ ...postForm, baths: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="1">1 Restroom</option>
                        <option value="2">2 Restrooms</option>
                        <option value="3">3 Restrooms</option>
                        <option value="4">4+ Restrooms</option>
                      </select>
                    </div>
                  </div>

                  {postForm.type === 'Office' && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                        <span>Office Furnishing Specification Guide</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        <strong>Fully Furnished:</strong> Turnkey Plug & Play with desks, chairs, director cabins, and conference room.
                        <br />
                        <strong>Semi-Furnished:</strong> Includes glass cabin partitions, ductable air conditioning, ceiling & basic lighting.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        if (!postForm.title || !postForm.location) {
                          showToast('Please fill in title and location.');
                          return;
                        }
                        setPostStep(2);
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Next: Pricing & Terms</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {postStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Pricing & RERA Details</h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Listing Purpose</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPostForm({ ...postForm, purpose: 'buy' })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition ${postForm.purpose === 'buy' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm' : 'border-slate-200 text-slate-700'}`}
                      >
                        For Sale (Buy)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPostForm({ ...postForm, purpose: 'rent' })}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition ${postForm.purpose === 'rent' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm' : 'border-slate-200 text-slate-700'}`}
                      >
                        For Rent (Lease)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        {postForm.purpose === 'buy' ? 'Total Price (₹)' : 'Monthly Rent (₹)'} *
                      </label>
                      <input 
                        type="number"
                        placeholder={postForm.purpose === 'buy' ? 'e.g. 12500000' : 'e.g. 45000'}
                        value={postForm.price}
                        onChange={(e) => setPostForm({ ...postForm, price: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Area Size (sqft) *</label>
                      <input 
                        type="number"
                        placeholder="e.g. 1850"
                        value={postForm.area}
                        onChange={(e) => setPostForm({ ...postForm, area: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">RERA Registration ID</label>
                      <input 
                        type="text"
                        value={postForm.reraId}
                        onChange={(e) => setPostForm({ ...postForm, reraId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Possession Status</label>
                      <select 
                        value={postForm.possession}
                        onChange={(e) => setPostForm({ ...postForm, possession: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="Ready to Move">Ready to Move</option>
                        <option value="Under Construction (2027)">Under Construction (2027)</option>
                        <option value="Immediate (Lease Ready)">Immediate (Lease Ready)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button 
                      type="button"
                      onClick={() => setPostStep(1)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (!postForm.price || !postForm.area) {
                          showToast('Please enter price and area.');
                          return;
                        }
                        setPostStep(3);
                      }}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                    >
                      <span>Next: Media & Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {postStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">3. Media & Description</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Database className="w-3 h-3 text-emerald-600" />
                      <span>Supabase Cloud Storage</span>
                    </span>
                  </div>

                  {/* Primary Camera Capture CTA */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 text-white space-y-3 border border-slate-800 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30 flex-shrink-0">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-white">Live Camera Photo Studio</h5>
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                              Recommended
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Take high-resolution photos using your device camera (front/back) with room tags
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCameraModal(true)}
                        className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo Now</span>
                      </button>
                    </div>

                    {/* Captured Photos Reel */}
                    {capturedPhotos.length > 0 ? (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> {capturedPhotos.length} Camera Photos Captured & Linked
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowCameraModal(true)}
                            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                          >
                            + Take More Photos
                          </button>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-24 overflow-y-auto no-scrollbar">
                          {capturedPhotos.map((photo) => (
                            <div
                              key={photo.id}
                              className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition ${
                                photo.isPrimary
                                  ? 'border-amber-400 ring-2 ring-amber-400/30'
                                  : 'border-slate-800'
                              }`}
                            >
                              <img src={photo.url} alt={photo.tag} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1 flex flex-col justify-end">
                                <span className="text-[8px] font-bold text-slate-200 truncate block">
                                  {photo.tag}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-1.5 flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        <span>0 camera photos attached yet. You can also select from architectural presets below.</span>
                      </div>
                    )}
                  </div>

                  {/* Preset / Fallback Selection */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Or Select Architectural Preset Image</label>
                    <select 
                      value={postForm.image}
                      onChange={(e) => setPostForm({ ...postForm, image: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none mb-2"
                    >
                      <option value="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop">Executive Commercial Office Floor</option>
                      <option value="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop">Luxury Villa with Pool</option>
                      <option value="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop">High-Rise Skyline Apartment</option>
                      <option value="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop">Industrial Godown / Warehouse Hub</option>
                      <option value="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop">Manufacturing Plant / Factory Shed</option>
                    </select>
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 max-h-48">
                      <img src={postForm.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Property Description</label>
                    <textarea 
                      rows={3}
                      placeholder="Describe amenities, furnishing status, clubhouses, schools nearby..."
                      value={postForm.description}
                      onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button 
                      type="button"
                      onClick={() => setPostStep(2)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPostStep(4)}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next: Contact Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {postStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">4. Contact & Owner Verification</h4>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Owner / Landlord Name *</label>
                    <input 
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={postForm.ownerName}
                      onChange={(e) => setPostForm({ ...postForm, ownerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                      <input 
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={postForm.phone}
                        onChange={(e) => setPostForm({ ...postForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email Address</label>
                      <input 
                        type="email"
                        placeholder="rajesh@example.com"
                        value={postForm.email}
                        onChange={(e) => setPostForm({ ...postForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>By publishing, you agree to Nestify's Zero-Brokerage Listing Policy and confirm that you hold authorized ownership of this property.</span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button 
                      type="button"
                      onClick={() => setPostStep(3)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Verified Listing</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ================= PROPERTY DETAIL MODAL WITH MEDIA GALLERY & VIRTUAL TOUR ================= */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 my-auto overflow-hidden">
            <button 
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto flex-1">

            {/* Media Tabs Header */}
            <div className="bg-slate-900 px-6 pt-4 pb-3 flex items-center justify-between text-white border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'photos', label: 'Photos' },
                  { id: 'virtual_tour', label: '3D Tour' },
                  { id: 'floor_plan', label: 'Floor Plan' },
                  { id: 'map', label: 'Map View' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveMediaTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${activeMediaTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {activeMediaTab === 'photos' && (
              <div className="relative aspect-[16/9] bg-slate-900 group">
                <img 
                  src={
                    [
                      selectedProperty.image,
                      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop'
                    ][activePhotoIndex] || selectedProperty.image
                  } 
                  alt={selectedProperty.title} 
                  className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                
                {/* Carousel Navigation Buttons */}
                <button
                  onClick={() => setActivePhotoIndex(prev => (prev === 0 ? 3 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg opacity-80 group-hover:opacity-100 font-bold text-lg"
                >
                  ‹
                </button>
                <button
                  onClick={() => setActivePhotoIndex(prev => (prev === 3 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg opacity-80 group-hover:opacity-100 font-bold text-lg"
                >
                  ›
                </button>

                {/* Photo Counter Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wider border border-white/20">
                  Photo {activePhotoIndex + 1} of 4
                </div>

                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-500/40 uppercase tracking-wider flex items-center gap-1.5">
                  {selectedProperty.purpose === 'buy' ? <Building2 className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
                  For {selectedProperty.purpose.toUpperCase()} • {selectedProperty.type}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-2xl font-black text-amber-400">{selectedProperty.priceDisplay}</p>
                  <h3 className="text-lg font-bold font-serif">{selectedProperty.title}</h3>
                  <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {selectedProperty.location} ({selectedProperty.city})
                  </p>
                </div>

                {/* Thumbnail Strip */}
                <div className="absolute bottom-3 right-4 hidden sm:flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
                  {[
                    selectedProperty.image,
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=300&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=300&auto=format&fit=crop'
                  ].map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-11 h-7 rounded-lg overflow-hidden border-2 transition ${activePhotoIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMediaTab === 'virtual_tour' && (
              <div className="aspect-[16/9] bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 animate-pulse">
                  <Compass className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold font-serif text-white">3D Immersive Virtual Walkthrough</h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Experience 360° pan, zoom, and floor inspection of {selectedProperty.title}.</p>
                <button 
                  onClick={() => showToast('Launching immersive 3D walkthrough engine...')}
                  className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  Launch Fullscreen 3D Tour
                </button>
              </div>
            )}

            {activeMediaTab === 'floor_plan' && (
              <div className="aspect-[16/9] bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-full max-w-md p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span>ARCHITECTURAL SCHEMATIC (2D)</span>
                    <span>{selectedProperty.area} sqft</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">Living Room: 18' x 14'</div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">Master Bedroom: 15' x 13'</div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">Modular Kitchen: 10' x 9'</div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">Balcony Deck: 12' x 6'</div>
                  </div>
                </div>
              </div>
            )}

            {activeMediaTab === 'map' && (
              <PropertyLeafletMap property={selectedProperty} />
            )}

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedProperty.type === 'Office' || selectedProperty.type === 'Commercial' || selectedProperty.type === 'Factory' || selectedProperty.type === 'Godown' ? 'Property Type' : 'Bedrooms'}
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    {selectedProperty.type === 'Office' ? (
                      <><Briefcase className="w-3.5 h-3.5 text-amber-600" /> Office</>
                    ) : selectedProperty.type === 'Commercial' ? (
                      <><Building2 className="w-3.5 h-3.5 text-amber-600" /> Commercial</>
                    ) : selectedProperty.type === 'Factory' ? (
                      <><Factory className="w-3.5 h-3.5 text-amber-600" /> Factory</>
                    ) : selectedProperty.type === 'Godown' ? (
                      <><Warehouse className="w-3.5 h-3.5 text-amber-600" /> Godown</>
                    ) : (
                      <><Bed className="w-3.5 h-3.5 text-amber-600" /> {selectedProperty.beds} Beds</>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Furnishing Status</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1 truncate" title={selectedProperty.furnishing || 'Fully Furnished'}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedProperty.furnishing || 'Fully Furnished'}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Area Size</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                    <Square className="w-3.5 h-3.5 text-amber-600" /> {selectedProperty.area} sqft
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Rating & Reviews</p>
                  <p className="text-sm font-bold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedProperty.rating}
                  </p>
                </div>
              </div>

              {/* Office Furnishing & Infrastructure Showcase */}
              {selectedProperty.type === 'Office' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                      <Briefcase className="w-4 h-4 text-amber-600" />
                      <span>Corporate Office Fitout & Furnishing Specification</span>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      (selectedProperty.furnishing || '').toLowerCase().includes('semi')
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {selectedProperty.furnishing || 'Fully Furnished'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100/80">
                      <span className="text-[10px] text-slate-400 block font-medium">Fitout Status</span>
                      <strong className="text-slate-900">
                        {(selectedProperty.furnishing || '').toLowerCase().includes('semi') ? 'Semi-Furnished' : 'Full Furnished (Plug & Play)'}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100/80">
                      <span className="text-[10px] text-slate-400 block font-medium">Workstation Desks</span>
                      <strong className="text-slate-900">
                        {(selectedProperty.furnishing || '').toLowerCase().includes('semi') ? 'Cabin Partitions Fitted' : '30 - 60 Modular Desks'}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100/80">
                      <span className="text-[10px] text-slate-400 block font-medium">Power Backup</span>
                      <strong className="text-emerald-700">100% DG Backed 24x7</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100/80">
                      <span className="text-[10px] text-slate-400 block font-medium">Air Conditioning</span>
                      <strong className="text-slate-900">Centralized VRF/HVAC</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Description & RERA Info</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProperty.description} This verified property is backed by RERA guidelines ({selectedProperty.reraId || 'RERA-MH-2024-8891'}), offering zero brokerage options, Italian marble finishing, and premium modular kitchen.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {['24x7 Security', 'Power Backup', 'Swimming Pool', 'Gymnasium', 'Clubhouse', 'Dedicated Parking', 'Vastu Compliant'].map((amenity, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-amber-600" /> {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Move-in Cost & Rent Calculator */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Move-in Cost & Financial Calculator</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Zero Brokerage</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/50">
                    <p className="text-[10px] text-slate-400">Monthly Rent / EMI</p>
                    <p className="font-black text-slate-900 mt-0.5">{selectedProperty.priceDisplay}</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/50">
                    <p className="text-[10px] text-slate-400">Security Deposit</p>
                    <p className="font-black text-slate-900 mt-0.5">
                      {selectedProperty.purpose === 'rent' ? `₹${(selectedProperty.price * 2).toLocaleString()}` : `₹${(selectedProperty.price * 0.1).toLocaleString()} (10%)`}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-amber-200/50">
                    <p className="text-[10px] text-slate-400">Maintenance</p>
                    <p className="font-black text-slate-900 mt-0.5">₹2,500 / mo</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                    <p className="text-[10px] text-amber-400">Total Move-In</p>
                    <p className="font-black text-white mt-0.5">
                      {selectedProperty.purpose === 'rent' 
                        ? `₹${(selectedProperty.price * 3 + 2500).toLocaleString()}` 
                        : `₹${(selectedProperty.price * 0.12).toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => toggleSave(selectedProperty.id)}
                  className={`flex-1 py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                    savedIds.includes(selectedProperty.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${savedIds.includes(selectedProperty.id) ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">{savedIds.includes(selectedProperty.id) ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}#property=${selectedProperty.id}`;
                    if (navigator.share) {
                      navigator.share({
                        title: selectedProperty.title,
                        text: `Check out ${selectedProperty.title} in ${selectedProperty.location} for ${selectedProperty.priceDisplay}`,
                        url: shareUrl,
                      }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(shareUrl);
                      showToast('Property link copied to clipboard!');
                    }
                  }}
                  className="px-3 sm:px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  title="Share Property Link"
                >
                  <Share2 className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={() => {
                    const prop = selectedProperty;
                    setSelectedProperty(null);
                    setVisitProperty(prop);
                    setShowVisitModal(true);
                  }}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {showVisitModal && visitProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold font-serif">Schedule Property Tour</h3>
                  <p className="text-[11px] text-amber-400 font-medium truncate max-w-[260px]">{visitProperty.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowVisitModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {visitSubmitted ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Visit Scheduled Successfully!</h4>
                <p className="text-xs text-slate-600">
                  Your {visitForm.type} tour for <span className="font-semibold">{visitProperty.title}</span> has been booked for <span className="font-semibold">{visitForm.date || 'Tomorrow'}</span> at <span className="font-semibold">{visitForm.time}</span>. Our relationship manager will meet you at the property.
                </p>
                <button
                  onClick={() => {
                    setShowVisitModal(false);
                    setVisitSubmitted(false);
                  }}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!visitForm.name || !visitForm.phone || !visitForm.date || !visitProperty) {
                    showToast('Please fill in all required fields.');
                    return;
                  }

                  try {
                    if (isSupabaseActive) {
                      await createViewingBookingRecord({
                        id: 'book-' + Date.now(),
                        propertyId: visitProperty.id,
                        propertyTitle: visitProperty.title,
                        propertyLocation: visitProperty.location,
                        propertyCity: visitProperty.city,
                        propertyImage: visitProperty.image,
                        propertyPrice: visitProperty.price,
                        propertyListingType: visitProperty.purpose,
                        userId: user?.id,
                        userName: visitForm.name.trim(),
                        userEmail: user?.email || 'guest@nestify.com',
                        userPhone: visitForm.phone.trim(),
                        preferredDate: visitForm.date,
                        preferredTime: visitForm.time,
                        tourType: visitForm.type === 'video' ? 'Live Video Tour' : 'In-Person Visit',
                        notes: 'Booked from main property comparison/tour flow.',
                        status: 'confirmed',
                        createdAt: new Date().toISOString()
                      });
                    }
                    setVisitSubmitted(true);
                    showToast('Property visit scheduled successfully!');
                  } catch (err: any) {
                    showToast(err?.message || 'Failed to schedule property visit.');
                  }
                }}
                className="p-6 space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tour Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVisitForm({ ...visitForm, type: 'in-person' })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${visitForm.type === 'in-person' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm' : 'border-slate-200 text-slate-700'}`}
                    >
                      In-Person Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisitForm({ ...visitForm, type: 'video' })}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${visitForm.type === 'video' ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm' : 'border-slate-200 text-slate-700'}`}
                    >
                      Video Walkthrough
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Name *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Rahul Verma"
                    value={visitForm.name}
                    onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Phone Number *</label>
                  <input 
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={visitForm.phone}
                    onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Preferred Date *</label>
                    <input 
                      type="date"
                      value={visitForm.date}
                      onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Time Slot</label>
                    <select
                      value={visitForm.time}
                      onChange={(e) => setVisitForm({ ...visitForm, time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                    >
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                      <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                      <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition mt-2"
                >
                  Confirm & Book Tour
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= SUPABASE SIGN IN / REGISTER MODAL ================= */}
      {(showSignInModal || isAuthModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200/80 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                      Supabase Cloud Authentication
                    </span>
                    <h3 className="text-lg font-bold font-serif leading-tight">
                      {authMode === 'signin' ? 'Sign In to Your Account' : 'Create Supabase Account'}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowSignInModal(false);
                    closeAuthModal();
                    setAuthError(null);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Persist saved properties directly in Supabase PostgreSQL</span>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 m-4 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setAuthError(null); }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(null); }}
                className={`py-2 rounded-xl transition cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="mx-6 mb-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="p-6 pt-2 space-y-3.5">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander Wright"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Role</label>
                      <select
                        value={authRole}
                        onChange={(e) => setAuthRole(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 outline-none"
                      >
                        <option value="seller">Seller / Owner</option>
                        <option value="user">Buyer / Tenant</option>
                        <option value="agent">RERA Agent</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98201 45678"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
              >
                {authSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>
                  {authSubmitting
                    ? 'Authenticating with Supabase...'
                    : authMode === 'signin'
                    ? 'Sign In to Supabase Account'
                    : 'Create Free Supabase Account'}
                </span>
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ⚡ One-Click Demo Accounts (Supabase Pre-Seeded):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('appsellbuy@gmail.com', 'password123', 'Alexander Wright (Investor)')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-left transition cursor-pointer"
                >
                  <strong className="text-xs text-slate-900 block font-bold">appsellbuy@gmail.com</strong>
                  <span className="text-[10px] text-slate-500">Investor / Seller Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('vikram.singhania@gmail.com', 'password123', 'Vikramaditya Singhania')}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-left transition cursor-pointer"
                >
                  <strong className="text-xs text-slate-900 block font-bold">vikram.singhania@gmail.com</strong>
                  <span className="text-[10px] text-slate-500">Commercial Office Owner</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUICK PROFILE MODAL ================= */}
      {showProfileModal && user && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setShowProfileModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif">{user.name || 'User Account'}</h3>
                  <p className="text-xs text-amber-400 font-medium">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Supabase PostgreSQL Connected</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  Realtime Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => {
                    setShowProfileModal(false);
                    setActiveTab('saved');
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 transition cursor-pointer space-y-0.5"
                >
                  <p className="text-xs text-slate-500 font-medium">Saved in Supabase</p>
                  <p className="text-lg font-black text-slate-900">{savedIds.length} Properties</p>
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                    View Wishlist <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <p className="text-xs text-slate-500 font-medium">User Role</p>
                  <p className="text-base font-black text-slate-900 uppercase">{user.role || 'USER'}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">100% RERA Verified</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setActiveTab('profile');
                  }}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Manage Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    logout();
                    showToast('Signed out of Supabase.');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CAMERA CAPTURE PHOTO STUDIO MODAL ================= */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        propertyId={`prop-${Date.now()}`}
        initialPhotos={capturedPhotos}
        onPhotosSaved={(newPhotos, primaryUrl) => {
          setCapturedPhotos(newPhotos);
          const urls = newPhotos.map(p => p.url);
          setPostForm(prev => ({
            ...prev,
            image: primaryUrl || prev.image,
            gallery: urls
          }));
          showToast(`Attached ${newPhotos.length} camera photos to property listing!`);
        }}
      />

      {/* ================= SUPABASE DATABASE MANAGEMENT & DIAGNOSTICS MODAL ================= */}
      <DatabaseManagerModal
        isOpen={showDatabaseModal}
        onClose={() => setShowDatabaseModal(false)}
        onToast={showToast}
      />

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                N
              </div>
              <span className="text-base font-extrabold tracking-tight">Nestify Real Estate</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier RERA-registered proptech platform connecting verified buyers, tenants, and sellers with zero brokerage transparency.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition">Home</button></li>
              <li><button onClick={() => { setSelectedPurpose('buy'); setActiveTab('explore'); }} className="hover:text-amber-400 transition">Buy Property</button></li>
              <li><button onClick={() => setActiveTab('rent-properties')} className="hover:text-amber-400 transition">Rent Properties Tab</button></li>
              <li><button onClick={() => setShowPostModal(true)} className="hover:text-amber-400 transition">Post Property</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400 transition">Contact Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">Top Cities</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><span onClick={() => { setSelectedCity('Mumbai'); setActiveTab('rent-properties'); }} className="cursor-pointer hover:text-amber-400 transition">Rental Flats in Mumbai</span></li>
              <li><span onClick={() => { setSelectedCity('Pune'); setActiveTab('rent-properties'); }} className="cursor-pointer hover:text-amber-400 transition">Apartments in Pune</span></li>
              <li><span onClick={() => { setSelectedCity('Jaipur'); setActiveTab('rent-properties'); }} className="cursor-pointer hover:text-amber-400 transition">Villas in Jaipur</span></li>
              <li><span onClick={() => { setSelectedCity('Bangalore'); setActiveTab('explore'); }} className="cursor-pointer hover:text-amber-400 transition">Flats in Bangalore</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">Contact Info</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cyber City, Phase 2, Gurgaon, Haryana 122002<br />
              Email: support@nestify.in<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Nestify Technologies India Pvt. Ltd. All rights reserved. 100% RERA Compliant.
        </div>
      </footer>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 gap-1 text-center">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'home' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>
          
          <button 
            onClick={() => { setSelectedPurpose('buy'); setActiveTab('explore'); }}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'explore' && selectedPurpose === 'buy' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Buy</span>
          </button>

          <button 
            onClick={() => setActiveTab('rent-properties')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
              activeTab === 'rent-properties' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Key className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Rent Tab</span>
          </button>

          <button 
            onClick={() => setShowPostModal(true)}
            className="flex flex-col items-center justify-center py-1.5 rounded-xl transition text-slate-500 hover:text-slate-900"
          >
            <PlusCircle className="w-5 h-5 text-amber-600" />
            <span className="text-[10px] mt-0.5 font-bold">Post</span>
          </button>

          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition relative ${
              activeTab === 'saved' ? 'text-amber-600 font-bold bg-amber-50' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Saved</span>
            {savedIds.length > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {savedIds.length}
              </span>
            )}
          </button>
        </div>
      </nav>

    </div>
  );
}
