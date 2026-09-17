import { Property, User, ViewingBooking, ValuationRequest, PropertyInquiry, SavedListing, Agent, Testimonial, Article, AgentInquiry } from '../types';
import { INITIAL_PROPERTIES, INITIAL_AGENTS, INITIAL_TESTIMONIALS, INITIAL_ARTICLES } from '../data/initialData';

const BASE_URL = '/api';

export const api = {
  // Properties
  async getProperties(params?: {
    category?: string;
    listingType?: string;
    city?: string;
    locality?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    bhk?: number | string;
    furnishing?: string;
    featured?: boolean;
    ownerId?: string;
  }): Promise<Property[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.listingType && params.listingType !== 'all') query.set('listingType', params.listingType);
      if (params?.city && params.city !== 'all' && params.city !== 'All India') query.set('city', params.city);
      if (params?.locality && params.locality !== 'all') query.set('locality', params.locality);
      if (params?.search) query.set('search', params.search);
      if (params?.minPrice) query.set('minPrice', String(params.minPrice));
      if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
      if (params?.bhk && params.bhk !== 'all') query.set('bhk', String(params.bhk));
      if (params?.furnishing && params.furnishing !== 'all') query.set('furnishing', params.furnishing);
      if (params?.featured) query.set('featured', 'true');
      if (params?.ownerId) query.set('ownerId', params.ownerId);

      const url = `${BASE_URL}/properties${query.toString() ? `?${query.toString()}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch properties from server');
      const data = await res.json();
      localStorage.setItem('navikx_properties_cache', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('API error, falling back to local storage cache:', err);
      const local = localStorage.getItem('navikx_properties_cache');
      if (local) {
        try {
          return JSON.parse(local);
        } catch {
          // ignore
        }
      }
      return INITIAL_PROPERTIES;
    }
  },

  async getProperty(id: string): Promise<Property | null> {
    try {
      const res = await fetch(`${BASE_URL}/properties/${id}`);
      if (!res.ok) throw new Error('Property not found');
      return await res.json();
    } catch (err) {
      const props = await this.getProperties();
      return props.find(p => p.id === id) || null;
    }
  },

  async createProperty(propertyData: Partial<Property>, token?: string): Promise<Property> {
    try {
      const res = await fetch(`${BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(propertyData)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create property');
      }
      return await res.json();
    } catch (err) {
      console.warn('API create property fallback to local:', err);
      const newProp: Property = {
        id: 'prop-local-' + Date.now(),
        title: propertyData.title || 'Prime Property',
        location: propertyData.location || 'Mumbai, Maharashtra',
        city: propertyData.city || 'Mumbai',
        locality: propertyData.locality || 'Bandra West',
        price: Number(propertyData.price) || 50000,
        priceDisplay: propertyData.priceDisplay || `₹${Number(propertyData.price || 50000).toLocaleString('en-IN')}`,
        category: propertyData.category || 'apartment',
        listingType: propertyData.listingType || 'rent',
        beds: Number(propertyData.beds) || 2,
        baths: Number(propertyData.baths) || 2,
        sqft: Number(propertyData.sqft) || 1200,
        carpetArea: Number(propertyData.carpetArea) || 1000,
        image: propertyData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
        gallery: [propertyData.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'],
        description: propertyData.description || 'Verified property in prime residential locality.',
        verified: true,
        zeroBrokerage: true,
        postedBy: 'Owner',
        ownerId: propertyData.ownerId || 'user-default',
        ownerName: propertyData.ownerName || 'Alexander Wright',
        ownerPhone: propertyData.ownerPhone || '+91 98201 45678',
        createdAt: new Date().toISOString(),
        status: 'active',
        furnishing: propertyData.furnishing || 'Semi-Furnished',
        possessionStatus: 'Immediate Move-In'
      };
      return newProp;
    }
  },

  async updateProperty(id: string, propertyData: Partial<Property>, token?: string): Promise<Property> {
    const res = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(propertyData)
    });
    if (!res.ok) throw new Error('Failed to update property');
    return await res.json();
  },

  async deleteProperty(id: string, token?: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to delete property');
    return true;
  },

  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed');
    }
    return await res.json();
  },

  async register(data: { name: string; email: string; password: string; role?: string; phone?: string; city?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Registration failed');
    }
    return await res.json();
  },

  async getMe(token: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Session invalid');
    const data = await res.json();
    return data.user;
  },

  // Bookings / Property Visits
  async getBookings(email?: string, userId?: string): Promise<ViewingBooking[]> {
    const query = new URLSearchParams();
    if (email) query.set('email', email);
    if (userId) query.set('userId', userId);
    const res = await fetch(`${BASE_URL}/bookings?${query.toString()}`);
    if (!res.ok) return [];
    return await res.json();
  },

  async createBooking(bookingData: Partial<ViewingBooking>): Promise<ViewingBooking> {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to book viewing tour');
    }
    return await res.json();
  },

  async cancelBooking(id: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // Inquiries / Direct Leads
  async submitInquiry(data: {
    propertyId: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string;
    message: string;
    inquiryType?: 'Price Negotiation' | 'Schedule Visit' | 'Request Brochure' | 'Loan Assistance' | 'General Query';
  }): Promise<{ success: boolean; inquiry: PropertyInquiry }> {
    const res = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit inquiry');
    return await res.json();
  },

  async getInquiries(params?: { email?: string; ownerId?: string }): Promise<PropertyInquiry[]> {
    const query = new URLSearchParams();
    if (params?.email) query.set('email', params.email);
    if (params?.ownerId) query.set('ownerId', params.ownerId);
    const res = await fetch(`${BASE_URL}/inquiries?${query.toString()}`);
    if (!res.ok) return [];
    return await res.json();
  },

  // Valuation
  async submitValuation(data: {
    propertyType: string;
    city?: string;
    locality?: string;
    location?: string;
    name: string;
    email?: string;
    phone?: string;
    propertySize?: string;
    bhk?: string;
    furnishing?: string;
  }): Promise<{ estimate: string; estimateRent: string; record: ValuationRequest }> {
    const payload = {
      propertyType: data.propertyType,
      city: data.city || data.location || 'Mumbai',
      locality: data.locality || data.location || 'Central',
      name: data.name,
      email: data.email,
      phone: data.phone,
      propertySize: data.propertySize,
      bhk: data.bhk,
      furnishing: data.furnishing
    };
    const res = await fetch(`${BASE_URL}/valuation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Valuation request failed');
    return await res.json();
  },

  // Agent Inquiries
  async getAgentInquiries(): Promise<AgentInquiry[]> {
    return [
      {
        id: 'inq-1',
        agentId: 'agent-1',
        agentName: 'Rajesh Sharma',
        userName: 'Pooja Verma',
        userEmail: 'pooja.verma@example.com',
        userPhone: '+91 98201 11223',
        message: 'Interested in booking a 3 BHK site visit this Saturday.',
        createdAt: '2025-03-01T10:30:00Z'
      }
    ];
  },

  async submitAgentInquiry(data: Omit<AgentInquiry, 'id' | 'createdAt'>): Promise<{ success: boolean; inquiry: AgentInquiry }> {
    const inq: AgentInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return { success: true, inquiry: inq };
  },

  // Saved Listings (Favorites)
  async getSavedListings(userId?: string, email?: string): Promise<SavedListing[]> {
    try {
      const query = new URLSearchParams();
      if (userId) query.set('userId', userId);
      if (email) query.set('email', email);
      const res = await fetch(`${BASE_URL}/saved-listings?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch saved listings');
      return await res.json();
    } catch {
      return [];
    }
  },

  async toggleSavedListing(propertyId: string, property: Property, userId?: string, email?: string): Promise<{ isSaved: boolean; savedListing?: SavedListing }> {
    const res = await fetch(`${BASE_URL}/saved-listings/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId, property, userId, userEmail: email })
    });
    if (!res.ok) throw new Error('Failed to toggle saved listing');
    return await res.json();
  },

  async removeSavedListing(propertyId: string, userId?: string, email?: string): Promise<boolean> {
    const query = new URLSearchParams();
    if (userId) query.set('userId', userId);
    if (email) query.set('email', email);
    const res = await fetch(`${BASE_URL}/saved-listings/${propertyId}?${query.toString()}`, {
      method: 'DELETE'
    });
    return res.ok;
  },

  // Newsletter
  async subscribeNewsletter(email: string): Promise<boolean> {
    const res = await fetch(`${BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.ok;
  },

  // Auxiliary data
  async getAgents(): Promise<Agent[]> {
    const res = await fetch(`${BASE_URL}/agents`);
    if (!res.ok) return INITIAL_AGENTS;
    return await res.json();
  },

  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch(`${BASE_URL}/testimonials`);
    if (!res.ok) return INITIAL_TESTIMONIALS;
    return await res.json();
  },

  async getArticles(): Promise<Article[]> {
    const res = await fetch(`${BASE_URL}/articles`);
    if (!res.ok) return INITIAL_ARTICLES;
    return await res.json();
  }
};
