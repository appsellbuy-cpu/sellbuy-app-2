import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { PageTitleArea } from './components/PageTitleArea';
import { PopularCitiesSection } from './components/PopularCitiesSection';
import { JaipurInsightsSection } from './components/JaipurInsightsSection';
import { FeaturedPropertiesSection } from './components/FeaturedPropertiesSection';
import { BrowseByCategorySection } from './components/BrowseByCategorySection';
import { ServicesSection } from './components/ServicesSection';
import { AudienceHighlightsSection } from './components/AudienceHighlightsSection';
import { NewsAndGuidesSection } from './components/NewsAndGuidesSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { PostPropertyCTASection } from './components/PostPropertyCTASection';
import { Footer } from './components/Footer';

// Dedicated Sub-Pages
import { RentPage } from './pages/RentPage';
import { BuyPage } from './pages/BuyPage';
import { CommercialPage } from './pages/CommercialPage';
import { PGPage } from './pages/PGPage';
import { PlotsPage } from './pages/PlotsPage';
import { ServicesPage } from './pages/ServicesPage';
import { NewsGuidePage } from './pages/NewsGuidePage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { UserProfilePage } from './pages/UserProfilePage';

// Modals
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PostPropertyModal } from './components/PostPropertyModal';
import { ScheduleTourModal } from './components/ScheduleTourModal';
import { InquiryModal } from './components/InquiryModal';
import { EMICalculatorModal } from './components/EMICalculatorModal';
import { PropertyValuationModal } from './components/PropertyValuationModal';
import { RentAgreementModal } from './components/RentAgreementModal';
import { CompareModal } from './components/CompareModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { AuthModal } from './components/AuthModal';
import { CitySelectorModal } from './components/CitySelectorModal';

import { Property, Article } from './types';

const MainAppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const { toastMessage, searchLocation, setSelectedCity, setListingType, setCategory } = useProperties();

  // Active modal controls
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [inquiryProperty, setInquiryProperty] = useState<Property | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [isPostPropertyOpen, setIsPostPropertyOpen] = useState(false);
  const [isEMICalculatorOpen, setIsEMICalculatorOpen] = useState(false);
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isRentAgreementOpen, setIsRentAgreementOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // Sync hash routing or scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: string, extra?: { listingType?: string; category?: string; city?: string }) => {
    if (extra?.listingType) setListingType(extra.listingType as any);
    if (extra?.category) setCategory(extra.category);
    if (extra?.city) setSelectedCity(extra.city);
    setCurrentView(view);
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    if (currentView === 'home') {
      setCurrentView('buy');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header / Navigation */}
      <NavBar
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedCity={searchLocation || 'All India'}
        onSelectCity={handleCitySelect}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
        onOpenRentAgreement={() => setIsRentAgreementOpen(true)}
      />

      {/* All Platform Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onOpenBooking={(p) => setBookingProperty(p)}
        onOpenInquiry={(p) => setInquiryProperty(p)}
        onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      <PostPropertyModal
        isOpen={isPostPropertyOpen}
        onClose={() => setIsPostPropertyOpen(false)}
      />

      <ScheduleTourModal
        property={bookingProperty}
        onClose={() => setBookingProperty(null)}
      />

      <InquiryModal
        property={inquiryProperty}
        onClose={() => setInquiryProperty(null)}
      />

      <EMICalculatorModal
        isOpen={isEMICalculatorOpen}
        onClose={() => setIsEMICalculatorOpen(false)}
      />

      <PropertyValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
      />

      <RentAgreementModal
        isOpen={isRentAgreementOpen}
        onClose={() => setIsRentAgreementOpen(false)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectProperty={(p) => setSelectedProperty(p)}
        onOpenBooking={(p) => setBookingProperty(p)}
      />

      <ArticleReaderModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <AuthModal />

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={searchLocation || 'All India'}
        onSelectCity={handleCitySelect}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Reference Image Styled Indian Real Estate Hero */}
            <Hero
              onNavigate={handleNavigate}
              onOpenPostProperty={() => setIsPostPropertyOpen(true)}
            />

            {/* Page Title Area */}
            <PageTitleArea
              title={`Flats for Rent: Houses, Apartments and Flats for rent in ${searchLocation && searchLocation !== 'All India' ? searchLocation : 'Jaipur'}`}
              subtitle={`Browse 2,450+ verified properties for rent and sale in ${searchLocation && searchLocation !== 'All India' ? searchLocation : 'Jaipur'}, featuring JDA Patta approval, zero brokerage direct owner listings, and instant virtual tours.`}
              totalCount={2450}
              locationName={searchLocation && searchLocation !== 'All India' ? searchLocation : 'Jaipur'}
              activeType="rent"
              categoryTags={['0% Brokerage Direct Owners', 'JDA Scheme Patta Approved', 'Furnished & Semi-Furnished', '100% Verified Properties']}
            />

            {/* Popular Cities / Localities Grid */}
            <PopularCitiesSection
              onSelectCity={handleCitySelect}
              selectedCity={searchLocation || 'All India'}
              onOpenAllCities={() => setIsCityModalOpen(true)}
            />

            {/* Jaipur Real Estate Insights Section */}
            <JaipurInsightsSection
              onSelectLocality={(locality) => {
                handleCitySelect(locality);
                handleNavigate('buy');
              }}
              onOpenValuation={() => setIsValuationOpen(true)}
              onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
            />

            {/* Featured Properties (For Rent & For Sale with Indian format) */}
            <FeaturedPropertiesSection
              onOpenDetail={(p) => setSelectedProperty(p)}
              onSelectProperty={(p) => setSelectedProperty(p)}
              onOpenBooking={(p) => setBookingProperty(p)}
              onOpenInquiry={(p) => setInquiryProperty(p)}
              onNavigate={handleNavigate}
              onOpenPostProperty={() => setIsPostPropertyOpen(true)}
              onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
            />

            {/* Browse by Category (Flats, Houses, Commercial, PG, Land) */}
            <BrowseByCategorySection
              onSelectCategory={(catId, subCat) => {
                if (catId === 'pg') handleNavigate('pg', { category: subCat });
                else if (catId === 'plot') handleNavigate('plots', { category: subCat });
                else if (catId === 'commercial') handleNavigate('commercial', { category: subCat });
                else if (catId === 'rent') handleNavigate('rent', { category: subCat });
                else handleNavigate('buy', { category: subCat });
              }}
            />

            {/* Comprehensive Services Section */}
            <ServicesSection
              onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
              onOpenValuation={() => setIsValuationOpen(true)}
              onOpenPostProperty={() => setIsPostPropertyOpen(true)}
              onOpenRentAgreement={() => setIsRentAgreementOpen(true)}
              onNavigate={handleNavigate}
            />

            {/* Audience Highlights: For Tenants, For Buyers, For Sellers */}
            <AudienceHighlightsSection
              onNavigate={handleNavigate}
              onOpenPostProperty={() => setIsPostPropertyOpen(true)}
              onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
              onOpenValuation={() => setIsValuationOpen(true)}
            />

            {/* Property News, Market Trends & Buyer Guides */}
            <NewsAndGuidesSection
              onSelectArticle={(art) => setSelectedArticle(art)}
              onViewAllNews={() => setCurrentView('news-guide')}
            />

            {/* Mobile App Download Section */}
            <AppDownloadSection />

            {/* Post Property FREE Action Section */}
            <PostPropertyCTASection
              onOpenPostProperty={() => setIsPostPropertyOpen(true)}
              onOpenValuation={() => setIsValuationOpen(true)}
            />
          </>
        )}

        {currentView === 'rent' && (
          <RentPage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
            onOpenInquiry={(p) => setInquiryProperty(p)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
            onOpenRentAgreement={() => setIsRentAgreementOpen(true)}
          />
        )}

        {currentView === 'buy' && (
          <BuyPage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
            onOpenInquiry={(p) => setInquiryProperty(p)}
            onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          />
        )}

        {currentView === 'commercial' && (
          <CommercialPage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
            onOpenInquiry={(p) => setInquiryProperty(p)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          />
        )}

        {currentView === 'pg' && (
          <PGPage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
            onOpenInquiry={(p) => setInquiryProperty(p)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          />
        )}

        {currentView === 'plots' && (
          <PlotsPage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
            onOpenInquiry={(p) => setInquiryProperty(p)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
          />
        )}

        {currentView === 'services' && (
          <ServicesPage
            onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
            onOpenValuation={() => setIsValuationOpen(true)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
            onOpenRentAgreement={() => setIsRentAgreementOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'news-guide' && (
          <NewsGuidePage
            onSelectArticle={(art) => setSelectedArticle(art)}
          />
        )}

        {currentView === 'dashboard' && (
          <UserDashboardPage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
            onOpenInquiry={(p) => setInquiryProperty(p)}
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'seller-dashboard' && (
          <SellerDashboardPage
            onOpenPostProperty={() => setIsPostPropertyOpen(true)}
            onOpenValuation={() => setIsValuationOpen(true)}
            onSelectProperty={(p) => setSelectedProperty(p)}
          />
        )}

        {currentView === 'profile' && (
          <UserProfilePage
            onSelectProperty={(p) => setSelectedProperty(p)}
            onOpenBooking={(p) => setBookingProperty(p)}
          />
        )}
      </main>

      {/* Comprehensive Indian Real Estate Mega-Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenEMICalculator={() => setIsEMICalculatorOpen(true)}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenPostProperty={() => setIsPostPropertyOpen(true)}
      />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <MainAppContent />
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
