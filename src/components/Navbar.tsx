"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activePage?: string;
  logoVariant?: "image" | "text";
  isLoggedIn?: boolean;
}

export default function Navbar({
  activePage = "",
  logoVariant = "image",
}: NavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [dashboardLink, setDashboardLink] = useState("/dashboard");
  const [loading, setLoading] = useState(true);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const fullName = user.user_metadata?.full_name || "Member";
        setName(fullName.split(" ")[0]);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const fullName = user.user_metadata?.full_name || "Member";
        setName(fullName.split(" ")[0]);

        // CHECK ROLE TO SET CORRECT LINK
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          setDashboardLink("/admin/dashboard");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const getLinkClass = (pageName: string) => {
    const base =
      "flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 ease-in-out";
    if (activePage === pageName) {
      return `${base} bg-[#5D8CAE] text-white shadow-lg scale-105`;
    }
    return `${base} hover:text-blue-200 hover:bg-white/10`;
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0A1A44] text-white shadow-md transition-all duration-300">
      <div className="relative mx-auto flex h-20 w-full max-w-[1440px] items-center px-4 sm:px-8">
        {/* LOGO */}
        <div
          className={`absolute left-4 sm:left-8 z-50 transition-all duration-500 ${
            logoVariant === "image"
              ? "top-2 hover:translate-y-1"
              : "top-0 h-full flex items-center"
          }`}
        >
          <Link href={user ? "/dashboard" : "/"}>
            {logoVariant === "image" ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <Image
                  src="/images/logo/coolstaylogo.jpg"
                  alt="CoolStay logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              <span
                className="text-3xl text-white tracking-wide transition-opacity hover:opacity-80"
                style={{ fontFamily: "var(--font-goblin), cursive" }}
              >
                CoolStay
              </span>
            )}
          </Link>
        </div>

        {/* LINKS */}
        <div className="flex-1 flex justify-center pl-24">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium tracking-wide uppercase">
            <Link
              href={user ? "/dashboard" : "/"}
              className={getLinkClass("home")}
            >
              Home
            </Link>
            <Link
              href="/accommodation"
              className={getLinkClass("accommodation")}
            >
              Accommodation
            </Link>
            <Link href="/day-pass" className={getLinkClass("day-pass")}>
              Day Pass
            </Link>
            <Link href="/events" className={getLinkClass("events")}>
              Plan An Event
            </Link>
            <Link href="/experience" className={getLinkClass("experience")}>
              Experience
            </Link>
          </div>
        </div>

        {/* AUTH / PROFILE */}
        <div className="flex-none hidden md:block">
          {!loading && (
            <>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Toggle Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 cursor-pointer"
                  >
                    <div className="flex flex-col items-end mr-2">
                      <span className="text-sm font-bold leading-none group-hover:text-blue-200">
                        {name}
                      </span>
                      <span className="text-[10px] text-blue-200 uppercase tracking-wider group-hover:text-white">
                        Member
                      </span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <svg
                        className="h-6 w-6 text-[#0A1A44]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 text-gray-800 animate-in fade-in zoom-in duration-200 border border-gray-100">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 font-bold uppercase">
                          Account
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-blue-50 text-sm font-medium transition-colors text-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-blue-50 text-sm font-medium transition-colors text-gray-700"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <div className="border-t border-gray-100 mt-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button
                    variant="white"
                    rounded="full"
                    className="font-bold px-8 shadow-lg hover:scale-105"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
