import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import UploadCard from './components/UploadCard';
import VideoPreviewCard from './components/VideoPreviewCard';
import GraphCard from './components/GraphCard';
import MomentsTableCard from './components/MomentsTableCard';
import HighlightedMomentCard from './components/HighlightedMomentCard';
import { ResultsProvider } from './context/ResultsContext';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

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

  return (
    <ThemeProvider>
      <ResultsProvider>
        <div className="flex min-h-screen bg-[var(--bg-color)]">
          <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
          
          <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
            <div className="flex justify-between items-center mb-6">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-display">Anomaly Detection</h1>
                <p className="text-[var(--text-color)]/70">Upload a video and enter a query to detect anomalies</p>
              </motion.div>
              <ThemeToggle />
            </div>

            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="lg:col-span-6 xl:col-span-5">
                <UploadCard />
              </motion.div>

              <motion.div className="lg:col-span-6 xl:col-span-7">
                <VideoPreviewCard />
              </motion.div>

              <motion.div className="lg:col-span-8">
                <GraphCard />
              </motion.div>

              <motion.div className="lg:col-span-4">
                <MomentsTableCard />
              </motion.div>

              <motion.div className="lg:col-span-12">
                <HighlightedMomentCard />
              </motion.div>
            </motion.div>
          </main>
        </div>
      </ResultsProvider>
    </ThemeProvider>
  );
}

export default App;