
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import StepCard3D from "./StepCard3D";
import { Step } from "@/types/timeline";
import * as THREE from "three";

interface TimelineCarouselProps {
  steps: Step[];
  onBegin: (id: number) => void;
}

// Helper component to position cards in 3D space
const CarouselContainer: React.FC<TimelineCarouselProps> = ({ steps, onBegin }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Rotate carousel based on active index
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Calculate rotation angle based on active index
    const targetRotation = (activeIndex / steps.length) * Math.PI * 2;
    
    // Animate rotation
    const animate = () => {
      if (!groupRef.current) return;
      
      const currentRotation = groupRef.current.rotation.y;
      const diff = targetRotation - currentRotation;
      
      // Smooth rotation animation
      groupRef.current.rotation.y += diff * 0.05;
      
      if (Math.abs(diff) > 0.01) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [activeIndex, steps.length]);
  
  // Set up wheel event listener for carousel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent default scrolling
      if (e.deltaY > 0) {
        // Scroll down - go to next step
        setActiveIndex((prev) => (prev + 1) % steps.length);
      } else {
        // Scroll up - go to previous step
        setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
      }
    };
    
    // Add passive: false to ensure preventDefault works
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [steps.length]);
  
  // Calculate positions of cards in a circle
  const radius = 6;
  const cardPositions = steps.map((_, i) => {
    const angle = (i / steps.length) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    return [x, 0, z] as [number, number, number];
  });
  
  // Calculate rotations to face the center
  const cardRotations = steps.map((_, i) => {
    const angle = (i / steps.length) * Math.PI * 2;
    return [0, angle + Math.PI, 0] as [number, number, number];
  });
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <hemisphereLight intensity={0.35} />
      <group ref={groupRef}>
        {steps.map((step, index) => (
          <StepCard3D
            key={step.id}
            step={step}
            index={index}
            position={cardPositions[index]}
            rotation={cardRotations[index]}
            isActive={index === activeIndex}
            onBegin={onBegin}
          />
        ))}
      </group>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
};

const TimelineCarousel3D: React.FC<TimelineCarouselProps> = ({ steps, onBegin }) => {
  return (
    <div className="w-full h-[600px] relative" style={{ touchAction: 'none' }}>
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <CarouselContainer steps={steps} onBegin={onBegin} />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-muted-foreground">
        Use mousewheel to navigate through steps
      </div>
    </div>
  );
};

export default TimelineCarousel3D;
