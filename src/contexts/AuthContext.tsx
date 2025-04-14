
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
  lastSyncTimestamp?: number;
  lastLogin?: string; // Track last login time
  deviceId?: string; // Track device identifier
  sessionToken?: string; // JWT-like token for session validation
  tokenExpiry?: number; // Token expiration timestamp
}

// Mock user type for database storage
interface MockUser extends User {
  password: string;
  refreshToken?: string; // For token refresh mechanism
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
  incrementProblemsSolved: (points: number) => void;
  getUsersFromSameOrganization: () => MockUser[];
  validateSession: () => boolean; // New function to validate session
  refreshUserSession: () => void; // New function to refresh user session
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

// Generate a unique device ID
const generateDeviceId = (): string => {
  const existingDeviceId = localStorage.getItem('codegen_device_id');
  if (existingDeviceId) return existingDeviceId;
  
  const newDeviceId = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
  localStorage.setItem('codegen_device_id', newDeviceId);
  return newDeviceId;
};

// Generate a JWT-like token (simulated for frontend only)
const generateToken = (userId: string): { token: string, expiry: number } => {
  const now = Date.now();
  const expiryTime = now + (7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  // In a real app, this would be a proper JWT signed by a server
  const payload = {
    userId,
    deviceId: generateDeviceId(),
    issuedAt: now,
    expiresAt: expiryTime
  };
  
  const token = btoa(JSON.stringify(payload)); // Base64 encoding (simulated JWT)
  return { token, expiry: expiryTime };
};

// Validate token 
const validateToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.expiresAt > Date.now();
  } catch (e) {
    return false;
  }
};

// Initial mock users
const initialMockUsers: MockUser[] = [];

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
      return initialMockUsers;
    }
  }
  return initialMockUsers;
};

// Function to save users to localStorage
const saveUsers = (users: MockUser[]) => {
  localStorage.setItem('codegen_all_users', JSON.stringify(users));
};

// Function to save user data to sessionStorage for browser session persistence
const saveUserToSessionStorage = (user: User) => {
  sessionStorage.setItem('codegen_current_user', JSON.stringify({
    ...user,
    lastSyncTimestamp: Date.now(),
    deviceId: generateDeviceId()
  }));
};

// Function to save user data to localStorage for cross-session persistence
const saveUserToLocalStorage = (user: User) => {
  localStorage.setItem('codegen_user', JSON.stringify({
    ...user,
    lastSyncTimestamp: Date.now(),
    deviceId: generateDeviceId(),
    lastLogin: new Date().toISOString()
  }));
};

// Function to get user from sessionStorage
const getUserFromSessionStorage = (): User | null => {
  const storedUser = sessionStorage.getItem('codegen_current_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse stored user data from session:', e);
      return null;
    }
  }
  return null;
};

// Function to get user from localStorage
const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem('codegen_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      
      // Check if token has expired (if it exists)
      if (user.sessionToken && user.tokenExpiry) {
        if (user.tokenExpiry < Date.now()) {
          // Token expired, clear from localStorage
          localStorage.removeItem('codegen_user');
          sessionStorage.removeItem('codegen_current_user');
          return null;
        }
      }
      
      return user;
    } catch (e) {
      console.error('Failed to parse stored user data from localStorage:', e);
      return null;
    }
  }
  return null;
};

// Sync user data across storage and devices
const syncUserData = (user: User): User => {
  const localUser = getUserFromLocalStorage();
  const sessionUser = getUserFromSessionStorage();
  
  // Get the most recent data
  let mostRecentUser = user;
  
  if (localUser && localUser.lastSyncTimestamp && 
      (!mostRecentUser.lastSyncTimestamp || localUser.lastSyncTimestamp > mostRecentUser.lastSyncTimestamp)) {
    mostRecentUser = localUser;
  }
  
  if (sessionUser && sessionUser.lastSyncTimestamp && 
      (!mostRecentUser.lastSyncTimestamp || sessionUser.lastSyncTimestamp > mostRecentUser.lastSyncTimestamp)) {
    mostRecentUser = sessionUser;
  }
  
  // Update all storage locations with most recent data
  saveUserToSessionStorage(mostRecentUser);
  saveUserToLocalStorage(mostRecentUser);
  
  return mostRecentUser;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [allUsers, setAllUsers] = useState<MockUser[]>(getStoredUsers());

  // Session validation function
  const validateSession = (): boolean => {
    const localUser = getUserFromLocalStorage();
    
    if (!localUser) return false;
    
    // Check if token exists and is valid
    if (localUser.sessionToken) {
      return validateToken(localUser.sessionToken);
    }
    
    return false;
  };
  
  // Session refresh function
  const refreshUserSession = () => {
    if (!user || !user.id) return;
    
    // Generate new token
    const { token, expiry } = generateToken(user.id);
    
    // Update user with new token
    const updatedUser = { 
      ...user, 
      sessionToken: token,
      tokenExpiry: expiry,
      lastSyncTimestamp: Date.now()
    };
    
    setUser(updatedUser);
    saveUserToSessionStorage(updatedUser);
    saveUserToLocalStorage(updatedUser);
    
    // Update in all users collection
    const updatedAllUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { ...u, sessionToken: token, tokenExpiry: expiry };
      }
      return u;
    });
    
    setAllUsers(updatedAllUsers);
    saveUsers(updatedAllUsers);
  };

  useEffect(() => {
    // Check for stored user data in localStorage or sessionStorage on initial load
    const localStorageUser = getUserFromLocalStorage();
    const sessionStorageUser = getUserFromSessionStorage();
    
    let currentUser = null;
    
    // Prioritize session storage for current browser tab
    if (sessionStorageUser) {
      currentUser = sessionStorageUser;
    } else if (localStorageUser) {
      currentUser = localStorageUser;
      // Also save to session storage for cross-tab consistency
      saveUserToSessionStorage(localStorageUser);
    }
    
    if (currentUser) {
      // Validate session token if it exists
      if (currentUser.sessionToken) {
        const isValid = validateToken(currentUser.sessionToken);
        if (!isValid) {
          // Token is invalid or expired
          localStorage.removeItem('codegen_user');
          sessionStorage.removeItem('codegen_current_user');
          setUser(null);
          setIsLoading(false);
          return;
        }
      }
      
      // Sync data across storage mechanisms
      const syncedUser = syncUserData(currentUser);
      setUser(syncedUser);
      
      // Check if we need to update the allUsers array with any updated user data
      if (syncedUser.id) {
        const updatedAllUsers = allUsers.map(u => {
          if (u.id === syncedUser.id) {
            return { ...u, ...syncedUser, password: u.password }; // Keep password from storage
          }
          return u;
        });
        setAllUsers(updatedAllUsers);
        saveUsers(updatedAllUsers);
      }
    }
    
    setIsLoading(false);
    
    // Set up periodic token validation
    const intervalId = setInterval(() => {
      if (user && user.sessionToken) {
        const isValid = validateToken(user.sessionToken);
        if (!isValid) {
          // Token has expired, refresh it
          refreshUserSession();
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
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
    
    // Generate unique ID
    const userId = Date.now().toString();
    
    // Generate authentication token
    const { token, expiry } = generateToken(userId);
    
    // Create new user
    const newUser: MockUser = {
      id: userId,
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
      downloads: 0,
      sessionToken: token,
      tokenExpiry: expiry,
      deviceId: generateDeviceId(),
      lastLogin: new Date().toISOString(),
      lastSyncTimestamp: Date.now()
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
      downloads: newUser.downloads,
      sessionToken: token,
      tokenExpiry: expiry,
      deviceId: generateDeviceId(),
      lastLogin: new Date().toISOString(),
      lastSyncTimestamp: Date.now()
    };
    
    setUser(userWithoutPassword);
    saveUserToLocalStorage(userWithoutPassword);
    saveUserToSessionStorage(userWithoutPassword);
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
    
    // Generate new authentication token
    const { token, expiry } = generateToken(foundUser.id);
    
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
      downloads: foundUser.downloads,
      deviceId: generateDeviceId(),
      lastLogin: new Date().toISOString(),
      sessionToken: token,
      tokenExpiry: expiry,
      lastSyncTimestamp: Date.now()
    };
    
    // Update state
    setUser(authenticatedUser);
    
    // Always save to sessionStorage for browser session persistence
    saveUserToSessionStorage(authenticatedUser);
    
    // Save to localStorage if rememberMe is enabled or for cross-device access
    // We now always save to localStorage to enable cross-device login, but with different persistence
    if (rememberMe) {
      // Permanent storage
      saveUserToLocalStorage(authenticatedUser);
    } else {
      // Session-only storage with expiration hint
      const tempUser = {...authenticatedUser, sessionOnly: true};
      saveUserToLocalStorage(tempUser);
    }
    
    // Update the user's session token in the database
    const updatedAllUsers = allUsers.map(u => {
      if (u.id === foundUser.id) {
        return { ...u, sessionToken: token, tokenExpiry: expiry, lastLogin: new Date().toISOString() };
      }
      return u;
    });
    
    setAllUsers(updatedAllUsers);
    saveUsers(updatedAllUsers);
    
    setIsLoading(false);
    
    toast({
      title: "Login Successful",
      description: "Welcome back to CODEGEN!",
    });
  };

  const logout = () => {
    // If user exists, invalidate their token in the database
    if (user && user.id) {
      const updatedAllUsers = allUsers.map(u => {
        if (u.id === user.id) {
          // Remove token from database record
          const { sessionToken, tokenExpiry, ...rest } = u;
          return rest;
        }
        return u;
      });
      
      setAllUsers(updatedAllUsers);
      saveUsers(updatedAllUsers);
    }
    
    setUser(null);
    localStorage.removeItem('codegen_user');
    sessionStorage.removeItem('codegen_current_user');
    
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
    
    // Update in both storage locations
    saveUserToLocalStorage(updatedUser);
    saveUserToSessionStorage(updatedUser);
    
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

  const incrementProblemsSolved = (points: number) => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      problemsSolved: user.problemsSolved + 1,
      points: user.points + points
    };
    
    // Update rank based on new problem count
    updatedUser.rank = calculateRank(updatedUser.problemsSolved);
    
    setUser(updatedUser);
    
    // Update in both storage locations
    saveUserToLocalStorage(updatedUser);
    saveUserToSessionStorage(updatedUser);
    
    // Also update in users database
    const updatedUsers = allUsers.map(u => {
      if (u.id === user.id) {
        return { 
          ...u, 
          problemsSolved: u.problemsSolved + 1,
          points: u.points + points,
          rank: calculateRank(u.problemsSolved + 1)
        };
      }
      return u;
    });
    
    setAllUsers(updatedUsers);
    saveUsers(updatedUsers);
    
    toast({
      title: "Problem Completed!",
      description: `+${points} points added to your profile.`,
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

  // Function to get users from the same organization, excluding the current user and demo user
  const getUsersFromSameOrganization = (): MockUser[] => {
    if (!user || !user.organization) return [];
    
    return allUsers
      .filter(u => 
        u.organization === user.organization && 
        u.id !== user.id && 
        u.email !== 'demo@example.com'
      )
      .map(u => ({
        ...u,
        password: '********' // Mask password for security
      }));
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
