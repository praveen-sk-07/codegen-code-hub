
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type UserType = 'student' | 'professional';

export interface User {
  id: string;
  fullName: string;
  organization: string; // Changed from optional to required
  username: string;
  email: string;
  userType: UserType;
  profileImage: string; // Changed from optional to required
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
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  checkEmailAvailability: (email: string) => Promise<boolean>;
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

// Mock database for demonstration
const mockUsers = [
  {
    id: '1',
    fullName: 'Demo User',
    organization: 'Adhiyamaan College of Engineering',
    username: 'demouser',
    email: 'demo@example.com',
    password: 'password123',
    userType: 'student' as UserType,
    profileImage: '',
    problemsSolved: 45,
    points: 325,
    rank: 12,
    downloads: 8
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user data in localStorage on initial load
    const storedUser = localStorage.getItem('codegen_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data:', e);
        localStorage.removeItem('codegen_user');
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const userExists = mockUsers.some(u => u.email === data.email || u.username === data.username);
    
    if (userExists) {
      setIsLoading(false);
      throw new Error('User with this email or username already exists');
    }
    
    // Create new user with organization and profileImage always set
    const newUser: User = {
      id: Date.now().toString(),
      fullName: data.fullName,
      organization: data.organization || 'N/A', // Default value if empty
      username: data.username,
      email: data.email,
      userType: data.userType,
      profileImage: '',
      problemsSolved: 0,
      points: 0,
      rank: mockUsers.length + 1,
      downloads: 0
    };
    
    // Add to mock database
    mockUsers.push({ 
      ...newUser, 
      password: data.password
    });
    
    // Update state and storage
    setUser(newUser);
    localStorage.setItem('codegen_user', JSON.stringify(newUser));
    setIsLoading(false);
    
    toast({
      title: "Registration Successful",
      description: "Your CODEGEN account has been created successfully!",
    });
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // Create user object (without password)
    const authenticatedUser: User = {
      id: foundUser.id,
      fullName: foundUser.fullName,
      organization: foundUser.organization,
      username: foundUser.username,
      email: foundUser.email,
      userType: foundUser.userType,
      profileImage: foundUser.profileImage,
      problemsSolved: foundUser.problemsSolved,
      points: foundUser.points,
      rank: foundUser.rank,
      downloads: foundUser.downloads
    };
    
    // Update state
    setUser(authenticatedUser);
    
    // Save to localStorage if rememberMe is enabled
    if (rememberMe) {
      localStorage.setItem('codegen_user', JSON.stringify(authenticatedUser));
    }
    
    setIsLoading(false);
    
    toast({
      title: "Login Successful",
      description: "Welcome back to CODEGEN!",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codegen_user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('codegen_user', JSON.stringify(updatedUser));
    
    // Also update in mock database
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return !mockUsers.some(u => u.username === username && u.id !== user?.id);
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return !mockUsers.some(u => u.email === email && u.id !== user?.id);
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
        checkEmailAvailability
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
