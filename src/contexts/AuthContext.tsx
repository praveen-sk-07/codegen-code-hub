
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

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

// Mock user type for database storage
interface MockUser extends User {
  password: string;
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

// Password validation function
const isStrongPassword = (password: string): boolean => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMinimumLength = password.length >= 8;
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && hasMinimumLength;
};

// Mock database for demonstration
const mockUsers: MockUser[] = [
  {
    id: '1',
    fullName: 'Demo User',
    organization: 'Adhiyamaan College of Engineering',
    username: 'demouser',
    email: 'demo@example.com',
    password: 'Password@123',
    userType: 'student' as UserType,
    profileImage: '',
    problemsSolved: 45,
    points: 325,
    rank: 12,
    downloads: 8
  }
];

// Function to calculate rank based on problems solved
const calculateRank = (problemsSolved: number): number => {
  if (problemsSolved >= 100) return 1;
  if (problemsSolved >= 80) return 2;
  if (problemsSolved >= 60) return 3;
  if (problemsSolved >= 40) return 4;
  if (problemsSolved >= 20) return 5;
  if (problemsSolved >= 10) return 6;
  return 7;
};

// Function to get stored users from localStorage
const getStoredUsers = (): MockUser[] => {
  const storedUsers = localStorage.getItem('codegen_all_users');
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error('Failed to parse stored users data:', e);
      return mockUsers;
    }
  }
  return mockUsers;
};

// Function to save users to localStorage
const saveUsers = (users: MockUser[]) => {
  localStorage.setItem('codegen_all_users', JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<MockUser[]>(getStoredUsers());

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
    const userExists = allUsers.some(u => u.email === data.email || u.username === data.username);
    
    if (userExists) {
      setIsLoading(false);
      throw new Error('User with this email or username already exists');
    }
    
    // Validate password strength
    if (!isStrongPassword(data.password)) {
      setIsLoading(false);
      throw new Error('Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character');
    }
    
    // Create new user
    const newUser: MockUser = {
      id: Date.now().toString(),
      fullName: data.fullName,
      organization: data.organization,
      username: data.username,
      email: data.email,
      userType: data.userType,
      password: data.password,
      profileImage: '',
      problemsSolved: 0,
      points: 0,
      rank: 7, // Default rank
      downloads: 0
    };
    
    // Add to mock database
    const updatedUsers = [...allUsers, newUser];
    
    setAllUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    // Update state and storage
    // We omit the password when storing in state or localStorage
    const userWithoutPassword: User = {
      id: newUser.id,
      fullName: newUser.fullName,
      organization: newUser.organization,
      username: newUser.username,
      email: newUser.email,
      userType: newUser.userType,
      profileImage: newUser.profileImage,
      problemsSolved: newUser.problemsSolved,
      points: newUser.points,
      rank: newUser.rank,
      downloads: newUser.downloads
    };
    
    setUser(userWithoutPassword);
    localStorage.setItem('codegen_user', JSON.stringify(userWithoutPassword));
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
    
    // Find user in the stored users
    const foundUser = allUsers.find(u => u.email === email && u.password === password);
    
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
    
    // Update rank based on problems solved if problems were updated
    if (data.problemsSolved !== undefined) {
      updatedUser.rank = calculateRank(data.problemsSolved);
    }
    
    setUser(updatedUser);
    localStorage.setItem('codegen_user', JSON.stringify(updatedUser));
    
    // Also update in users database
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, ...data };
      }
      return u;
    });
    
    setAllUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return !allUsers.some(u => u.username === username && u.id !== user?.id);
  };

  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return !allUsers.some(u => u.email === email && u.id !== user?.id);
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
