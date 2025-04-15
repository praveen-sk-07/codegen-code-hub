
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, setPersistence, browserLocalPersistence, browserSessionPersistence } from '@/lib/firebase';

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
  loginWithGoogle: (rememberMe: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  incrementProblemsSolved: (points: number) => void;
  getUsersFromSameOrganization: () => User[];
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

// User data is stored in localStorage for persistence
const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem('codegen_current_user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const saveUserToStorage = (user: User): void => {
  localStorage.setItem('codegen_current_user', JSON.stringify(user));
};

// Initial mock users for organization features
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem('codegen_users');
  return stored ? JSON.parse(stored) : [];
};

const saveUsersToStorage = (users: User[]): void => {
  localStorage.setItem('codegen_users', JSON.stringify(users));
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<User[]>(getStoredUsers());

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, check if we have their data in localStorage
        const existingUser = getUserFromStorage();
        
        if (existingUser && existingUser.email === firebaseUser.email) {
          // We have user data in localStorage, use that
          setUser(existingUser);
        } else {
          // Create minimal user record from Firebase data
          const newUser: User = {
            id: firebaseUser.uid,
            fullName: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            username: firebaseUser.email?.split('@')[0] || 'user',
            userType: 'student', // Default value
            profileImage: firebaseUser.photoURL || '',
            problemsSolved: 0,
            points: 0,
            rank: 7,
            downloads: 0
          };
          
          setUser(newUser);
          saveUserToStorage(newUser);
          
          // Add to all users if not already there
          if (!allUsers.some(u => u.email === newUser.email)) {
            const updatedUsers = [...allUsers, newUser];
            setAllUsers(updatedUsers);
            saveUsersToStorage(updatedUsers);
          }
        }
      } else {
        // User is logged out
        setUser(null);
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // In a real app, this would be a backend call
    // Here we're just checking against our local storage users
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    return !allUsers.some(u => u.username === username && u.id !== user?.id);
  };
  
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    // In a real app, this would be a backend call
    // Here we're just checking against our local storage users
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    return !allUsers.some(u => u.email === email && u.id !== user?.id);
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const firebaseUser = userCredential.user;
      
      // Create user record with additional information
      const newUser: User = {
        id: firebaseUser.uid,
        fullName: data.fullName,
        organization: data.organization,
        username: data.username,
        email: data.email,
        userType: data.userType,
        profileImage: firebaseUser.photoURL || '',
        problemsSolved: 0,
        points: 0,
        rank: 7,
        downloads: 0
      };
      
      // Save user to localStorage
      saveUserToStorage(newUser);
      
      // Add to all users
      const updatedUsers = [...allUsers, newUser];
      setAllUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      setUser(newUser);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to CODEGEN!",
      });
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle Firebase errors
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please try logging in instead.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Set persistence based on "Remember Me" checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to CODEGEN!",
      });
    } catch (error: any) {
      setIsLoading(false);
      
      // Handle Firebase errors
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Set persistence based on "Remember Me" checkbox
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      // Create Google provider
      const provider = new GoogleAuthProvider();
      
      // Sign in with popup
      await signInWithPopup(auth, provider);
      
      toast({
        title: "Login Successful",
        description: "Welcome to CODEGEN!",
      });
    } catch (error: any) {
      setIsLoading(false);
      
      toast({
        title: "Login Failed",
        description: "Google sign-in failed. Please try again.",
        variant: "destructive",
      });
      
      throw new Error("Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem('codegen_current_user');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    }).catch((error) => {
      console.error("Error signing out: ", error);
      
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    });
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
    
    // Update in all users list
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, ...data };
      }
      return u;
    });
    
    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
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
    saveUserToStorage(updatedUser);
    
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, problemsSolved: u.problemsSolved + 1, points: u.points + points };
      }
      return u;
    });
    
    setAllUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    toast({
      title: "Problem Completed!",
      description: `+${points} points added to your profile.`,
    });
  };

  const getUsersFromSameOrganization = () => {
    if (!user?.organization) return [];
    return allUsers.filter(u => u.organization === user.organization && u.id !== user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        loginWithGoogle,
        logout,
        updateUser,
        incrementProblemsSolved,
        getUsersFromSameOrganization,
        checkUsernameAvailability,
        checkEmailAvailability,
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
