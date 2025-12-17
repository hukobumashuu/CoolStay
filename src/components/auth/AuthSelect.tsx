import React from "react";

interface AuthSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export const AuthSelect = ({
  label,
  options,
  className = "",
  ...props
}: AuthSelectProps) => (
  <div className="w-full space-y-2">
    <label className="block text-left text-white text-sm font-medium ml-1 drop-shadow-sm">
      {label}
    </label>
    <div className="relative">
      <select
        className={`w-full px-4 py-3 rounded-lg bg-white/30 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/40 transition-all backdrop-blur-sm appearance-none ${className}`}
        {...props}
      >
        <option value="" disabled className="text-gray-500">
          Select {label}
        </option>
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="text-gray-800 bg-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </div>
  </div>
);
