import React, { useState, useEffect } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types';
import { AIPresentationCopilot } from './AIPresentationCopilot';
import { 
  X, 
  Save, 
  Upload, 
  Sparkles, 
  Loader2, 
  Link, 
  Star, 
  Trash2, 
  CheckCircle2,
  Compass,
  Camera
} from 'lucide-react';

const JAIPUR_PRESETS = [
  { title: 'Luxury Villa Exterior', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', tag: '4K UHD' },
  { title: 'Regal Living Lounge', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop', tag: '4K UHD' },
  { title: 'Royal Rajput Facade', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop', tag: 'UHD Architectural' },
  { title: 'Contemporary Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop', tag: '4K Resolution' },
  { title: 'Master Palace Suite', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop', tag: '4K Resolution' },
  { title: 'Heritage Arch Courtyard', url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1200&auto=format&fit=crop', tag: 'UHD Architectural' }
];

interface EditPropertyModalProps {
  property: Property | null;
  onClose: () => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({ property, onClose }) => {
  const { updateProperty, showToast } = useProperties();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'house' | 'apartment' | 'plot'>('house');
  const [beds, setBeds] = useState('0');
  const [baths, setBaths] = useState('0');
  const [sqft, setSqft] = useState('0');
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [virtualTourUrl, setVirtualTourUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setLocation(property.location);
      setPrice(String(property.price));
      setCategory(property.category);
      setBeds(String(property.beds || 0));
      setBaths(String(property.baths || 0));
      setSqft(String(property.sqft || 0));
      setImage(property.image || '');
      setGallery(property.gallery || (property.image ? [property.image] : []));
      setDescription(property.description || '');
      setVirtualTourUrl(property.virtualTourUrl || '');
    }
  }, [property]);

  if (!property) return null;

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
            showToast(`Successfully added ${validFiles.length} photos!`);
          }, 400);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addImageFromUrl = () => {
    if (!image.trim()) return;
    if (!image.startsWith('http://') && !image.startsWith('https://') && !image.startsWith('data:')) {
      showToast('Please enter a valid absolute image URL.');
      return;
    }
    setGallery(prev => [...prev, image]);
    setImage('');
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

  const handleAIGenerateDescription = async () => {
    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/gemini/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          price: price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Request Price',
          amenities: property?.amenities || [],
          category,
          beds: Number(beds) || 2,
          listingType: property?.listingType || 'sale'
        })
      });

      const data = await response.json();
      if (response.ok && data.description) {
        setDescription(data.description);
        showToast('Instant SEO-optimized property description generated successfully!');
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
      const response = await fetch('/api/gemini/generate-highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          features: `${description ? description + '. ' : ''}Area: ${sqft} sqft`,
          location: location || 'Jaipur',
          price: price ? `₹${Number(price).toLocaleString('en-IN')}` : 'Request Price',
          category,
          beds: Number(beds) || 2,
          listingType: property?.listingType || 'sale'
        })
      });

      const data = await response.json();
      if (response.ok && data.title && data.highlights) {
        setTitle(data.title);
        setDescription(data.highlights.join('\n'));
        showToast('Instant AI property highlights & title generated successfully!');
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

  const selectPreset = (url: string) => {
    if (gallery.includes(url)) {
      setGallery(prev => prev.filter(img => img !== url));
    } else {
      setGallery(prev => [...prev, url]);
      showToast('Preset added!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !price) return;

    setIsSubmitting(true);
    try {
      await updateProperty(property.id, {
        title,
        location,
        price: Number(price),
        category,
        beds: category === 'plot' ? 0 : Number(beds),
        baths: category === 'plot' ? 0 : Number(baths),
        sqft: Number(sqft),
        image: gallery[0] || image || property.image,
        gallery: gallery.length > 0 ? gallery : [image || property.image],
        virtualTourUrl: virtualTourUrl.trim() || undefined,
        description
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 bg-[#FAF9F7]/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#9A7632] uppercase block">
              Manage Listing
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A192F]">
              Edit Property Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Property Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Category
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Price ($ USD)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Beds
              </label>
              <input
                type="number"
                disabled={category === 'plot'}
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Baths
              </label>
              <input
                type="number"
                disabled={category === 'plot'}
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Sqft Area
              </label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
              />
            </div>
          </div>

          {/* Robust Drag & Drop Multi-Image Upload Utility */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                Property Photo Gallery
              </label>
              <span className="text-[10px] font-bold text-[#9A7632] bg-[#FAF9F7] border border-[#C5A059]/30 px-2 py-0.5 rounded-full">
                ★ {gallery.length} Photos
              </span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                isDragging
                  ? 'border-[#C5A059] bg-[#FAF9F7] scale-[1.01]'
                  : 'border-gray-200 hover:border-[#C5A059] bg-gray-50/60'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#9A7632] shadow-sm relative">
                <Upload className="w-5 h-5" />
                <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
              </div>

              <div>
                <p className="text-xs font-bold text-gray-800">
                  Drag & Drop multiple photos here
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  or click to select from files (JPG, PNG, WEBP)
                </p>
              </div>

              {/* Upload progress indicator */}
              {uploadProgress !== null && (
                <div className="w-full max-w-xs mt-2 space-y-1 z-20 relative">
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-700">
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-[#9A7632]" />
                      Processing high-res photos...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C5A059] transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Architectural Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                Select Architectural Presets
              </span>
              <div className="grid grid-cols-6 gap-1.5">
                {JAIPUR_PRESETS.map((p, idx) => {
                  const isSelected = gallery.includes(p.url);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectPreset(p.url)}
                      className={`group relative aspect-[4/3] rounded-lg overflow-hidden border transition cursor-pointer ${
                        isSelected ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 bg-[#C5A059] text-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thumbnail Manager Grid */}
            {gallery.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                  Reorder or Delete Photos (First photo is cover)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-[4/3] bg-gray-50 border rounded-xl overflow-hidden shadow-2xs transition ${
                        idx === 0 ? 'border-[#C5A059] ring-2 ring-[#C5A059]/20' : 'border-gray-100'
                      }`}
                    >
                      <img src={img} alt="thumb" className="w-full h-full object-cover" />

                      <div className="absolute inset-x-0 top-0 p-1 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => makePrimaryCover(idx)}
                          className={`p-1 rounded bg-black/40 hover:bg-black/60 text-white transition ${
                            idx === 0 ? 'text-[#C5A059] font-bold' : ''
                          }`}
                        >
                          <Star className={`w-2.5 h-2.5 ${idx === 0 ? 'fill-yellow-400 text-yellow-400 animate-pulse' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="p-1 rounded bg-red-600 hover:bg-red-500 text-white"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-0.5 right-0.5 px-1 py-0.5 rounded bg-black/60 text-[7px] font-black text-white uppercase">
                        {idx === 0 ? '★ COVER' : `P${idx + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paste URL Input field */}
            <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5">
              <label className="text-[9px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
                <Link className="w-3 h-3 text-gray-400" />
                <span>Or paste single image URL</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="button"
                  onClick={addImageFromUrl}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0A192F] hover:bg-[#152a4a] text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Optional 360 Virtual Tour Link */}
            <div className="p-3 bg-amber-50/40 border border-amber-200/50 rounded-xl space-y-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-700 tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-600 animate-pulse" />
                <span>360° Virtual Tour Embed Link (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="e.g. https://kuula.co/share/collection/7PX9r..."
                value={virtualTourUrl}
                onChange={(e) => setVirtualTourUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 focus:outline-none focus:border-[#C5A059]"
              />
              <p className="text-[8px] text-slate-500 leading-tight">
                Provide a standard panoramic viewer link (Kuula, Pannellum, Matterport, etc.) to allow users to view interactive VR rooms.
              </p>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
              Description / Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#0A192F]"
            />
            
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleAIGenerateHighlights}
                disabled={isGeneratingAI || isGeneratingDescription}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-[#9A7632] text-white hover:text-white disabled:bg-slate-800 disabled:text-slate-400 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 disabled:bg-slate-800 disabled:text-slate-400 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer"
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
          </div>

          {/* AI Presentation Copilot Helper */}
          <div className="pt-2">
            <AIPresentationCopilot
              category={category}
              city="Jaipur"
              locality={location.split(',')[0] || 'Vaishali Nagar'}
              onApply={(newTitle, newHighlights) => {
                setTitle(newTitle);
                setDescription(newHighlights);
                showToast('AI Title & Highlights applied to edited listing successfully!');
              }}
            />
          </div>

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
              className="px-6 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-[#C5A059]" />
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
