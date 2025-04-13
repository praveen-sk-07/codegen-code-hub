
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@formspree/react';
import FeedbackForm from './FeedbackForm';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chatMessage: string;
}

const FeedbackDialog = ({ isOpen, onClose, chatMessage }: FeedbackDialogProps) => {
  const [formState, handleSubmit] = useForm("xeoanvav");
  const { toast } = useToast();
  const [feedback, setFeedback] = useState("");
  
  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit({
      message: `Feedback for: "${chatMessage}"\n\nUser feedback: ${feedback}`,
    });
    
    if (!formState.errors) {
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our chat assistant.",
      });
      setFeedback("");
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How can we improve this answer?</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitFeedback} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Original answer:</label>
            <div className="bg-muted p-3 rounded-md text-sm">{chatMessage}</div>
          </div>
          <div>
            <label htmlFor="feedback" className="text-sm font-medium mb-1 block">
              Your feedback:
            </label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us how we can improve this response..."
              className="w-full"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={formState.submitting || !feedback.trim()}>
              {formState.submitting ? "Sending..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hello! I'm CodeHelp, your coding assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

// Sample responses for when API is unavailable
const fallbackResponses = [
  "I found a relevant solution for this. In programming, breaking down complex problems into smaller steps is a good approach. Let's start by understanding the core issue.",
  "This is a common programming challenge. Let's tackle it step by step. First, we need to identify the key requirements and constraints.",
  "Based on your question, here's a helpful approach. When working with algorithms, consider time and space complexity before implementing the solution.",
  "For this coding task, I'd recommend starting with a simple implementation and then optimizing as needed. Focus on readability first.",
  "Let me help with that coding question. A good practice is to write test cases before implementing your solution to ensure it works as expected."
];

const getFallbackResponse = (query: string) => {
  // Generate deterministic index based on query to get consistent responses
  const index = Math.abs(query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackResponses.length);
  return fallbackResponses[index];
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [fullFeedbackOpen, setFullFeedbackOpen] = useState(false);
  const [currentFeedbackMessage, setCurrentFeedbackMessage] = useState('');
  const [apiAvailable, setApiAvailable] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Check API availability on component mount
  useEffect(() => {
    checkApiAvailability();
  }, []);

  // Function to check if API is accessible
  const checkApiAvailability = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://codegen-helpdesk.created.app/api/status', {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setApiAvailable(response.ok);
    } catch (error) {
      console.warn('API availability check failed:', error);
      setApiAvailable(false);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // If API is unavailable, use fallback responses
    if (!apiAvailable) {
      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          content: getFallbackResponse(inputMessage),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500); // Simulate typing delay
      return;
    }

    // Fetch response from codegen-helpdesk API
    fetch('https://codegen-helpdesk.created.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: inputMessage,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('API response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data && data.response) {
        const botMessage: Message = {
          id: messages.length + 2,
          content: data.response,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    })
    .catch(error => {
      console.error('Error fetching from helpdesk:', error);
      
      // If API call fails, use fallback response
      const fallbackMessage = getFallbackResponse(inputMessage);
      
      const errorMessage: Message = {
        id: messages.length + 2,
        content: fallbackMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Set API as unavailable after a failed call
      setApiAvailable(false);
      
      // Show toast only for first failure
      toast({
        title: "Offline Mode",
        description: "Using fallback responses. Some features may be limited.",
        variant: "default",
      });
    })
    .finally(() => {
      setIsTyping(false);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openFeedbackDialog = (message: string) => {
    setCurrentFeedbackMessage(message);
    setFeedbackDialogOpen(true);
  };
  
  const openFullFeedbackForm = () => {
    setFullFeedbackOpen(true);
  };

  const handleFeedback = (isHelpful: boolean, messageContent: string) => {
    toast({
      title: isHelpful ? "Thanks for the feedback!" : "We'll improve our answers",
      description: isHelpful 
        ? "We're glad you found this helpful." 
        : "Would you like to tell us how we can improve?",
      action: !isHelpful ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => openFeedbackDialog(messageContent)}
        >
          Give Feedback
        </Button>
      ) : undefined,
    });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-codegen-purple text-white flex items-center justify-center shadow-lg z-40"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-40 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Chat Header */}
            <div className="bg-codegen-purple text-white p-3 flex items-center">
              <Bot className="mr-2" size={20} />
              <div className="flex-1">
                <h3 className="font-medium">CodeHelp</h3>
                <p className="text-xs opacity-90">
                  {apiAvailable ? "Coding assistant" : "Coding assistant (offline mode)"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={openFullFeedbackForm} className="text-white hover:bg-white/20 mr-1">
                <HelpCircle size={18} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                <X size={18} />
              </Button>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-codegen-purple text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        
                        {/* Feedback buttons for bot messages */}
                        {message.sender === 'bot' && (
                          <div className="flex space-x-1">
                            <button 
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                              onClick={() => handleFeedback(true, message.content)}
                            >
                              <ThumbsUp size={12} className="text-gray-500 dark:text-gray-400" />
                            </button>
                            <button 
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                              onClick={() => handleFeedback(false, message.content)}
                            >
                              <ThumbsDown size={12} className="text-gray-500 dark:text-gray-400" />
                            </button>
                            <button 
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                              onClick={() => openFeedbackDialog(message.content)}
                            >
                              <HelpCircle size={12} className="text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>●</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-end gap-2">
              <Textarea
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[40px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button
                size="icon"
                className="bg-codegen-purple hover:bg-codegen-purple/90 h-10 w-10 rounded-full flex-shrink-0"
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === '' || isTyping}
              >
                <Send size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Quick Feedback Dialog */}
      <FeedbackDialog 
        isOpen={feedbackDialogOpen} 
        onClose={() => setFeedbackDialogOpen(false)} 
        chatMessage={currentFeedbackMessage} 
      />
      
      {/* Full Feedback Form Sheet */}
      <Sheet open={fullFeedbackOpen} onOpenChange={setFullFeedbackOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Send Feedback</SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <FeedbackForm onClose={() => setFullFeedbackOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Chatbot;
