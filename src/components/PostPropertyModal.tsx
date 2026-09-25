import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Building2, 
  Home, 
  Briefcase, 
  Users, 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  IndianRupee, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Image as ImageIcon,
  Trash2,
  Star,
  Link,
  Loader2,
  Camera,
  Database
} from 'lucide-react';
import { INDIAN_CITIES } from '../utils/formatters';
import { useProperties } from '../context/PropertyContext';
import { AIPresentationCopilot } from './AIPresentationCopilot';
import { useAuth } from '../context/AuthContext';
import { CameraCaptureModal, CapturedPhoto } from './CameraCaptureModal';

const JAIPUR_PRESETS = [
  { title: 'Luxury Villa Exterior', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', tag: '4K UHD' },
  { title: 'Regal Living Lounge', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop', tag: '4K UHD' },
  { title: 'Royal Rajput Facade', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop', tag: 'UHD Architectural' },
  { title: 'Contemporary Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop', tag: '4K Resolution' },
  { title: 'Master Palace Suite', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop', tag: '4K Resolution' },
  { title: 'Heritage Arch Courtyard', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1200&auto=format&fit=crop', tag: 'UHD Architectural' }
];

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({ isOpen, onClose }) => {
  const { addProperty, showToast } = useProperties();
  const { user } = useAuth();

  const [listingType, setListingType] = useState<'rent' | 'buy' | 'commercial' | 'pg' | 'plot'>('rent');
  const [category, setCategory] = useState<'apartment' | 'house' | 'villa' | 'office' | 'shop' | 'pg' | 'plot'>('apartment');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [beds, setBeds] = useState(2);
  const [baths, setBaths] = useState(2);
  const [sqft, setSqft] = useState(1200);
  const [carpetArea, setCarpetArea] = useState(1050);
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [price, setPrice] = useState('35000');
  const [securityDeposit, setSecurityDeposit] = useState('70000');
  const [society, setSociety] = useState('');
  const [facing, setFacing] = useState('East');
  const [propertyAge, setPropertyAge] = useState('1-5 Years');
  const [smartSuggestEnabled, setSmartSuggestEnabled] = useState(true);
  const [isAnalyzingSuggest, setIsAnalyzingSuggest] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraPhotos, setCameraPhotos] = useState<CapturedPhoto[]>([]);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop');
  const [gallery, setGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [zeroBrokerage, setZeroBrokerage] = useState(true);
  const [petFriendly, setPetFriendly] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Lift / Elevator',
    '24/7 Power Backup',
    'Covered Car Parking',
    'Security Guard'
  ]);
  const [ownerName, setOwnerName] = useState(user?.name || 'Alexander Wright');
  const [ownerPhone, setOwnerPhone] = useState(user?.phone || '+91 98201 45678');
  const [ownerRole, setOwnerRole] = useState<'Owner' | 'Agent' | 'Builder'>('Owner');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      processFiles(files);
    }
  };

  const processFiles = (files: FileList) => {
    setUploadProgress(10);
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      showToast('Please upload valid image files only.');
      setUploadProgress(null);
      return;
    }

    let loadedCount = 0;
    const newImages: string[] = [];

    // Simulate progress uploading high-resolution photos
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        loadedCount++;
        if (loadedCount === validFiles.length) {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => {
            setGallery(prev => [...prev, ...newImages]);
            setUploadProgress(null);
            showToast(`Successfully uploaded ${validFiles.length} high-resolution property photo(s)!`);
          }, 400);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addImageFromUrl = () => {
    if (!imageUrl.trim()) return;
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
      showToast('Please enter a valid absolute image URL.');
      return;
    }
    setGallery(prev => [...prev, imageUrl]);
    setImageUrl('');
    showToast('Image URL added to gallery.');
  };

  const removeGalleryImage = (idx: number) => {
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  const makePrimaryCover = (idx: number) => {
    if (idx === 0) return;
    setGallery(prev => {
      const updated = [...prev];
      const target = updated[idx];
      updated.splice(idx, 1);
      updated.unshift(target);
      return updated;
    });
    showToast('Cover photo updated.');
  };

  const selectPreset = (url: string) => {
    if (gallery.includes(url)) {
      setGallery(prev => prev.filter(img => img !== url));
    } else {
      setGallery(prev => [...prev, url]);
      showToast('Heritage architectural preset added!');
    }
  };

  const handleSmartSuggest = async (customTitle?: string, customDesc?: string) => {
    const activeTitle = customTitle !== undefined ? customTitle : title;
    const activeDesc = customDesc !== undefined ? customDesc : description;
    const activeLocation = `${locality ? locality + ', ' : ''}${city}`;

    if (!activeTitle.trim()) {
      return;
    }

    setIsAnalyzingSuggest(true);
    try {
      const response = await fetch('/api/gemini/smart-suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: activeTitle,
          description: activeDesc,
          location: activeLocation
        })
      });

      const data = await response.json();
      if (response.ok) {
        if (data.facing) setFacing(data.facing);
        if (data.propertyAge) setPropertyAge(data.propertyAge);
        if (data.furnishing) setFurnishing(data.furnishing);
        if (data.beds) setBeds(data.beds);
        if (data.baths) setBaths(data.baths);
        
        if (Array.isArray(data.suggestedAmenities) && data.suggestedAmenities.length > 0) {
          setSelectedAmenities(prev => {
            const unique = new Set([...prev, ...data.suggestedAmenities]);
            return Array.from(unique);
          });
        }
        showToast('✨ AI Smart Suggest: Auto-filled specifications & amenities based on property name and location!');
      } else {
        console.warn(data.error || 'Smart Suggest error');
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzingSuggest(false);
    }
  };

  // Automatically trigger smart suggestions on entering property name (title) and location (locality, city)
  useEffect(() => {
    if (!smartSuggestEnabled || !title.trim()) return;

    const timer = setTimeout(() => {
      handleSmartSuggest(title, description);
    }, 1500); // Debounce delay of 1.5s to prevent excessive API hits while typing

    return () => clearTimeout(timer);
  }, [title, locality, city, smartSuggestEnabled]);

  const handleAIGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          location: `${locality ? locality + ', ' : ''}${city}`,
          price: price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Request Price',
          amenities: selectedAmenities,
          category,
          beds,
          listingType
        })
      });

      const data = await response.json();
      if (response.ok && data.description) {
        setDescription(data.description);
        showToast('Instant SEO-optimized property description generated successfully!');
        if (smartSuggestEnabled) {
          // Trigger autofill on the newly generated description
          setTimeout(() => handleSmartSuggest(title, data.description), 300);
        }
      } else {
        showToast(data.error || 'Failed to generate SEO description. Please check your API key in Settings > Secrets.');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error communicating with description API.');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleAIGenerateHighlights = async () => {
    setIsGeneratingAI(true);
    try {
      const mergedFeatures = `${description ? description + '. ' : ''}Amenities: ${selectedAmenities.join(', ')}. Furnishing: ${furnishing}. Area: ${sqft} sqft`;
      const response = await fetch('/api/gemini/generate-highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          features: mergedFeatures,
          location: `${locality ? locality + ', ' : ''}${city}`,
          price: price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Request Price',
          category,
          beds,
          listingType
        })
      });

      const data = await response.json();
      if (response.ok && data.title && data.highlights) {
        setTitle(data.title);
        const highlightsText = data.highlights.join('\n');
        setDescription(highlightsText);
        showToast('Instant AI property highlights & title generated successfully!');
        if (smartSuggestEnabled) {
          // Trigger autofill on the newly generated title and highlights text
          setTimeout(() => handleSmartSuggest(data.title, highlightsText), 300);
        }
      } else {
        showToast(data.error || 'Failed to generate highlights. Please verify your API key is correctly saved under Settings > Secrets.');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error communicating with server-side AI engine.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !locality.trim() || !price) {
      showToast('Please fill in the property title, locality, and price.');
      return;
    }

    setIsSubmitting(true);
    try {
      const numPrice = Number(price);
      let priceDisplay = '';
      if (listingType === 'rent') {
        priceDisplay = `₹${numPrice.toLocaleString('en-IN')}/month`;
      } else if (numPrice >= 10000000) {
        priceDisplay = `₹${(numPrice / 10000000).toFixed(2)} Crore`;
      } else if (numPrice >= 100000) {
        priceDisplay = `₹${(numPrice / 100000).toFixed(2)} Lakh`;
      } else {
        priceDisplay = `₹${numPrice.toLocaleString('en-IN')}`;
      }

      await addProperty({
        title,
        listingType,
        category,
        city,
        locality,
        location: `${locality}, ${city}`,
        price: numPrice,
        priceDisplay,
        securityDeposit: listingType === 'rent' ? `₹${Number(securityDeposit || 0).toLocaleString('en-IN')}` : undefined,
        beds: Number(beds) || 0,
        baths: Number(baths) || 0,
        sqft: Number(sqft) || 1000,
        carpetArea: Number(carpetArea) || Number(sqft) || 1000,
        furnishing,
        description,
        society: society || 'Private Society',
        facing: facing.toLowerCase().includes('facing') ? facing : `${facing} Facing`,
        propertyAge,
        amenities: selectedAmenities,
        image: gallery[0] || imageUrl,
        gallery: gallery.length > 0 ? gallery : [imageUrl],
        virtualTourUrl: virtualTourUrl.trim() || undefined,
        verified: true,
        zeroBrokerage,
        petFriendly,
        postedBy: ownerRole,
        ownerName,
        ownerPhone,
        ownerId: user?.id || 'user-default',
        status: 'active'
      });

      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to post property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAmenitiesList = [
    'Lift / Elevator',
    '24/7 Power Backup',
    'Covered Car Parking',
    'Security Guard & CCTV',
    'Gymnasium',
    'Swimming Pool',
    'Club House',
    'Children Play Area',
    'Jogging Track',
    'Vastu Compliant',
    'Piped Gas Connection',
    'Rainwater Harvesting'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Post Property FREE</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  0% BROKERAGE
                </span>
              </div>
              <p className="text-xs text-slate-400">Reach 10M+ verified buyers & tenants across India</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Step 1: Listing Intent & Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. What do you want to do?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'rent', label: 'Rent Out', icon: Home },
                { id: 'buy', label: 'Sell Property', icon: Building2 },
                { id: 'commercial', label: 'Commercial', icon: Briefcase },
                { id: 'pg', label: 'PG / Co-Living', icon: Users },
                { id: 'plot', label: 'Land / Plot', icon: Compass }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setListingType(item.id as any);
                      if (item.id === 'rent') setPrice('35000');
                      if (item.id === 'buy') setPrice('9500000');
                    }}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                      listingType === item.id
                        ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Property Category */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'apartment', label: '🏠 Apartment / Flat' },
              { id: 'house', label: '🏘️ Independent House' },
              { id: 'villa', label: '🏡 Gated Villa' },
              { id: 'office', label: '🏢 Commercial Office' },
              { id: 'commercial', label: '🏬 Commercial / Shop' },
              { id: 'factory', label: '🏭 Factory / Industrial' },
              { id: 'godown', label: '📦 Godown / Warehouse' },
              { id: 'plot', label: '📐 Plot / Land' }
            ].map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id as any)}
                className={`p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                  category === c.id
                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Step 2: Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              2. Property Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-amber-500"
                >
                  {INDIAN_CITIES.map(c => (
                    <option key={c.name} value={c.name}>{c.icon} {c.name}, {c.state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Locality / Area Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra West, Koramangala, Cyber City"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-600 font-medium mb-1 block">Society / Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Godrej Prime, Hiranandani Gardens, Prestige Shantiniketan"
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Title & Description */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Title & Highlights
              </label>
              
              {/* Premium Smart Suggest Switch Toggle */}
              <div className="flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-800">Smart Suggest</span>
                <button
                  type="button"
                  onClick={() => setSmartSuggestEnabled(!smartSuggestEnabled)}
                  className={`relative inline-flex h-4 w-7.5 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    smartSuggestEnabled ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                  title="Toggle AI Smart Suggest"
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      smartSuggestEnabled ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {smartSuggestEnabled && (
                <div className="p-3 bg-gradient-to-r from-amber-50/70 via-amber-50/40 to-transparent border border-amber-100 rounded-2xl flex items-center justify-between text-xs text-slate-700 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span>AI is ready to auto-fill missing specs, age, direction, and amenities as you write.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSmartSuggest(title, description)}
                    disabled={isAnalyzingSuggest}
                    className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase bg-slate-900 hover:bg-[#9A7632] text-white disabled:bg-slate-600 rounded-lg transition"
                  >
                    {isAnalyzingSuggest ? 'Analyzing...' : 'Scan Now'}
                  </button>
                </div>
              )}

              <input
                type="text"
                placeholder="e.g. Luxury 3 BHK Sea-Facing Flat in Worli with Balcony"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:ring-2 focus:ring-amber-500"
                required
              />

              <textarea
                rows={3}
                placeholder="Describe key features, proximity to metro/schools/tech parks, sunlight, ventilation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAIGenerateHighlights}
                  disabled={isGeneratingAI || isGeneratingDescription}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-950 hover:bg-[#9A7632] text-white hover:text-white disabled:bg-slate-800 disabled:text-slate-400 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Generating with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>AI Generate Title & Highlights</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleAIGenerateDescription}
                  disabled={isGeneratingAI || isGeneratingDescription}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:bg-slate-800 disabled:text-slate-400 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                      <span>Generating SEO Description...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                      <span>AI Generate SEO Description</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Copilot Helper for Title & Highlights */}
              <div className="pt-1.5">
                <AIPresentationCopilot
                  category={category}
                  city={city}
                  locality={locality}
                  onApply={(newTitle, newHighlights) => {
                    setTitle(newTitle);
                    setDescription(newHighlights);
                    showToast('AI Title & Highlights applied successfully!');
                  }}
                />
              </div>
            </div>
          </div>

          {/* Step 4: Specs & Pricing */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              4. Specifications & Pricing
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mb-4">
              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Bedrooms (BHK)</label>
                <select
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value={1}>1 BHK</option>
                  <option value={2}>2 BHK</option>
                  <option value={3}>3 BHK</option>
                  <option value={4}>4 BHK</option>
                  <option value={5}>5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Bathrooms</label>
                <select
                  value={baths}
                  onChange={(e) => setBaths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value={1}>1 Bath</option>
                  <option value={2}>2 Baths</option>
                  <option value={3}>3 Baths</option>
                  <option value={4}>4+ Baths</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Carpet Area (sq.ft)</label>
                <input
                  type="number"
                  value={carpetArea}
                  onChange={(e) => setCarpetArea(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Furnishing Status</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Fully Furnished">✨ Fully Furnished (Plug & Play / Ready Desks)</option>
                  <option value="Semi-Furnished">🛋️ Semi-Furnished (Partially Fitted / Cabins)</option>
                  <option value="Unfurnished">🧱 Unfurnished / Bare Shell</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Facing Direction</label>
                <select
                  value={facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 font-medium mb-1 block">Property Age</label>
                <select
                  value={propertyAge}
                  onChange={(e) => setPropertyAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-5 Years">1-5 Years</option>
                  <option value="5-10 Years">5-10 Years</option>
                  <option value="10+ Years">10+ Years</option>
                </select>
              </div>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div>
                <label className="text-xs font-bold text-slate-800 mb-1 block">
                  {listingType === 'rent' ? 'Monthly Expected Rent (₹) *' : 'Total Selling Price (₹) *'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder={listingType === 'rent' ? 'e.g. 35000' : 'e.g. 8500000'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                    required
                  />
                </div>
              </div>

              {listingType === 'rent' && (
                <div>
                  <label className="text-xs font-bold text-slate-800 mb-1 block">
                    Security Deposit (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 70000"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 5: Amenities Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              5. Amenities & Facilities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allAmenitiesList.map(amenity => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-2 rounded-xl text-left border text-xs flex items-center justify-between transition ${
                      isChecked
                        ? 'bg-amber-50 border-amber-400 text-amber-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{amenity}</span>
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 6: Multi-Photo Architectural Upload Utility */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1 border-b border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                6. High-Resolution Property Gallery
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-600" /> Supabase Storage
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                  ⭐ {gallery.length} Photos Selected
                </span>
              </div>
            </div>

            {/* Live Camera Photo Studio Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-amber-950 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 flex-shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-xs font-bold text-white">Live Camera Photo Studio</h5>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase">
                      Direct Capture
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Snap crystal-clear photos with your device camera (front/back) & tag rooms directly into Supabase
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo with Camera</span>
              </button>
            </div>

            {/* Drag & Drop Main Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-6 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                isDragging
                  ? 'border-amber-500 bg-amber-50/50 scale-[1.01]'
                  : 'border-slate-200 hover:border-amber-400 bg-slate-50/60'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-3xs flex items-center justify-center text-amber-600 relative">
                <Upload className="w-6 h-6" />
                <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
              </div>

              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Drag & Drop multiple high-res photos here
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  or click to select files from your computer (JPG, PNG, WEBP)
                </p>
              </div>

              {/* Uploading progress indicator */}
              {uploadProgress !== null && (
                <div className="w-full max-w-xs mt-3 space-y-1.5 z-20 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                      Optimizing Architecture Shots...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Preloaded Jaipur Architectural Presets (For outstanding instantaneous demonstration) */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  Select Heritage Architectural Presets (Quick Setup)
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {JAIPUR_PRESETS.map((p, idx) => {
                  const isSelected = gallery.includes(p.url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectPreset(p.url)}
                      className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition text-left cursor-pointer ${
                        isSelected ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                        <span className="text-[8px] font-black uppercase text-amber-300 tracking-wider truncate block leading-none">
                          {p.tag}
                        </span>
                        <span className="text-[9px] font-medium text-white truncate block mt-0.5 leading-none">
                          {p.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Uploaded Gallery Grid Management */}
            {gallery.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide block">
                  Manage Selected Photos (First photo will be Primary Cover)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-[4/3] bg-slate-100 border rounded-2xl overflow-hidden shadow-2xs transition ${
                        idx === 0 ? 'border-amber-500 ring-2 ring-amber-400/20' : 'border-slate-200'
                      }`}
                    >
                      <img src={img} alt="Property thumbnail" className="w-full h-full object-cover" />

                      {/* Header overlay actions */}
                      <div className="absolute inset-x-0 top-0 p-1.5 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                        
                        {/* Primary Cover indicator/trigger */}
                        <button
                          type="button"
                          onClick={() => makePrimaryCover(idx)}
                          className={`p-1 rounded-lg backdrop-blur-md transition ${
                            idx === 0 
                              ? 'bg-amber-500 text-slate-950 font-bold' 
                              : 'bg-black/40 hover:bg-black/60 text-amber-300'
                          }`}
                          title={idx === 0 ? "Active Cover Photo" : "Set as Cover Photo"}
                        >
                          <Star className={`w-3 h-3 ${idx === 0 ? 'fill-slate-950' : ''}`} />
                        </button>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-1 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Footer Badge */}
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-3xs text-[8px] font-extrabold text-white uppercase tracking-wider flex items-center gap-1">
                        {idx === 0 ? (
                          <span className="text-amber-300">★ COVER</span>
                        ) : (
                          <span>PHOTO {idx + 1}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Manual URL Input */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                <Link className="w-3.5 h-3.5 text-slate-400" />
                <span>Or add image from absolute web link URL</span>
              </span>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Paste high-res image URL (e.g. https://images.unsplash.com/photo-...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                />
                <button
                  type="button"
                  onClick={addImageFromUrl}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Add URL</span>
                </button>
              </div>
            </div>

            {/* Optional 360 Virtual Tour link */}
            <div className="p-3.5 bg-amber-50/40 border border-amber-200/50 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Add 360° Virtual Tour Embed Link (Optional)</span>
              </span>
              <input
                type="url"
                placeholder="e.g. https://kuula.co/share/collection/7PX9r..."
                value={virtualTourUrl}
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[9px] text-slate-500 leading-tight">
                Provide a standard panoramic viewer link (Kuula, Pannellum, Matterport, etc.) to allow users to view interactive VR rooms.
              </p>
            </div>
          </div>

          {/* Owner Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs text-slate-600 font-medium mb-1 block">Your Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium mb-1 block">Contact Phone Number</label>
              <input
                type="tel"
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium mb-1 block">Posting As</label>
              <select
                value={ownerRole}
                onChange={(e) => setOwnerRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Owner">Direct Owner</option>
                <option value="Agent">Real Estate Broker</option>
                <option value="Builder">Builder / Developer</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Free Listing • Immediate Live Publication</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/25 transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish Property Free'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Camera Capture Photo Studio Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        propertyId={`prop-${Date.now()}`}
        initialPhotos={cameraPhotos}
        onPhotosSaved={(newPhotos, primaryUrl) => {
          setCameraPhotos(newPhotos);
          const urls = newPhotos.map(p => p.url);
          setImageUrl(primaryUrl || urls[0]);
          setGallery(prev => Array.from(new Set([...urls, ...prev])));
          showToast(`Attached ${newPhotos.length} device camera photos to gallery!`);
        }}
      />
    </div>
  );
};
