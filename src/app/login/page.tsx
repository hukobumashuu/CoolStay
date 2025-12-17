"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import HomeFooter from "@/components/HomeFooter";

// Import Shared Auth Components
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";

const LoginForm = () => (
  <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
    <div className="space-y-4">
      <AuthInput
        label="Email"
        type="email"
        placeholder="name@example.com"
        required
      />
      <AuthInput
        label="Password"
        type="password"
        placeholder="••••••••"
        required
      />
    </div>

    {/* Primary Action */}
    <div className="pt-2">
      <AuthButton type="submit">SIGN IN</AuthButton>
    </div>

    {/* Footer Links */}
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

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col font-sans text-slate-800">
      {/* 1. Full-Screen Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/background/coolstaybg.png"
          alt="Resort Aerial View"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
      </div>

      {/* Navbar */}
      <Navbar logoVariant="text" />

      {/* 2. Main Content Area */}
      <div className="relative z-10 grow flex items-center justify-center p-4 pt-40 pb-12">
        {/* Reusable Auth Card - Defaults to correct width (480px) */}
        <AuthCard title="Log in to access your exclusive resort experience.">
          <LoginForm />
        </AuthCard>
      </div>

      <HomeFooter />
    </main>
  );
}
