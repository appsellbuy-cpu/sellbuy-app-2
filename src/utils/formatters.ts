export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `₹${cr} Cr`;
  }
  
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} Lakh`;
  }
  
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatPropertyPrice(price: number, listingType?: string): string {
  if (listingType === 'rent' || listingType === 'pg') {
    if (price >= 100000) {
      const lakh = (price / 100000).toFixed(2).replace(/\.00$/, '');
      return `₹${lakh} L/mo`;
    }
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }
  
  return formatIndianCurrency(price);
}

export function formatRentPrice(price: number): string {
  if (price >= 100000) {
    const lakh = (price / 100000).toFixed(2).replace(/\.00$/, '');
    return `₹${lakh} L/mo`;
  }
  return `₹${price.toLocaleString('en-IN')}/mo`;
}

export const formatRentalPrice = formatRentPrice;

export function calculateEMI(principal: number, annualInterestRate: number = 8.5, tenureYears: number = 20): {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
} {
  const monthlyRate = annualInterestRate / (12 * 100);
  const totalMonths = tenureYears * 12;
  
  if (monthlyRate === 0) {
    const monthlyEmi = Math.round(principal / totalMonths);
    return { monthlyEmi, totalPayment: principal, totalInterest: 0 };
  }
  
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;
  
  return {
    monthlyEmi: emi,
    totalPayment,
    totalInterest
  };
}

export const JAIPUR_LOCALITIES = [
  { name: 'Vaishali Nagar', area: 'West Jaipur', count: '1,420+ Properties', icon: '🏛️', tag: 'Premier Lifestyle Hub', rentStarting: '₹18,000/mo', buyStarting: '₹75 Lakh' },
  { name: 'Jagatpura', area: 'South-East Jaipur', count: '1,890+ Properties', icon: '🎓', tag: 'IT & University Hub', rentStarting: '₹12,000/mo', buyStarting: '₹42 Lakh' },
  { name: 'Malviya Nagar', area: 'South Jaipur', count: '1,650+ Properties', icon: '🛍️', tag: 'Commercial & WTP Zone', rentStarting: '₹22,000/mo', buyStarting: '₹95 Lakh' },
  { name: 'Mansarovar', area: 'South-West Jaipur', count: '2,100+ Properties', icon: '🚇', tag: 'Metro Corridor', rentStarting: '₹14,000/mo', buyStarting: '₹55 Lakh' },
  { name: 'C-Scheme', area: 'Central Jaipur', count: '850+ Properties', icon: '👑', tag: 'Royal Luxury Enclave', rentStarting: '₹45,000/mo', buyStarting: '₹2.10 Cr' },
  { name: 'Raja Park', area: 'Central-East Jaipur', count: '920+ Properties', icon: '🛍️', tag: 'Heritage Market Zone', rentStarting: '₹20,000/mo', buyStarting: '₹88 Lakh' },
  { name: 'Tonk Road', area: 'South Jaipur Corridor', count: '1,150+ Properties', icon: '✈️', tag: 'Airport & Corporate Belt', rentStarting: '₹16,000/mo', buyStarting: '₹68 Lakh' },
  { name: 'Ajmer Road', area: 'West Growth Corridor', count: '1,780+ Properties', icon: '🛣️', tag: 'Gated Townships & SEZ', rentStarting: '₹15,000/mo', buyStarting: '₹48 Lakh' },
  { name: 'Bani Park', area: 'Central Heritage Zone', count: '640+ Properties', icon: '🏰', tag: 'Palace & Boutique Enclave', rentStarting: '₹25,000/mo', buyStarting: '₹1.25 Cr' },
  { name: 'Nirman Nagar', area: 'West Jaipur', count: '780+ Properties', icon: '🏢', tag: 'Residential Colony', rentStarting: '₹17,000/mo', buyStarting: '₹70 Lakh' },
  { name: 'Sirsi Road', area: 'North-West Jaipur', count: '910+ Properties', icon: '🌿', tag: 'Peaceful Suburbs', rentStarting: '₹13,000/mo', buyStarting: '₹45 Lakh' },
  { name: 'Gopalpura Bypass', area: 'South Jaipur', count: '1,240+ Properties', icon: '📚', tag: 'Coaching & Student Hub', rentStarting: '₹11,000/mo', buyStarting: '₹50 Lakh' }
];

export const INDIAN_CITIES = JAIPUR_LOCALITIES.map(loc => ({
  name: loc.name,
  state: 'Jaipur, Rajasthan',
  count: loc.count,
  icon: loc.icon
}));

export const POPULAR_LOCALITIES_BY_CITY: Record<string, string[]> = {
  'Jaipur': ['Vaishali Nagar', 'Jagatpura', 'Malviya Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park', 'Tonk Road', 'Ajmer Road', 'Bani Park', 'Nirman Nagar', 'Sirsi Road', 'Gopalpura Bypass']
};
