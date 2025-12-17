"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import HomeFooter from "@/components/HomeFooter";

// Import Custom Auth Components
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSelect } from "@/components/auth/AuthSelect";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";

const RegisterForm = () => (
  <form className="w-full space-y-5" onSubmit={(e) => e.preventDefault()}>
    {/* Row 1: 3 Columns (Name + Gender) */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AuthInput label="First Name" placeholder="e.g. John" required />
      <AuthInput label="Last Name" placeholder="e.g. Doe" required />
      <AuthSelect
        label="Gender"
        defaultValue=""
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Prefer not to say" },
        ]}
      />
    </div>

    {/* Row 2: 2 Columns (Contact Info) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AuthInput
        label="Email"
        type="email"
        placeholder="name@example.com"
        required
      />
      <AuthInput
        label="Phone Number"
        type="tel"
        placeholder="+63 900 000 0000"
        required
      />
    </div>

    {/* Row 3: 2 Columns (Passwords) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AuthInput
        label="Password"
        type="password"
        placeholder="Create a password"
        required
      />
      <AuthInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        required
      />
    </div>

    {/* Primary Action */}
    <div className="pt-4 max-w-md mx-auto w-full">
      <AuthButton type="submit">Create My Account</AuthButton>
    </div>

    {/* Footer Links */}
    <div className="text-center space-y-4 pt-2">
      <p className="text-blue-50 text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-white font-bold underline decoration-white/50 hover:decoration-white transition-all"
        >
          Sign in now!
        </Link>
      </p>

      <p className="text-xs text-blue-100/60 leading-relaxed px-4">
        By signing in or creating an account, you agree with our Terms &
        Conditions and Privacy Statement.
      </p>
    </div>
  </form>
);

export default function RegisterPage() {
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

      <Navbar logoVariant="text" />

      {/* 2. Main Content Area */}
      <div className="relative z-10 grow flex items-center justify-center p-4 pt-40 pb-20">
        {/* Reusable Auth Card Wrapper */}
        <AuthCard
          title="Create an account to unlock exclusive access to CoolStay!"
          subtitle="Join us today for seamless bookings and unforgettable experiences."
          maxWidth="max-w-[850px]" // Custom width for Registration
        >
          <RegisterForm />
        </AuthCard>
      </div>

      <HomeFooter />
    </main>
  );
}
