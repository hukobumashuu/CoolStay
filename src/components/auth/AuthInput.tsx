"use client";

import React, { useState, forwardRef } from "react";
import { Check, Eye, EyeOff, AlertCircle } from "lucide-react"; // Make sure to install lucide-react if needed

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isSuccess?: boolean; // New prop for valid state
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    { label, className = "", type = "text", error, isSuccess, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    // Dynamic border color
    let borderColor = "border-white/20";
    if (error) borderColor = "border-red-400 ring-2 ring-red-400/20";
    else if (isSuccess)
      borderColor = "border-green-400 ring-2 ring-green-400/20";

    return (
      <div className="w-full space-y-2">
        <label className="text-left text-white text-sm font-medium ml-1 drop-shadow-sm flex justify-between">
          <span>{label}</span>
        </label>

        <div className="relative group">
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-100/50 
              focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 
              transition-all backdrop-blur-sm ${borderColor} ${className}`}
            {...props}
          />

          {/* Icons Container */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Success Icon */}
            {isSuccess && !error && (
              <Check className="w-5 h-5 text-green-300 animate-in zoom-in" />
            )}

            {/* Error Icon */}
            {error && (
              <AlertCircle className="w-5 h-5 text-red-300 animate-in zoom-in" />
            )}

            {/* Toggle Password */}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/70 hover:text-white transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-1 text-red-200 text-xs ml-1 font-medium bg-red-500/20 px-2 py-1 rounded w-fit animate-in slide-in-from-top-1">
            {error}
          </div>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
