
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react'; // Added import

const Resources = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now());
  
  useEffect(() => {
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [iframeKey]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(Date.now());
  };
  
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <BackButton to="/" />
            <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Access a wealth of coding tutorials, documentation and practice websites
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[calc(100vh-220px)]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <svg className="animate-spin h-10 w-10 text-codegen-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
              </div>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <iframe
              key={iframeKey}
              src="https://www.freecodecamp.org/learn"
              title="Coding Resources"
              className="w-full h-full"
              allow="accelerometer; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
