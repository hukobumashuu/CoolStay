"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-[#0A1A44] text-white flex items-center justify-between px-6 shadow-md fixed top-0 right-0 left-0 z-30 lg:left-64 transition-all">
      {/* Mobile Menu Toggle (Hidden on Desktop for now) */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-serif font-bold tracking-wide lg:hidden">
          CoolStay Admin
        </h1>
      </div>

      {/* Right Side: Profile & Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">Admin User</p>
            <p className="text-[10px] text-blue-200 uppercase">Manager</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center overflow-hidden">
            <span className="font-bold text-sm">AD</span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs font-bold text-red-300 hover:text-red-100 transition-colors uppercase tracking-wider border border-red-900/50 px-3 py-1.5 rounded-lg bg-red-900/20 hover:bg-red-900/40"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
