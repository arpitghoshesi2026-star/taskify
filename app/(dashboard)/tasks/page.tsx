"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar as CalendarIcon, 
  MoreVertical,
  Flag,
  Tag,
  Trash2,
  ChevronDown
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTaskContext, Priority, Category } from "@/context/TaskContext";

export default function TasksPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskContext();
  
  const [filter, setFilter] = useState<"All" | "Active" | "Completed" | Priority>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("Medium");
  const [newTaskCategory, setNewTaskCategory] = useState<Category>("Personal");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: newTaskDueDate,
    });
    
    // Reset form
    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskPriority("Medium");
    setNewTaskCategory("Personal");
    setNewTaskDueDate("");
    setIsFormExpanded(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const allText = `${t.title} ${t.description || ''} ${t.category} ${t.priority}`.toLowerCase();
      if (!allText.includes(query)) return false;
    }
    
    switch (filter) {
      case "Active": return !t.completed;
      case "Completed": return t.completed;
      case "High": return t.priority === "High";
      case "Medium": return t.priority === "Medium";
      case "Low": return t.priority === "Low";
      default: return true;
    }
  });

  const priorityColors = {
    High: "text-red-500 bg-red-500/10 border-red-500/20",
    Medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    Low: "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20"
  };

  const categoryColors = {
    Personal: "text-neon-purple bg-neon-purple/10 border-neon-purple/20",
    Work: "text-neon-blue bg-neon-blue/10 border-neon-blue/20",
    Urgent: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Health: "text-green-500 bg-green-500/10 border-green-500/20"
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 pt-4">
      <GlassCard className="p-6 md:p-10 shadow-2xl bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 backdrop-blur-2xl">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Tasks</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage, organize, and conquer your goals.</p>
            </div>
          </div>

      {/* Add Task Form */}
      <GlassCard className="p-1 overflow-hidden transition-all duration-300 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/60">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center">
              <Plus size={14} className="text-neon-purple" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Add a new task</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <input 
                type="text"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onFocus={() => setIsFormExpanded(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask();
                }}
                className="flex-1 w-full bg-black/5 dark:bg-[#0f0f1a]/50 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 transition-all"
              />
              
              <button 
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                className="w-full md:w-auto flex-shrink-0 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                <span>Add Task</span>
              </button>
            </div>

            <AnimatePresence>
              {isFormExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-4 overflow-hidden"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <input 
                      type="text"
                      placeholder="Description (optional)"
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      className="flex-1 min-w-[200px] bg-black/5 dark:bg-[#0f0f1a]/50 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 transition-all"
                    />

                    {/* Priority Selector */}
                    <div className="relative">
                      <select 
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                        className="appearance-none bg-black/5 dark:bg-[#0f0f1a]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 cursor-pointer"
                      >
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                      </select>
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                        newTaskPriority === 'High' ? 'bg-red-500' : 
                        newTaskPriority === 'Medium' ? 'bg-amber-500' : 'bg-neon-cyan'
                      }`} />
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Category Selector */}
                    <div className="relative">
                      <select 
                        value={newTaskCategory}
                        onChange={(e) => setNewTaskCategory(e.target.value as Category)}
                        className="appearance-none bg-black/5 dark:bg-[#0f0f1a]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 cursor-pointer"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Work">Work</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Health">Health</option>
                      </select>
                      <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neon-purple pointer-events-none" />
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Date Picker */}
                    <div className="relative">
                      <input 
                        type="date"
                        value={newTaskDueDate}
                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                        className="bg-black/5 dark:bg-[#0f0f1a]/50 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </GlassCard>

      {/* Toolbar (Search & Filters) */}
      <div className="flex flex-col gap-4 sticky top-0 z-20 py-2">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Task Progress Indicator instead of Search */}
          <div className="flex-1 max-w-md bg-white/60 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-glass-border rounded-xl px-4 py-2 flex flex-col justify-center shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall Progress</span>
              <span className="text-xs font-bold text-neon-purple">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="h-full bg-neon-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="relative">
            <select className="appearance-none bg-white/60 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-glass-border rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 cursor-pointer shadow-sm">
              <option>Newest first</option>
              <option>Oldest first</option>
              <option>Highest Priority</option>
              <option>Due Date</option>
            </select>
            <CalendarIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-blue pointer-events-none" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Active", "Completed", "High", "Medium", "Low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filter === f 
                  ? "bg-neon-purple text-white shadow-md shadow-neon-purple/20 border border-neon-purple" 
                  : "bg-white/40 dark:bg-black/40 backdrop-blur-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5 hover:bg-white/60 dark:hover:bg-black/60 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {f === 'All' && <span className="text-[10px]">🗂️</span>}
              {f === 'Active' && <Circle size={12} />}
              {f === 'Completed' && <CheckCircle2 size={12} />}
              {f === 'High' && <span className="text-[10px]">↑</span>}
              {f === 'Medium' && <span className="text-[10px]">=</span>}
              {f === 'Low' && <span className="text-[10px]">↓</span>}
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 mt-6">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-white/50 dark:bg-black/30 border border-gray-200 dark:border-white/5 flex items-center justify-center mb-6 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-neon-purple/20 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tasks yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                {searchQuery 
                  ? "We couldn't find any tasks matching your search." 
                  : "Add your first task above to get started!"}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                key={task.id}
              >
                <GlassCard className={`p-4 group transition-all duration-300 border-white/20 dark:border-white/5 bg-white/40 dark:bg-[#1a1a2e]/40 ${task.completed ? 'opacity-60 grayscale-[0.5]' : 'hover:border-neon-purple/50 dark:hover:border-neon-purple/30'}`}>
                  <div className="flex items-start gap-4">
                    
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 flex-shrink-0 text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={22} className="text-neon-cyan" />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
                        <h4 className={`text-lg font-semibold truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        
                        {/* Badges */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${categoryColors[task.category]}`}>
                            {task.category}
                          </span>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 mt-2">
                          {task.description}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-gray-500 mt-3">
                        {task.dueDate && (
                          <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                            <CalendarIcon size={14} />
                            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          if (confirm("Move this task to the trash?")) {
                            deleteTask(task.id);
                          }
                        }}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete task"
                      >  <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

        </div>
      </GlassCard>
    </div>
  );
}
