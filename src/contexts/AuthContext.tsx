
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  incrementProblemsSolved: (points: number) => void;
  getUsersFromSameOrganization: () => User[];
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

// Initial mock users
const initialUsers: (User & { password: string })[] = [];

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<(User & { password: string })[]>(() => {
    const stored = localStorage.getItem('codegen_users');
    return stored ? JSON.parse(stored) : initialUsers;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('codegen_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      id: Date.now().toString(),
      fullName: data.fullName,
      organization: data.organization,
      username: data.username,
      email: data.email,
      userType: data.userType,
      profileImage: '',
      problemsSolved: 0,
      points: 0,
      rank: 7,
      downloads: 0,
      password: data.password,
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('codegen_users', JSON.stringify(updatedUsers));

    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as any).password;
    
    setUser(userWithoutPassword);
    localStorage.setItem('codegen_current_user', JSON.stringify(userWithoutPassword));
    
    setIsLoading(false);
    
    toast({
      title: "Registration Successful",
      description: "Welcome to CODEGEN!",
    });
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = allUsers.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    const userWithoutPassword = { ...foundUser };
    delete (userWithoutPassword as any).password;
    
    setUser(userWithoutPassword);
    localStorage.setItem('codegen_current_user', JSON.stringify(userWithoutPassword));
    
    if (rememberMe) {
      localStorage.setItem('codegen_remember_user', JSON.stringify(userWithoutPassword));
    }
    
    setIsLoading(false);
    
    toast({
      title: "Login Successful",
      description: "Welcome back to CODEGEN!",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codegen_current_user');
    localStorage.removeItem('codegen_remember_user');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('codegen_current_user', JSON.stringify(updatedUser));
    
    // Update in all users list
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, ...data };
      }
      return u;
    });
    
    setAllUsers(updatedUsers);
    localStorage.setItem('codegen_users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const incrementProblemsSolved = (points: number) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      problemsSolved: user.problemsSolved + 1,
      points: user.points + points,
    };
    
    setUser(updatedUser);
    localStorage.setItem('codegen_current_user', JSON.stringify(updatedUser));
    
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, problemsSolved: u.problemsSolved + 1, points: u.points + points };
      }
      return u;
    });
    
    setAllUsers(updatedUsers);
    localStorage.setItem('codegen_users', JSON.stringify(updatedUsers));
    
    toast({
      title: "Problem Completed!",
      description: `+${points} points added to your profile.`,
    });
  };

  const getUsersFromSameOrganization = () => {
    if (!user?.organization) return [];
    return allUsers
      .filter(u => u.organization === user.organization && u.id !== user.id)
      .map(u => {
        const userWithoutPassword = { ...u };
        delete (userWithoutPassword as any).password;
        return userWithoutPassword;
      });
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
        incrementProblemsSolved,
        getUsersFromSameOrganization,
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

export { AuthProvider };
