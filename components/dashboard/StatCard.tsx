"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  delay?: number;
  colorClass?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  isPositive = true, 
  icon: Icon, 
  delay = 0,
  colorClass = "text-neon-purple",
  className
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      <GlassCard className="p-6 group hover:scale-[1.02] transition-transform duration-300">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-glass-border ${colorClass} group-hover:shadow-glow transition-all`}>
            <Icon size={24} />
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={isPositive ? "text-green-400" : "text-red-400"}>
              {trend}
            </span>
            <span className="text-gray-500 ml-2">vs last week</span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
