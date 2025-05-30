import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-everforest-light-card dark:bg-everforest-dark-card"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5 text-everforest-light-accent-cyan" />
      ) : (
        <Moon className="w-5 h-5 text-everforest-dark-accent-cyan" />
      )}
    </motion.button>
  );
};

export default ThemeToggle