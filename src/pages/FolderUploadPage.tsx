import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import FolderUploadCard from "../components/FolderUploadCard";
import BatchResultsCard from "../components/BatchResultsCard";
import { FolderResultsProvider } from "../context/FolderResultsContext";
import ThemeToggle from "../components/ThemeToggle";

interface FolderUploadPageProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: "home" | "single" | "batch" | "results" | "settings";
  onPageChange: (page: "home" | "single" | "batch" | "results" | "settings") => void;
}

const FolderUploadPage: React.FC<FolderUploadPageProps> = ({ isSidebarCollapsed, toggleSidebar, currentPage, onPageChange }) => {
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
    <FolderResultsProvider>
      <div className="flex min-h-screen bg-everforest-light-bg dark:bg-everforest-dark-bg">
        <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={onPageChange} />

        <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <div className="flex justify-between items-center mb-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl font-display text-gray-800 dark:text-gray-100">Batch Video Analysis</h1>
              <p className="text-gray-600 dark:text-gray-300">Upload multiple videos and analyze them in batch</p>
            </motion.div>
            <ThemeToggle />
          </div>

          <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-4" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="lg:col-span-4">
              <FolderUploadCard />
            </motion.div>

            <motion.div className="lg:col-span-8">
              <BatchResultsCard />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </FolderResultsProvider>
  );
};

export default FolderUploadPage;
