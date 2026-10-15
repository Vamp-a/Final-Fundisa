import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('fundisa_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string): { success: boolean; error?: string } => {
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!found) {
      return { success: false, error: 'No account found for that email address.' };
    }
    setUser(found);
    sessionStorage.setItem('fundisa_user', JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('fundisa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
