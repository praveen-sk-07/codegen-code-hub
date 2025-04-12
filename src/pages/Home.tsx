
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Terminal, Book, MessagesSquare, BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import FeatureCard from '@/components/FeatureCard';
import FeedbackForm from '@/components/FeedbackForm';
import FAQSection from '@/components/FAQSection';

const Home = () => {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-codegen-blue via-codegen-purple to-codegen-lightblue text-white py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjE1IiBmaWxsPSJub25lIiBkPSJNNjAwIDAgTDYwMCA2MDAgTDAgNjAwIi8+CiAgPHBhdGggc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjE1IiBmaWxsPSJub25lIiBkPSJNMCAwIEw2MDAgNjAwIi8+Cjwvc3ZnPg==')] bg-no-repeat bg-cover opacity-20"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 z-10 relative"
        >
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="mb-6 p-3 bg-white/10 rounded-full backdrop-blur-sm border border-white/30">
              <div className="text-white text-2xl font-mono font-bold">{'</>'}</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              CODEGEN
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Advanced Online Coding Workspace
            </p>
            <p className="text-lg mb-8 max-w-lg text-white/80">
              A fully integrated platform for learners and professionals to code, practice, prepare for interviews, and access learning resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="glow-button bg-white text-codegen-blue hover:bg-white/90">
                <Link to="/compiler">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" className="glow-button border-white text-white hover:bg-white/10">
                <Link to="/resources">Explore Resources</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Explore Our Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              CODEGEN offers a comprehensive suite of tools to enhance your coding journey. From practice to resources, we've got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              title="Online Compiler"
              description="Write, run, and debug your code in multiple programming languages directly in your browser."
              icon={<Terminal className="h-8 w-8" />}
              to="/compiler"
              delay={0.1}
            />
            <FeatureCard 
              title="Coding Practice"
              description="Strengthen your skills with our curated collection of coding problems, from beginners to advanced levels."
              icon={<Book className="h-8 w-8" />}
              to="/practice"
              delay={0.2}
            />
            <FeatureCard 
              title="Interview Preparation"
              description="Get ready for technical interviews with comprehensive resources and practice materials."
              icon={<MessagesSquare className="h-8 w-8" />}
              to="/interview"
              delay={0.3}
            />
            <FeatureCard 
              title="Learning Resources"
              description="Access a rich collection of tutorials, documentation, and external resources to enhance your learning."
              icon={<BookOpen className="h-8 w-8" />}
              to="/resources"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Feedback Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold mb-2">We Value Your Feedback</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Help us improve CODEGEN by sharing your thoughts, suggestions, or reporting issues.
            </p>
          </motion.div>

          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="glow-button bg-codegen-purple hover:bg-codegen-purple/90"
              onClick={() => setFeedbackDialogOpen(true)}
            >
              <PenTool className="mr-2 h-5 w-5" />
              Share Feedback
            </Button>
          </div>
        </div>
      </section>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <FeedbackForm onClose={() => setFeedbackDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
