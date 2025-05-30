
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, validateSession, refreshUserSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Validate the current session token
    const isSessionValid = validateSession();
    
    // If session validation fails but user is still considered authenticated,
    // try to refresh the session token
    if (!isSessionValid && isAuthenticated) {
      refreshUserSession();
    }
    
    // If still not authenticated after validation, redirect to login
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to access this feature",
        variant: "default",
      });
      navigate('/login', { state: { from: location.pathname } });
    }
    
    // Set up periodic session validation
    const intervalId = setInterval(() => {
      if (!validateSession() && isAuthenticated) {
        refreshUserSession();
      }
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, isLoading, navigate, location.pathname, toast, validateSession, refreshUserSession]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
          }}
          className="text-codegen-purple text-5xl mb-4"
        >
          {'</>'}
        </motion.div>
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;
