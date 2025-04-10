
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Github, 
  Linkedin, 
  Mail, 
  Heart,
  CheckCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-codegen-blue text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo and Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-white" />
              <span className="font-poppins font-bold text-xl">CODEGEN</span>
            </div>
            <p className="text-sm text-gray-300">
              Advanced Online Coding Workspace for students and professionals.
            </p>
            <p className="text-sm text-gray-300">
              Adhiyamaan College of Engineering
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/compiler" className="hover:text-white transition-colors">Compiler</Link></li>
              <li><Link to="/practice" className="hover:text-white transition-colors">Practice</Link></li>
              <li><Link to="/interview" className="hover:text-white transition-colors">Interview Prep</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          {/* Special Acknowledgement */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-lg mb-2">Special Acknowledgement</h3>
              <p className="text-gray-300 mb-4">
                We extend our heartfelt gratitude to <a href="https://www.linkedin.com/in/dr-g-fathima-254abb48" target="_blank" rel="noopener noreferrer" className="font-medium text-codegen-green underline hover:text-white">Dr. G. Fathima</a>, HOD of CSE Department, for her invaluable guidance as our Mini & Main Project Guide, who helped us to develop this project and contribute to our department.
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2">Project Team</h4>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://www.linkedin.com/in/mohammedkaif-aka-princekaif10" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm hover:text-codegen-green transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>Mohammed Kaif</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/mohammed-nadeem-a2b640269" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm hover:text-codegen-green transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>Mohammed Nadeem</span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/s-praveen07" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm hover:text-codegen-green transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>S. Praveen</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} CODEGEN. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <span className="text-sm text-gray-300 flex items-center">
              Made with <Heart size={14} className="mx-1 text-red-400 animate-pulse" /> at Adhiyamaan College of Engineering
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
