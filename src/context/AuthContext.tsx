import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getStore } from '../utils/store';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // simple hash for demo
  createdAt: string;
}

interface AuthContextType {
  user: Omit<User, 'passwordHash'> | null;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; email?: string; password?: string }) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signup: async () => null,
  login: async () => null,
  logout: async () => {},
  updateProfile: async () => null,
});

const USERS_KEY = 'users';
const SESSION_KEY = 'session';


// naive password hash (for demo only)
function simpleHash(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);

  useEffect(() => {
    (async () => {
  const store = await getStore();
  const session = (await store.get(SESSION_KEY)) as { userId: string } | null;
  const users = ((await store.get(USERS_KEY)) as User[]) || [];
      if (session) {
        const u = users.find((x) => x.id === session.userId);
        if (u) setUser({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });
      }
    })();
  }, []);

  const signup: AuthContextType['signup'] = async (name, email, password) => {
  const store = await getStore();
  const users = ((await store.get(USERS_KEY)) as User[]) || [];
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      const msg = 'Email already registered';
      toast.error(msg);
      return msg;
    }
    const id = crypto.randomUUID();
    const user: User = {
      id,
      name,
      email,
      passwordHash: simpleHash(password),
      createdAt: new Date().toISOString(),
    };
  await store.set(USERS_KEY, [...users, user]);
  await store.set(SESSION_KEY, { userId: id });
  await store.save();
    setUser({ id, name, email, createdAt: user.createdAt });
    return null;
  };

  const login: AuthContextType['login'] = async (email, password) => {
  const store = await getStore();
  const users = ((await store.get(USERS_KEY)) as User[]) || [];
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
  if (!u) { const msg = 'User not found'; toast.error(msg); return msg; }
  if (u.passwordHash !== simpleHash(password)) { const msg = 'Invalid credentials'; toast.error(msg); return msg; }
  await store.set(SESSION_KEY, { userId: u.id });
  await store.save();
    setUser({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });
    return null;
  };

  const logout = async () => {
  const store = await getStore();
  await store.delete(SESSION_KEY);
  await store.save();
    setUser(null);
  };

  const updateProfile: AuthContextType['updateProfile'] = async (updates) => {
    if (!user) return 'Not authenticated';
    const store = await getStore();
    const users = ((await store.get(USERS_KEY)) as User[]) || [];
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return 'User not found';
    if (updates.email && users.some((u, i) => i !== idx && u.email.toLowerCase() === updates.email!.toLowerCase())) {
      return 'Email already in use';
    }
    const current = users[idx];
    const updated: User = {
      ...current,
      name: updates.name ?? current.name,
      email: updates.email ?? current.email,
      passwordHash: updates.password ? simpleHash(updates.password) : current.passwordHash,
    };
    users[idx] = updated;
    await store.set(USERS_KEY, users);
    await store.save();
    setUser({ id: updated.id, name: updated.name, email: updated.email, createdAt: updated.createdAt });
    return null;
  };

  const value = useMemo(() => ({ user, signup, login, logout, updateProfile }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
