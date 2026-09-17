export type ListingType = 'buy' | 'rent' | 'commercial' | 'pg' | 'plot' | 'sale';
export type PropertyCategory = 'apartment' | 'house' | 'villa' | 'independent_floor' | 'plot' | 'office' | 'shop' | 'pg';
export type PropertySortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'beds-desc' | 'sqft-desc';

export interface Property {
  id: string;
  title: string;
  location: string;
  locality?: string;
  city: string;
  price: number;
  priceDisplay?: string;
  category: PropertyCategory;
  listingType: ListingType;
  beds: number;
  baths: number;
  sqft: number;
  carpetArea?: number;
  image: string;
  gallery?: string[];
  description: string;
  featured?: boolean;
  verified?: boolean;
  sponsored?: boolean;
  promoted?: boolean;
  reraApproved?: boolean;
  reraId?: string;
  zeroBrokerage?: boolean;
  postedBy?: 'Owner' | 'Verified Agent' | 'Builder';
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
  createdAt: string;
  status: 'active' | 'pending' | 'sold' | 'rented';
  amenities?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  
  // Specific Metadata
  furnishing?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  possessionStatus?: 'Ready to Move' | 'Under Construction' | 'Immediate Move-In';
  facing?: 'North' | 'East' | 'North-East' | 'West' | 'South' | string;
  floor?: string;
  parking?: string;
  ageOfProperty?: string;
  
  // Rental specific
  deposit?: number;
  securityDeposit?: string | number;
  monthlyRent?: string | number;
  leaseDuration?: string;
  availableDate?: string;
  availableFrom?: string;
  petFriendly?: boolean;
  preferredTenant?: 'Bachelors' | 'Family' | 'Any' | 'Company' | string;

  // Architectural Image Metadata
  architectureStyle?: string;
  imageQuality?: 'HD' | '4K' | '4K Architectural' | 'UHD Architectural' | string;
  imageResolution?: string;
  photographerCredit?: string;
  virtualTourUrl?: string;
  
  // PG / Co-Living specific
  pgSharing?: 'Single Room' | 'Twin Sharing' | 'Triple Sharing' | '4+ Sharing';
  foodIncluded?: boolean;
  wifiIncluded?: boolean;
  genderPreference?: 'Male' | 'Female' | 'Co-Living / Any';
  
  // Plot specific
  plotDimensions?: string;
  boundaryWall?: boolean;
  cornerPlot?: boolean;
  
  // Commercial specific
  commercialType?: 'Office Space' | 'Retail Shop' | 'Showroom' | 'Warehouse' | 'Co-Working Desk';
  suitableFor?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin' | 'seller';
  phone?: string;
  avatar?: string;
  city?: string;
  companyName?: string;
  totalListings?: number;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyCity?: string;
  propertyImage: string;
  propertyPrice: number;
  propertyListingType?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  preferredDate: string;
  preferredTime: string;
  tourType?: 'In-Person Visit' | 'Live Video Tour';
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  propertyPrice?: number;
  ownerId?: string;
  ownerName?: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  message: string;
  inquiryType: 'Price Negotiation' | 'Schedule Visit' | 'Request Brochure' | 'Loan Assistance' | 'General Query';
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface ValuationRequest {
  id: string;
  propertyType: string;
  city: string;
  locality: string;
  name: string;
  email?: string;
  phone?: string;
  propertySize?: string;
  bhk?: string;
  furnishing?: string;
  estimatedPrice?: string;
  estimatedRent?: string;
  createdAt: string;
}

export interface SavedListing {
  id: string;
  userId: string;
  userEmail: string;
  propertyId: string;
  property: Property;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  city: string;
  agency?: string;
  image: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  propertiesCount: number;
  verifiedBadge?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  rating: number;
  comment: string;
  avatar?: string;
  location?: string;
  propertyType?: string;
}

export interface AgentInquiry {
  id: string;
  agentId: string;
  agentName: string;
  agentEmail?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  inquiryType?: string;
  message: string;
  createdAt: string;
}

export interface Article {
  id: string;
  tag: string;
  title: string;
  date: string;
  image: string;
  readTime: string;
  category: string;
  snippet?: string;
  summary?: string;
  author?: string;
  fullContent?: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  category: 'buyer' | 'tenant' | 'seller' | 'financial' | 'legal';
  actionText: string;
}
