"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, CheckSquare, Calendar, 
  BarChart2, Bell, Clock, Settings, 
  HelpCircle, Menu, X, Focus, LogOut, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { account, appwriteConfig } from "@/lib/appwrite/client";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Tasks", icon: CheckSquare, href: "/tasks" },
  { name: "Calendar", icon: Calendar, href: "/calendar" },
  { name: "Focus Mode", icon: Focus, href: "/focus", color: "text-neon-cyan" },
  { name: "Analytics", icon: BarChart2, href: "/analytics" },
];

const secondaryItems = [
  { name: "History", icon: Clock, href: "/activity" },
  { name: "Recently Deleted", icon: Trash2, href: "/deleted" },
];

const bottomItems = [
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    document.addEventListener('toggle-sidebar', handleToggle);
    return () => document.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      document.cookie = `a_session_${appwriteConfig.projectId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      router.push('/');
    }
  };

  const NavItem = ({ item }: { item: { name: string, icon: React.ElementType, href: string, color?: string } }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link href={item.href} className="block w-full" onClick={() => setIsOpen(false)}>
        <div className={cn(
          "flex items-center px-4 py-3 mb-1 rounded-xl transition-all duration-300 group relative",
          isActive ? "bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
        )}>
          {isActive && (
            <motion.div 
              layoutId="sidebar-active"
              className="absolute left-0 w-1 h-8 bg-neon-cyan rounded-r-full"
            />
          )}
          <Icon size={20} className={cn("mr-3 transition-colors", item.color, isActive && "text-neon-cyan")} />
          <span className="font-medium">{item.name}</span>
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : 0 }}
        className={cn(
          "fixed md:relative z-40 w-64 h-full bg-white/50 dark:bg-glass-dark border-r border-gray-200 dark:border-glass-border backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center group" onClick={() => setIsOpen(false)}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-glow transition-transform group-hover:scale-105 overflow-hidden bg-black/20">
              <img src="/logo.png" alt="Taskify Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Taskify</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-6">
          <div>
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
            {menuItems.map((item) => <NavItem key={item.name} item={item} />)}
          </div>
          
          <div>
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Updates</p>
            {secondaryItems.map((item) => <NavItem key={item.name} item={item} />)}
          </div>
        </div>

        <div className="p-4 mt-auto">
          {bottomItems.map((item) => <NavItem key={item.name} item={item} />)}
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 mb-1 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
          >
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Log Out</span>
          </button>

        </div>
      </motion.aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
