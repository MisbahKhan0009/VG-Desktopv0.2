import React, { useEffect, useState } from "react";
import { getStore, KEYS, DEFAULT_SETTINGS, SettingsData } from '../utils/store';
import { useAuth } from '../context/AuthContext';
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { User, Bell, Shield, Database, Monitor, Key, Save, RotateCcw } from "lucide-react";

interface SettingsPageProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  currentPage: "home" | "single" | "results" | "settings";
  onPageChange: (page: "home" | "single" | "results" | "settings") => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isSidebarCollapsed, toggleSidebar, currentPage, onPageChange }) => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      analysisComplete: true,
      anomalyDetected: true,
      systemUpdates: false,
    },
    privacy: {
      dataRetention: "30",
      anonymizeData: true,
      shareAnalytics: false,
      cookiesEnabled: true,
    },
    processing: {
      maxConcurrentAnalyses: "3",
      autoProcessing: false,
      qualityPreset: "high",
      compressionEnabled: true,
    },
    display: {
      theme: "auto",
      language: "en",
      timezone: "UTC",
      dateFormat: "MM/DD/YYYY",
    },
  });

  // load settings for current user
  useEffect(() => {
    (async () => {
      const store = await getStore();
      const key = user ? KEYS.settingsFor(user.id) : 'settings_guest';
      const stored = (await store.get(key)) as SettingsData | null;
      if (stored) setSettings(stored);
      else setSettings(DEFAULT_SETTINGS);
    })();
  }, [user]);

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

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "processing", label: "Processing", icon: Database },
    { id: "display", label: "Display", icon: Monitor },
  ];

  const handleSettingChange = (category: string, setting: string, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="retro-card p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">User Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              defaultValue={user?.name || ''}
              onBlur={async (e) => { if (e.target.value && e.target.value !== user?.name) await updateProfile({ name: e.target.value }); }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              defaultValue={user?.email || ''}
              onBlur={async (e) => { if (e.target.value && e.target.value !== user?.email) await updateProfile({ email: e.target.value }); }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization</label>
            <input type="text" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" defaultValue="Acme Corporation" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              <option>Administrator</option>
              <option>Analyst</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>
      </div>

      <div className="retro-card p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Account Security</h3>
        <div className="space-y-4">
          <motion.button className="flex items-center gap-3 p-3 w-full text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Key className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">Change Password</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
            </div>
          </motion.button>
          <motion.button className="flex items-center gap-3 p-3 w-full text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enable 2FA for enhanced security</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="retro-card p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{getNotificationDescription(key)}</p>
            </div>
            <motion.button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`} onClick={() => handleSettingChange("notifications", key, !value)} whileTap={{ scale: 0.95 }}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );

  const getNotificationDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      emailNotifications: "Receive notifications via email",
      pushNotifications: "Receive browser push notifications",
      analysisComplete: "Notify when video analysis is complete",
      anomalyDetected: "Alert when anomalies are detected",
      systemUpdates: "Receive system update notifications",
    };
    return descriptions[key] || "";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return (
          <div className="retro-card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Privacy & Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Retention Period (days)</label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" value={settings.privacy.dataRetention} onChange={(e) => handleSettingChange("privacy", "dataRetention", e.target.value)}>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
              {Object.entries(settings.privacy)
                .filter(([key]) => key !== "dataRetention")
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</p>
                    </div>
                    <motion.button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`} onClick={() => handleSettingChange("privacy", key, !value)} whileTap={{ scale: 0.95 }}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
                    </motion.button>
                  </div>
                ))}
            </div>
          </div>
        );
      case "processing":
        return (
          <div className="retro-card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Processing Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Concurrent Analyses</label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" value={settings.processing.maxConcurrentAnalyses} onChange={(e) => handleSettingChange("processing", "maxConcurrentAnalyses", e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality Preset</label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" value={settings.processing.qualityPreset} onChange={(e) => handleSettingChange("processing", "qualityPreset", e.target.value)}>
                  <option value="low">Low (Faster)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Better Quality)</option>
                  <option value="ultra">Ultra (Best Quality)</option>
                </select>
              </div>
            </div>
          </div>
        );
      case "display":
        return (
          <div className="retro-card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" value={settings.display.theme} onChange={(e) => handleSettingChange("display", "theme", e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100" value={settings.display.language} onChange={(e) => handleSettingChange("display", "language", e.target.value)}>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-everforest-light-bg dark:bg-everforest-dark-bg">
      <Sidebar collapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} currentPage={currentPage} onPageChange={onPageChange} />

      <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="flex justify-between items-center mb-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-display text-gray-800 dark:text-gray-100">Settings</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your preferences and system configuration</p>
          </motion.div>
          <ThemeToggle />
        </div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" animate="visible">
          {/* Settings Navigation */}
          <motion.div className="lg:col-span-1" variants={cardVariants}>
            <div className="retro-card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div className="lg:col-span-3" variants={cardVariants}>
            {renderTabContent()}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
                <motion.button onClick={async () => { const store = await getStore(); const key = user ? KEYS.settingsFor(user.id) : 'settings_guest'; await store.set(key, settings); await store.save(); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Save className="w-4 h-4" />
                Save Changes
              </motion.button>
                <motion.button onClick={() => setSettings(DEFAULT_SETTINGS)} className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;
