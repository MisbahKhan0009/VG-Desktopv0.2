import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import UploadCard from "./components/UploadCard";
import VideoPreviewCard from "./components/VideoPreviewCard";
import GraphCard from "./components/GraphCard";
import MomentsTableCard from "./components/MomentsTableCard";
import HighlightedMomentCard from "./components/HighlightedMomentCard";
import FolderUploadPage from "./pages/FolderUploadPage";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import SettingsPage from "./pages/SettingsPage";
import { ResultsProvider } from "./context/ResultsContext";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "single" | "batch" | "results" | "settings">("home");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handlePageChange = (page: "home" | "single" | "batch" | "results" | "settings") => {
    setCurrentPage(page);
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

  if (currentPage === "batch") {
    return (
      <ThemeProvider>
        <AuthProvider>
          <FolderUploadPage isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={handlePageChange} />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === "home") {
    return (
      <ThemeProvider>
        <AuthProvider>
          <HomePage isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={handlePageChange} />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === "results") {
    return (
      <ThemeProvider>
        <AuthProvider>
          <ResultsPage isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={handlePageChange} />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  if (currentPage === "settings") {
    return (
      <ThemeProvider>
        <AuthProvider>
          <SettingsPage isSidebarCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={handlePageChange} />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ResultsProvider>
        <div className="flex min-h-screen bg-everforest-light-bg dark:bg-everforest-dark-bg">
          <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={handlePageChange} />

          <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
            <div className="flex justify-between items-center mb-6">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl font-display text-gray-800 dark:text-gray-100">AnomalyNQA</h1>
                <p className="text-gray-600 dark:text-gray-300">Upload a video and enter a query to detect anomalies</p>
              </motion.div>
              <ThemeToggle />
            </div>

            <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-4" variants={containerVariants} initial="hidden" animate="visible">
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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
