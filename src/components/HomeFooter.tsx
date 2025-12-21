"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HomeFooterProps {
  showSignOut?: boolean;
}

export default function HomeFooter({ showSignOut = false }: HomeFooterProps) {
  const router = useRouter();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh(); // Refresh to update Navbar state
  };

  return (
    <footer className="bg-[#4E342E] text-[#D7CCC8] py-4 px-8 border-t-4 border-[#3E2723] z-20 relative">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between text-sm font-serif font-semibold tracking-wide">
        {/* Left Links - Always on the left */}
        <div className="flex gap-8">
          <Link
            href="/about"
            className="hover:text-white uppercase transition-colors duration-300 hover:tracking-widest"
          >
            About Us
          </Link>
          <Link
            href="/map"
            className="hover:text-white uppercase transition-colors duration-300 hover:tracking-widest"
          >
            Resort Map
          </Link>
        </div>

        {/* Dynamic Sign Out Link - Pushed to the right */}
        {showSignOut && (
          <button
            onClick={handleSignOut}
            className="text-red-200 hover:text-red-50 uppercase transition-colors duration-300 hover:tracking-widest bg-transparent border-none cursor-pointer font-serif font-semibold text-sm"
          >
            Sign Out
          </button>
        )}
      </div>
    </footer>
  );
}
