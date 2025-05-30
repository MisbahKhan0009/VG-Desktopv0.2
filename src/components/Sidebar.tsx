import React from 'react';
import { motion } from 'framer-motion';
import { Home, Upload, BarChart2, Settings, Menu, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' },
  };

  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Upload, label: 'Upload', active: true },
    { icon: BarChart2, label: 'Results', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <motion.div
      className="fixed h-full bg-white border-r border-content/10 shadow-sm z-10"
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-content/10 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 overflow-hidden"
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <BarChart2 size={18} className="text-white" />
            </div>
            {!collapsed && (
              <span className="font-display font-bold text-lg">AnomalyDetect</span>
            )}
          </motion.div>
          <button
            onClick={toggleSidebar}
            className="text-content/70 hover:text-content transition-colors p-1 rounded-md hover:bg-background"
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center gap-3 px-4 py-3 transition-all hover:bg-background
                    ${item.active ? 'text-primary border-r-4 border-primary' : 'text-content/70'}`}
                >
                  <item.icon size={20} />
                  <motion.span
                    className={`whitespace-nowrap ${collapsed ? 'opacity-0' : 'opacity-100'}`}
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-content/10">
          <motion.div
            className="text-xs text-content/50"
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {!collapsed && <p>AnomalyDetect v1.0</p>}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;