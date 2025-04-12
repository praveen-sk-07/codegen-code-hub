
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const practiceQuestions = [
  { 
    id: 'beginners',
    title: 'Beginners Challenge',
    url: 'https://onecompiler.com/challenges/3w7dby3mt/beginners-coding-challenge',
    points: 10
  },
  { 
    id: 'if-else',
    title: 'If-Else Set 1',
    url: 'https://onecompiler.com/challenges/3xveaz8es/if-else-set-1',
    points: 15
  },
  { 
    id: 'strings',
    title: 'String Challenge',
    url: 'https://onecompiler.com/challenges/3w8xvfbtb/strings-challenge',
    points: 20
  },
  { 
    id: 'loops',
    title: 'Loops 1',
    url: 'https://onecompiler.com/challenges/3xvgabhq3/loops-1',
    points: 25
  },
  { 
    id: 'intermediate',
    title: 'Intermediate Challenge',
    url: 'https://onecompiler.com/challenges/3w9us3eby/intermediate-coding-challenge',
    points: 30
  },
  { 
    id: 'arrays',
    title: 'Arrays Challenge',
    url: 'https://onecompiler.com/challenges/3wf8b98k2/arrays-coding-challenge',
    points: 35
  },
  { 
    id: 'patterns',
    title: 'Pattern Problems',
    url: 'https://onecompiler.com/challenges/3wkjky7nj/pattern-problems-coding-challenge',
    points: 40
  },
  { 
    id: 'advanced',
    title: 'Advanced',
    url: 'https://onecompiler.com/challenges/3ynj6me3n/advanced',
    points: 45
  },
  { 
    id: 'javascript',
    title: 'JavaScript Interview',
    url: 'https://onecompiler.com/challenges/3zubsy6cd/javascript-interview-questions',
    points: 50
  }
];

// Track completed challenges in localStorage
const getCompletedChallenges = (userId: string): string[] => {
  const stored = localStorage.getItem(`codegen_completed_${userId}`);
  return stored ? JSON.parse(stored) : [];
};

const markChallengeCompleted = (userId: string, challengeId: string) => {
  const completed = getCompletedChallenges(userId);
  if (!completed.includes(challengeId)) {
    completed.push(challengeId);
    localStorage.setItem(`codegen_completed_${userId}`, JSON.stringify(completed));
    return true; // Return true if this is a newly completed challenge
  }
  return false; // Already completed
};

const Practice = () => {
  const [activeTab, setActiveTab] = useState('beginners');
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const { user, incrementProblemsSolved } = useAuth();
  const { toast } = useToast();
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (user) {
      setCompletedChallenges(getCompletedChallenges(user.id));
    }
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeTab, iframeKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(Date.now());
  };

  const handleMarkCompleted = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to track your progress",
        variant: "destructive"
      });
      return;
    }

    const challenge = practiceQuestions.find(q => q.id === activeTab);
    if (!challenge) return;

    const isNewCompletion = markChallengeCompleted(user.id, challenge.id);
    
    if (isNewCompletion) {
      // Update completion state
      setCompletedChallenges(prev => [...prev, challenge.id]);
      
      // Update user profile with points
      incrementProblemsSolved(challenge.points);
      
      toast({
        title: "Challenge Completed!",
        description: `You earned ${challenge.points} points for completing ${challenge.title}`,
      });
    } else {
      toast({
        title: "Already Completed",
        description: "You've already completed this challenge",
      });
    }
  };

  const activeQuestion = practiceQuestions.find(q => q.id === activeTab);
  const isCompleted = completedChallenges.includes(activeTab);

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <BackButton to="/" />
            <h1 className="text-3xl font-bold mb-4">Practice Coding Questions</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Strengthen your coding skills with our curated collection of problems
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            
            <Button
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              className={`flex items-center gap-2 ${isCompleted ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-codegen-purple hover:bg-codegen-purple/90'}`}
              onClick={handleMarkCompleted}
              disabled={isLoading}
            >
              {isCompleted ? (
                <>
                  <Check className="h-4 w-4" /> Completed
                </>
              ) : (
                <>
                  <Code className="h-4 w-4" /> Mark Completed
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto flex w-full">
            {practiceQuestions.map((question) => (
              <TabsTrigger 
                key={question.id} 
                value={question.id}
                className={`flex-shrink-0 ${completedChallenges.includes(question.id) ? 'text-green-600 dark:text-green-400' : ''}`}
              >
                {question.title} 
                {completedChallenges.includes(question.id) && (
                  <Check className="ml-1 h-3 w-3" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {practiceQuestions.map((question) => (
            <TabsContent 
              key={question.id} 
              value={question.id}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[calc(100vh-280px)]"
            >
              {isLoading && activeTab === question.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-10">
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <svg className="animate-spin h-10 w-10 text-codegen-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Loading practice questions...</p>
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading && activeTab === question.id ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <iframe
                  ref={iframeRef}
                  key={`${question.id}-${iframeKey}`}
                  src={question.url}
                  title={question.title}
                  className="w-full h-full"
                  allow="accelerometer; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi"
                />
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Practice;
