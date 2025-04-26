
import React from "react";
import { motion } from "framer-motion";

interface CircleSegmentProps {
  label: string;
  radius: number;
  isActive: boolean;
  onClick: () => void;
}

const CircleSegment: React.FC<CircleSegmentProps> = ({ label, radius, isActive, onClick }) => {
  return (
    <motion.g
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
    >
      {/* Visible circle fill for better tap target */}
      <circle
        cx="100"
        cy="150"
        r={radius}
        fill={isActive ? "rgba(200, 200, 200, 0.2)" : "transparent"}
        stroke={isActive ? "hsl(var(--cyan))" : "#E0E0E0"}
        strokeWidth="2"
        className="transition-colors duration-300"
      />
      
      <text
        x="100"
        y={150 - radius - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isActive ? "hsl(var(--cyan))" : "#999999"}
        className="font-semibold text-base transition-colors duration-300 pointer-events-none"
      >
        {label}
      </text>
    </motion.g>
  );
};

export default CircleSegment;
