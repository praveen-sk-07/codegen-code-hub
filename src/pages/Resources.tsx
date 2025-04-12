
import React from 'react';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Code, Book, Video, FileCode, Layers, BrainCircuit } from 'lucide-react';

const Resources = () => {
  const resources = [
    {
      title: 'FreeCodeCamp',
      description: 'Learn to code with free interactive lessons covering HTML, CSS, JavaScript and more.',
      link: 'https://www.freecodecamp.org/learn',
      icon: <Code className="h-8 w-8 text-codegen-purple" />
    },
    {
      title: 'MDN Web Docs',
      description: 'Resources for developers, by developers. Comprehensive web development documentation.',
      link: 'https://developer.mozilla.org/en-US/',
      icon: <Book className="h-8 w-8 text-codegen-purple" />
    },
    {
      title: 'LeetCode',
      description: 'Enhance your skills, expand your knowledge and prepare for technical interviews.',
      link: 'https://leetcode.com/',
      icon: <FileCode className="h-8 w-8 text-codegen-purple" />
    },
    {
      title: 'Codecademy',
      description: 'Interactive lessons in programming languages, web development, data science and more.',
      link: 'https://www.codecademy.com/',
      icon: <Layers className="h-8 w-8 text-codegen-purple" />
    },
    {
      title: 'HackerRank',
      description: 'Practice coding, prepare for interviews, and get hired.',
      link: 'https://www.hackerrank.com/',
      icon: <BrainCircuit className="h-8 w-8 text-codegen-purple" />
    },
    {
      title: 'YouTube Coding Tutorials',
      description: 'Thousands of free coding tutorials covering a wide range of topics and languages.',
      link: 'https://www.youtube.com/results?search_query=coding+tutorials',
      icon: <Video className="h-8 w-8 text-codegen-purple" />
    }
  ];
  
  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <BackButton to="/" />
          <h1 className="text-3xl font-bold mb-4">Learning Resources</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Access a wealth of coding tutorials, documentation and practice websites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  {resource.icon}
                  <CardTitle>{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{resource.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-codegen-purple hover:bg-codegen-purple/90">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                    <span>Visit Resource</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;
