"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeFooter from "@/components/HomeFooter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const returnTo = searchParams.get("return_to");

  // Helper for email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-Side Validation
    if (!email || !isValidEmail(email)) {
      toast.error("Invalid email address");
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Invalid password (must be at least 6 characters)");
      return;
    }

    setLoading(true);

    try {
      // 2. Call the Server-Side Login API
      // This API checks the password AND the user role (Admin vs User)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("Welcome back!");

      // 3. Smart Redirect
      // If there is a forced return URL (e.g. from booking), go there.
      // Otherwise, go where the SERVER told us to go (Admin Dashboard vs User Dashboard)
      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push(data.redirectUrl); // <--- THIS FIXES THE BUG
      }

      router.refresh(); // Ensure the UI updates with the new session
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col font-sans text-slate-800">
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/background/coolstaybg.png"
          alt="Resort Aerial View"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
      </div>

      <Navbar logoVariant="text" />

      <div className="relative z-10 grow flex items-center justify-center p-4 pt-40 pb-20">
        <AuthCard
          title="Welcome Back"
          subtitle="Sign in to manage your bookings and explore exclusive offers."
        >
          <form className="w-full space-y-5" onSubmit={handleLogin}>
            <div className="space-y-4">
              <AuthInput
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <AuthInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <AuthButton type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </AuthButton>
            </div>

            <div className="text-center space-y-4 pt-2">
              <p className="text-blue-50 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-white font-bold underline decoration-white/50 hover:decoration-white transition-all"
                >
                  Create one now
                </Link>
              </p>
              <p className="text-xs text-blue-100/60 leading-relaxed px-4">
                By signing in, you agree with our Terms & Conditions and Privacy
                Statement.
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
      <HomeFooter />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
