"use client";

import { useTaskContext } from "@/context/TaskContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { tasks } = useTaskContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category Breakdown
  const categories = ["Personal", "Work", "Urgent", "Health"];
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: tasks.filter(t => t.category === cat).length,
    color: cat === "Personal" ? "bg-neon-purple" : cat === "Work" ? "bg-neon-blue" : cat === "Urgent" ? "bg-orange-500" : "bg-green-500"
  }));

  // Priority Breakdown
  const priorities = ["High", "Medium", "Low"];
  const priorityCounts = priorities.map(pri => ({
    name: pri,
    count: tasks.filter(t => t.priority === pri).length,
    color: pri === "High" ? "bg-red-500" : pri === "Medium" ? "bg-amber-500" : "bg-neon-cyan"
  }));

  const maxPriorityCount = Math.max(...priorityCounts.map(p => p.count), 1);

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-8 px-4 space-y-10">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Visualize your productivity and track your growth.
        </p>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/40 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">Total Created</span>
            <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center">
              <BarChart3 size={16} className="text-neon-blue" />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white tabular-nums drop-shadow-sm">{totalTasks}</h3>
            <p className="text-xs text-gray-400 mt-2 font-medium">Tasks in your system</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/40 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">Completed</span>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-black text-gray-900 dark:text-white tabular-nums drop-shadow-sm">{completedTasks}</h3>
            <p className="text-xs text-gray-400 mt-2 font-medium">Tasks officially done</p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/40 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 z-10 relative">
            <span className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">Success Rate</span>
            <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-neon-purple" />
            </div>
          </div>
          <div className="z-10 relative">
            <h3 className="text-5xl font-black text-gray-900 dark:text-white tabular-nums drop-shadow-sm">{completionRate}%</h3>
            <p className="text-xs text-gray-400 mt-2 font-medium">Overall completion rate</p>
          </div>
          {/* Background subtle progress wave */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-neon-purple/10 to-transparent pointer-events-none" />
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${completionRate}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 left-0 right-0 bg-neon-purple/5 pointer-events-none"
          />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Breakdown (Progress Bars) */}
        <GlassCard className="p-8 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/40">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="text-gray-400" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Category Distribution</h2>
          </div>
          
          <div className="space-y-6">
            {categoryCounts.map((cat, i) => {
              const percent = totalTasks > 0 ? (cat.count / totalTasks) * 100 : 0;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    <span className="text-gray-500 tabular-nums">{cat.count} ({Math.round(percent)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-black/40 rounded-full h-3 overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className={`h-full rounded-full ${cat.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Priority Heatmap (Line/Area Graph) */}
        <GlassCard className="p-8 border-white/20 dark:border-white/10 bg-white/40 dark:bg-[#1a1a2e]/40 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-gray-400" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Priority Workload</h2>
          </div>

          <div className="flex-1 w-full h-48 relative mt-auto border-b border-gray-200 dark:border-gray-800 flex flex-col justify-end">
            {/* SVG Graph */}
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 150">
              {/* Grid Lines */}
              <line x1="0" y1="25" x2="300" y2="25" className="stroke-gray-200 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="300" y2="75" className="stroke-gray-200 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="125" x2="300" y2="125" className="stroke-gray-200 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />

              {/* Area & Line */}
              {(() => {
                const max = maxPriorityCount === 0 ? 1 : maxPriorityCount; // prevent division by zero
                const points = priorityCounts.map((pri, i) => {
                  const x = 50 + (i * 100);
                  const y = 140 - (pri.count / max) * 110; // y goes from 140 to 30
                  return { x, y };
                });

                // Smooth path string
                const linePath = `M ${points[0].x} ${points[0].y} Q 100 ${points[0].y}, ${points[1].x} ${points[1].y} T ${points[2].x} ${points[2].y}`;
                const areaPath = `${linePath} L ${points[2].x} 150 L ${points[0].x} 150 Z`;

                return (
                  <>
                    {/* Area gradient definition */}
                    <defs>
                      <linearGradient id="priorityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area */}
                    <motion.path 
                      d={areaPath}
                      fill="url(#priorityGradient)"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />

                    {/* Glowing Line */}
                    <motion.path 
                      d={linePath}
                      fill="transparent"
                      stroke="#8b5cf6"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]"
                    />

                    {/* Data Points */}
                    {points.map((p, i) => (
                      <motion.g 
                        key={i} 
                        initial={{ opacity: 0, scale: 0 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                      >
                        <circle cx={p.x} cy={p.y} r="6" className="fill-white dark:fill-black stroke-neon-purple" strokeWidth="3" />
                        <text x={p.x} y={p.y - 15} textAnchor="middle" className="text-[10px] fill-gray-500 font-bold tabular-nums">
                          {priorityCounts[i].count}
                        </text>
                      </motion.g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Labels under the graph */}
            <div className="absolute -bottom-8 left-0 right-0 flex justify-around">
              {priorityCounts.map((pri) => (
                <span key={pri.name} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[100px] text-center">
                  {pri.name}
                </span>
              ))}
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
