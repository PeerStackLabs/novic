import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../constants';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="fixed w-full top-0 z-50 bg-forest/95 backdrop-blur-sm text-cream border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold tracking-wide">
          Novic<span className="text-mint">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium tracking-wide hover:text-mint transition-colors ${
                location.pathname === link.path ? 'text-mint' : 'text-cream/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/donate"
            className="bg-mint text-forest px-6 py-2 rounded-full font-medium hover:bg-mint-dark transition-colors"
          >
            Donate Now
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-cream/80 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium text-cream/80 hover:text-white transition-colors border border-cream/20 px-4 py-2 rounded-full hover:border-cream/50"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-cream focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-forest border-t border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-medium text-cream hover:text-mint"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/donate"
                className="bg-mint text-forest px-6 py-3 rounded-full font-medium text-center hover:bg-mint-dark"
                onClick={() => setIsOpen(false)}
              >
                Donate Now
              </Link>
              <Link
                to="/login"
                className="text-center text-cream/80 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-center text-cream/80 hover:text-white border border-cream/20 px-4 py-2 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
