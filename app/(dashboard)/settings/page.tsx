"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Moon, Sun, Bell, Volume2, ShieldAlert, Trash2, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTaskContext } from "@/context/TaskContext";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { emptyTrash, clearActivityLog, clearNotifications } = useTaskContext();
  
  // App Preferences State (Mocked with LocalStorage)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    const savedSound = localStorage.getItem("taskify_sound");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    
    const savedNotifs = localStorage.getItem("taskify_notifications_pref");
    if (savedNotifs !== null) setNotificationsEnabled(savedNotifs === "true");
  }, []);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("taskify_sound", String(newState));
  };

  const handleToggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("taskify_notifications_pref", String(newState));
    if (newState && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  const handleClearAllData = () => {
    if (confirm("Are you absolutely sure? This will wipe all your local tasks, history, and trash. This cannot be undone!")) {
      localStorage.removeItem("taskify_tasks");
      localStorage.removeItem("taskify_deleted_tasks");
      localStorage.removeItem("taskify_activity_log");
      localStorage.removeItem("taskify_notifications");
      emptyTrash();
      clearActivityLog();
      clearNotifications();
      // Reload to clear state
      window.location.reload();
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-8 px-4 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
          <SettingsIcon className="text-neon-cyan" size={40} />
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Manage your app preferences, theme, and data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Appearance Settings */}
        <GlassCard className="p-6 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            {theme === "dark" ? <Moon className="text-neon-purple" size={24} /> : <Sun className="text-orange-500" size={24} />}
            Appearance
          </h2>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode interface</p>
            </div>
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${theme === "dark" ? "bg-neon-cyan" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </GlassCard>

        {/* Preferences */}
        <GlassCard className="p-6 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Volume2 className="text-neon-cyan" size={24} />
            Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Sound Effects</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Play beep alarm for Focus Mode</p>
              </div>
              <button 
                onClick={handleToggleSound}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${soundEnabled ? "bg-neon-cyan" : "bg-gray-300 dark:bg-gray-700"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${soundEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Desktop Notifications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Show native browser popups</p>
              </div>
              <button 
                onClick={handleToggleNotifications}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notificationsEnabled ? "bg-neon-cyan" : "bg-gray-300 dark:bg-gray-700"}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notificationsEnabled ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Data Management */}
        <GlassCard className="p-6 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40 md:col-span-2 mt-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="text-gray-500 dark:text-gray-400" size={24} />
            Data Management
          </h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Clear All App Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will permanently delete all your tasks, activity history, and settings from this browser.</p>
            </div>
            <button 
              onClick={handleClearAllData}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm flex-shrink-0"
            >
              <Trash2 size={18} />
              Wipe Data
            </button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
