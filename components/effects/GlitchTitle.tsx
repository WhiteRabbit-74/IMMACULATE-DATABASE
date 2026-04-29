"use client";

import React, { useState, useEffect } from "react";

interface GlitchTitleProps {
  text: string;
  className?: string;
}

export const GlitchTitle: React.FC<GlitchTitleProps> = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!@#$%^&*()_+{}:\"<>?|1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    let interval: any;
    const triggerGlitch = () => {
      let count = 0;
      interval = setInterval(() => {
        setDisplayText(prev => 
          prev.split("").map((char, index) => {
            if (Math.random() > 0.9) return chars[Math.floor(Math.random() * chars.length)];
            return text[index];
          }).join("")
        );
        count++;
        if (count > 5) {
          clearInterval(interval);
          setDisplayText(text);
        }
      }, 50);
    };

    const timeout = setInterval(triggerGlitch, 4000);
    return () => {
      clearInterval(timeout);
      clearInterval(interval);
    };
  }, [text]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{displayText}</span>
      <span className="absolute top-0 left-0 -z-10 text-red-500/30 translate-x-[1px] animate-pulse">{displayText}</span>
      <span className="absolute top-0 left-0 -z-20 text-blue-500/30 -translate-x-[1px] animate-pulse">{displayText}</span>
    </span>
  );
};
