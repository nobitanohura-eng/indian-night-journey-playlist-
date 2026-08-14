import React from 'react';
import { motion } from 'motion/react';

export function BusChassis({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        x: [0, 1, -1, 0.5, -0.5, 1, 0],
        y: [0, -1, 1, -0.5, 0.5, -1, 0],
        rotateX: [0, 0.5, -0.5, 0],
        rotateY: [0, -0.5, 0.5, 0],
      }}
      transition={{
        x: { duration: 3.1, repeat: Infinity, ease: "linear" },
        y: { duration: 2.7, repeat: Infinity, ease: "linear" },
        rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 10, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute inset-0 w-full h-full origin-center pointer-events-none"
      style={{ perspective: '800px' }}
    >
      {/* We make the wrapper pointer-events-none so it doesn't block interactions, 
          but its children can re-enable pointer-events if needed */}
      <div className="absolute inset-0 pointer-events-auto w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}
