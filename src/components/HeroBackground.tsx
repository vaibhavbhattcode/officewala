'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroBackgroundProps {
  backgroundUrl: string;
  backgrounds?: string[];
}

export const HeroBackground = memo(function HeroBackground({ backgroundUrl, backgrounds }: HeroBackgroundProps) {
  const images = backgrounds && backgrounds.length > 0 ? backgrounds : [backgroundUrl];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    
    // Cycle every 35 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 35000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {images.map((src, index) => (
        <div 
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <Image
            src={src}
            alt={`Station Background ${index + 1}`}
            fill
            sizes="100vw"
            className="object-contain sm:object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
});
