
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
      className={`feature-card ${className}`}
      style={{ perspective: '1000px' }}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <div className="h-full flex flex-col p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md">
            <div className="h-14 w-14 bg-codegen-purple/10 dark:bg-codegen-purple/20 rounded-lg flex items-center justify-center mb-4 text-codegen-purple">
              {icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
              {description}
            </p>
          </div>
        </div>
        <div className="flip-card-back">
          <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-codegen-purple/90 to-codegen-blue/90 text-white rounded-xl">
            <h3 className="text-xl font-semibold mb-4">{title}</h3>
            <Link to={to} className="px-4 py-2 bg-white text-codegen-purple rounded-lg hover:bg-gray-100 transition-colors flex items-center">
              Explore
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
