import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (credentials: { email: string; password: string; role: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authAPI.getCurrentUser();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error checking auth status:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: { email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Navigate to appropriate dashboard based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      
      toast.success(`Welcome back, ${user.name}!`);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Don't show toast here, let the component handle the error display
      if (error.response?.data?.message) {
        // Do nothing, let the component handle it
      } else {
        toast.error('Login failed. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role: string }) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Navigate based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
        toast.success('Admin account created successfully!');
      } else if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
        if (user.status === 'pending') {
          toast.info('Your teacher account is pending approval from admin');
        } else {
          toast.success('Teacher account created successfully!');
        }
      } else {
        navigate('/student/dashboard');
        toast.success('Student account created successfully!');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Don't show toast here, let the component handle the error display
      if (error.response?.data?.message) {
        // Do nothing, let the component handle it
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout
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

export default AuthContext;