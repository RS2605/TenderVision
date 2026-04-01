"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TenderAnalysis } from "@/components/dashboard/TenderAnalysis";
import { loginWithGoogle, logout, auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader2, LogOut } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Robust Firebase Auth Mount Listener
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase Config Missing. Paste your settings in lib/firebase.ts: ", e);
      setLoading(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      alert("Please ensure Firebase keys are configured correctly!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deepNavy">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 md:p-24 relative overflow-x-hidden">
      
      {/* Abstract Background Visuals */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Dynamic Authorization Header */}
      <div className="w-full max-w-6xl mx-auto flex justify-end mb-12 z-20 relative">
        {user ? (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <span className="text-white/70 italic text-sm border-r border-white/20 pr-4">Active Profile: {user.displayName || user.email}</span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        ) : (
          <Button onClick={handleLogin} variant="outline" className="text-gold border-gold hover:bg-gold hover:text-deepNavy shadow-lg animate-in fade-in">
            MSME Login (Google Auth)
          </Button>
        )}
      </div>

      {/* Hero Rendering Context (Unauthenticated vs Authenticated Flow) */}
      {!user ? (
        <div className="z-10 text-center space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-12">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">
            TenderVision MVP
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">
            Unlock government contracts for your MSME. Our Gemini 1.5 Flash algorithm analyzes 50+ page PDFs in seconds to verify eligibility and break down financial barriers.
          </p>
          <div className="pt-8">
            <Button size="lg" className="text-md font-bold uppercase tracking-wider px-12" onClick={handleLogin}>
              Authenticate to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full relative z-10 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex flex-col items-center mb-12 text-center w-full max-w-4xl mx-auto">
            <h1 className="text-4xl font-semibold text-white tracking-tight mb-2">Analysis Central</h1>
            <p className="text-white/60">Algorithm scanning loaded via Firebase Auth</p>
          </div>
          <TenderAnalysis uid={user.uid} />
        </div>
      )}

    </main>
  );
}
