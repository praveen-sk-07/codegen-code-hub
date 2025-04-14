import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export type UserType = 'student' | 'professional';

export interface User {
  id: string;
  fullName: string;
  organization?: string;
  username: string;
  email: string;
  userType: UserType;
  profileImage?: string;
  problemsSolved: number;
  points: number;
  rank: number;
  downloads: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
  incrementProblemsSolved: (points: number) => Promise<void>;
  getUsersFromSameOrganization: () => Promise<User[]>;
  validateSession: () => Promise<boolean>;
  refreshUserSession: () => Promise<void>;
}

export interface RegisterData {
  userType: UserType;
  fullName: string;
  organization: string;
  username: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const calculateRank = (problemsSolved: number): number => {
  if (problemsSolved >= 100) return 1;
  if (problemsSolved >= 80) return 2;
  if (problemsSolved >= 60) return 3;
  if (problemsSolved >= 40) return 4;
  if (problemsSolved >= 20) return 5;
  if (problemsSolved >= 10) return 6;
  return 7;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const transformSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    if (!supabaseUser) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    
    if (error || !data) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      fullName: data.fullName || '',
      organization: data.organization,
      username: data.username || '',
      userType: data.userType || 'student',
      profileImage: data.profileImage,
      problemsSolved: data.problemsSolved || 0,
      points: data.points || 0,
      rank: data.rank || 7,
      downloads: data.downloads || 0
    };
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };
  
  const refreshUserSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.user) {
        const updatedUser = await transformSupabaseUser(data.user);
        if (updatedUser) {
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          if (supabaseUser) {
            const appUser = await transformSupabaseUser(supabaseUser);
            setUser(appUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const appUser = await transformSupabaseUser(session.user);
          setUser(appUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (authError) {
        if (authError.message.includes('email') && authError.message.includes('taken')) {
          throw new Error('This email is already registered. Please log in or use a different email.');
        }
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error('Registration failed');
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          fullName: data.fullName,
          organization: data.organization,
          username: data.username,
          userType: data.userType,
          problemsSolved: 0,
          points: 0,
          rank: 7,
          downloads: 0
        });
      
      if (profileError) {
        if (profileError.message.includes('username') || profileError.message.includes('unique constraint')) {
          throw new Error('This username is already taken. Please choose a different username.');
        }
        throw profileError;
      }
      
      const newUser = await transformSupabaseUser(authData.user);
      setUser(newUser);
      
      toast({
        title: "Registration Successful",
        description: "Your CODEGEN account has been created successfully! Please check your email to verify your account.",
      });
      
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error?.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Login failed');
      }
      
      const appUser = await transformSupabaseUser(data.user);
      setUser(appUser);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to CODEGEN!",
      });
      
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error?.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUser = async (data: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      if (data.email && data.email !== user.email) {
        const { error: updateEmailError } = await supabase.auth.updateUser({
          email: data.email,
        });
        
        if (updateEmailError) throw updateEmailError;
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          ...data,
          ...(data.problemsSolved && { rank: calculateRank(data.problemsSolved) }),
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      const updatedUser = { ...user, ...data };
      if (data.problemsSolved !== undefined) {
        updatedUser.rank = calculateRank(data.problemsSolved);
      }
      
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const incrementProblemsSolved = async (points: number): Promise<void> => {
    if (!user) return;
    
    try {
      const newProblemsSolved = user.problemsSolved + 1;
      const newPoints = user.points + points;
      const newRank = calculateRank(newProblemsSolved);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          problemsSolved: newProblemsSolved,
          points: newPoints,
          rank: newRank
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({
        ...user,
        problemsSolved: newProblemsSolved,
        points: newPoints,
        rank: newRank
      });
      
      toast({
        title: "Problem Completed!",
        description: `+${points} points added to your profile.`,
      });
      
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error?.message || "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    return true;
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    return true;
  };

  const getUsersFromSameOrganization = async (): Promise<User[]> => {
    if (!user || !user.organization) return [];
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization', user.organization)
        .neq('id', user.id);
      
      if (error) throw error;
      
      return data.map(profile => ({
        id: profile.id,
        fullName: profile.fullName,
        organization: profile.organization,
        username: profile.username,
        email: profile.email || '',
        userType: profile.userType,
        profileImage: profile.profileImage,
        problemsSolved: profile.problemsSolved || 0,
        points: profile.points || 0,
        rank: profile.rank || 7,
        downloads: profile.downloads || 0
      }));
      
    } catch (error) {
      console.error('Error fetching users from organization:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
        updateUser,
        checkUsernameAvailability,
        checkEmailAvailability,
        incrementProblemsSolved,
        getUsersFromSameOrganization,
        validateSession,
        refreshUserSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
