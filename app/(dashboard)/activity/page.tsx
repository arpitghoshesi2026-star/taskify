"use client";

import { useTaskContext } from "@/context/TaskContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Plus, CheckCircle2, XCircle, Trash2, RefreshCw, AlertTriangle, ShieldX } from "lucide-react";

export default function ActivityPage() {
  const { activityLog, clearActivityLog } = useTaskContext();

  const getIconForAction = (action: string) => {
    switch (action) {
      case "Created": return <Plus size={16} className="text-neon-cyan" />;
      case "Completed": return <CheckCircle2 size={16} className="text-green-500" />;
      case "Uncompleted": return <XCircle size={16} className="text-orange-500" />;
      case "Deleted": return <Trash2 size={16} className="text-red-500" />;
      case "Restored": return <RefreshCw size={16} className="text-neon-purple" />;
      case "Permanently Deleted": return <ShieldX size={16} className="text-red-600" />;
      default: return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const getBgForAction = (action: string) => {
    switch (action) {
      case "Created": return "bg-neon-cyan/10 border-neon-cyan/20";
      case "Completed": return "bg-green-500/10 border-green-500/20";
      case "Uncompleted": return "bg-orange-500/10 border-orange-500/20";
      case "Deleted": return "bg-red-500/10 border-red-500/20";
      case "Restored": return "bg-neon-purple/10 border-neon-purple/20";
      case "Permanently Deleted": return "bg-red-600/10 border-red-600/20";
      default: return "bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-8 px-4 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
            <Clock className="text-neon-cyan" size={40} />
            Activity Log
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Track everything that happens in your workspace.
          </p>
        </div>
        {activityLog.length > 0 && (
          <button 
            onClick={clearActivityLog}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Log
          </button>
        )}
      </div>

      {/* Timeline */}
      <GlassCard className="p-8 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/40 relative">
        {activityLog.length === 0 ? (
          <div className="text-center py-20">
            <Clock size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
            <p className="text-gray-400">Your actions will appear here like a timeline.</p>
          </div>
        ) : (
          <div className="relative border-l border-gray-300 dark:border-gray-700 ml-4 space-y-8">
            <AnimatePresence>
              {activityLog.map((log, index) => {
                const date = new Date(log.timestamp);
                const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateString = date.toLocaleDateString();

                return (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-8"
                  >
                    {/* Timeline Node */}
                    <div className={`absolute -left-4 top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white dark:bg-black ${getBgForAction(log.action)} shadow-lg`}>
                      {getIconForAction(log.action)}
                    </div>

                    <div className="bg-gray-50/80 dark:bg-black/20 border border-gray-200 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{log.action} Task</span>
                        <span className="text-xs text-gray-500 font-medium tabular-nums">{timeString} • {dateString}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        You {log.action.toLowerCase()} <span className="text-neon-purple dark:text-neon-cyan font-medium">"{log.taskTitle}"</span>
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
