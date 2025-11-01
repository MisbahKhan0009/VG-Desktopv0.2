import React from "react";
import { motion } from "framer-motion";
import { Home, Upload, BarChart2, Settings, Menu, ChevronLeft } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  currentPage?: "home" | "single" | "results" | "settings";
  onPageChange?: (page: "home" | "single" | "results" | "settings") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar, currentPage = "home", onPageChange }) => {
  const sidebarVariants = {
    expanded: { width: "16rem" },
    collapsed: { width: "4rem" },
  };

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      active: currentPage === "home",
      onClick: () => onPageChange?.("home"),
    },
    {
      icon: Upload,
      label: "Single Upload",
      active: currentPage === "single",
      onClick: () => onPageChange?.("single"),
    },
    {
      icon: BarChart2,
      label: "Results",
      active: currentPage === "results",
      onClick: () => onPageChange?.("results"),
    },
    {
      icon: Settings,
      label: "Settings",
      active: currentPage === "settings",
      onClick: () => onPageChange?.("settings"),
    },
  ];

  return (
    <motion.div className="fixed h-full bg-everforest-light-card dark:bg-everforest-dark-card border-r border-everforest-light-border dark:border-everforest-dark-border shadow-sm z-10" variants={sidebarVariants} animate={collapsed ? "collapsed" : "expanded"} transition={{ duration: 0.3, ease: "easeInOut" }}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-everforest-light-border dark:border-everforest-dark-border flex items-center justify-between">
          <motion.div className="flex items-center gap-2 overflow-hidden" animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
            <div className="w-8 h-8 rounded-full bg-everforest-light-accent-cyan dark:bg-everforest-dark-accent-cyan flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            {!collapsed && <span className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">AnomalyNQA</span>}
          </motion.div>
          <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all hover:bg-everforest-light-bg dark:hover:bg-everforest-dark-bg text-left
                    ${item.active ? "text-everforest-light-accent-cyan dark:text-everforest-dark-accent-cyan border-r-4 border-everforest-light-accent-cyan dark:border-everforest-dark-accent-cyan bg-everforest-light-accent-cyan/10 dark:bg-everforest-dark-accent-cyan/10" : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"}`}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <motion.span className={`whitespace-nowrap ${collapsed ? "opacity-0" : "opacity-100"}`} animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
                    {item.label}
                  </motion.span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-everforest-light-border dark:border-everforest-dark-border">
          <motion.div className="text-xs text-gray-500 dark:text-gray-400" animate={{ opacity: collapsed ? 0 : 1 }} transition={{ duration: 0.2 }}>
            {!collapsed && <p>AnomalyNQA V1.0</p>}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
