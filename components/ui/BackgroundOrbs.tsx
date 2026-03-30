'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundOrbs() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync scroll with motion
  const y1 = useTransform(scrollY, [0, 500, 1000], [0, 100, 200]);
  const y2 = useTransform(scrollY, [0, 500, 1000], [0, -150, -300]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-black pointer-events-none">
      {/* Primary Royal Blue Orb (Mouse Following) */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-[#2B59FF]/10 blur-[120px]"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 50,
        }}
      />

      {/* Static Floating Orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#4169E1]/5 blur-[100px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#2B59FF]/10 blur-[130px]"
      />
      
      {/* Ambient Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none noise-grain" />
    </div>
  );
}
