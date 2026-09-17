import React, { useState } from 'react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { 
  X, 
  Check, 
  Minus, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign, 
  Eye, 
  Calendar, 
  Scale, 
  Trash2, 
  Plus, 
  Sparkles,
  SlidersHorizontal,
  Home,
  Building,
  Trees,
  Award
} from 'lucide-react';

export const PropertyCompareModal: React.FC = () => {
  const { 
    properties,
    compareList, 
    removeFromCompare, 
    addToCompare,
    clearCompare, 
    isCompareModalOpen, 
    closeCompareModal,
    openDetail
  } = useProperties();

  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
  const [isAddPickerOpen, setIsAddPickerOpen] = useState<boolean>(false);

  if (!isCompareModalOpen) return null;

  // Available properties not yet in compare list
  const availableToAdd = (properties || []).filter(
    p => !(compareList || []).some(comp => comp.id === p.id)
  );

  // Union of all amenities across all compared properties
  const allAmenities = Array.from(
    new Set(
      compareList.flatMap(p => p.amenities || [])
    )
  ).sort();

  // Find lowest price and largest sqft for value badge
  const minPrice = compareList.length > 1 ? Math.min(...compareList.map(p => p.price)) : null;
  const maxSqft = compareList.length > 1 ? Math.max(...compareList.map(p => p.sqft)) : null;
  const minPricePerSqft = compareList.length > 1 
    ? Math.min(...compareList.map(p => Math.round(p.price / (p.sqft || 1)))) 
    : null;

  // Specs definitions
  const specs = [
    {
      id: 'price',
      label: 'Price',
      icon: DollarSign,
      render: (p: Property) => (
        <div>
          <span className="text-xl font-bold font-sans text-[#0A192F]">
            ${p.price.toLocaleString()}
          </span>
          {minPrice && p.price === minPrice && (
            <span className="ml-2 inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
              <Award className="w-3 h-3" /> Lowest Price
            </span>
          )}
        </div>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.price)).size > 1;
      }
    },
    {
      id: 'pricePerSqft',
      label: 'Price / sq ft',
      icon: DollarSign,
      render: (p: Property) => {
        const pps = Math.round(p.price / (p.sqft || 1));
        return (
          <div className="text-sm font-semibold text-gray-700">
            ${pps.toLocaleString()} / sqft
            {minPricePerSqft && pps === minPricePerSqft && (
              <span className="ml-2 inline-flex items-center text-[10px] font-bold text-[#9A7632] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#C5A059]/30">
                Best Rate
              </span>
            )}
          </div>
        );
      },
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => Math.round(p.price / (p.sqft || 1)))).size > 1;
      }
    },
    {
      id: 'type',
      label: 'Property Type',
      icon: Home,
      render: (p: Property) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider bg-gray-100 text-[#0A192F]">
          {p.category === 'house' && <Home className="w-3 h-3 text-[#C5A059]" />}
          {p.category === 'apartment' && <Building className="w-3 h-3 text-[#C5A059]" />}
          {p.category === 'plot' && <Trees className="w-3 h-3 text-[#C5A059]" />}
          {p.category}
        </span>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.category)).size > 1;
      }
    },
    {
      id: 'bedrooms',
      label: 'Bedrooms',
      icon: Bed,
      render: (p: Property) => (
        <span className="text-sm font-semibold text-gray-800">
          {p.category === 'plot' ? '— (Plot)' : `${p.beds} Beds`}
        </span>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.beds)).size > 1;
      }
    },
    {
      id: 'bathrooms',
      label: 'Bathrooms',
      icon: Bath,
      render: (p: Property) => (
        <span className="text-sm font-semibold text-gray-800">
          {p.category === 'plot' ? '— (Plot)' : `${p.baths} Baths`}
        </span>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.baths)).size > 1;
      }
    },
    {
      id: 'sqft',
      label: 'Total Area',
      icon: Square,
      render: (p: Property) => {
        const sqMeters = Math.round(p.sqft * 0.092903);
        return (
          <div>
            <span className="text-sm font-bold text-[#0A192F]">
              {p.sqft.toLocaleString()} sqft
            </span>
            <span className="text-xs text-gray-400 block font-normal">
              ≈ {sqMeters.toLocaleString()} m²
            </span>
            {maxSqft && p.sqft === maxSqft && (
              <span className="mt-1 inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                Largest Living Area
              </span>
            )}
          </div>
        );
      },
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.sqft)).size > 1;
      }
    },
    {
      id: 'location',
      label: 'Location',
      icon: MapPin,
      render: (p: Property) => (
        <div className="flex items-start gap-1 text-xs font-semibold text-gray-700">
          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
          <span>{p.location}</span>
        </div>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.location)).size > 1;
      }
    },
    {
      id: 'status',
      label: 'Listing Status',
      icon: Award,
      render: (p: Property) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {p.status ? p.status.toUpperCase() : 'ACTIVE'} &bull; Verified Title
        </span>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.status)).size > 1;
      }
    },
    {
      id: 'specialist',
      label: 'Exclusive Agent',
      icon: Calendar,
      render: (p: Property) => (
        <span className="text-xs font-medium text-gray-600">
          {p.ownerName || 'Emma Johnson'} (Senior Partner)
        </span>
      ),
      isDifferent: () => {
        if (compareList.length < 2) return false;
        return new Set(compareList.map(p => p.ownerName || '')).size > 1;
      }
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center min-h-screen p-3 sm:p-6 animate-in fade-in duration-200"
      id="property-compare-modal-backdrop"
      onClick={closeCompareModal}
    >
      <div 
        className="bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative my-auto max-h-[90vh] flex flex-col"
        id="property-compare-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A192F] text-white flex items-center justify-center shadow-sm">
              <Scale className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0A192F]">
                  Property Comparison
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF8F5] text-[#9A7632] border border-[#C5A059]/30">
                  {compareList.length} of 3 Selected
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Analyze specifications, pricing, and premium features side-by-side.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 1 && (
              <button
                type="button"
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  highlightDifferences
                    ? 'bg-[#0A192F] text-white border-[#0A192F]'
                    : 'bg-[#FAF8F5] text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
                title="Only show specifications that differ between properties"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{highlightDifferences ? 'Showing Differences' : 'Highlight Differences'}</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors p-2"
                title="Clear comparison list"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeCompareModal}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              title="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {compareList.length === 0 ? (
          <div className="p-12 text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] text-[#0A192F] border border-gray-200 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8 text-[#C5A059]" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0A192F]">
              No Properties Selected to Compare
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
              Select up to 3 properties from our portfolio by clicking the &ldquo;Compare&rdquo; button on any property card to view their specs side-by-side.
            </p>
            <button
              type="button"
              onClick={closeCompareModal}
              className="mt-6 px-6 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all shadow-md"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          /* Scrollable Side-by-Side Table Container */
          <div className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6">
            <table className="w-full border-collapse min-w-[700px]">
              <thead>
                <tr>
                  {/* Sticky Spec Title Column Header */}
                  <th className="w-48 sm:w-56 p-4 text-left align-bottom bg-[#FAF9F7]/80 rounded-tl-2xl border-b border-gray-200">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#9A7632]">
                      Overview
                    </div>
                    <div className="text-sm font-serif font-bold text-[#0A192F]">
                      Selected Properties
                    </div>
                  </th>

                  {/* Compared Properties Column Headers (Up to 3) */}
                  {compareList.map((property) => (
                    <th 
                      key={property.id} 
                      className="w-1/3 min-w-[220px] p-4 text-left align-top bg-white border-b border-gray-200 border-l border-gray-100"
                    >
                      <div className="relative group">
                        {/* Remove from comparison */}
                        <button
                          type="button"
                          onClick={() => removeFromCompare(property.id)}
                          className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow"
                          title="Remove property"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        {/* Thumbnail Image */}
                        <div 
                          className="relative h-36 sm:h-44 rounded-2xl overflow-hidden mb-3 bg-gray-100 cursor-pointer shadow-sm group-hover:shadow-md transition-shadow"
                          onClick={() => {
                            openDetail(property);
                            closeCompareModal();
                          }}
                        >
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">
                              {property.category}
                            </span>
                          </div>
                        </div>

                        {/* Property Title & Location */}
                        <h4 
                          className="text-base font-serif font-bold text-[#0A192F] hover:text-[#C5A059] transition-colors cursor-pointer line-clamp-1"
                          onClick={() => {
                            openDetail(property);
                            closeCompareModal();
                          }}
                        >
                          {property.title}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                          <span className="truncate">{property.location}</span>
                        </p>

                        {/* Quick View Details Button */}
                        <button
                          type="button"
                          onClick={() => {
                            openDetail(property);
                            closeCompareModal();
                          }}
                          className="mt-3 w-full py-2 bg-[#0A192F] text-white text-xs font-semibold rounded-xl hover:bg-[#152a4a] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </th>
                  ))}

                  {/* Empty Slot Placeholder if < 3 properties */}
                  {compareList.length < 3 && (
                    <th className="w-1/3 min-w-[200px] p-4 text-center align-middle bg-[#FAF9F7]/50 border-b border-gray-200 border-l border-dashed border-gray-200 rounded-tr-2xl">
                      <div className="p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 mb-2">
                          <Plus className="w-5 h-5" />
                        </div>
                        <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Slot {compareList.length + 1} of 3
                        </h5>
                        <p className="text-[11px] text-gray-400 mt-1 max-w-[150px]">
                          Add another property to compare specs side-by-side
                        </p>

                        {/* Add Property Dropdown / Selector Button */}
                        <div className="relative mt-3">
                          <button
                            type="button"
                            onClick={() => setIsAddPickerOpen(!isAddPickerOpen)}
                            className="px-3 py-1.5 bg-white border border-gray-300 hover:border-[#0A192F] text-[#0A192F] text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Add Property</span>
                          </button>

                          {/* Quick picker popover */}
                          {isAddPickerOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-left animate-in fade-in zoom-in-95">
                              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
                                Choose a Property
                              </div>
                              <div className="max-h-56 overflow-y-auto space-y-1">
                                {availableToAdd.map((p) => (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      addToCompare(p);
                                      setIsAddPickerOpen(false);
                                    }}
                                    className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors group"
                                  >
                                    <img
                                      src={p.image}
                                      alt={p.title}
                                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-bold text-[#0A192F] truncate group-hover:text-[#C5A059]">
                                        {p.title}
                                      </div>
                                      <div className="text-[10px] text-gray-500 truncate">
                                        ${p.price.toLocaleString()} &bull; {p.location}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Specification Rows */}
              <tbody>
                {/* Section Divider: Core Specs */}
                <tr className="bg-[#FAF8F5]/80">
                  <td 
                    colSpan={compareList.length + 1 + (compareList.length < 3 ? 1 : 0)} 
                    className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest text-[#9A7632] border-b border-gray-200"
                  >
                    Core Specifications
                  </td>
                </tr>

                {specs.map((spec) => {
                  const hasDifference = spec.isDifferent();
                  if (highlightDifferences && !hasDifference) {
                    return null;
                  }

                  const IconComp = spec.icon;

                  return (
                    <tr 
                      key={spec.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                        hasDifference && highlightDifferences ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Row Label */}
                      <td className="p-4 align-middle bg-[#FAF9F7]/40 text-xs font-bold text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-[#0A192F] shrink-0">
                            <IconComp className="w-3.5 h-3.5 text-[#C5A059]" />
                          </div>
                          <span>{spec.label}</span>
                        </div>
                      </td>

                      {/* Values for each property */}
                      {compareList.map((property) => (
                        <td 
                          key={`${property.id}-${spec.id}`} 
                          className="p-4 align-middle border-l border-gray-100"
                        >
                          {spec.render(property)}
                        </td>
                      ))}

                      {/* Empty slot placeholder */}
                      {compareList.length < 3 && (
                        <td className="p-4 align-middle border-l border-dashed border-gray-200 text-center text-gray-300 text-xs">
                          —
                        </td>
                      )}
                    </tr>
                  );
                })}

                {/* Section Divider: Features & Amenities */}
                <tr className="bg-[#FAF8F5]/80">
                  <td 
                    colSpan={compareList.length + 1 + (compareList.length < 3 ? 1 : 0)} 
                    className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-widest text-[#9A7632] border-b border-gray-200 border-t border-gray-200"
                  >
                    Amenities & Features ({allAmenities.length} Tracked)
                  </td>
                </tr>

                {allAmenities.map((amenity) => {
                  const presenceArray = compareList.map(p => Boolean(p.amenities?.includes(amenity)));
                  const isAmenityDifferent = new Set(presenceArray).size > 1;

                  if (highlightDifferences && !isAmenityDifferent) {
                    return null;
                  }

                  return (
                    <tr 
                      key={amenity}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                        isAmenityDifferent && highlightDifferences ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <td className="p-4 align-middle bg-[#FAF9F7]/40 text-xs font-medium text-gray-700">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      </td>

                      {compareList.map((property) => {
                        const hasAmenity = property.amenities?.includes(amenity);
                        return (
                          <td 
                            key={`${property.id}-${amenity}`}
                            className="p-4 align-middle border-l border-gray-100"
                          >
                            {hasAmenity ? (
                              <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                                <span>Included</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                <Minus className="w-3 h-3 text-gray-300" />
                                <span>Not listed</span>
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {compareList.length < 3 && (
                        <td className="p-4 align-middle border-l border-dashed border-gray-200 text-center text-gray-300 text-xs">
                          —
                        </td>
                      )}
                    </tr>
                  );
                })}

                {/* Footer Action Row */}
                <tr className="bg-gray-50/60">
                  <td className="p-4 text-xs font-bold text-gray-700 bg-[#FAF9F7]">
                    Ready to proceed?
                  </td>
                  {compareList.map((property) => (
                    <td key={`action-${property.id}`} className="p-4 border-l border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          openDetail(property);
                          closeCompareModal();
                        }}
                        className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08e49] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                      >
                        Schedule Tour
                      </button>
                    </td>
                  ))}
                  {compareList.length < 3 && (
                    <td className="p-4 border-l border-dashed border-gray-200 text-center">
                      <button
                        type="button"
                        onClick={() => setIsAddPickerOpen(true)}
                        className="text-xs font-semibold text-[#0A192F] hover:underline"
                      >
                        + Add 3rd property
                      </button>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-gray-100 bg-[#FAF9F7] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500">
            {compareList.length === 1 ? (
              <span>Add at least 1 more property to see full side-by-side differentials.</span>
            ) : compareList.length > 1 ? (
              <span>Tip: Click <strong>Highlight Differences</strong> to immediately spot feature variances.</span>
            ) : null}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={closeCompareModal}
              className="px-5 py-2.5 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#152a4a] transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
