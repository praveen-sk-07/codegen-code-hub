
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Building, BookOpen, Trophy, Download, Edit, Camera, Save, UserRound, Briefcase
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth, User as UserType, UserType as UserTypeEnum } from '@/contexts/AuthContext';
import BackButton from '@/components/BackButton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';

const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
  organization: z.string().optional(),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  userType: z.enum(['student', 'professional']),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const Profile = () => {
  const { user, updateUser, logout, checkUsernameAvailability, checkEmailAvailability } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [profileImage, setProfileImage] = useState<string | undefined>(user?.profileImage);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      organization: user?.organization || '',
      username: user?.username || '',
      email: user?.email || '',
      userType: user?.userType || 'student',
    },
  });

  const watchUserType = form.watch('userType');
  const watchUsername = form.watch('username');
  const watchEmail = form.watch('email');

  React.useEffect(() => {
    if (isEditMode && watchUsername !== user?.username) {
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
  }, [watchUsername, isEditMode, user?.username, checkUsernameAvailability]);

  React.useEffect(() => {
    if (isEditMode && watchEmail !== user?.email) {
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
  }, [watchEmail, isEditMode, user?.email, checkEmailAvailability]);

  // Mock activity history data
  const activityHistory = [
    { id: '1', type: 'problem', name: 'Two Sum', date: '2023-04-05', points: 10 },
    { id: '2', type: 'download', name: 'JavaScript Cheatsheet', date: '2023-04-03', points: 0 },
    { id: '3', type: 'problem', name: 'Reverse String', date: '2023-04-01', points: 15 },
    { id: '4', type: 'download', name: 'Data Structures PDF', date: '2023-03-28', points: 0 },
    { id: '5', type: 'problem', name: 'Binary Search', date: '2023-03-25', points: 20 },
  ];

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!isUsernameAvailable || !isEmailAvailable) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        ...data,
        profileImage,
      });
      
      setIsEditMode(false);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
        <Button asChild>
          <a href="/login">Login</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton to="/" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader className="relative pb-0">
            {isEditMode ? (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditMode(false);
                    form.reset();
                    setProfileImage(user.profileImage);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting || !isUsernameAvailable || !isEmailAvailable}
                  className="bg-codegen-purple hover:bg-codegen-purple/90"
                >
                  {isSubmitting ? <span className="flex items-center"><span className="animate-spin mr-2">◌</span> Saving...</span> : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-4 right-4"
                onClick={() => setIsEditMode(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
            
            <div className="flex flex-col md:flex-row items-center gap-6 pt-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="bg-codegen-purple/20 text-codegen-purple text-xl">
                    {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {isEditMode && (
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-codegen-purple text-white rounded-full p-1.5 cursor-pointer hover:bg-codegen-purple/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input 
                      id="profile-image" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleProfileImageChange}
                    />
                  </label>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <CardTitle className="text-2xl">
                  {user.fullName}
                </CardTitle>
                <CardDescription className="flex items-center justify-center md:justify-start mt-1">
                  {user.userType === 'student' ? (
                    <UserRound className="h-4 w-4 mr-1 text-codegen-purple" />
                  ) : (
                    <Briefcase className="h-4 w-4 mr-1 text-codegen-purple" />
                  )}
                  {user.userType === 'student' ? 'Student' : 'Professional'}
                </CardDescription>
                {user.organization && (
                  <p className="text-sm text-gray-500 flex items-center justify-center md:justify-start mt-1">
                    <Building className="h-4 w-4 mr-1" />
                    {user.organization}
                  </p>
                )}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="font-medium">{user.problemsSolved}</span>
                    <span className="text-gray-500 ml-1">Problems</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="font-medium">{user.points}</span>
                    <span className="text-gray-500 ml-1">Points</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Download className="h-4 w-4 mr-1 text-green-500" />
                    <span className="font-medium">{user.downloads}</span>
                    <span className="text-gray-500 ml-1">Downloads</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                {isEditMode ? (
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div className="flex items-center justify-center">
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="student" id="student" />
                                    </FormControl>
                                    <FormLabel htmlFor="student" className="cursor-pointer flex items-center">
                                      <UserRound className="h-4 w-4 mr-2" />
                                      Student
                                    </FormLabel>
                                  </FormItem>
                                </div>
                                <div className="flex items-center justify-center">
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="professional" id="professional" />
                                    </FormControl>
                                    <FormLabel htmlFor="professional" className="cursor-pointer flex items-center">
                                      <Briefcase className="h-4 w-4 mr-2" />
                                      Professional
                                    </FormLabel>
                                  </FormItem>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {watchUserType === 'student' ? 'College Name' : 'Organization Name'}
                              {watchUserType === 'student' && <span className="text-red-500">*</span>}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input className="pl-9" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input className="pl-9" {...field} />
                                {field.value !== user.username && field.value.length >= 3 && (
                                  <div className="absolute right-3 top-3">
                                    {isUsernameAvailable ? (
                                      <span className="text-green-500 text-sm">Available</span>
                                    ) : (
                                      <span className="text-red-500 text-sm">Unavailable</span>
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
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input type="email" className="pl-9" {...field} />
                                {field.value !== user.email && field.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && (
                                  <div className="absolute right-3 top-3">
                                    {isEmailAvailable ? (
                                      <span className="text-green-500 text-sm">Available</span>
                                    ) : (
                                      <span className="text-red-500 text-sm">Unavailable</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">User Type</h3>
                        <p className="mt-1">{user.userType === 'student' ? 'Student' : 'Professional'}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1">{user.fullName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          {user.userType === 'student' ? 'College Name' : 'Organization Name'}
                        </h3>
                        <p className="mt-1">{user.organization || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Username</h3>
                        <p className="mt-1">{user.username}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1">{user.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Rank</h3>
                        <p className="mt-1">#{user.rank}</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="space-y-4">
                  {activityHistory.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No activity history yet</p>
                  ) : (
                    <div className="divide-y">
                      {activityHistory.map((activity) => (
                        <div key={activity.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            {activity.type === 'problem' ? (
                              <BookOpen className="h-5 w-5 mr-3 text-blue-500" />
                            ) : (
                              <Download className="h-5 w-5 mr-3 text-green-500" />
                            )}
                            <div>
                              <p className="font-medium">{activity.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {activity.points > 0 && (
                            <div className="flex items-center text-sm font-medium text-yellow-600">
                              <Trophy className="h-4 w-4 mr-1" />
                              {activity.points} points
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-center md:justify-end border-t pt-4">
            <Button 
              variant="outline" 
              onClick={logout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Logout
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
