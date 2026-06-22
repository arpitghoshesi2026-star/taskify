"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Mail, CalendarDays, Edit3, Shield, LogOut } from "lucide-react";
import { account, appwriteConfig } from "@/lib/appwrite/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 pt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        <GlassCard className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/40">
          
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan p-1 shadow-glow flex-shrink-0">
              <div className="w-full h-full rounded-full bg-white dark:bg-glass-dark flex items-center justify-center overflow-hidden border-4 border-white dark:border-glass-dark relative">
                {user?.name ? (
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={48} className="text-gray-400" />
                )}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-lg border-2 border-white dark:border-glass-dark group-hover:scale-110">
              <Edit3 size={16} />
            </button>
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-6 text-center md:text-left w-full">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                {user?.name || "Anonymous User"}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                <Shield size={14} className="text-neon-cyan" />
                <span>Verified Account</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <Mail size={18} />
                  <span className="font-medium text-sm">Email Address</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{user?.email || "No email provided"}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <CalendarDays size={18} />
                  <span className="font-medium text-sm">Joined Date</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently"}
                </span>
              </div>
            </div>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
}
