"use client"; // Ensures it's a client component

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const FloatingShapes = () => {
  const [shapes, setShapes] = useState([]);

  useEffect(() => {
    const generateShapes = () => {
      return Array.from({ length: 10 }).map(() => ({
        width: Math.random() * 100 + 50,
        height: Math.random() * 100 + 50,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        yMove: Math.random() * 100 - 50,
        xMove: Math.random() * 100 - 50,
        duration: Math.random() * 10 + 10,
      }));
    };

    setShapes(generateShapes());
  }, []); // Runs only once on component mount

  return (
    <div className="absolute inset-0 overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white bg-opacity-10"
          style={{
            width: shape.width,
            height: shape.height,
            left: shape.left,
            top: shape.top,
          }}
          animate={{
            y: [0, shape.yMove],
            x: [0, shape.xMove],
          }}
          transition={{
            duration: shape.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
