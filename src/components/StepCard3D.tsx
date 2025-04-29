
import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Step } from "@/types/timeline";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

interface StepCardProps {
  step: Step;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  isActive: boolean;
  onBegin: (id: number) => void;
}

const StepCard3D: React.FC<StepCardProps> = ({
  step,
  index,
  position,
  rotation,
  isActive,
  onBegin
}) => {
  const navigate = useNavigate();
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  
  // Colors based on step index for variety
  const colors = [
    "#FFE29F", // Yellow
    "#FFA99F", // Orange
    "#FF719A", // Pink
    "#7DF9FF", // Cyan
    "#A3A1FF", // Purple
    "#77DD77", // Green
    "#FFB347", // Orange
    "#C23B23", // Red
    "#FFD1DC", // Light pink
    "#03C03C", // Green
    "#AEC6CF", // Light blue
    "#CFCFC4", // Light gray
    "#FF6961", // Light red
    "#CB99C9"  // Light purple
  ];
  
  // Animation for active/inactive cards
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Make active card more prominent
    if (isActive) {
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        position[2] + 0.5,
        0.1
      );
      meshRef.current.scale.set(1.1, 1.1, 1.1);
    } else {
      meshRef.current.position.z = THREE.MathUtils.lerp(
        meshRef.current.position.z,
        position[2],
        0.1
      );
      meshRef.current.scale.set(1, 1, 1);
    }
    
    // Subtle floating animation based on time
    const t = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + index * 0.5) * 0.05;
    
    // Hover effect for non-active cards
    if (hovered && !isActive) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotation[1] - 0.1,
        0.1
      );
    } else if (!isActive) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        rotation[1],
        0.1
      );
    }
  });
  
  // Handle click event
  const handleClick = (e: any) => {
    e.stopPropagation();
    onBegin(step.id);
  };
  
  // Calculate text position and size based on viewport
  const fontSize = viewport.width < 10 ? 0.1 : 0.15;
  const cardWidth = 2;
  const cardHeight = 3;
  const cardDepth = 0.2;
  
  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Card base */}
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
        <meshStandardMaterial 
          color={colors[index % colors.length]}
          roughness={0.4}
          metalness={0.1}
        />
        
        {/* Title text */}
        <Text
          position={[0, 0.8, cardDepth / 2 + 0.01]}
          fontSize={fontSize}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          font="/fonts/Inter-Bold.woff"
        >
          {step.title}
        </Text>
        
        {/* Description text */}
        <Text
          position={[0, 0, cardDepth / 2 + 0.01]}
          fontSize={fontSize * 0.7}
          color="#333333"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
          font="/fonts/Inter-Regular.woff"
        >
          {step.description}
        </Text>
        
        {/* Duration badge */}
        <Text
          position={[0, -0.8, cardDepth / 2 + 0.01]}
          fontSize={fontSize * 0.6}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Medium.woff"
        >
          {step.duration}
        </Text>
        
        {/* Step number */}
        <Text
          position={[-cardWidth/2 + 0.3, cardHeight/2 - 0.3, cardDepth / 2 + 0.01]}
          fontSize={fontSize * 0.6}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {step.id}
        </Text>
      </mesh>
      
      {/* Button for active card */}
      {isActive && (
        <mesh
          position={[0, -1.4, cardDepth / 2 + 0.1]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial color="#ffffff" />
          <Text
            position={[0, 0, 0.01]}
            fontSize={fontSize * 0.6}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Medium.woff"
          >
            Begin
          </Text>
        </mesh>
      )}
    </group>
  );
};

export default StepCard3D;
