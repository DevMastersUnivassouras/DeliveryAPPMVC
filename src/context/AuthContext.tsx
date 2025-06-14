import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Administrador",
    isAdmin: true,
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    name: "Usuário Padrão",
    isAdmin: false,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const getUsersFromStorage = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : MOCK_USERS;
  };

  const saveUsersToStorage = (users: typeof MOCK_USERS) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const login = async (email: string, password: string, isAdmin?: boolean) => {
    try {
      // Tenta login no backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        // Salva token JWT no localStorage
        localStorage.setItem('token', data.token);
        const userData = { ...data.user, isAdmin: data.user.role === 'admin' };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login realizado com sucesso');
        return;
      }
      throw new Error('Credenciais inválidas');
    } catch (error) {
      toast.error('Credenciais inválidas');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      if (response.ok) {
        const data = await response.json();
        // Login automático após registro
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          localStorage.setItem('token', loginData.token);
          const userData = { ...loginData.user, isAdmin: loginData.user.role === 'admin' };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          toast.success('Conta criada com sucesso!');
          return true;
        }
        toast.error('Erro ao fazer login após registro');
        return false;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao registrar');
        return false;
      }
    } catch (error) {
      toast.error('Erro ao registrar');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register, // Adiciona a função register ao contexto
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
