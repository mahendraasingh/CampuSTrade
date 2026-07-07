import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const WorldMap = ({ dots, className }) => {
  // We use a fixed aspect ratio for the SVG coordinate system
  const width = 1000;
  const height = 500;

  const project = (lat, lng) => {
    // Equirectangular projection mapping to SVG width/height
    const x = (lng + 180) * (width / 360);
    const y = (90 - lat) * (height / 180);
    return { x, y };
  };

  return (
    <div className={cn("relative w-full max-w-5xl mx-auto aspect-[2/1] bg-black/10 dark:bg-black/50 rounded-2xl overflow-hidden shadow-inner border border-white/5", className)}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #9ca3af 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-xl absolute inset-0">
        {dots.map((dot, i) => {
          const start = project(dot.start.lat, dot.start.lng);
          const end = project(dot.end.lat, dot.end.lng);

          // Control points for a curved path
          const midX = (start.x + end.x) / 2;
          const curveHeight = Math.abs(end.x - start.x) * 0.3 + 20;
          
          const cp1x = start.x + (end.x - start.x) / 4;
          const cp1y = Math.min(start.y, end.y) - curveHeight;
          const cp2x = start.x + (end.x - start.x) * (3/4);
          const cp2y = Math.min(start.y, end.y) - curveHeight;

          return (
            <g key={i}>
              <motion.path
                d={`M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: i * 0.15 }}
              />
              <motion.circle 
                cx={start.x} cy={start.y} r="3" fill="#4ade80" 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}
              />
              <motion.circle 
                cx={end.x} cy={end.y} r="3" fill="#60a5fa"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 + 1.2 }}
              />
              
              <text x={start.x} y={start.y - 12} fill="#9ca3af" fontSize="10" textAnchor="middle" className="font-semibold tracking-wider">
                {dot.start.label}
              </text>
              <text x={end.x} y={end.y - 12} fill="#9ca3af" fontSize="10" textAnchor="middle" className="font-semibold tracking-wider">
                {dot.end.label}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
