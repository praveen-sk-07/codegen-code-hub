
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  delay?: number;
  className?: string;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  to,
  delay = 0,
  className = ""
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className={`feature-card flip-card ${className}`}
    >
      <div className="h-full flip-card-inner">
        {/* Front side of the card */}
        <div className="flip-card-front h-full flex flex-col p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl">
          <div className="h-14 w-14 bg-codegen-purple/10 dark:bg-codegen-purple/20 rounded-lg flex items-center justify-center mb-4 text-codegen-purple">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            {description}
          </p>
          <div className="flex items-center text-codegen-purple font-medium">
            Explore
            <ArrowRight size={18} className="ml-2" />
          </div>
        </div>
        
        {/* Back side of the card */}
        <div className="flip-card-back h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-codegen-purple to-codegen-blue border border-gray-100 dark:border-gray-700 rounded-xl text-white">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <p className="mb-6">Click below to start using this feature</p>
            <Link
              to={to}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white text-codegen-purple font-medium transition-all hover:bg-opacity-90"
            >
              Get Started
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
