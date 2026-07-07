import React from 'react';
import { cn } from '@/lib/utils';

export const LiquidMetalButton = ({
  label = "Submit",
  viewMode = "default",
  className,
  onClick,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden group rounded-lg bg-[#0f172a] text-white font-semibold flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95",
        viewMode === "icon" ? "w-12 h-12" : "px-8 py-3 w-full sm:w-auto",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-xy" />
      
      {/* Glossy overlay to simulate "metal" sheen */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent opacity-40 mix-blend-overlay" />
      <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg group-hover:ring-white/30 transition-all" />
      
      <span className="relative z-10 flex items-center justify-center drop-shadow-md whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};
