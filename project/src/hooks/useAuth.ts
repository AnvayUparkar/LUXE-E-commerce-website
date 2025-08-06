import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check - replace with actual API call
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login - replace with actual API call
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email,
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, login, logout };
};