import React from "react";

export const AuthButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full py-3 px-6 rounded-full bg-[#065FA3] hover:bg-[#054a80] text-white font-bold tracking-wide shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-white/10 ${className}`}
    {...props}
  >
    {children}
  </button>
);
