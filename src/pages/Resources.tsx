import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, YoutubeIcon, FileText, BookOpen, Download, RefreshCw } from 'lucide-react';

const youtubeResources = [
  {
    id: 'yt1',
    title: 'Complete JavaScript Tutorial',
    channel: 'Programming with Mosh',
    url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
    description: 'Learn JavaScript basics and advanced concepts in this comprehensive tutorial.'
  },
  {
    id: 'yt2',
    title: 'Python Full Course for Beginners',
    channel: 'freeCodeCamp',
    url: 'https://www.youtube.com/embed/rfscVS0vtbw',
    description: 'Learn Python from scratch in this full beginner-friendly course.'
  },
  {
    id: 'yt3',
    title: 'React JS Crash Course',
    channel: 'Traversy Media',
    url: 'https://www.youtube.com/embed/w7ejDZ8SWv8',
    description: 'Learn the fundamentals of React including components, state, props, hooks, and more.'
  },
  {
    id: 'yt4',
    title: 'Data Structures Easy to Advanced Course',
    channel: 'freeCodeCamp',
    url: 'https://www.youtube.com/embed/RBSGKlAvoiM',
    description: 'Complete data structures tutorial to level up your coding skills.'
  },
  {
    id: 'yt5',
    title: 'Algorithms and Data Structures Tutorial',
    channel: 'CS Dojo',
    url: 'https://www.youtube.com/embed/BBpAmxU_NQo',
    description: 'Learn the most common algorithms and data structures used in programming.'
  },
  {
    id: 'yt6',
    title: 'SQL Tutorial for Beginners',
    channel: 'Programming with Mosh',
    url: 'https://www.youtube.com/embed/7S_tz1z_5bA',
    description: 'Comprehensive introduction to SQL for beginners.'
  },
  {
    id: 'yt7',
    title: 'HTML & CSS Crash Course',
    channel: 'Traversy Media',
    url: 'https://www.youtube.com/embed/UB1O30fR-EE',
    description: 'Learn the basics of HTML and CSS for web development.'
  },
  {
    id: 'yt8',
    title: 'Git and GitHub Tutorial for Beginners',
    channel: 'Programming with Mosh',
    url: 'https://www.youtube.com/embed/8JJ101D3knE',
    description: 'Learn the basics of Git and GitHub for version control.'
  },
  {
    id: 'yt9',
    title: 'Java Tutorial for Beginners',
    channel: 'Programming with Mosh',
    url: 'https://www.youtube.com/embed/eIrMbAQSU34',
    description: 'Learn Java programming from scratch in this full course.'
  },
  {
    id: 'yt10',
    title: 'C++ Tutorial for Beginners',
    channel: 'freeCodeCamp',
    url: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
    description: 'Learn C++ programming from scratch in this comprehensive tutorial.'
  },
  {
    id: 'yt11',
    title: 'Node.js Tutorial for Beginners',
    channel: 'Programming with Mosh',
    url: 'https://www.youtube.com/embed/TlB_eWDSMt4',
    description: 'Learn Node.js from scratch for backend development.'
  },
  {
    id: 'yt12',
    title: 'MongoDB Tutorial',
    channel: 'Net Ninja',
    url: 'https://www.youtube.com/embed/ExcRbA7fy_A',
    description: 'Complete MongoDB tutorial for beginners.'
  }
];

const documentResources = [
  {
    id: 'doc1',
    title: 'JavaScript Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#javascript',
    description: 'Comprehensive JavaScript syntax and concepts at a glance.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGp_H8SSUUKey1_V99x_c-i1jJYfhzaA-Okg&usqp=CAU'
  },
  {
    id: 'doc2',
    title: 'Python Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#python',
    description: 'Quick reference for Python syntax, built-in functions, and common libraries.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMi0bQVCEBcRCqGPB_buKtRWXE9kGV_PYhMQ&usqp=CAU'
  },
  {
    id: 'doc3',
    title: 'Data Structures Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#data-structures-and-algorithms',
    description: 'Reference guide for common data structures and their operations.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI5wMtI95vZBxcv1zDXjhRn8tZIFnwG1njKA&usqp=CAU'
  },
  {
    id: 'doc4',
    title: 'SQL Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#sql',
    description: 'Quick reference for SQL commands and database operations.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzsjQD_iY9gV0WHwXnUjVI6OI5ZebC5QSgqQ&usqp=CAU'
  },
  {
    id: 'doc5',
    title: 'Git Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#git',
    description: 'Essential Git commands and workflows for version control.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRikUOtuUcDGn0x8oBmUfj1eWvV-RPmzjF-aw&usqp=CAU'
  },
  {
    id: 'doc6',
    title: 'React Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#react',
    description: 'Quick reference for React concepts, Hooks, and component patterns.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVxI1_-PQxBFnZ3kEBtJ59L9X8eSkzaT_FZA&usqp=CAU'
  },
  {
    id: 'doc7',
    title: 'CSS Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#css',
    description: 'Comprehensive reference for CSS properties and selectors.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJzp7lOVBbArXHEpZkJOVK9gXELl79YjU4Uw&usqp=CAU'
  },
  {
    id: 'doc8',
    title: 'Java Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#java',
    description: 'Reference for Java syntax, classes, and common patterns.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1u5XKXokIGTU1kb_0RgTwXs4pRXJjTVhvWQ&usqp=CAU'
  },
  {
    id: 'doc9',
    title: 'Linux Command Line Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#linux',
    description: 'Essential Linux commands for developers.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI_LMQjIg_G7GzPEIcLhLg6Gu_D0ynrvNxIQ&usqp=CAU'
  },
  {
    id: 'doc10',
    title: 'C++ Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#c-1',
    description: 'Quick reference for C++ syntax and standard library functions.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWFrhAG6GIYnMJx8fMSj8v9-W5G66cqgJqKw&usqp=CAU'
  },
  {
    id: 'doc11',
    title: 'Docker Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#docker',
    description: 'Essential Docker commands and workflows for containerization.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHu5Smg-36eHTQF5e3VQpPQjhkJQphb4Fo_g&usqp=CAU'
  },
  {
    id: 'doc12',
    title: 'TypeScript Cheatsheet',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/more/free-programming-cheatsheets.md#typescript',
    description: 'Reference for TypeScript types, interfaces, and advanced features.',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP_y_mqUyUwM0rEJy9TlPYvLSXjtUHXKZPJw&usqp=CAU'
  }
];

const conceptualPractice = {
  title: 'Conceptual Practice',
  url: 'https://codeegen20.vercel.app/top-coding-questions',
  description: 'Practice key coding concepts and strengthen your problem-solving skills.'
};

const externalLinks = [
  {
    id: 'ext1',
    title: 'LeetCode',
    url: 'https://leetcode.com',
    description: 'Platform for practicing coding interview questions.',
    iconColor: 'text-amber-500'
  },
  {
    id: 'ext2',
    title: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org',
    description: 'Computer science portal for geeks with tutorials and practice problems.',
    iconColor: 'text-green-500'
  },
  {
    id: 'ext3',
    title: 'HackerRank',
    url: 'https://www.hackerrank.com',
    description: 'Platform for competitive programming and technical interviews practice.',
    iconColor: 'text-emerald-500'
  },
  {
    id: 'ext4',
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Platform for version control and collaboration on coding projects.',
    iconColor: 'text-gray-500'
  },
  {
    id: 'ext5',
    title: 'LinkedIn',
    url: 'https://www.linkedin.com',
    description: 'Professional networking platform for career development.',
    iconColor: 'text-blue-600'
  },
  {
    id: 'ext6',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: 'Community for developers to learn and share knowledge.',
    iconColor: 'text-orange-500'
  },
  {
    id: 'ext7',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Resources for developers, by developers.',
    iconColor: 'text-indigo-500'
  },
  {
    id: 'ext8',
    title: 'FreeCodeCamp',
    url: 'https://www.freecodecamp.org',
    description: 'Free coding curriculum with certifications.',
    iconColor: 'text-teal-500'
  },
  {
    id: 'ext9',
    title: 'Codecademy',
    url: 'https://www.codecademy.com',
    description: 'Interactive platform to learn to code.',
    iconColor: 'text-purple-500'
  },
  {
    id: 'ext10',
    title: 'Coursera',
    url: 'https://www.coursera.org',
    description: 'Online courses and specializations in programming and CS.',
    iconColor: 'text-blue-500'
  },
  {
    id: 'ext11',
    title: 'edX',
    url: 'https://www.edx.org',
    description: 'Online courses from top institutions.',
    iconColor: 'text-red-500'
  },
  {
    id: 'ext12',
    title: 'W3Schools',
    url: 'https://www.w3schools.com',
    description: 'Web development tutorials and references.',
    iconColor: 'text-green-600'
  }
];

const Resources = () => {
  const [activeTab, setActiveTab] = useState('youtube');
  const [selectedYoutubeId, setSelectedYoutubeId] = useState<string | null>(null);
  const [isConceptualPracticeLoading, setIsConceptualPracticeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(Date.now());

  React.useEffect(() => {
    if (activeTab === 'conceptual') {
      const timer = setTimeout(() => {
        setIsConceptualPracticeLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, iframeKey]);

  const handleRefresh = () => {
    setIsConceptualPracticeLoading(true);
    setIframeKey(Date.now());
  };

  const handleYoutubeSelect = (id: string) => {
    setSelectedYoutubeId(id);
  };

  const selectedVideo = youtubeResources.find(resource => resource.id === selectedYoutubeId);

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div>
          <BackButton to="/" />
          <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Access a curated collection of resources to enhance your coding journey
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-6 bg-gray-100 dark:bg-gray-800 p-1 overflow-x-auto flex">
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <YoutubeIcon className="h-4 w-4" /> YouTube Tutorials
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Documents
            </TabsTrigger>
            <TabsTrigger value="conceptual" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Conceptual Practice
            </TabsTrigger>
            <TabsTrigger value="external" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> External Links
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {selectedYoutubeId ? (
                <div className="space-y-4">
                  <Button variant="outline" size="sm" onClick={() => setSelectedYoutubeId(null)}>
                    Back to all tutorials
                  </Button>
                  
                  <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                    <iframe
                      src={selectedVideo?.url}
                      title={selectedVideo?.title}
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold">{selectedVideo?.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {selectedVideo?.description}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Channel: {selectedVideo?.channel}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {youtubeResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleYoutubeSelect(resource.id)}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl">{resource.title}</CardTitle>
                          <CardDescription>{resource.channel}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden mb-4">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <YoutubeIcon size={40} className="text-red-600" />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {resource.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentResources.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden flex items-center justify-center">
                        <img 
                          src={doc.imageUrl} 
                          alt={doc.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.description}
                      </p>
                      <div className="pt-2">
                        <Button 
                          asChild 
                          className="w-full"
                          variant="outline"
                        >
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <Download className="h-4 w-4" /> Download Cheatsheet
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conceptual">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[calc(100vh-240px)] relative">
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              </div>
              
              {isConceptualPracticeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <svg className="animate-spin h-10 w-10 text-codegen-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Loading conceptual practice resources...</p>
                  </div>
                </div>
              )}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isConceptualPracticeLoading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <iframe
                  key={iframeKey}
                  src={conceptualPractice.url}
                  title={conceptualPractice.title}
                  className="w-full h-full"
                  allow="accelerometer; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi"
                />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="external">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-codegen-purple">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl">{link.title}</CardTitle>
                          </div>
                          <ExternalLink className={`h-5 w-5 ${link.iconColor}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-400">
                          {link.description}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Resources;
