"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Settings, CheckSquare, X, Command } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTaskContext } from "@/context/TaskContext";

export function SpotlightSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("open-search", handleOpen);
    document.addEventListener("close-search", handleClose);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("open-search", handleOpen);
      document.removeEventListener("close-search", handleClose);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const { tasks } = useTaskContext();

  // Mock data for settings
  const searchableSettings = [
    { id: 's1', type: 'Setting', title: 'Profile Settings', icon: Settings, href: '/settings' },
    { id: 's2', type: 'Setting', title: 'Theme Appearance', icon: Settings, href: '/settings' },
    { id: 's3', type: 'Setting', title: 'Notifications Preferences', icon: Settings, href: '/settings' },
  ];

  // Dynamically map real tasks to the searchable format
  const searchableTasks = tasks.map(t => ({
    id: t.id,
    type: `Task • ${t.category} • ${t.priority}`,
    title: t.title,
    icon: CheckSquare,
    href: '/tasks'
  }));

  const searchableItems = [...searchableSettings, ...searchableTasks];

  const filteredItems = query.trim() === "" 
    ? [] 
    : searchableItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.type.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Spotlight Modal */}
          <div className="fixed inset-0 flex items-start justify-center pt-[15vh] z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-glass-dark border border-glass-border shadow-2xl rounded-2xl overflow-hidden backdrop-blur-2xl pointer-events-auto mx-4"
            >
              {/* Search Input Area */}
              <div className="flex items-center px-4 py-4 border-b border-glass-border bg-black/20">
                <Search size={24} className="text-neon-cyan mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 bg-transparent text-white text-xl placeholder-gray-500 focus:outline-none"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-500 hover:text-white transition-colors bg-white/5 border border-glass-border"
                >
                  <span className="text-xs font-medium px-1 flex items-center"><Command size={10} className="mr-0.5" /> ESC</span>
                </button>
              </div>

              {/* Results Area */}
              {query.trim() !== "" && (
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
                  {filteredItems.length > 0 ? (
                    <div className="px-2">
                      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Results</h3>
                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.href)}
                          className="w-full flex items-center px-3 py-3 rounded-xl hover:bg-white/10 transition-colors group text-left"
                        >
                          <div className="p-2 rounded-lg bg-black/40 text-gray-400 group-hover:text-neon-purple transition-colors mr-3">
                            <item.icon size={18} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-14 text-center">
                      <Search size={40} className="text-gray-600 mx-auto mb-4" />
                      <p className="text-white font-medium text-lg">No results found</p>
                      <p className="text-gray-500 text-sm mt-1">Try searching for settings or tasks</p>
                    </div>
                  )}
                </div>
              )}

              {/* Default State (Empty Query) */}
              {query.trim() === "" && (
                <div className="py-8 px-6 bg-black/10">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Suggestions</h3>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setQuery("Profile")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-glass-border text-sm text-gray-400 hover:text-white transition-colors">Profile Settings</button>
                    <button onClick={() => setQuery("Theme")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-glass-border text-sm text-gray-400 hover:text-white transition-colors">Theme Options</button>
                    <button onClick={() => setQuery("Notifications")} className="px-3 py-1.5 rounded-lg bg-white/5 border border-glass-border text-sm text-gray-400 hover:text-white transition-colors">Notification Preferences</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
