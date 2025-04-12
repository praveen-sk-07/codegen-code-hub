import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Building, UserRound, Briefcase, Code } from 'lucide-react';
import BackButton from '@/components/BackButton';
import { useAuth, RegisterData } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  rememberMe: z.boolean().optional()
});

const registerSchema = z.object({
  userType: z.enum(['student', 'professional'], {
    required_error: "Please select your user type",
  }),
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
  organization: z.string().min(2, { message: "Organization name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, login, isAuthenticated, checkUsernameAvailability, checkEmailAvailability } = useAuth();
  const navigate = useNavigate();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userType: 'student',
      fullName: "",
      organization: "",
      username: "",
      email: "",
      password: ""
    }
  });

  const userType = registerForm.watch('userType');
  const watchUsername = registerForm.watch('username');
  const watchEmail = registerForm.watch('email');

  // Check username availability
  React.useEffect(() => {
    if (activeTab === 'register' && watchUsername) {
      const checkUsername = async () => {
        if (watchUsername.length >= 3) {
          const isAvailable = await checkUsernameAvailability(watchUsername);
          setIsUsernameAvailable(isAvailable);
        }
      };
      
      const timer = setTimeout(() => {
        checkUsername();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [watchUsername, activeTab, checkUsernameAvailability]);

  // Check email availability
  React.useEffect(() => {
    if (activeTab === 'register' && watchEmail) {
      const checkEmail = async () => {
        if (watchEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          const isAvailable = await checkEmailAvailability(watchEmail);
          setIsEmailAvailable(isAvailable);
        }
      };
      
      const timer = setTimeout(() => {
        checkEmail();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [watchEmail, activeTab, checkEmailAvailability]);

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password, data.rememberMe || false);
      toast({
        title: "Login Successful",
        description: "Welcome back to CODEGEN!",
      });
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    if (!isUsernameAvailable || !isEmailAvailable) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const registerData: RegisterData = {
        userType: data.userType,
        fullName: data.fullName,
        organization: data.organization,
        username: data.username,
        email: data.email,
        password: data.password
      };
      
      await register(registerData);
      
      toast({
        title: "Registration Successful",
        description: "Your CODEGEN account has been created successfully!",
      });
      
      navigate('/profile');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg px-4">
        <div className="mb-6">
          <BackButton to="/" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-codegen-purple/10 rounded-full">
                <Code className="h-8 w-8 text-codegen-purple" />
              </div>
              <CardTitle className="text-2xl">Welcome to CODEGEN</CardTitle>
              <CardDescription>
                Sign in or create an account to access all features
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  placeholder="Your email address" 
                                  className="pl-9" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Your password" 
                                  className="pl-9" 
                                  {...field} 
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  className="absolute right-2 top-2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                />
                              </FormControl>
                              <FormLabel className="text-sm cursor-pointer">Remember me</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <Link to="#" className="text-sm text-codegen-purple hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-codegen-purple hover:bg-codegen-purple/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2">◌</span> Signing in...
                          </span>
                        ) : "Sign in"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                {/* Registration Form */}
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a</FormLabel>
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                type="button"
                                variant={field.value === 'student' ? 'default' : 'outline'}
                                className={`flex items-center justify-center ${field.value === 'student' ? 'bg-codegen-purple' : ''}`}
                                onClick={() => field.onChange('student')}
                              >
                                <UserRound className="mr-2 h-4 w-4" />
                                Student
                              </Button>
                              <Button
                                type="button"
                                variant={field.value === 'professional' ? 'default' : 'outline'}
                                className={`flex items-center justify-center ${field.value === 'professional' ? 'bg-codegen-purple' : ''}`}
                                onClick={() => field.onChange('professional')}
                              >
                                <Briefcase className="mr-2 h-4 w-4" />
                                Professional
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  placeholder="Your full name" 
                                  className="pl-9" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {userType === 'student' ? 'College Name' : 'Organization Name'}
                              {userType === 'student' && <span className="text-red-500">*</span>}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  placeholder={userType === 'student' ? "Your college name" : "Your organization name"} 
                                  className="pl-9" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  placeholder="Choose a unique username" 
                                  className="pl-9" 
                                  {...field} 
                                />
                                {field.value.length >= 3 && (
                                  <div className="absolute right-3 top-3">
                                    {isUsernameAvailable ? (
                                      <span className="text-green-500 text-sm">Available</span>
                                    ) : (
                                      <span className="text-red-500 text-sm">Username taken</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  placeholder="Your email address" 
                                  className="pl-9" 
                                  {...field} 
                                />
                                {field.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && (
                                  <div className="absolute right-3 top-3">
                                    {isEmailAvailable ? (
                                      <span className="text-green-500 text-sm">Available</span>
                                    ) : (
                                      <span className="text-red-500 text-sm">Email taken</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="Create a strong password" 
                                  className="pl-9" 
                                  {...field} 
                                />
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon"
                                  className="absolute right-2 top-2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-codegen-purple hover:bg-codegen-purple/90"
                        disabled={isSubmitting || !isUsernameAvailable || !isEmailAvailable}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2">◌</span> Creating account...
                          </span>
                        ) : "Create account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 text-center text-sm text-gray-600">
              <p>
                By continuing, you agree to CODEGEN's Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
