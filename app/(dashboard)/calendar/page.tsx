"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parseISO
} from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  CheckCircle2, 
  Circle,
  Flag,
  Tag,
  Clock,
  Trash2
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTaskContext, Priority, Category } from "@/context/TaskContext";

export default function CalendarPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Quick Add Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("Medium");
  const [newTaskCategory, setNewTaskCategory] = useState<Category>("Personal");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    setShowQuickAdd(false);
  };

  const handleQuickAdd = () => {
    if (!selectedDate || !newTaskTitle.trim()) return;

    // We store due date in YYYY-MM-DD format based on local time
    // format(date, 'yyyy-MM-dd') is safe from timezone shifting.
    addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: format(selectedDate, 'yyyy-MM-dd'),
    });

    setNewTaskTitle("");
    setShowQuickAdd(false);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(t => t.dueDate === format(date, 'yyyy-MM-dd'));
  };

  const priorityColors = {
    High: "bg-red-500",
    Medium: "bg-amber-500",
    Low: "bg-neon-cyan"
  };

  const calendarPillColors = {
    High: "bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30",
    Medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30",
    Low: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30"
  };

  const categoryColors = {
    Personal: "text-neon-purple border-neon-purple/20 bg-neon-purple/10",
    Work: "text-neon-blue border-neon-blue/20 bg-neon-blue/10",
    Urgent: "text-orange-500 border-orange-500/20 bg-orange-500/10",
    Health: "text-green-500 border-green-500/20 bg-green-500/10"
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Calendar</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Schedule and track your upcoming tasks.</p>
      </div>
      <div className="flex items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 dark:border-white/5">
        <button 
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <span className="text-lg font-bold min-w-[140px] text-center text-gray-900 dark:text-white">
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button 
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(new Date());

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-semibold text-sm text-gray-400 dark:text-gray-500 pb-4">
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/5">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const dayTasks = getTasksForDate(cloneDay);
        
        // Render pills for max 3 tasks
        const taskPills = dayTasks.slice(0, 3).map((task, idx) => (
          <div 
            key={idx} 
            className={`w-full px-1.5 py-0.5 rounded text-[10px] font-semibold truncate transition-all ${calendarPillColors[task.priority]} ${task.completed ? 'opacity-40 line-through' : ''}`} 
          >
            {task.title}
          </div>
        ));
        const extraTasks = dayTasks.length > 3 ? dayTasks.length - 3 : 0;

        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
            className={`
              min-h-[120px] p-2 border-b border-r border-gray-200 dark:border-white/5 cursor-pointer transition-all relative group flex flex-col
              ${!isSameMonth(day, monthStart) ? "text-gray-300 dark:text-gray-600 bg-black/5 dark:bg-black/20" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}
              ${isSameDay(day, new Date()) ? "bg-neon-purple/5 dark:bg-neon-purple/10" : ""}
            `}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`
                inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium transition-all
                ${isSameDay(day, new Date()) ? "bg-neon-purple text-white shadow-lg shadow-neon-purple/30" : ""}
                ${isSelected && !isSameDay(day, new Date()) ? "bg-gray-800 dark:bg-white text-white dark:text-black" : ""}
              `}>
                {formattedDate}
              </span>
            </div>

            {/* Task Pills */}
            <div className="flex flex-col gap-1 mt-1 flex-1">
              {taskPills}
              {extraTasks > 0 && (
                <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium px-1 mt-0.5">
                  +{extraTasks} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border-l border-t border-gray-200 dark:border-white/5 mt-4 rounded-xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-xl">{rows}</div>;
  };

  const renderSidePanel = () => {
    if (!selectedDate) return null;
    
    const dayTasks = getTasksForDate(selectedDate);
    const isToday = isSameDay(selectedDate, new Date());

    return (
      <>
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedDate(null)}
          className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm z-40"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] bg-white/90 dark:bg-[#0f0f1a]/90 backdrop-blur-2xl border-l border-white/20 shadow-2xl z-50 flex flex-col"
        >
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isToday ? "Today" : format(selectedDate, "EEEE")}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {format(selectedDate, "MMMM d, yyyy")}
              </p>
            </div>
            <button 
              onClick={() => setSelectedDate(null)}
              className="p-2 bg-black/5 dark:bg-white/10 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors text-gray-600 dark:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Panel Content (Tasks) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth no-scrollbar">
            {dayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks scheduled</p>
                <p className="text-sm text-gray-400 mt-1">Enjoy your free time!</p>
              </div>
            ) : (
              <AnimatePresence>
                {dayTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-4 rounded-2xl border transition-all ${task.completed ? 'bg-black/5 dark:bg-white/5 border-transparent grayscale-[0.5] opacity-60' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm'}`}
                  >
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 text-gray-400 hover:text-neon-cyan transition-colors"
                      >
                        {task.completed ? <CheckCircle2 size={20} className="text-neon-cyan" /> : <Circle size={20} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-[15px] mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${categoryColors[task.category]}`}>
                            {task.category}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                            <Flag size={10} className={priorityColors[task.priority].replace('bg-', 'text-')} />
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Quick Add Form / Button */}
          <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
            <AnimatePresence mode="wait">
              {!showQuickAdd ? (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowQuickAdd(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium hover:border-neon-purple hover:text-neon-purple dark:hover:border-neon-cyan dark:hover:text-neon-cyan transition-colors"
                >
                  <Plus size={18} />
                  <span>Schedule Task</span>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-4"
                >
                  <input 
                    type="text"
                    placeholder="Task title..."
                    autoFocus
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(); }}
                    className="w-full bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-neon-purple/50"
                  />
                  <div className="flex gap-2">
                    <select 
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                      className="flex-1 appearance-none bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 cursor-pointer"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <select 
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as Category)}
                      className="flex-1 appearance-none bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 cursor-pointer"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Urgent">Urgent</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowQuickAdd(false)}
                      className="flex-1 py-2.5 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleQuickAdd}
                      disabled={!newTaskTitle.trim()}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-blue text-white font-medium text-sm hover:shadow-lg hover:shadow-neon-purple/20 transition-all disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-4">
      <GlassCard className="p-6 md:p-10 shadow-2xl bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 backdrop-blur-2xl">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </GlassCard>

      <AnimatePresence>
        {renderSidePanel()}
      </AnimatePresence>
    </div>
  );
}
