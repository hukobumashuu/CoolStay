"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthButton } from "@/components/auth/AuthButton";
import { KeyRound } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();

  // 1. Initialize Supabase Client
  const [supabase] = useState(() => createClient());

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [debugStatus, setDebugStatus] = useState("Initializing...");

  // 2. ROBUST SESSION RECOVERY
  useEffect(() => {
    const handleSession = async () => {
      // A. Check for existing session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsSessionValid(true);
        setDebugStatus("Session Active (Storage)");
        return;
      }

      // B. Manually Parse URL Hash (The "Force" Fix)
      // This ensures we capture the token even if the auto-detector misses it
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        try {
          // Parse the hash string manually
          const params = new URLSearchParams(hash.substring(1)); // remove '#'
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");

          if (access_token && refresh_token) {
            setDebugStatus("Found Token in URL, forcing session...");

            // Force Set Session
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (!error) {
              setIsSessionValid(true);
              setDebugStatus("Session Forced Successfully");
              // Optional: Clear hash to clean up URL, but keeping it helps debugging if needed
              // window.history.replaceState(null, "", window.location.pathname);
            } else {
              setDebugStatus(`Error forcing session: ${error.message}`);
            }
          }
        } catch (e) {
          console.error("Error parsing hash:", e);
        }
      }
    };

    // Listen for standard events as a backup
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsSessionValid(true);
        setDebugStatus(`Auth Event: ${event}`);
      }
    });

    handleSession();

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // 3. Last Check before Update
    // Ensure we actually have a user before calling update
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Session lost. Please click the invite link again.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Password set successfully! Logging you in...");
      // Hard refresh to ensure cookies are set for the server
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] p-4">
      <AuthCard
        title="Set New Password"
        subtitle="Please enter your new password below."
      >
        <form onSubmit={handleUpdate} className="space-y-6">
          <AuthInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={KeyRound}
          />

          <AuthButton
            type="submit"
            disabled={loading || !isSessionValid}
            icon={KeyRound}
            className={!isSessionValid ? "opacity-50 cursor-not-allowed" : ""}
          >
            {!isSessionValid
              ? `Verifying... (${debugStatus})`
              : loading
              ? "Updating..."
              : "Set Password"}
          </AuthButton>
        </form>
      </AuthCard>
    </div>
  );
}
