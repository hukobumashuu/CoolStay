"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection
import HomeFooter from "@/components/HomeFooter";

// Auth Components
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSelect } from "@/components/auth/AuthSelect";
import { AuthButton } from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";

// Supabase Client
import { createClient } from "@/lib/supabase/client";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const gender = formData.get("gender") as string;

    // 1. Basic Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // 2. Call Supabase
    const supabase = createClient();
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          phone: phone,
          gender: gender,
        },
      },
    });

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
    } else {
      // 3. Success!
      // If email confirmation is enabled (default), tell them to check email.
      // Otherwise, redirect to dashboard.
      if (data.session) {
        router.push("/dashboard");
      } else {
        alert(
          "Registration successful! Please check your email to confirm your account."
        );
        router.push("/login");
      }
    }
  };

  return (
    <form className="w-full space-y-5" onSubmit={handleRegister}>
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Row 1: 3 Columns (Name + Gender) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AuthInput
          name="firstName"
          label="First Name"
          placeholder="e.g. John"
          required
        />
        <AuthInput
          name="lastName"
          label="Last Name"
          placeholder="e.g. Doe"
          required
        />
        <AuthSelect
          name="gender"
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
          name="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          required
        />
        <AuthInput
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+63 900 000 0000"
          required
        />
      </div>

      {/* Row 3: 2 Columns (Passwords) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AuthInput
          name="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          required
        />
        <AuthInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
        />
      </div>

      {/* Primary Action */}
      <div className="pt-4 max-w-md mx-auto w-full">
        <AuthButton type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create My Account"}
        </AuthButton>
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
};

export default function RegisterPage() {
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
          title="Create an account to unlock exclusive access to CoolStay!"
          subtitle="Join us today for seamless bookings and unforgettable experiences."
          maxWidth="max-w-[850px]"
        >
          <RegisterForm />
        </AuthCard>
      </div>

      <HomeFooter />
    </main>
  );
}
