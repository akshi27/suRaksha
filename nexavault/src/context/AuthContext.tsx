import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { loginUser, verifyOTP, type User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ message: string; email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('nexavault_token');
    const savedUser = localStorage.getItem('nexavault_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    return await loginUser(email, password);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const response = await verifyOTP(email, otp);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('nexavault_token', response.token);
    localStorage.setItem('nexavault_user', JSON.stringify(response.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexavault_token');
    localStorage.removeItem('nexavault_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        verifyOtp,
        logout,
        setUser,
        setToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
