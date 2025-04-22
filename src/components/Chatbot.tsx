
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@formspree/react';

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

// Sample responses for common coding questions
const sampleResponses: Record<string, string> = {
  "how to start coding": "To start coding, I recommend beginning with a simple language like Python or JavaScript. You can try online platforms like Codecademy or freeCodeCamp for interactive lessons. Start with basic concepts like variables, data types, and control structures before moving to more complex topics.",
  "what is a function": "A function is a reusable block of code that performs a specific task. It takes inputs (parameters), processes them, and returns an output. Functions help make code more organized, reusable, and easier to test.",
  "what is an array": "An array is a data structure that stores a collection of elements, each identified by an index or a key. Arrays allow you to store multiple values in a single variable and access them efficiently.",
  "javascript tutorial": "For JavaScript tutorials, I recommend checking the Learning Resources section of CODEGEN. You'll find structured video tutorials and documentation to help you learn JavaScript from basics to advanced concepts.",
  "how to debug code": "Debugging involves identifying and fixing errors in your code. You can use console.log() statements to print variable values, use browser developer tools for JavaScript, or IDE debuggers to step through your code line by line.",
  "what is recursion": "Recursion is when a function calls itself to solve a smaller instance of the same problem. It consists of a base case (stopping condition) and a recursive case. While powerful, it must be used carefully to avoid stack overflow errors.",
  "help": "I can help with coding questions, explain programming concepts, guide you in using CODEGEN features, or provide resources for learning. Just ask me what you'd like to know!"
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentFeedbackMessage, setCurrentFeedbackMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Attempt to fetch response from codegen-helpdesk
    fetch('https://codegen-helpdesk.created.app/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: inputMessage,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Use the AI response if available
      const botResponse = data?.response || fallbackResponse(inputMessage);
      
      const botMessage: Message = {
        id: messages.length + 2,
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    })
    .catch(error => {
      console.error('Error fetching from helpdesk:', error);
      // Fall back to local responses
      const botMessage: Message = {
        id: messages.length + 2,
        content: fallbackResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    })
    .finally(() => {
      setIsTyping(false);
    });
  };

  const fallbackResponse = (userInput: string) => {
    let botResponse = "I'm not sure how to help with that. Could you try asking something related to coding or the CODEGEN platform?";
      
    // Check for predefined answers
    const lowercaseInput = userInput.toLowerCase();
    
    // Try to match input with sample responses
    for (const [key, value] of Object.entries(sampleResponses)) {
      if (lowercaseInput.includes(key)) {
        botResponse = value;
        break;
      }
    }
    
    // Special cases for greetings
    if (lowercaseInput.match(/^(hi|hello|hey|greetings)/i)) {
      botResponse = "Hello! How can I assist you with coding or using the CODEGEN platform today?";
    }
    
    // Special case for thank you
    if (lowercaseInput.match(/thank you|thanks/i)) {
      botResponse = "You're welcome! If you have more questions, feel free to ask anytime.";
    }

    return botResponse;
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
                <p className="text-xs opacity-90">Coding assistant</p>
              </div>
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
                disabled={inputMessage.trim() === ''}
              >
                <Send size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Feedback Dialog */}
      <FeedbackDialog 
        isOpen={feedbackDialogOpen} 
        onClose={() => setFeedbackDialogOpen(false)} 
        chatMessage={currentFeedbackMessage} 
      />
    </>
  );
};

export default Chatbot;
