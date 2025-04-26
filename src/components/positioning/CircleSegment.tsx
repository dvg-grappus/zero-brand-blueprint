
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
      {/* Invisible full circle to make the entire area clickable */}
      <circle
        cx="300"
        cy="300"
        r={radius}
        fill="transparent"
        className="cursor-pointer"
      />
      
      {/* Visible circle outline */}
      <circle
        cx="300"
        cy="300"
        r={radius}
        fill="none"
        stroke={isActive ? "hsl(var(--cyan))" : "#E0E0E0"}
        strokeWidth="2"
        className="transition-colors duration-300 pointer-events-none"
      />
      
      <text
        x="300"
        y={300 - radius}
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
