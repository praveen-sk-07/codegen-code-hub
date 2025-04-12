
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Code, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleTheme, isDarkMode }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-codegen-darkblue/80 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <Code className="h-8 w-8 text-codegen-purple" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-codegen-blue border-t-transparent border-l-transparent"
            />
          </div>
          <span className="font-poppins font-bold text-xl text-codegen-blue dark:text-white">
            CODEGEN
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          <Link to="/compiler" className="navbar-link">
            Compiler
          </Link>
          <Link to="/practice" className="navbar-link">
            Practice
          </Link>
          <Link to="/interview" className="navbar-link">
            Interview Prep
          </Link>
          <Link to="/resources" className="navbar-link">
            Resources
          </Link>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-codegen-darkblue shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Home
            </Link>
            <Link to="/compiler" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Compiler
            </Link>
            <Link to="/practice" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Practice
            </Link>
            <Link to="/interview" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Interview Prep
            </Link>
            <Link to="/resources" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Resources
            </Link>
            <Link to="/login" className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
              Login
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
