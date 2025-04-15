
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
  const { register, login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Initialize forms first before using them
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

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

  const PasswordRequirements = ({ password }: { password: string }) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinimumLength = password.length >= 8;
    
    const requirements = [
      { label: "8+ characters", met: hasMinimumLength },
      { label: "1 uppercase letter", met: hasUpperCase },
      { label: "1 lowercase letter", met: hasLowerCase },
      { label: "1 number", met: hasNumbers },
      { label: "1 special character", met: hasSpecialChar },
    ];
    
    return (
      <div className="mt-2 space-y-1 text-xs">
        {requirements.map((req, index) => (
          <div key={index} className={`flex items-center ${req.met ? 'text-green-500' : 'text-gray-400'}`}>
            <div className={`w-1 h-1 rounded-full mr-1.5 ${req.met ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            {req.label}
          </div>
        ))}
      </div>
    );
  };

  const watchRegisterPassword = registerForm.watch('password');
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const userType = registerForm.watch('userType');

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password, data.rememberMe || false);
      navigate('/profile');
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    
    try {
      const rememberMe = loginForm.getValues('rememberMe') || false;
      await loginWithGoogle(rememberMe);
      navigate('/profile');
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
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
      navigate('/profile');
    } catch (error) {
      // Error handling is done in the AuthContext
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
                        ) : "Sign in with Email"}
                      </Button>
                      
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
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
                            {activeTab === 'register' && field.value && <PasswordRequirements password={field.value} />}
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-codegen-purple hover:bg-codegen-purple/90"
                        disabled={isSubmitting}
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
