"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { account, appwriteConfig } from "@/lib/appwrite/client";
import { motion } from "framer-motion";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.getSession('current');
        if (session) {
          // Set the cookie manually for Next.js middleware to pick up
          document.cookie = `a_session_${appwriteConfig.projectId}=${session.$id}; path=/; max-age=2592000; SameSite=Strict`;
          router.push('/dashboard');
        } else {
          setError("Session not found. Please try logging in again.");
        }
      } catch (err: any) {
        console.error("OAuth Check Error:", err);
        setError("Login failed. If you already registered with this email manually, please use your password to login.");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mb-4"
          />
          <p className="text-white font-medium">Completing login...</p>
        </div>
      )}
    </div>
  );
}
