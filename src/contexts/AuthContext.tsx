'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'pjc_users';
const SESSION_KEY = 'pjc_session';

function getStoredUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Simple hash — purely for basic obfuscation in localStorage
function hashPassword(pw: string): string {
  return btoa(encodeURIComponent(pw + 'pjc_salt_2024'));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) setUser(JSON.parse(session));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const users = getStoredUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('Un compte existe déjà avec cet email.');

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    saveStoredUsers([...users, newUser]);

    const session: User = { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const login = async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === hashPassword(password)
    );
    if (!found) throw new Error('Email ou mot de passe incorrect.');

    const session: User = { id: found.id, name: found.name, email: found.email, createdAt: found.createdAt };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
