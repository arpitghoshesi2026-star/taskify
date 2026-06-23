"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useTaskContext } from "@/context/TaskContext";
import { account } from "@/lib/appwrite/client";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Hello");
  const [subGreeting, setSubGreeting] = useState("Let's get things done.");
  const [greetingEmoji, setGreetingEmoji] = useState("👋");
  const [userName, setUserName] = useState("User");

  const emojis = ["👋", "✨", "🚀", "🔥", "💪", "🌟", "🎉"];

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    }));

    // Pick a random emoji
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setGreetingEmoji(randomEmoji);

    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good Morning");
      setSubGreeting("Ready to conquer the day? Let's get started.");
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting("Good Afternoon");
      setSubGreeting("Keep the momentum going. You're doing great!");
    } else if (currentHour >= 17 && currentHour < 22) {
      setGreeting("Good Evening");
      setSubGreeting("Time to wind down and reflect on your achievements.");
    } else {
      setGreeting("Good Night");
      setSubGreeting("Rest up. Tomorrow is a new day of opportunities.");
    }
    // Fetch actual user name
    account.get()
      .then((u) => {
        if (u.name) {
          setUserName(u.name.split(' ')[0]); // Get first name
        } else if (u.email) {
          setUserName(u.email.split('@')[0]); // Fallback to email prefix
        } else {
          setUserName("User");
        }
      })
      .catch(() => setUserName("User"));
  }, []);

  // For 3D Background Scroll Animation
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const rotateValue = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const yPos = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Global Tasks
  const { tasks } = useTaskContext();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  // Calculate overdue (naive check for demonstration)
  const overdueTasks = tasks.filter(t => {
    if (t.completed || !t.dueDate) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(t.dueDate);
    return dueDate < today;
  }).length;

  return (
    <div ref={containerRef} className="space-y-8 pb-10 relative overflow-visible">
      

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group w-full max-w-3xl"
        >
          <div className="inline-flex items-center justify-center space-x-2 text-neon-cyan mb-6 px-4 py-1.5 rounded-full bg-black/5 dark:bg-black/30 border border-black/5 dark:border-white/5">
            <CalendarIcon size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">{currentDate}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tighter leading-tight drop-shadow-sm dark:drop-shadow-lg">
            {greeting}, <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-neon-purple dark:to-neon-cyan">
              {userName}
            </span> {greetingEmoji}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 md:mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm dark:drop-shadow-md px-4">
            {subGreeting}
          </p>
        </motion.div>
      </section>

      {/* Stats Grid (Staircase Layout) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-32 items-start px-4">
        <StatCard 
          title="Total Tasks" 
          value={totalTasks.toString()} 
          trend="" 
          icon={TrendingUp} 
          delay={0.1}
          colorClass="text-neon-blue"
          className="lg:mt-0"
        />
        <StatCard 
          title="Completed" 
          value={completedTasks.toString()} 
          trend="" 
          icon={CheckCircle2} 
          delay={0.2}
          colorClass="text-neon-cyan"
          className="lg:mt-12"
        />
        <StatCard 
          title="Pending" 
          value={pendingTasks.toString()} 
          trend="" 
          isPositive={false}
          icon={Clock} 
          delay={0.3}
          colorClass="text-neon-purple"
          className="lg:mt-24"
        />
        <StatCard 
          title="Overdue" 
          value={overdueTasks.toString()} 
          trend="" 
          icon={AlertCircle} 
          delay={0.4}
          colorClass="text-red-400"
          className="lg:mt-36"
        />
      </section>

      {/* Main Content Split */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Today's Timeline */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today&apos;s Timeline</h2>
              <Link href="/tasks" className="text-sm text-neon-cyan hover:text-white transition-colors">View All</Link>
            </div>
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
              <Clock size={40} className="text-gray-500 mb-4" />
              <p className="text-gray-400 font-medium">No tasks scheduled for today.</p>
              <p className="text-sm text-gray-500 mt-1">Enjoy your free time or add a new task!</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              <Link href="/tasks" className="text-sm text-neon-cyan hover:text-white transition-colors">View All</Link>
            </div>
            
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center">
              <CalendarIcon size={40} className="text-gray-500 mb-4" />
              <p className="text-gray-400 font-medium">No upcoming deadlines.</p>
              <p className="text-sm text-gray-500 mt-1">You&apos;re all caught up!</p>
            </GlassCard>
          </motion.div>
        </div>

      </section>
    </div>
  );
}
