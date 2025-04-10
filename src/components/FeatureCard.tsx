
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
    >
      <div className="h-full flex flex-col p-6">
        <div className="h-14 w-14 bg-codegen-purple/10 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
          {description}
        </p>
        <Link
          to={to}
          className="flex items-center text-codegen-purple font-medium hover:underline transition-all"
        >
          Explore
          <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
