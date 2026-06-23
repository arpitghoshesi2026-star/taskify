"use client";

import { Search, Bell, Moon, Sun, Sparkles, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { account } from "@/lib/appwrite/client";

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = useState("U");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    account.get().then((u) => setUserName(u.name.charAt(0).toUpperCase())).catch(() => {});
  }, []);

  return (
    <header className="h-20 w-full border-b border-gray-200 dark:border-glass-border bg-white/50 dark:bg-glass-dark/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 md:px-10 sticky top-0 z-30">
      
      {/* Mobile Hamburger Menu */}
      <button 
        className="md:hidden mr-4 p-2.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        onClick={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))}
      >
        <Menu size={24} />
      </button>

      {/* Search Bar (Click to open Spotlight) */}
      <div className="flex-1 max-w-xl hidden md:block" onClick={() => document.dispatchEvent(new CustomEvent('open-search'))}>
        <div className="relative group cursor-pointer">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neon-cyan transition-colors">
            <Search size={18} />
          </div>
          <div className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-glass-border rounded-full bg-black/5 dark:bg-black/40 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-inner">
            Search tasks, projects, or notes... (Press ⌘K)
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-4 ml-auto">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button 
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-notifications'))}
          className="relative p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-neon-purple ring-2 ring-background"></span>
        </button>

        <Link href="/profile">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan p-0.5 cursor-pointer hover:scale-105 transition-transform shadow-sm">
            <div className="w-full h-full rounded-full bg-white dark:bg-glass-dark flex items-center justify-center overflow-hidden">
              <span className="text-sm font-bold text-gray-800 dark:text-white">{userName}</span>
            </div>
          </div>
        </Link>

        {/* Mobile Search Icon */}
        <button 
          onClick={() => document.dispatchEvent(new CustomEvent('open-search'))}
          className="md:hidden p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </header>
  );
}
