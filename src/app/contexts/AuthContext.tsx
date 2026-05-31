import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Notification } from '../types';
import { mockUsers, mockNotifications } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: 'freelancer' | 'customer') => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  notifications: Notification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate loading user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Load notifications for this user
      const userNotifications = mockNotifications.filter(n => n.userId === userData.id);
      setNotifications(userNotifications);
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by email and role
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      // Load notifications
      const userNotifications = mockNotifications.filter(n => n.userId === foundUser.id);
      setNotifications(userNotifications);
      return true;
    }

    return false;
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: 'freelancer' | 'customer'
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      createdAt: new Date().toISOString(),
      completedProjects: 0,
      rating: 0,
      verified: false,
    };

    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setNotifications([]);
    return true;
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
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
