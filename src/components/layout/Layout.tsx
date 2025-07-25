
import { useState, useEffect } from 'react';
import Header from './Header';
import MobileSidebar from './MobileSidebar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import StoreFinderModal from '../modals/StoreFinderModal';
import BookingModal from '../modals/BookingModal';
import WishlistModal from '../modals/WishlistModal';
import ContactModal from '../modals/ContactModal';
import NewsletterSignupModal from '../modals/NewsletterSignupModal';
import ScrollToTop from '../ui/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  useEffect(() => {
    // Show newsletter modal after a short delay when app loads
    const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletterModal');
    if (!hasSeenNewsletter) {
      const timer = setTimeout(() => {
        setIsNewsletterOpen(true);
      }, 2000); // 2 second delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleMenuClick = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleStoreFinderOpen = () => {
    setIsStoreFinderOpen(true);
  };

  const handleStoreFinderClose = () => {
    setIsStoreFinderOpen(false);
  };

  const handleBookingOpen = () => {
    setIsBookingOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingOpen(false);
  };

  const handleWishlistOpen = () => {
    setIsWishlistOpen(true);
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
  };

  const handleContactOpen = () => {
    setIsContactOpen(true);
  };

  const handleContactClose = () => {
    setIsContactOpen(false);
  };

  const handleNewsletterClose = () => {
    setIsNewsletterOpen(false);
    localStorage.setItem('hasSeenNewsletterModal', 'true');
  };

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar onStoreFinderOpen={handleStoreFinderOpen} />
      <Header 
        onMenuClick={handleMenuClick} 
        onContactOpen={handleContactOpen}
        onBookingOpen={handleBookingOpen}
      />
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        onStoreFinderOpen={handleStoreFinderOpen}
        onBookingOpen={handleBookingOpen}
        onWishlistOpen={handleWishlistOpen}
        onContactOpen={handleContactOpen}
      />
      <main>{children}</main>
      <Footer />
      <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />
      <BookingModal isOpen={isBookingOpen} onClose={handleBookingClose} />
      <WishlistModal isOpen={isWishlistOpen} onClose={handleWishlistClose} />
      <ContactModal isOpen={isContactOpen} onClose={handleContactClose} />
      <NewsletterSignupModal isOpen={isNewsletterOpen} onClose={handleNewsletterClose} />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
