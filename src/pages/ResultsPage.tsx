import React from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { AlertTriangle, CheckCircle, Clock, BarChart3, Eye, Download, Filter } from "lucide-react";

interface ResultsPageProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: "home" | "single" | "results" | "settings";
  onPageChange: (page: "home" | "single" | "results" | "settings") => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ isSidebarCollapsed, toggleSidebar, currentPage, onPageChange }) => {
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

  const analysisResults = [
    {
      id: 1,
      fileName: "security_camera_01.mp4",
      analysisDate: "2024-01-15 14:30",
      status: "completed",
      anomaliesDetected: 3,
      confidence: 0.87,
      duration: "00:05:23",
      highlights: ["Person entering restricted area", "Unusual movement pattern", "Object left behind"],
    },
    {
      id: 2,
      fileName: "production_line_monitoring.mp4",
      analysisDate: "2024-01-15 13:45",
      status: "completed",
      anomaliesDetected: 1,
      confidence: 0.92,
      duration: "00:12:17",
      highlights: ["Equipment malfunction detected"],
    },
    {
      id: 3,
      fileName: "traffic_intersection_cam.mp4",
      analysisDate: "2024-01-15 12:15",
      status: "processing",
      anomaliesDetected: 0,
      confidence: 0.0,
      duration: "00:08:45",
      highlights: [],
    },
    {
      id: 4,
      fileName: "warehouse_activity.mp4",
      analysisDate: "2024-01-15 11:30",
      status: "completed",
      anomaliesDetected: 5,
      confidence: 0.79,
      duration: "00:15:33",
      highlights: ["Unauthorized access", "Unusual package handling", "Safety protocol violation", "Equipment misuse", "Irregular workflow"],
    },
  ];

  const summaryStats = [
    { label: "Total Analyses", value: "247", icon: BarChart3, change: "+12%" },
    { label: "Anomalies Found", value: "89", icon: AlertTriangle, change: "+8%" },
    { label: "Success Rate", value: "94.2%", icon: CheckCircle, change: "+2.1%" },
    { label: "Avg Processing Time", value: "3.4 min", icon: Clock, change: "-15%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "processing":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "failed":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex min-h-screen bg-everforest-light-bg dark:bg-everforest-dark-bg">
      <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={onPageChange} />

      <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="flex justify-between items-center mb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-display text-gray-800 dark:text-gray-100">Analysis Results</h1>
            <p className="text-gray-600 dark:text-gray-300">View and manage your video analysis results</p>
          </motion.div>
          <ThemeToggle />
        </div>

        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Summary Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={cardVariants}>
            {summaryStats.map((stat, index) => (
              <motion.div key={index} className="retro-card p-6" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters and Actions */}
          <motion.div className="retro-card p-4" variants={cardVariants}>
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <motion.button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Filter className="w-4 h-4" />
                  Filter Results
                </motion.button>
                <motion.button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Download className="w-4 h-4" />
                  Export Data
                </motion.button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Showing {analysisResults.length} results</span>
              </div>
            </div>
          </motion.div>

          {/* Results Table */}
          <motion.div className="retro-card p-6" variants={cardVariants}>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Recent Analysis Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">File Name</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">Date</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">Status</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">Anomalies</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">Confidence</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">Duration</th>
                    <th className="text-left py-3 px-4 text-gray-800 dark:text-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResults.map((result) => (
                    <motion.tr key={result.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800 dark:text-gray-100">{result.fileName}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{result.analysisDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>{result.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800 dark:text-gray-100">{result.anomaliesDetected}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${getConfidenceColor(result.confidence)}`}>{result.status === "processing" ? "--" : `${(result.confidence * 100).toFixed(1)}%`}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{result.duration}</td>
                      <td className="py-3 px-4">
                        <motion.button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Detailed Highlights */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={cardVariants}>
            {analysisResults
              .filter((r) => r.highlights.length > 0)
              .map((result) => (
                <motion.div key={result.id} className="retro-card p-6" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100">{result.fileName}</h4>
                  <div className="space-y-2">
                    {result.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{result.anomaliesDetected} anomalies detected</span>
                    <motion.button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      View Details →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default ResultsPage;
