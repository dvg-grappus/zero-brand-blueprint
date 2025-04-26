
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
      {/* Clickable background circle */}
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill={isActive ? "rgba(200, 200, 200, 0.2)" : "transparent"}
        className="transition-colors duration-300"
      />
      
      {/* Visible circle outline */}
      <circle
        cx="150"
        cy="150"
        r={radius}
        fill="transparent"
        stroke={isActive ? "hsl(var(--cyan))" : "#E0E0E0"}
        strokeWidth="2"
        className="transition-colors duration-300"
      />
      
      <text
        x="150"
        y={150 - radius - 15}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isActive ? "hsl(var(--cyan))" : "#999999"}
        className="font-semibold text-lg transition-colors duration-300 pointer-events-none"
      >
        {label}
      </text>
    </motion.g>
  );
};

export default CircleSegment;
