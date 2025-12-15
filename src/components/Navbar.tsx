"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface NavbarProps {
  activePage?: string;
  logoVariant?: "image" | "text";
}

export default function Navbar({
  activePage = "",
  logoVariant = "image",
}: NavbarProps) {
  // Helper to determine link styles
  const getLinkClass = (pageName: string) => {
    const base =
      "flex items-center gap-1 px-4 py-2 rounded-full transition-colors duration-200";
    if (activePage === pageName) {
      return `${base} bg-[#5D8CAE] text-white shadow-md`; // Active Pill Style
    }
    return `${base} hover:text-blue-200`;
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#0A1A44] text-white shadow-md">
      <div className="relative mx-auto flex h-20 w-full max-w-[1440px] items-center px-4 sm:px-8">
        {/* LOGO CONTAINER */}
        <div
          className={`absolute left-4 sm:left-8 z-50 ${
            logoVariant === "image"
              ? "top-2" /* IMAGE MODE: Uses your preferred 'top-2' alignment */
              : "top-0 h-full flex items-center" /* TEXT MODE: Centers text vertically */
          }`}
        >
          <Link href="/">
            {logoVariant === "image" ? (
              /* IMAGE VARIANT: Reverted to exactly what you had */
              <div className="relative h-32 w-32 overflow-hidden rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <Image
                  src="/coolstaylogo.jpg"
                  alt="CoolStay logo"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              /* TEXT VARIANT: Used for Day Pass page */
              <span
                className="text-3xl text-white tracking-wide"
                style={{ fontFamily: "var(--font-goblin), cursive" }} // Direct style to ensure font loads
              >
                CoolStay
              </span>
            )}
          </Link>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 flex justify-center pl-24">
          <div className="hidden md:flex items-center gap-4 text-sm font-medium tracking-wide uppercase">
            <Link href="/" className={getLinkClass("home")}>
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

        {/* SIGN IN BUTTON */}
        <div className="flex-none hidden md:block">
          <Button variant="white" rounded="full" className="font-bold px-8">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
}
