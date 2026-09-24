import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Property, PropertyCategory, PropertySortOption, ViewingBooking, ValuationRequest, SavedListing } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialData';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  rentalProperties: Property[];
  category: string;
  setCategory: (category: string) => void;
  listingTypeFilter: 'all' | 'sale' | 'rent';
  setListingTypeFilter: (type: 'all' | 'sale' | 'rent') => void;
  setListingType: (type: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  sortBy: PropertySortOption;
  setSortBy: (sort: PropertySortOption) => void;
  searchLocation: string;
  setSearchLocation: (loc: string) => void;
  propertyTypeFilter: string;
  setPropertyTypeFilter: (type: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  minPrice: number;
  setMinPrice: (min: number) => void;
  maxPrice: number;
  setMaxPrice: (max: number) => void;
  resetAllFilters: () => void;
  uniqueLocations: { location: string; count: number }[];
  isFiltered: boolean;
  // Rental specific filters
  rentPriceRange: string;
  setRentPriceRange: (range: string) => void;
  rentFurnishedFilter: 'all' | 'furnished' | 'unfurnished';
  setRentFurnishedFilter: (val: 'all' | 'furnished' | 'unfurnished') => void;
  rentPetFriendlyOnly: boolean;
  setRentPetFriendlyOnly: (val: boolean) => void;
  rentBedsFilter: string;
  setRentBedsFilter: (val: string) => void;
  rentSearchLocation: string;
  setRentSearchLocation: (val: string) => void;
  rentSortBy: PropertySortOption;
  setRentSortBy: (sort: PropertySortOption) => void;
  resetRentFilters: () => void;
  isRentFiltered: boolean;
  compareList: Property[];
  addToCompare: (property: Property) => boolean;
  removeFromCompare: (propertyId: string) => void;
  toggleCompare: (property: Property) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  isInCompare: (propertyId: string) => boolean;
  savedListings: SavedListing[];
  savedProperties: Property[];
  isSaved: (propertyId: string) => boolean;
  toggleFavorite: (property: Property) => Promise<boolean>;
  removeSavedListing: (propertyId: string) => Promise<boolean>;
  loadSavedListings: () => Promise<void>;
  selectedProperty: Property | null;
  openDetail: (property: Property) => void;
  closeDetail: () => void;
  isSellModalOpen: boolean;
  openSellModal: () => void;
  closeSellModal: () => void;
  editingProperty: Property | null;
  openEditModal: (property: Property) => void;
  closeEditModal: () => void;
  bookings: ViewingBooking[];
  loading: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  addProperty: (propertyData: Partial<Property>) => Promise<Property>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<Property>;
  deleteProperty: (id: string) => Promise<boolean>;
  addBooking: (bookingData: Partial<ViewingBooking>) => Promise<ViewingBooking>;
  cancelBooking: (id: string) => Promise<boolean>;
  submitValuation: (data: { propertyType: string; location: string; name: string; email?: string; phone?: string; propertySize?: string }) => Promise<{ estimate: string }>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('navikx_properties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached properties don't have rental properties, merge initial ones
          const hasRentals = parsed.some((p: Property) => p.listingType === 'rent');
          if (!hasRentals) {
            const merged = [...parsed, ...INITIAL_PROPERTIES.filter(p => p.listingType === 'rent')];
            localStorage.setItem('navikx_properties', JSON.stringify(merged));
            return merged;
          }
          return parsed;
        }
      } catch {
        return INITIAL_PROPERTIES;
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [category, setCategoryState] = useState<string>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [selectedCityState, setSelectedCityState] = useState<string>('All India');
  const [sortBy, setSortByState] = useState<PropertySortOption>('featured');
  const [searchLocation, setSearchLocation] = useState<string>('');

  const setSelectedCity = useCallback((city: string) => {
    setSelectedCityState(city);
    const loc = (city === 'All India' || !city) ? '' : city;
    setSearchLocation(loc);
    setRentSearchLocation(loc);
  }, []);

  const setListingType = useCallback((type: string) => {
    if (type === 'rent' || type === 'sale' || type === 'all') {
      setListingTypeFilter(type as any);
    }
  }, []);
  const [propertyTypeFilter, setPropertyTypeFilterState] = useState<string>('all');
  const [priceRange, setPriceRangeState] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);

  // Rental specific filters state
  const [rentPriceRange, setRentPriceRange] = useState<string>('all');
  const [rentFurnishedFilter, setRentFurnishedFilter] = useState<'all' | 'furnished' | 'unfurnished'>('all');
  const [rentPetFriendlyOnly, setRentPetFriendlyOnly] = useState<boolean>(false);
  const [rentBedsFilter, setRentBedsFilter] = useState<string>('all');
  const [rentSearchLocation, setRentSearchLocation] = useState<string>('');
  const [rentSortBy, setRentSortBy] = useState<PropertySortOption>('featured');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [bookings, setBookings] = useState<ViewingBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compare properties list (up to 3)
  const [compareList, setCompareList] = useState<Property[]>(() => {
    const saved = localStorage.getItem('navikx_compare');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Saved Listings (Favorites)
  const [savedListings, setSavedListings] = useState<SavedListing[]>(() => {
    const saved = localStorage.getItem('navikx_saved_listings');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('navikx_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('navikx_saved_listings', JSON.stringify(savedListings));
  }, [savedListings]);

  const savedProperties = React.useMemo(() => {
    return savedListings.map(s => s.property).filter(Boolean) as Property[];
  }, [savedListings]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  }, []);

  const isInCompare = useCallback((propertyId: string) => {
    return compareList.some(p => p.id === propertyId);
  }, [compareList]);

  const addToCompare = useCallback((property: Property): boolean => {
    if (compareList.some(p => p.id === property.id)) {
      return true;
    }
    if (compareList.length >= 3) {
      showToast('You can compare up to 3 properties at a time. Remove one to add another.');
      return false;
    }
    setCompareList(prev => [...prev, property]);
    showToast(`Added "${property.title}" to comparison (${compareList.length + 1}/3).`);
    return true;
  }, [compareList, showToast]);

  const removeFromCompare = useCallback((propertyId: string) => {
    setCompareList(prev => {
      const filtered = prev.filter(p => p.id !== propertyId);
      const removed = prev.find(p => p.id === propertyId);
      if (removed) {
        showToast(`Removed "${removed.title}" from comparison.`);
      }
      return filtered;
    });
  }, [showToast]);

  const toggleCompare = useCallback((property: Property) => {
    if (compareList.some(p => p.id === property.id)) {
      removeFromCompare(property.id);
    } else {
      addToCompare(property);
    }
  }, [compareList, removeFromCompare, addToCompare]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    showToast('Comparison list cleared.');
  }, [showToast]);

  const openCompareModal = useCallback(() => {
    setIsCompareModalOpen(true);
  }, []);

  const closeCompareModal = useCallback(() => {
    setIsCompareModalOpen(false);
  }, []);

  // Synchronize category and propertyTypeFilter
  const setCategory = useCallback((cat: string) => {
    setCategoryState(cat);
    setPropertyTypeFilterState(cat);
  }, []);

  const setPropertyTypeFilter = useCallback((type: string) => {
    setPropertyTypeFilterState(type);
    setCategoryState(type);
  }, []);

  const setPriceRange = useCallback((range: string) => {
    setPriceRangeState(range);
    if (range === 'all') {
      setMinPrice(0);
      setMaxPrice(0);
    } else if (range === 'under-800k' || range === 'under-1m') {
      setMinPrice(0);
      setMaxPrice(range === 'under-800k' ? 800000 : 1000000);
    } else if (range === '800k-1.5m') {
      setMinPrice(800000);
      setMaxPrice(1500000);
    } else if (range === '1m-2m') {
      setMinPrice(1000000);
      setMaxPrice(2000000);
    } else if (range === '1.5m-2.5m') {
      setMinPrice(1500000);
      setMaxPrice(2500000);
    } else if (range === '2m-3m') {
      setMinPrice(2000000);
      setMaxPrice(3000000);
    } else if (range === 'above-2m') {
      setMinPrice(2000000);
      setMaxPrice(0);
    } else if (range === 'above-2.5m') {
      setMinPrice(2500000);
      setMaxPrice(0);
    }
  }, []);

  const setSortBy = useCallback((sort: PropertySortOption) => {
    setSortByState(sort);
  }, []);

  const resetAllFilters = useCallback(() => {
    setCategoryState('all');
    setPropertyTypeFilterState('all');
    setSearchLocation('');
    setPriceRangeState('all');
    setMinPrice(0);
    setMaxPrice(0);
    setSortByState('featured');
  }, []);

  // Compute unique locations with listings count
  const uniqueLocations = React.useMemo(() => {
    const map = new Map<string, number>();
    properties.forEach((p) => {
      const loc = p.location?.trim();
      if (loc) {
        map.set(loc, (map.get(loc) || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([location, count]) => ({ location, count }));
  }, [properties]);

  const isFiltered = Boolean(
    category !== 'all' ||
    propertyTypeFilter !== 'all' ||
    searchLocation.trim().length > 0 ||
    priceRange !== 'all' ||
    minPrice > 0 ||
    maxPrice > 0 ||
    sortBy !== 'featured'
  );

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProperties();
      if (data && data.length > 0) {
        setProperties(data);
        localStorage.setItem('navikx_properties', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Failed to load from API, keeping cached properties', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      const email = user?.email;
      const data = await api.getBookings(email);
      setBookings(data);
    } catch (err) {
      console.warn('Failed to fetch bookings', err);
    }
  }, [user]);

  const loadSavedListings = useCallback(async () => {
    try {
      const data = await api.getSavedListings(user?.id, user?.email);
      setSavedListings(data);
    } catch (err) {
      console.warn('Failed to fetch saved listings', err);
    }
  }, [user]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    loadSavedListings();
  }, [loadSavedListings]);

  const isSaved = useCallback((propertyId: string) => {
    return savedListings.some(s => s.propertyId === propertyId);
  }, [savedListings]);

  const toggleFavorite = useCallback(async (property: Property): Promise<boolean> => {
    const wasSaved = savedListings.some(s => s.propertyId === property.id);
    
    // Optimistic UI update
    if (wasSaved) {
      setSavedListings(prev => prev.filter(s => s.propertyId !== property.id));
      showToast(`Removed "${property.title}" from Saved Listings`);
    } else {
      const optimisticItem: SavedListing = {
        id: 'saved-opt-' + Date.now(),
        userId: user?.id || 'user-default',
        userEmail: user?.email || 'appsellbuy@gmail.com',
        propertyId: property.id,
        property,
        createdAt: new Date().toISOString()
      };
      setSavedListings(prev => [optimisticItem, ...prev]);
      showToast(`Added "${property.title}" to Saved Listings ❤️`);
    }

    try {
      const result = await api.toggleSavedListing(property.id, property, user?.id, user?.email);
      // Synchronize with server response
      if (result.savedListing && !wasSaved) {
        setSavedListings(prev => [result.savedListing!, ...prev.filter(s => s.propertyId !== property.id)]);
      }
      return result.isSaved;
    } catch (err) {
      console.warn('Failed to toggle favorite on server:', err);
      return !wasSaved;
    }
  }, [savedListings, user, showToast]);

  const removeSavedListing = useCallback(async (propertyId: string): Promise<boolean> => {
    const target = savedListings.find(s => s.propertyId === propertyId);
    const title = target?.property?.title || 'Property';

    // Optimistic removal
    setSavedListings(prev => prev.filter(s => s.propertyId !== propertyId));
    showToast(`Removed "${title}" from Saved Listings`);

    try {
      await api.removeSavedListing(propertyId, user?.id, user?.email);
      return true;
    } catch (err) {
      console.warn('Failed to remove saved listing on server:', err);
      return true;
    }
  }, [savedListings, user, showToast]);

  // Client filtering & sorting
  const filteredProperties = React.useMemo(() => {
    const list = (properties || []).filter(prop => {
      // Category filter
      const activeCat = category !== 'all' ? category : propertyTypeFilter !== 'all' ? propertyTypeFilter : null;
      if (activeCat && (prop.category || '').toLowerCase() !== activeCat.toLowerCase()) {
        return false;
      }

      // Location / Text search
      if (searchLocation.trim()) {
        const q = searchLocation.toLowerCase().trim();
        const match =
          (prop.location || '').toLowerCase().includes(q) ||
          (prop.title || '').toLowerCase().includes(q) ||
          (prop.description || '').toLowerCase().includes(q);
        if (!match) return false;
      }

      // Numerical Price Limits (Min & Max)
      if (minPrice > 0 && prop.price < minPrice) return false;
      if (maxPrice > 0 && prop.price > maxPrice) return false;

      // Price range fallback presets if min/max not explicitly applied
      if (minPrice === 0 && maxPrice === 0 && priceRange !== 'all') {
        if (priceRange === 'under-800k' && prop.price >= 800000) return false;
        if (priceRange === 'under-1m' && prop.price >= 1000000) return false;
        if (priceRange === '800k-1.5m' && (prop.price < 800000 || prop.price > 1500000)) return false;
        if (priceRange === '1m-2m' && (prop.price < 1000000 || prop.price > 2000000)) return false;
        if (priceRange === '1.5m-2.5m' && (prop.price < 1500000 || prop.price > 2500000)) return false;
        if (priceRange === '2m-3m' && (prop.price < 2000000 || prop.price > 3000000)) return false;
        if (priceRange === 'above-2m' && prop.price <= 2000000) return false;
        if (priceRange === 'above-2.5m' && prop.price <= 2500000) return false;
      }

      return true;
    });

    // Apply sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (sortBy === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      if (sortBy === 'beds-desc') {
        return (b.beds || 0) - (a.beds || 0);
      }
      if (sortBy === 'sqft-desc') {
        return (b.sqft || 0) - (a.sqft || 0);
      }
      // 'featured' / default: featured items first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [properties, category, propertyTypeFilter, searchLocation, minPrice, maxPrice, priceRange, sortBy]);

  // Dedicated Rental Properties Filtering & Sorting
  const rentalProperties = React.useMemo(() => {
    const list = (properties || []).filter(prop => {
      // Must be a rental listing
      if (prop.listingType !== 'rent') {
        return false;
      }

      // Location / text search
      if (rentSearchLocation.trim()) {
        const q = rentSearchLocation.toLowerCase().trim();
        const match =
          (prop.location || '').toLowerCase().includes(q) ||
          (prop.title || '').toLowerCase().includes(q) ||
          (prop.description || '').toLowerCase().includes(q);
        if (!match) return false;
      }

      // Furnished filter
      if (rentFurnishedFilter === 'furnished' && !prop.furnished) return false;
      if (rentFurnishedFilter === 'unfurnished' && prop.furnished) return false;

      // Pet Friendly filter
      if (rentPetFriendlyOnly && !prop.petFriendly) return false;

      // Bedrooms filter
      if (rentBedsFilter !== 'all') {
        if (rentBedsFilter === '4+') {
          if ((prop.beds || 0) < 4) return false;
        } else {
          const targetBeds = parseInt(rentBedsFilter, 10);
          if (prop.beds !== targetBeds) return false;
        }
      }

      // Monthly Rent Price Range
      if (rentPriceRange !== 'all') {
        if (rentPriceRange === 'under-3.5k' && prop.price >= 3500) return false;
        if (rentPriceRange === '3.5k-7k' && (prop.price < 3500 || prop.price > 7000)) return false;
        if (rentPriceRange === '7k-12k' && (prop.price < 7000 || prop.price > 12000)) return false;
        if (rentPriceRange === 'above-12k' && prop.price <= 12000) return false;
      }

      return true;
    });

    // Apply rental sorting
    return [...list].sort((a, b) => {
      if (rentSortBy === 'price-asc') return a.price - b.price;
      if (rentSortBy === 'price-desc') return b.price - a.price;
      if (rentSortBy === 'newest') {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      }
      if (rentSortBy === 'beds-desc') return (b.beds || 0) - (a.beds || 0);
      if (rentSortBy === 'sqft-desc') return (b.sqft || 0) - (a.sqft || 0);
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [properties, rentSearchLocation, rentFurnishedFilter, rentPetFriendlyOnly, rentBedsFilter, rentPriceRange, rentSortBy]);

  const isRentFiltered = rentPriceRange !== 'all' || rentFurnishedFilter !== 'all' || rentPetFriendlyOnly || rentBedsFilter !== 'all' || rentSearchLocation.trim() !== '' || rentSortBy !== 'featured';

  const resetRentFilters = useCallback(() => {
    setRentPriceRange('all');
    setRentFurnishedFilter('all');
    setRentPetFriendlyOnly(false);
    setRentBedsFilter('all');
    setRentSearchLocation('');
    setRentSortBy('featured');
    showToast('Rental filters reset');
  }, [showToast]);

  const addProperty = async (propertyData: Partial<Property>): Promise<Property> => {
    setLoading(true);
    try {
      const created = await api.createProperty(
        {
          ...propertyData,
          ownerId: user?.id || 'user-default',
          ownerName: user?.name || 'Alexander Wright'
        },
        token || undefined
      );

      setProperties(prev => {
        const next = [created, ...prev];
        localStorage.setItem('navikx_properties', JSON.stringify(next));
        return next;
      });
      showToast(`Property "${created.title}" successfully listed!`);
      return created;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>): Promise<Property> => {
    setLoading(true);
    try {
      let updated: Property;
      try {
        updated = await api.updateProperty(id, propertyData, token || undefined);
      } catch {
        // Fallback local update
        const existing = properties.find(p => p.id === id);
        updated = { ...(existing as Property), ...propertyData };
      }

      setProperties(prev => {
        const next = prev.map(p => (p.id === id ? updated : p));
        localStorage.setItem('navikx_properties', JSON.stringify(next));
        return next;
      });

      if (selectedProperty?.id === id) {
        setSelectedProperty(updated);
      }

      showToast(`Property "${updated.title}" updated successfully!`);
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      try {
        await api.deleteProperty(id, token || undefined);
      } catch (err) {
        console.warn('API delete failed, updating local state', err);
      }

      setProperties(prev => {
        const next = prev.filter(p => p.id !== id);
        localStorage.setItem('navikx_properties', JSON.stringify(next));
        return next;
      });

      if (selectedProperty?.id === id) {
        setSelectedProperty(null);
      }

      showToast('Property deleted successfully.');
      return true;
    } finally {
      setLoading(false);
    }
  };

  const addBooking = async (bookingData: Partial<ViewingBooking>): Promise<ViewingBooking> => {
    const newBooking = await api.createBooking({
      ...bookingData,
      userId: user?.id,
      userName: bookingData.userName || user?.name || 'Guest User',
      userEmail: bookingData.userEmail || user?.email || 'guest@navikx.com'
    });

    setBookings(prev => [newBooking, ...prev]);
    showToast(`Viewing scheduled for ${newBooking.preferredDate}! Confirmation sent to ${newBooking.userEmail}.`);
    return newBooking;
  };

  const cancelBooking = async (id: string): Promise<boolean> => {
    await api.cancelBooking(id);
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast('Viewing booking has been cancelled.');
    return true;
  };

  const submitValuation = async (data: { propertyType: string; location: string; name: string; email?: string; phone?: string; propertySize?: string }) => {
    const res = await api.submitValuation(data);
    showToast(`Valuation calculated: Estimated value ${res.estimate}`);
    return res;
  };

  const openDetail = (property: Property) => {
    setSelectedProperty(property);
  };

  const closeDetail = () => {
    setSelectedProperty(null);
  };

  const openSellModal = () => {
    setIsSellModalOpen(true);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
  };

  const openEditModal = (property: Property) => {
    setEditingProperty(property);
  };

  const closeEditModal = () => {
    setEditingProperty(null);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        rentalProperties,
        category,
        setCategory,
        listingTypeFilter,
        setListingTypeFilter,
        setListingType,
        selectedCity: selectedCityState,
        setSelectedCity,
        sortBy,
        setSortBy,
        searchLocation,
        setSearchLocation,
        propertyTypeFilter,
        setPropertyTypeFilter,
        priceRange,
        setPriceRange,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        resetAllFilters,
        uniqueLocations,
        isFiltered,
        rentPriceRange,
        setRentPriceRange,
        rentFurnishedFilter,
        setRentFurnishedFilter,
        rentPetFriendlyOnly,
        setRentPetFriendlyOnly,
        rentBedsFilter,
        setRentBedsFilter,
        rentSearchLocation,
        setRentSearchLocation,
        rentSortBy,
        setRentSortBy,
        resetRentFilters,
        isRentFiltered,
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
        isInCompare,
        savedListings,
        savedProperties,
        isSaved,
        toggleFavorite,
        removeSavedListing,
        loadSavedListings,
        selectedProperty,
        openDetail,
        closeDetail,
        isSellModalOpen,
        openSellModal,
        closeSellModal,
        editingProperty,
        openEditModal,
        closeEditModal,
        bookings,
        loading,
        toastMessage,
        showToast,
        addProperty,
        updateProperty,
        deleteProperty,
        addBooking,
        cancelBooking,
        submitValuation
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
