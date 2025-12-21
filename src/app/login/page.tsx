"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HomeFooter from "@/components/HomeFooter";

import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { createClient } from "@/lib/supabase/client";

const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
    } else {
      // Login successful, redirect to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleLogin}>
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <AuthInput
          name="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
        />
        <AuthInput
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="pt-2">
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing In..." : "SIGN IN"}
        </AuthButton>
      </div>

      <div className="text-center space-y-4 pt-2">
        <p className="text-blue-50 text-sm">
          Don’t have an account yet?{" "}
          <Link
            href="/register"
            className="text-white font-bold underline decoration-white/50 hover:decoration-white transition-all"
          >
            Sign up now!
          </Link>
        </p>

        <p className="text-xs text-blue-100/60 leading-relaxed px-4">
          By signing in or creating an account, you agree with our Terms &
          Conditions and Privacy Statement.
        </p>
      </div>
    </form>
  );
};

export default function LoginPage() {
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

      <div className="relative z-10 flex-grow flex items-center justify-center p-4 pt-40 pb-12">
        <AuthCard title="Log in to access your exclusive resort experience.">
          <LoginForm />
        </AuthCard>
      </div>

      <HomeFooter />
    </main>
  );
}
