
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SplashScreen from './SplashScreen';
import Chatbot from './Chatbot';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check location changes to show splash screen
  useEffect(() => {
    setShowSplash(true);
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Check user's preferred color scheme on initial mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <>
          <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
          
          <Chatbot />
        </>
      )}
    </div>
  );
};

export default Layout;
