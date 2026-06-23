import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { DashboardBackground } from "@/components/layout/DashboardBackground";
import { TaskProvider } from "@/context/TaskContext";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { SpotlightSearch } from "@/components/layout/SpotlightSearch";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TaskProvider>
      <div className="flex h-screen text-foreground overflow-hidden relative z-0 bg-white dark:bg-black transition-colors duration-300">
        <DashboardBackground />
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0 z-10 relative h-screen">
          <TopNav />
          <main className="flex-1 overflow-y-auto scroll-smooth no-scrollbar p-4 sm:p-6 md:p-8 lg:p-10 relative">
            <div className="max-w-7xl mx-auto min-h-full">
              {children}
            </div>
          </main>
        </div>
        
        <NotificationPanel />
        <SpotlightSearch />
      </div>
    </TaskProvider>
  );
}
