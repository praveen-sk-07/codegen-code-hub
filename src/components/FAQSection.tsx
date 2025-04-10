
import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
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

const FAQSection = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Find answers to common questions about CODEGEN and how to make the most of our platform.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem value={`item-${index}`} className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
