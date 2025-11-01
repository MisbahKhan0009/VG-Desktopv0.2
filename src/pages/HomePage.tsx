import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { BarChart3, Users, Zap, Shield, Globe, LogIn, UserPlus, LogOut } from "lucide-react";
import { useEffect, useState } from 'react';
import { getStore, KEYS, HistoryItem } from '../utils/store';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { toast } from 'sonner';

interface HomePageProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: "home" | "single" | "results" | "settings";
  onPageChange: (page: "home" | "single" | "results" | "settings") => void;
}

const HomePage: React.FC<HomePageProps> = ({ isSidebarCollapsed, toggleSidebar, currentPage, onPageChange }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { label: "Videos Analyzed", value: "1,234", icon: BarChart3, color: "text-blue-600" },
    { label: "Anomalies Detected", value: "89", icon: Shield, color: "text-red-500" },
    { label: "Active Users", value: "45", icon: Users, color: "text-green-500" },
    { label: "Processing Speed", value: "2.3x", icon: Zap, color: "text-yellow-500" },
  ];

  const features = [
    {
      title: "Real-time Analysis",
      description: "Detect anomalies in videos as they're processed with our advanced AI algorithms.",
      icon: Zap,
      color: "bg-blue-500",
    },
    {
      title: "Global Deployment",
      description: "Deploy your anomaly detection models across multiple regions for better performance.",
      icon: Globe,
      color: "bg-purple-500",
    },
  ];

  const { user, logout } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const store = await getStore();
        const h = ((await store.get(KEYS.HISTORY)) as HistoryItem[]) || [];
        const filtered = user ? h.filter((x) => x.userId === user.id) : h;
        setHistory(filtered.slice(0, 10));
      } catch (e) {
        console.error(e);
        toast.error('Failed to load recent activity');
      }
    })();
  }, [user]);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="flex min-h-screen bg-everforest-light-bg dark:bg-everforest-dark-bg">
      <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={onPageChange} />

      <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="flex justify-between items-center mb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-display text-gray-800 dark:text-gray-100">Welcome to AnomalyNQA</h1>
            <p className="text-gray-600 dark:text-gray-300">Advanced video anomaly detection powered by AI</p>
          </motion.div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <button onClick={logout} className="ml-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1">
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setAuthMode('signup'); setAuthOpen(true); }} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1">
                  <UserPlus size={16} /> Sign up
                </button>
                <button onClick={() => { setAuthMode('login'); setAuthOpen(true); }} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1">
                  <LogIn size={16} /> Log in
                </button>
              </div>
            )}
          </div>
        </div>

        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Stats Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={cardVariants}>
            {stats.map((stat, index) => (
              <motion.div key={index} className="retro-card p-6" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Welcome Section */}
          <motion.div className="retro-card p-8" variants={cardVariants}>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-display mb-4 text-gray-800 dark:text-gray-100">Detect Anomalies with Precision</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Our state-of-the-art AI models can identify unusual patterns and anomalies in your video content. Whether you're monitoring security footage, analyzing sports performance, or detecting manufacturing defects, AnomalyNQA provides the tools you need.</p>
              <div className="flex gap-4 justify-center">
                <motion.button onClick={() => onPageChange("single")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Start Single Analysis
                </motion.button>
                {/* Batch Processing removed */}
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={cardVariants}>
            {features.map((feature, index) => (
              <motion.div key={index} className="retro-card p-6" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div className="retro-card p-6" variants={cardVariants}>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h3>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">No recent activity yet.</p>
              ) : (
                history.map((h) => (
                  <div key={h.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${h.status === 'completed' ? 'bg-green-500' : h.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{h.fileName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[360px]">
                          {h.anomalyType ? h.anomalyType : 'unknown'} • {h.query}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(h.time).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
  <AuthModal open={authOpen} mode={authMode} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default HomePage;
