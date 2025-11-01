import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  open: boolean;
  mode: 'login' | 'signup';
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ open, mode: initialMode, onClose }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let err: string | null = null;
      if (mode === 'login') {
        err = await login(email, password);
      } else {
        err = await signup(name || 'User', email, password);
      }
      if (err) setError(err);
      else onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{mode === 'login' ? 'Log in' : 'Sign up'}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full p-2 border rounded-md bg-white dark:bg-gray-800" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full p-2 border rounded-md bg-white dark:bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full p-2 border rounded-md bg-white dark:bg-gray-800" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <motion.button type="submit" disabled={loading} className={`w-full py-2 rounded-md bg-blue-600 text-white ${loading ? 'opacity-60' : 'hover:bg-blue-700'}`} whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </motion.button>
        </form>

        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {mode === 'login' ? (
            <button className="text-blue-600 hover:underline" onClick={() => setMode('signup')}>No account? Sign up</button>
          ) : (
            <button className="text-blue-600 hover:underline" onClick={() => setMode('login')}>Already have an account? Log in</button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
