"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface NavbarProps {
  activePage?: string;
  logoVariant?: "image" | "text";
  isLoggedIn?: boolean;
}

export default function Navbar({
  activePage = "",
  logoVariant = "image",
  isLoggedIn = false,
}: NavbarProps) {
  // Helper to determine link styles
  const getLinkClass = (pageName: string) => {
    const base =
      "flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 ease-in-out";
    if (activePage === pageName) {
      return `${base} bg-[#5D8CAE] text-white shadow-lg scale-105`; // Active Pill Style
    }
    return `${base} hover:text-blue-200 hover:bg-white/10`;
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0A1A44] text-white shadow-md transition-all duration-300">
      <div className="relative mx-auto flex h-20 w-full max-w-[1440px] items-center px-4 sm:px-8">
        {/* LOGO CONTAINER */}
        <div
          className={`absolute left-4 sm:left-8 z-50 transition-all duration-500 ${
            logoVariant === "image"
              ? "top-2 hover:translate-y-1" /* Subtle bounce on hover */
              : "top-0 h-full flex items-center"
          }`}
        >
          <Link href={isLoggedIn ? "/dashboard" : "/"}>
            {logoVariant === "image" ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 duration-300">
                <Image
                  src="/coolstaylogo.jpg"
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

        {/* NAV LINKS */}
        <div className="flex-1 flex justify-center pl-24">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium tracking-wide uppercase">
            <Link
              href={isLoggedIn ? "/dashboard" : "/"}
              className={getLinkClass("home")}
            >
              <svg
                className="w-4 h-4 mb-1 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
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

        {/* AUTH BUTTONS */}
        <div className="flex-none hidden md:block">
          {isLoggedIn ? (
            /* LOGGED IN STATE: Interactive User Profile Button */
            <button className="group flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20 cursor-pointer">
              <div className="flex flex-col items-end mr-2 transition-transform duration-300 group-hover:translate-x-[-2px]">
                <span className="text-sm font-bold leading-none group-hover:text-blue-200 transition-colors">
                  Matthew
                </span>
                <span className="text-[10px] text-blue-200 uppercase tracking-wider group-hover:text-white transition-colors">
                  Member
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-[#5D8CAE]">
                <svg
                  className="h-6 w-6 text-[#0A1A44] transition-colors"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </button>
          ) : (
            /* LOGGED OUT STATE: Animated Sign In Button */
            <Link href="/login">
              <Button
                variant="white"
                rounded="full"
                className="font-bold px-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-900/50 active:scale-95 active:shadow-sm"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
