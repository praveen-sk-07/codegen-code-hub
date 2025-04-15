
import React, { useState } from 'react';
import { useForm as useFormspree } from '@formspree/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  category: z.string().min(1, { message: "Please select a category" }),
  message: z.string().min(10, { message: "Feedback must be at least 10 characters long" }),
});

type FormValues = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  onClose?: () => void;
}

const FeedbackForm = ({ onClose }: FeedbackFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use Formspree's hook
  const [formspreeState, handleFormspreeSubmit] = useFormspree("xeoanvav");
  
  // Use react-hook-form for form validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      category: "",
      message: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Send the form data to Formspree
      await handleFormspreeSubmit({
        name: data.name,
        email: data.email,
        category: data.category,
        message: data.message,
      });
      
      // Display success message
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll get back to you soon.",
      });
      
      // Reset the form
      form.reset();
      
      // Close the dialog if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>Share your thoughts to help us improve CODEGEN</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="content">Content Issue</SelectItem>
                      <SelectItem value="suggestion">General Suggestion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please share your thoughts, ideas or issues..." 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <CardFooter className="px-0 pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || formspreeState.submitting}
              >
                {(isSubmitting || formspreeState.submitting) ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" /> Submit Feedback
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
