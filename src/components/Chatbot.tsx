
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Include project-related FAQs
const projectFAQs = [
  {
    question: "What is CODEGEN?",
    answer: "CODEGEN is an advanced online coding workspace designed for students and professionals. It provides an integrated environment for coding practice, interview preparation, and learning resources."
  },
  {
    question: "Do I need to create an account to use CODEGEN?",
    answer: "While you can access some features without an account, registration is required to access the full functionality, such as practice questions, tracking your progress, and personalizing your learning experience."
  },
  {
    question: "What programming languages are supported in the compiler?",
    answer: "Our compiler supports a wide range of programming languages including but not limited to JavaScript, Python, C++, Java, and many more. You can write, execute, and debug code directly in your browser."
  },
  {
    question: "How can I prepare for technical interviews using CODEGEN?",
    answer: "CODEGEN offers an Interview Preparation section with HR questions, technical interview questions, and coding challenges typically asked in top tech companies. You can practice these questions and improve your interview skills."
  },
  {
    question: "Are the learning resources free?",
    answer: "Yes, all learning resources provided in CODEGEN are free for registered users. These include video tutorials, documentation, articles, and external links to valuable coding practice websites."
  },
  {
    question: "How can I contribute to CODEGEN or report issues?",
    answer: "You can provide feedback using our Feedback Form located throughout the platform. We value your suggestions and bug reports to continuously improve the platform for everyone."
  }
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

const GEMINI_API_KEY = "AIzaSyCIlGpkXmyhqhngvMyFWAV1t5IrIJsIc1w"; // API key

const initialMessages: Message[] = [
  {
    id: 1,
    content: "Hello! I'm CodeHelp, your coding assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to get response from Gemini API
  const getGeminiResponse = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are CodeHelp, a helpful coding assistant for the CODEGEN platform.
                    Answer the following coding or programming question concisely:
                    ${prompt}
                    Keep your response under 250 words and focused on helping programmers.`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected response format from API');
      }
    } catch (error) {
      console.error('Error fetching Gemini response:', error);
      return handleFallbackResponse(prompt);
    }
  };

  // Fallback response mechanism
  const handleFallbackResponse = (prompt: string): string => {
    // First check project FAQs
    const lowercasePrompt = prompt.toLowerCase();
    
    for (const faq of projectFAQs) {
      if (lowercasePrompt.includes(faq.question.toLowerCase())) {
        return faq.answer;
      }
    }
    
    // Then check our predefined samples
    for (const [key, value] of Object.entries(sampleResponses)) {
      if (lowercasePrompt.includes(key)) {
        return value;
      }
    }
    
    // Check for CODEGEN specific questions
    if (lowercasePrompt.includes('what is codegen') || 
        lowercasePrompt.includes('about codegen') ||
        lowercasePrompt.includes('tell me about codegen')) {
      return "CODEGEN is an advanced online coding workspace designed for students and professionals. It provides an integrated environment for coding practice, interview preparation, and learning resources. You can practice coding, prepare for interviews, and access educational resources all in one platform.";
    }
    
    // Special cases for greetings
    if (lowercasePrompt.match(/^(hi|hello|hey|greetings)/i)) {
      return "Hello! How can I assist you with coding or using the CODEGEN platform today?";
    }
    
    // Special case for thank you
    if (lowercasePrompt.match(/thank you|thanks/i)) {
      return "You're welcome! If you have more questions, feel free to ask anytime.";
    }

    return "I'm not sure how to help with that specific question. Could you rephrase or ask something related to coding, programming concepts, or the CODEGEN platform?";
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

    // Get response from Gemini API
    getGeminiResponse(inputMessage)
      .then(response => {
        const botMessage: Message = {
          id: messages.length + 2,
          content: response,
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      })
      .catch(error => {
        console.error('Error getting response:', error);
        const errorMessage: Message = {
          id: messages.length + 2,
          content: "I'm having trouble connecting to my knowledge base right now. Let me try to help with what I know.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        
        toast({
          title: "Connection Error",
          description: "Couldn't connect to AI service. Using fallback responses.",
          variant: "destructive",
        });
      });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                <p className="text-xs opacity-90">AI coding assistant</p>
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
                      <p className="text-[10px] mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
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
    </>
  );
};

export default Chatbot;
