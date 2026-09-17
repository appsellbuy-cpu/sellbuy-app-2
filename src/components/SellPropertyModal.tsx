import React, { useState } from 'react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { X, Upload, Plus, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

interface SellPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: 'Minimalist Modern Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Glass Coastal House', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Urban High-Rise Penthouse', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Woodland Mountain Retreat', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Scenic Development Plot', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop' },
];

export const SellPropertyModal: React.FC<SellPropertyModalProps> = ({ isOpen, onClose }) => {
  const { addProperty } = useProperties();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'house' | 'apartment' | 'plot'>('house');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [sqft, setSqft] = useState('1850');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImage, setCustomImage] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !price) return;

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedImg = customImage.trim() || image;
      await addProperty({
        title,
        location,
        price: Number(price),
        category,
        beds: category === 'plot' ? 0 : Number(beds),
        baths: category === 'plot' ? 0 : Number(baths),
        sqft: Number(sqft),
        image: selectedImg,
        gallery: [selectedImg],
        description: description || 'Distinct luxury residence with bespoke finishings, prime solar orientation, and comprehensive title documentation.',
        ownerId: user?.id,
        ownerName: user?.name,
        featured: false
      });
      onClose();
      // Reset form
      setTitle('');
      setLocation('');
      setPrice('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-y-auto max-h-[90vh] shadow-2xl border border-gray-100 relative flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#FAF9F7]/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#9A7632] uppercase block">
              Marketplace Submission
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A192F]">
              List Your Property For Sale
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
          
          {!isAuthenticated && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
              <span>You are currently in guest mode. Sign in to link this property to your owner account.</span>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="font-bold underline ml-2 shrink-0"
              >
                Sign In Now
              </button>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Cliffside Villa"
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="plot">Plot</option>
              </select>
            </div>
          </div>

          {/* Location & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Location / City & Country *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Seminyak, Bali, Indonesia"
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Asking Price (USD $) *
              </label>
              <input
                type="number"
                required
                min={1000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 1250000"
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>
          </div>

          {/* Specs: Beds, Baths, Sqft */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                {category === 'plot' ? 'N/A' : 'Bedrooms'}
              </label>
              <input
                type="number"
                disabled={category === 'plot'}
                min={0}
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F] disabled:opacity-40"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                {category === 'plot' ? 'N/A' : 'Bathrooms'}
              </label>
              <input
                type="number"
                disabled={category === 'plot'}
                min={0}
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F] disabled:opacity-40"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Area (Sqft) *
              </label>
              <input
                type="number"
                required
                min={50}
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                placeholder="1800"
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>
          </div>

          {/* Preset Photography Selector */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
              Select Architectural Photography (or enter custom image URL)
            </label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setImage(preset.url);
                    setCustomImage('');
                  }}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all group ${
                    image === preset.url && !customImage ? 'border-[#C5A059] ring-2 ring-[#C5A059]/30' : 'border-gray-200'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {image === preset.url && !customImage && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 text-[#C5A059]" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Or paste custom high-res image URL (https://...)"
              value={customImage}
              onChange={(e) => setCustomImage(e.target.value)}
              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Property Description & Architectural Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the aesthetic features, light exposures, terrace views, and materials used in the property..."
              className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Publishing Property...' : 'Publish Property Listing'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
