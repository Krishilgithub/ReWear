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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
        } else {
          // Check for server-side session
          const response = await fetch('/api/auth/me', {
            credentials: 'include'
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
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

  const login = async (email: string, password: string) => {
    try {
      // Call your serverless function for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      setUser({ ...userData, authMethod: 'email' });
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
      } else {
        // Call server-side logout
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    logout,
    loading
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