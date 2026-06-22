"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    document.addEventListener("toggle-notifications", handleToggle);
    document.addEventListener("close-notifications", handleClose);

    return () => {
      document.removeEventListener("toggle-notifications", handleToggle);
      document.removeEventListener("close-notifications", handleClose);
    };
  }, []);

  const { notifications, clearNotifications } = useTaskContext();

  const getIconForType = (type: string) => {
    switch(type) {
      case "success": return <CheckCircle2 size={18} />;
      case "warning": return <AlertCircle size={18} />;
      case "error": return <AlertCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getColorForType = (type: string) => {
    switch(type) {
      case "success": return "text-green-500 bg-green-500/10";
      case "warning": return "text-orange-500 bg-orange-500/10";
      case "error": return "text-red-500 bg-red-500/10";
      default: return "text-neon-cyan bg-neon-cyan/10";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white/40 dark:bg-glass-dark border-l border-white/20 dark:border-glass-border backdrop-blur-2xl z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-glass-border">
              <div className="flex items-center space-x-2">
                <Bell size={20} className="text-neon-purple" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
              </div>
              <div className="flex items-center gap-3">
                {notifications.length > 0 && (
                  <button 
                    onClick={clearNotifications}
                    className="text-xs font-semibold text-neon-purple hover:text-neon-cyan transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notif) => {
                    const date = new Date(notif.timestamp);
                    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    
                    return (
                      <div key={notif.id} className="p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-white/40 dark:border-glass-border hover:border-white/60 dark:hover:border-glass-border/80 transition-colors flex items-start space-x-4 shadow-sm backdrop-blur-md">
                        <div className={`p-2 rounded-xl ${getColorForType(notif.type)} flex-shrink-0`}>
                          {getIconForType(notif.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-gray-900 dark:text-white text-sm font-bold">{notif.title}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 leading-relaxed">{notif.message}</p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2 font-medium">{timeString}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-4 opacity-50" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No new notifications</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">You're all caught up!</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
