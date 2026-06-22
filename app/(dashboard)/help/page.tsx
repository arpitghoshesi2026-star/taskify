"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard glow className="p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-glow flex items-center justify-center mb-6 shadow-glow">
            <span className="text-3xl">🚧</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Coming Soon</h1>
          <p className="text-gray-400">
            This section is currently under construction. Check back later!
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
