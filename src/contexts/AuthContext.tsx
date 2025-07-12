import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleAuthService, GoogleUser } from '@/services/googleAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  picture?: string;
  authMethod?: 'email' | 'google';
}

interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  signup: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash function for demo purposes (in production, use proper hashing)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

// Local storage keys
const USERS_STORAGE_KEY = 'rewear_users';
const CURRENT_USER_KEY = 'rewear_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get stored users from localStorage
  const getStoredUsers = (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading stored users:', error);
      return [];
    }
  };

  // Save users to localStorage
  const saveStoredUsers = (users: StoredUser[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  };

  // Get current user from localStorage
  const getCurrentUser = (): User | null => {
    try {
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      return currentUser ? JSON.parse(currentUser) : null;
    } catch (error) {
      console.error('Error reading current user:', error);
      return null;
    }
  };

  // Save current user to localStorage
  const saveCurrentUser = (user: User | null) => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  };

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        // First check for Google authentication
        const googleUser = googleAuthService.getCurrentUser();
        if (googleUser) {
          const userData: User = {
            id: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            role: 'user',
            picture: googleUser.picture,
            authMethod: 'google'
          };
          setUser(userData);
          saveCurrentUser(userData);
        } else {
          // Check for locally stored user
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signup = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const storedUsers = getStoredUsers();
      
      // Check if user already exists
      const existingUser = storedUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name,
        passwordHash: simpleHash(userData.password),
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Save to localStorage
      storedUsers.push(newUser);
      saveStoredUsers(storedUsers);

      // Create user object for context
      const user: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        authMethod: 'email'
      };

      setUser(user);
      saveCurrentUser(user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const storedUsers = getStoredUsers();
      const storedUser = storedUsers.find(u => u.email === email);
      
      if (!storedUser) {
        throw new Error('User not found');
      }

      if (storedUser.passwordHash !== simpleHash(password)) {
        throw new Error('Invalid password');
      }

      const user: User = {
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.name,
        role: storedUser.role,
        authMethod: 'email'
      };

      setUser(user);
      saveCurrentUser(user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const googleUser = await googleAuthService.signIn();
      
      // Convert Google user to our User interface
      const userData: User = {
        id: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name,
        role: 'user',
        picture: googleUser.picture,
        authMethod: 'google'
      };
      
      setUser(userData);
      saveCurrentUser(userData);
      
      // Optionally, you can also send the user data to your backend
      // to create/update the user in your database
      try {
        await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            googleId: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture
          }),
          credentials: 'include'
        });
      } catch (error) {
        console.error('Failed to sync user with backend:', error);
        // Don't throw here as the user is already logged in locally
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // If user was authenticated with Google, sign out from Google
      if (user?.authMethod === 'google') {
        await googleAuthService.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      saveCurrentUser(null);
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    loading,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
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