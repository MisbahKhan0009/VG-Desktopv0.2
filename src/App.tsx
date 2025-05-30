import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import UploadCard from './components/UploadCard';
import VideoPreviewCard from './components/VideoPreviewCard';
import GraphCard from './components/GraphCard';
import MomentsTableCard from './components/MomentsTableCard';
import HighlightedMomentCard from './components/HighlightedMomentCard';
import { ResultsProvider } from './context/ResultsContext';

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
    <ResultsProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
        
        <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-display text-content">Anomaly Detection</h1>
            <p className="text-content/70">Upload a video and enter a query to detect anomalies</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Card 1: Upload + Query */}
            <motion.div 
              className="lg:col-span-6 xl:col-span-5"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <UploadCard />
            </motion.div>

            {/* Card 2: Video Preview + Metadata */}
            <motion.div 
              className="lg:col-span-6 xl:col-span-7"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <VideoPreviewCard />
            </motion.div>

            {/* Card 3: Graph Display */}
            <motion.div 
              className="lg:col-span-8"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <GraphCard />
            </motion.div>

            {/* Card 4: Moments Table */}
            <motion.div 
              className="lg:col-span-4"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              <MomentsTableCard />
            </motion.div>

            {/* Card 5: Highlighted Moment */}
            <motion.div 
              className="lg:col-span-12"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
              }}
            >
              <HighlightedMomentCard />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </ResultsProvider>
  );
}

export default App;