
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CodeIcon } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      }
    }),
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const logoVariants = {
    hidden: { opacity: 0, rotate: -20 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        delay: 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const letters = "CODEGEN".split("");

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-codegen-blue via-codegen-purple to-codegen-lightblue z-50"
      variants={containerVariants}
      animate={isAnimating ? "visible" : "exit"}
      initial="visible"
    >
      <motion.div
        className="flex items-center mb-6"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white rounded-lg p-2 shadow-lg">
          <CodeIcon size={48} className="text-codegen-purple" />
        </div>
      </motion.div>
      
      <div className="flex items-center justify-center">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            className="text-white text-6xl md:text-7xl font-bold splash-letter"
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              display: 'inline-block',
              marginRight: letter === ' ' ? '0.5rem' : '0.1rem'
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      
      <motion.div 
        className="mt-4 text-white/80 text-xl"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 0.8, duration: 0.5 }
        }}
      >
        Advanced Online Coding Workspace
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
