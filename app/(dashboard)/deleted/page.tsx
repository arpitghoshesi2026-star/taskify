"use client";

import { useTaskContext } from "@/context/TaskContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, ShieldAlert, ShieldX, Clock } from "lucide-react";

export default function DeletedTasksPage() {
  const { deletedTasks, restoreTask, permanentlyDeleteTask, emptyTrash } = useTaskContext();

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-8 px-4 space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
            <Trash2 className="text-red-500" size={40} />
            Trash Bin
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Restore deleted tasks or permanently remove them.
          </p>
        </div>
        {deletedTasks.length > 0 && (
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to empty the trash? All deleted tasks will be permanently removed.")) {
                emptyTrash();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-600/20 text-red-500 hover:bg-red-600/40 border border-red-500/20 transition-colors font-bold text-sm flex items-center gap-2 shadow-lg"
          >
            <ShieldX size={18} />
            Empty Trash
          </button>
        )}
      </div>

      {/* Warning Banner */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-start gap-4">
        <ShieldAlert className="text-orange-500 flex-shrink-0 mt-0.5" size={24} />
        <div>
          <h3 className="text-orange-500 font-bold">Deleted Tasks Warning</h3>
          <p className="text-orange-400/80 text-sm mt-1">Tasks in the trash bin can be restored at any time. However, if you click "Empty Trash" or "Permanently Delete", they cannot be recovered.</p>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {deletedTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <Trash2 size={64} className="text-gray-600 mx-auto mb-6 opacity-30" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trash is empty</h3>
              <p className="text-gray-500">No deleted tasks to show.</p>
            </motion.div>
          ) : (
            deletedTasks.map((task) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={task.id}
              >
                <GlassCard className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-gray-200 dark:border-white/5 bg-gray-50/80 dark:bg-black/40 hover:bg-gray-100 dark:hover:bg-black/60 transition-colors">
                  <div className="opacity-60 grayscale-[0.3]">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-through decoration-red-500/50">{task.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {task.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {task.priority} Priority
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center text-xs text-gray-600 dark:text-gray-400 font-medium">
                          <Clock size={12} className="mr-1" />
                          {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button
                      onClick={() => restoreTask(task.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/40 border border-neon-purple/30 transition-colors font-medium text-sm"
                    >
                      <RefreshCw size={16} />
                      Restore
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Permanently delete this task? This action cannot be undone.")) {
                          permanentlyDeleteTask(task.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/30 border border-red-500/20 transition-colors"
                      title="Permanently Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
