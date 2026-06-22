"use client";

import { usePathname } from "next/navigation";
import { WebGLShader } from "@/components/ui/web-gl-shader";

export function DashboardBackground() {
  const pathname = usePathname();
  
  // Only show the 3D Shader on the main dashboard home page
  // The user explicitly requested to hide the rainbow background for /tasks, /calendar, /focus, /analytics, /activity, /deleted, /settings, and /profile
  const showShader = pathname !== "/tasks" && pathname !== "/calendar" && pathname !== "/focus" && pathname !== "/analytics" && pathname !== "/activity" && pathname !== "/deleted" && pathname !== "/settings" && pathname !== "/profile";

  return (
    <>
      {/* Solid base in case shader doesn't load immediately or is hidden */}
      <div className="absolute inset-0 bg-white dark:bg-black -z-20 pointer-events-none transition-colors duration-300" />
      
      {showShader && (
        <>
          {/* 3D Shader Animation Background */}
          <WebGLShader />
          
          {/* Subtle tint over the animation for readability in dark mode */}
          <div className="absolute inset-0 bg-transparent dark:bg-black/40 pointer-events-none z-0 transition-colors duration-300" />
        </>
      )}
    </>
  );
}
