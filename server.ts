import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
import { INITIAL_PROPERTIES, INITIAL_AGENTS, INITIAL_TESTIMONIALS, INITIAL_ARTICLES } from './src/data/initialData';
import { Property, User, ViewingBooking, ValuationRequest, PropertyInquiry, SavedListing } from './src/types';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

interface DatabaseSchema {
  properties: Property[];
  users: (User & { passwordHash: string })[];
  bookings: ViewingBooking[];
  valuations: ValuationRequest[];
  newsletter: string[];
  inquiries: PropertyInquiry[];
  savedListings: SavedListing[];
}

function loadDatabase(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.properties || parsed.properties.length === 0) {
        parsed.properties = INITIAL_PROPERTIES;
      }
      if (!parsed.savedListings) parsed.savedListings = [];
      if (!parsed.inquiries) parsed.inquiries = [];
      return parsed;
    }
  } catch (err) {
    console.error('Error reading db file, re-initializing:', err);
  }

  const initialDb: DatabaseSchema = {
    properties: INITIAL_PROPERTIES,
    users: [
      {
        id: 'user-default',
        name: 'Alexander Wright',
        email: 'appsellbuy@gmail.com',
        role: 'agent',
        phone: '+91 98201 45678',
        city: 'Mumbai',
        passwordHash: 'password123',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'user-seller-1',
        name: 'Vikramaditya Singhania',
        email: 'vikram.singhania@gmail.com',
        role: 'seller',
        phone: '+91 98201 45678',
        city: 'Mumbai',
        passwordHash: 'password123',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'user-admin',
        name: 'Pooja Hegde (Admin)',
        email: 'admin@navikx.in',
        role: 'admin',
        phone: '+91 99001 23456',
        city: 'Bangalore',
        passwordHash: 'admin123',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop'
      }
    ],
    bookings: [
      {
        id: 'book-1',
        propertyId: 'rent-ind-1',
        propertyTitle: '3 BHK Luxury High-Rise with Panoramic Skyline View',
        propertyLocation: 'Bandra West, Mumbai',
        propertyCity: 'Mumbai',
        propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
        propertyPrice: 85000,
        propertyListingType: 'rent',
        userName: 'Alexander Wright',
        userEmail: 'appsellbuy@gmail.com',
        userPhone: '+91 98201 45678',
        preferredDate: '2026-03-25',
        preferredTime: '15:30',
        tourType: 'In-Person Visit',
        notes: 'Would like to check covered car parking slots and verify society maintenance rules.',
        status: 'confirmed',
        createdAt: '2026-03-01T10:00:00Z'
      }
    ],
    valuations: [],
    newsletter: ['appsellbuy@gmail.com'],
    inquiries: [
      {
        id: 'inq-1',
        propertyId: 'rent-ind-1',
        propertyTitle: '3 BHK Luxury High-Rise with Panoramic Skyline View',
        propertyLocation: 'Bandra West, Mumbai',
        ownerId: 'owner-1',
        ownerName: 'Vikramaditya Singhania',
        senderName: 'Alexander Wright',
        senderEmail: 'appsellbuy@gmail.com',
        senderPhone: '+91 98201 45678',
        inquiryType: 'Schedule Visit',
        message: 'Hello, I am interested in renting this 3 BHK in Bandra West for a 2-year lease. Please connect.',
        status: 'new',
        createdAt: '2026-03-02T11:00:00Z'
      }
    ],
    savedListings: [
      {
        id: 'saved-default-1',
        userId: 'user-default',
        userEmail: 'appsellbuy@gmail.com',
        propertyId: 'rent-ind-1',
        property: INITIAL_PROPERTIES[0],
        createdAt: '2026-03-01T10:00:00Z'
      }
    ]
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  let db = loadDatabase();

  app.use(express.json());

  // API ROUTES

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', propertiesCount: db.properties.length });
  });

  // Get all properties with rich filtering
  app.get('/api/properties', (req: Request, res: Response) => {
    const { category, listingType, city, locality, search, minPrice, maxPrice, bhk, furnishing, featured, ownerId } = req.query;
    let list = [...db.properties];

    if (listingType && listingType !== 'all') {
      const lt = String(listingType).toLowerCase();
      list = list.filter(p => {
        if (lt === 'buy' || lt === 'sale') return p.listingType === 'buy' || p.listingType === 'sale';
        return p.listingType === lt;
      });
    }

    if (category && category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (city && city !== 'all' && city !== 'All India') {
      list = list.filter(p => p.city.toLowerCase() === String(city).toLowerCase() || p.location.toLowerCase().includes(String(city).toLowerCase()));
    }

    if (locality && locality !== 'all') {
      list = list.filter(p => p.location.toLowerCase().includes(String(locality).toLowerCase()) || p.locality?.toLowerCase().includes(String(locality).toLowerCase()));
    }

    if (bhk && bhk !== 'all') {
      const bhkNum = Number(bhk);
      if (!isNaN(bhkNum)) {
        if (bhkNum >= 4) {
          list = list.filter(p => p.beds >= 4);
        } else {
          list = list.filter(p => p.beds === bhkNum);
        }
      }
    }

    if (furnishing && furnishing !== 'all') {
      list = list.filter(p => p.furnishing?.toLowerCase() === String(furnishing).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          (p.locality && p.locality.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.amenities && p.amenities.some(a => a.toLowerCase().includes(q)))
      );
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) list = list.filter(p => p.price >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) list = list.filter(p => p.price <= max);
    }

    if (featured === 'true') {
      list = list.filter(p => p.featured);
    }

    if (ownerId) {
      list = list.filter(p => p.ownerId === String(ownerId));
    }

    res.json(list);
  });

  // Get single property by ID
  app.get('/api/properties/:id', (req: Request, res: Response) => {
    const property = db.properties.find(p => p.id === req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  });

  // Create property
  app.post('/api/properties', (req: Request, res: Response) => {
    const {
      title,
      location,
      city,
      locality,
      price,
      priceDisplay,
      category,
      listingType,
      beds,
      baths,
      sqft,
      carpetArea,
      image,
      gallery,
      description,
      ownerId,
      ownerName,
      ownerPhone,
      furnishing,
      possessionStatus,
      facing,
      floor,
      parking,
      deposit,
      leaseDuration,
      petFriendly,
      preferredTenant,
      pgSharing,
      foodIncluded,
      commercialType,
      amenities
    } = req.body;

    if (!title || !location || !price || !category) {
      return res.status(400).json({ error: 'Title, location, price, and category are required' });
    }

    const effectiveCity = city || (location.includes(',') ? location.split(',').pop()?.trim() : 'Mumbai') || 'Mumbai';
    const effectiveListingType = listingType || 'rent';

    const newProperty: Property = {
      id: 'prop-ind-' + Date.now(),
      title: String(title).trim(),
      location: String(location).trim(),
      city: effectiveCity,
      locality: locality || location.split(',')[0]?.trim(),
      price: Number(price),
      priceDisplay: priceDisplay || (effectiveListingType === 'rent' || effectiveListingType === 'pg' ? `₹${Number(price).toLocaleString('en-IN')}/month` : `₹${Number(price).toLocaleString('en-IN')}`),
      category: category,
      listingType: effectiveListingType,
      beds: Number(beds) || 0,
      baths: Number(baths) || 0,
      sqft: Number(sqft) || 1000,
      carpetArea: Number(carpetArea) || Number(sqft) || 850,
      image: image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'],
      description: description || 'Prime Indian property in prominent connected locality with 24x7 water and power backup.',
      featured: false,
      verified: true,
      reraApproved: effectiveListingType === 'buy' || effectiveListingType === 'sale',
      zeroBrokerage: true,
      postedBy: 'Owner',
      ownerId: ownerId || 'user-default',
      ownerName: ownerName || 'Property Owner',
      ownerPhone: ownerPhone || '+91 98201 45678',
      createdAt: new Date().toISOString(),
      status: 'active',
      furnishing: furnishing || 'Semi-Furnished',
      possessionStatus: possessionStatus || 'Immediate Move-In',
      facing: facing || 'North-East',
      floor: floor || '5th of 14 Floors',
      parking: parking || '1 Covered Parking',
      deposit: deposit ? Number(deposit) : undefined,
      leaseDuration: leaseDuration || '11 Months',
      petFriendly: Boolean(petFriendly),
      preferredTenant: preferredTenant || 'Any',
      pgSharing: pgSharing,
      foodIncluded: Boolean(foodIncluded),
      commercialType: commercialType,
      amenities: Array.isArray(amenities) && amenities.length > 0 ? amenities : ['24x7 Power Backup', 'Elevator', 'Security / CCTV', 'Vastu Compliant', 'Water Storage']
    };

    db.properties.unshift(newProperty);
    saveDatabase(db);
    res.status(201).json(newProperty);
  });

  // Update property
  app.put('/api/properties/:id', (req: Request, res: Response) => {
    const idx = db.properties.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const current = db.properties[idx];
    const updated: Property = {
      ...current,
      ...req.body,
      id: current.id,
      price: req.body.price !== undefined ? Number(req.body.price) : current.price,
      beds: req.body.beds !== undefined ? Number(req.body.beds) : current.beds,
      baths: req.body.baths !== undefined ? Number(req.body.baths) : current.baths,
      sqft: req.body.sqft !== undefined ? Number(req.body.sqft) : current.sqft
    };

    db.properties[idx] = updated;
    saveDatabase(db);
    res.json(updated);
  });

  // Delete property
  app.delete('/api/properties/:id', (req: Request, res: Response) => {
    const idx = db.properties.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const removed = db.properties.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, removedId: removed.id });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, role, phone, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (db.users.some(u => u.email === cleanEmail)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: String(name).trim(),
      email: cleanEmail,
      role: (role || 'user') as 'user' | 'agent' | 'admin' | 'seller',
      phone: phone || '+91 98200 00000',
      city: city || 'Mumbai',
      passwordHash: String(password),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
    };

    db.users.push(newUser);
    saveDatabase(db);

    const safeUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      city: newUser.city,
      avatar: newUser.avatar
    };

    res.status(201).json({ user: safeUser, token: 'token-' + newUser.id });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const found = db.users.find(u => u.email === cleanEmail);

    if (!found || found.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const safeUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      city: found.city,
      avatar: found.avatar
    };

    res.json({ user: safeUser, token: 'token-' + found.id });
  });

  // Auth: Get current user
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer token-')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = authHeader.replace('Bearer token-', '');
    const found = db.users.find(u => u.id === userId);
    if (!found) {
      return res.status(404).json({ error: 'User not found' });
    }

    const safeUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      city: found.city,
      avatar: found.avatar
    };

    res.json({ user: safeUser });
  });

  // Bookings / Property Visits
  app.get('/api/bookings', (req: Request, res: Response) => {
    const { email, userId } = req.query;
    let list = db.bookings || [];
    if (email) {
      list = list.filter(b => b.userEmail.toLowerCase() === String(email).toLowerCase());
    } else if (userId) {
      list = list.filter(b => b.userId === String(userId));
    }
    res.json(list);
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const { propertyId, userName, userEmail, userPhone, preferredDate, preferredTime, tourType, notes, userId } = req.body;

    if (!propertyId || !userName || !userEmail || !preferredDate) {
      return res.status(400).json({ error: 'Property, name, email, and preferred date are required' });
    }

    const property = db.properties.find(p => p.id === propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const newBooking: ViewingBooking = {
      id: 'book-' + Date.now(),
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyCity: property.city,
      propertyImage: property.image,
      propertyPrice: property.price,
      propertyListingType: property.listingType,
      userId: userId || undefined,
      userName: String(userName).trim(),
      userEmail: String(userEmail).toLowerCase().trim(),
      userPhone: userPhone || '+91 98200 00000',
      preferredDate: String(preferredDate),
      preferredTime: preferredTime || '11:00 AM',
      tourType: tourType || 'In-Person Visit',
      notes: notes || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    if (!db.bookings) db.bookings = [];
    db.bookings.unshift(newBooking);
    saveDatabase(db);
    res.status(201).json(newBooking);
  });

  app.delete('/api/bookings/:id', (req: Request, res: Response) => {
    if (!db.bookings) return res.json({ success: true });
    const idx = db.bookings.findIndex(b => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const removed = db.bookings.splice(idx, 1)[0];
    saveDatabase(db);
    res.json({ success: true, removedId: removed.id });
  });

  // Inquiries / Leads
  app.get('/api/inquiries', (req: Request, res: Response) => {
    const { email, ownerId } = req.query;
    let list = db.inquiries || [];
    if (email) {
      list = list.filter(i => i.senderEmail.toLowerCase() === String(email).toLowerCase());
    }
    if (ownerId) {
      list = list.filter(i => i.ownerId === String(ownerId));
    }
    res.json(list);
  });

  app.post('/api/inquiries', (req: Request, res: Response) => {
    const { propertyId, senderName, senderEmail, senderPhone, message, inquiryType } = req.body;

    if (!propertyId || !senderName || !senderEmail || !message) {
      return res.status(400).json({ error: 'Property ID, name, email, and message are required' });
    }

    const prop = db.properties.find(p => p.id === propertyId);
    const newInq: PropertyInquiry = {
      id: 'inq-' + Date.now(),
      propertyId,
      propertyTitle: prop?.title || 'Property',
      propertyLocation: prop?.location || 'India',
      propertyImage: prop?.image,
      propertyPrice: prop?.price,
      ownerId: prop?.ownerId || 'owner-1',
      ownerName: prop?.ownerName || 'Owner',
      senderName,
      senderEmail: String(senderEmail).toLowerCase().trim(),
      senderPhone: senderPhone || '+91 98200 00000',
      message,
      inquiryType: inquiryType || 'General Query',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    if (!db.inquiries) db.inquiries = [];
    db.inquiries.unshift(newInq);
    saveDatabase(db);
    res.status(201).json({ success: true, inquiry: newInq });
  });

  // Valuation
  app.post('/api/valuation', (req: Request, res: Response) => {
    const { propertyType, city, locality, name, email, phone, propertySize, bhk, furnishing } = req.body;
    if (!city || !locality || !name) {
      return res.status(400).json({ error: 'City, locality, and name are required' });
    }

    const sizeNum = Number(propertySize) || 1200;
    const baseRatePerSqft = city.toLowerCase() === 'mumbai' ? 22000 : city.toLowerCase() === 'gurgaon' ? 14000 : city.toLowerCase() === 'bangalore' ? 11000 : 8500;
    const estimatedValue = Math.round(sizeNum * baseRatePerSqft);
    const estimatedRentVal = Math.round(estimatedValue * 0.0032);

    const estPriceStr = estimatedValue >= 10000000 ? `₹${(estimatedValue / 10000000).toFixed(2)} Cr` : `₹${(estimatedValue / 100000).toFixed(2)} Lakh`;
    const estRentStr = `₹${estimatedRentVal.toLocaleString('en-IN')}/month`;

    const record: ValuationRequest = {
      id: 'val-' + Date.now(),
      propertyType: propertyType || 'Apartment',
      city,
      locality,
      name,
      email,
      phone,
      propertySize: `${sizeNum} sq.ft`,
      bhk: bhk || '3 BHK',
      furnishing: furnishing || 'Semi-Furnished',
      estimatedPrice: estPriceStr,
      estimatedRent: estRentStr,
      createdAt: new Date().toISOString()
    };

    if (!db.valuations) db.valuations = [];
    db.valuations.push(record);
    saveDatabase(db);
    res.status(201).json({ success: true, record, estimate: estPriceStr, estimateRent: estRentStr });
  });

  // Saved Listings / Favorites
  app.get('/api/saved-listings', (req: Request, res: Response) => {
    const { userId, email } = req.query;
    let list = db.savedListings || [];

    if (userId) {
      list = list.filter(s => s.userId === String(userId));
    } else if (email) {
      list = list.filter(s => s.userEmail.toLowerCase() === String(email).toLowerCase());
    }

    const hydratedList = list.map(item => {
      const liveProperty = db.properties.find(p => p.id === item.propertyId);
      return {
        ...item,
        property: liveProperty || item.property
      };
    });

    res.json(hydratedList);
  });

  app.post('/api/saved-listings/toggle', (req: Request, res: Response) => {
    const { propertyId, userId, userEmail, property } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required' });
    }

    if (!db.savedListings) db.savedListings = [];

    const effectiveUserId = userId || 'user-default';
    const effectiveEmail = userEmail ? String(userEmail).toLowerCase().trim() : 'appsellbuy@gmail.com';

    const existingIndex = db.savedListings.findIndex(
      s => s.propertyId === propertyId && (s.userId === effectiveUserId || s.userEmail.toLowerCase() === effectiveEmail)
    );

    if (existingIndex !== -1) {
      db.savedListings.splice(existingIndex, 1);
      saveDatabase(db);
      return res.json({ isSaved: false, propertyId, message: 'Removed from saved listings' });
    } else {
      const targetProperty = db.properties.find(p => p.id === propertyId) || property;
      if (!targetProperty) {
        return res.status(404).json({ error: 'Property not found' });
      }

      const newSavedItem: SavedListing = {
        id: 'saved-' + Date.now(),
        userId: effectiveUserId,
        userEmail: effectiveEmail,
        propertyId: targetProperty.id,
        property: targetProperty,
        createdAt: new Date().toISOString()
      };

      db.savedListings.unshift(newSavedItem);
      saveDatabase(db);
      return res.status(201).json({ isSaved: true, savedListing: newSavedItem, message: 'Saved to listings' });
    }
  });

  app.delete('/api/saved-listings/:propertyId', (req: Request, res: Response) => {
    const { propertyId } = req.params;
    const { userId, email } = req.query;

    if (!db.savedListings) return res.json({ success: true });

    const effectiveUserId = userId ? String(userId) : null;
    const effectiveEmail = email ? String(email).toLowerCase().trim() : null;

    db.savedListings = db.savedListings.filter(s => {
      if (s.propertyId !== propertyId) return true;
      if (effectiveUserId && s.userId !== effectiveUserId) return true;
      if (effectiveEmail && s.userEmail.toLowerCase() !== effectiveEmail) return true;
      return false;
    });

    saveDatabase(db);
    res.json({ success: true, removedPropertyId: propertyId });
  });

  // Newsletter
  app.post('/api/newsletter', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }
    const cleanEmail = String(email).toLowerCase().trim();
    if (!db.newsletter) db.newsletter = [];
    if (!db.newsletter.includes(cleanEmail)) {
      db.newsletter.push(cleanEmail);
      saveDatabase(db);
    }
    res.json({ success: true, message: 'Subscribed successfully to real estate alerts' });
  });

  // Auxiliary
  app.get('/api/agents', (req: Request, res: Response) => res.json(INITIAL_AGENTS));
  app.get('/api/testimonials', (req: Request, res: Response) => res.json(INITIAL_TESTIMONIALS));
  app.get('/api/articles', (req: Request, res: Response) => res.json(INITIAL_ARTICLES));

  // AI Highlights Generation using Gemini 3.8 Flash model
  app.post('/api/gemini/generate-highlights', async (req: Request, res: Response) => {
    try {
      const { features, location, price, category, beds, listingType } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: 'GEMINI_API_KEY environment variable is not set. Please supply your API key under Settings > Secrets to enable instant AI-powered title & highlights generation.' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an elite real estate marketer in India. Convert the following property details into a compelling, highly appealing property title and exactly 5 catchy, professional highlights (bullet points) to boost listing appeal.
      
Property details:
- Listing Type: ${listingType || 'sale'}
- Category: ${category || 'apartment'}
- Bed/BHK Count: ${beds || 3} BHK
- Pricing: ${price || 'Request Price'}
- Location: ${location || 'Jaipur'}
- Key Features: ${features || 'Modern amenities, spacious layout, prime area'}

Generate a JSON object with exactly these fields:
{
  "title": "A captivating, highly professional, compelling listing title (around 10-14 words) featuring the property configuration, prime USP, and exact location to boost appeal",
  "highlights": [
    "Catchy bullet highlight 1 with appropriate premium emojis",
    "Catchy bullet highlight 2 with appropriate premium emojis",
    "Catchy bullet highlight 3 with appropriate premium emojis",
    "Catchy bullet highlight 4 with appropriate premium emojis",
    "Catchy bullet highlight 5 with appropriate premium emojis"
  ]
}

Ensure the output is valid JSON, containing only the JSON structure. Do not wrap in markdown code blocks or add any trailing comments.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || '';
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        const cleanJsonStr = text.replace(/```json/i, '').replace(/```/, '').trim();
        data = JSON.parse(cleanJsonStr);
      }

      res.json(data);
    } catch (error: any) {
      console.error('Gemini generate highlights error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate highlights via AI' });
    }
  });

  // AI Description Generation using Gemini 3.8 Flash model
  app.post('/api/gemini/generate-description', async (req: Request, res: Response) => {
    try {
      const { title, location, price, amenities, category, beds, listingType } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: 'GEMINI_API_KEY environment variable is not set. Please supply your API key under Settings > Secrets to enable instant AI-powered SEO property description.' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an elite SEO real estate writer in India. Write a highly compelling, professional, and persuasive real estate listing description for a property listing.
      
Property parameters:
- Property Name/Title: "${title || ''}"
- Listing Type: ${listingType || 'sale'}
- Property Category: ${category || 'apartment'}
- Bed/BHK Count: ${beds || 3} BHK
- Pricing: ${price || 'Request Price'}
- Location: ${location || 'Jaipur'}
- Key Amenities: ${amenities ? amenities.join(', ') : 'Modern amenities'}

Write a detailed, structured, SEO-friendly description of about 150-250 words. Include:
1. An engaging overview hook emphasizing premium lifestyle or high ROI using the property name/title.
2. Property features & location advantage.
3. List of key amenities provided.
4. Call to action.

Ensure the output is written in beautiful natural paragraph style. Return the output as a valid JSON object of the form:
{
  "description": "The detailed SEO-optimized property description text"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || '';
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        const cleanJsonStr = text.replace(/```json/i, '').replace(/```/, '').trim();
        data = JSON.parse(cleanJsonStr);
      }

      res.json(data);
    } catch (error: any) {
      console.error('Gemini generate description error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate property description' });
    }
  });

  // AI Smart Suggest endpoint to extract property metadata from user inputs
  app.post('/api/gemini/smart-suggest', async (req: Request, res: Response) => {
    try {
      const { title, description, location } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ 
          error: 'GEMINI_API_KEY environment variable is not set. Please supply your API key under Settings > Secrets to enable instant AI-powered metadata auto-fill.' 
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `You are an intelligent real estate analyzer in India. Read the following property details and location, and extract/suggest highly accurate structured metadata values.

Property details:
- Property Name/Title: "${title || ''}"
- Description/Highlights: "${description || ''}"
- Location: "${location || ''}"

Infer the most accurate values based on semantic details. For example:
- If location is in a high-rise locality, "Lift / Elevator" or "24/7 Power Backup" are highly recommended amenities.
- If property name suggests a traditional villa or luxury house, "Vastu Compliant" or "Covered Car Parking" are recommended.
- If the title says "Brand New" or "Under Construction", property age should be "0-1 Years". If it says "well-maintained old" or similar, infer "5-10 Years" or "10+ Years".
- If a facing direction (like "East Facing", "North-East", etc.) is mentioned or implied, extract it. Otherwise, select a highly plausible facing direction (e.g., "East" or "North-East" are highly preferred in Vastu).

Supported property age: "0-1 Years", "1-5 Years", "5-10 Years", "10+ Years"
Supported facing options: "East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"
Supported furnishing options: "Fully Furnished", "Semi-Furnished", "Unfurnished"
Supported bedrooms (BHK): 1, 2, 3, 4, 5
Supported bathrooms: 1, 2, 3, 4

Extract/infer suggested amenities strictly from this exact pool of options (return only strings that are identical to these):
[
  "Lift / Elevator",
  "24/7 Power Backup",
  "Covered Car Parking",
  "Security Guard & CCTV",
  "Gymnasium",
  "Swimming Pool",
  "Club House",
  "Children Play Area",
  "Jogging Track",
  "Vastu Compliant",
  "Piped Gas Connection",
  "Rainwater Harvesting"
]

Generate a JSON object of this exact schema:
{
  "propertyAge": "Plausible age option",
  "facing": "Plausible facing option",
  "furnishing": "Plausible furnishing option",
  "beds": 2,
  "baths": 2,
  "suggestedAmenities": ["Lift / Elevator", "Vastu Compliant"]
}

Ensure the output is strictly valid JSON containing only the JSON structure. Do not wrap in markdown code blocks or add comments.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || '';
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        const cleanJsonStr = text.replace(/```json/i, '').replace(/```/, '').trim();
        data = JSON.parse(cleanJsonStr);
      }

      res.json(data);
    } catch (error: any) {
      console.error('Gemini smart suggest error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze and auto-fill metadata via AI' });
    }
  });

  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Indian Real Estate Marketplace server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
