'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, Heart, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

interface NavbarProps {
  onSearchOpen: () => void;
  onCartOpen: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchOpen, onCartOpen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();
  const { user, cart } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    // Set dark mode as default
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');

    // Load wishlist count from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistCount(JSON.parse(savedWishlist).length);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  // Choose logo based on theme
  const logoSrc = isDarkMode ? "/IMG-20250305-WA0003-removebg-preview.png" : "/image.png";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-custom border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
                <span className="text-sm font-medium">
                  {isMenuOpen ? 'Close' : 'Menu'}
                </span>
              </motion.button>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={logoSrc}
                alt="RARITONE"
                className="h-12 w-auto cursor-pointer transition-transform"
                onClick={() => navigate('/')}
              />
            </div>

            {/* Right - Icons */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistClick}
                className="relative text-white hover:text-gray-300 transition-colors"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/cart')}
                className="relative text-white hover:text-gray-300 transition-colors"
              >
                <ShoppingBag size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSearchOpen}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <Search size={20} />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleProfileClick}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <User size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black"
          >
            <div className="flex flex-col items-center justify-center min-h-screen space-y-8 text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <button 
                  onClick={() => { navigate('/catalog'); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-white hover:text-gray-300 transition-colors"
                >
                  Shop
                </button>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <button 
                  onClick={() => { navigate('/scan'); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-white hover:text-gray-300 transition-colors"
                >
                  Body Scan
                </button>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <button 
                  onClick={() => { handleProfileClick(); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-white hover:text-gray-300 transition-colors"
                >
                  Profile
                </button>
              </motion.div>
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <button 
                  onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                  className="text-4xl font-light text-white hover:text-gray-300 transition-colors"
                >
                  Settings
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Navbar;