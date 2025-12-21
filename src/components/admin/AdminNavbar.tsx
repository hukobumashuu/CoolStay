"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-[#0A1A44] text-white flex items-center justify-between px-6 lg:px-8 shadow-md fixed top-0 right-0 left-0 z-30 lg:left-64 transition-all">
      {/* Mobile Title & Logo (Only visible on small screens) */}
      <div className="lg:hidden flex items-center gap-3">
        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white/20">
          <Image
            src="/images/logo/coolstaylogo.jpg"
            alt="Logo"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-xl font-serif font-bold">CoolStay</span>
      </div>

      {/* Spacer for Desktop (pushes content right) */}
      <div className="hidden lg:block"></div>

      {/* Right Side: Profile & Actions */}
      <div className="flex items-center gap-4 sm:gap-8">
        <button
          onClick={handleSignOut}
          className="text-xs font-bold text-white hover:text-gray-300 transition-colors uppercase tracking-wider flex items-center gap-2"
        >
          SIGN OUT
        </button>

        <div className="bg-white text-black rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2 shadow-sm">
          <div className="bg-gray-200 rounded-full p-1">
            <User className="w-4 h-4 text-gray-600 fill-current" />
          </div>
          <span className="font-bold text-sm tracking-wide">ADMIN</span>
        </div>
      </div>
    </header>
  );
}
