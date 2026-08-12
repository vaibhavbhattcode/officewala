'use client';

import { memo, useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroBackgroundProps {
  backgroundUrl: string;
  backgrounds?: string[];
}

export const HeroBackground = memo(function HeroBackground({ backgroundUrl, backgrounds }: HeroBackgroundProps) {
  const sources = backgrounds && backgrounds.length > 0 ? backgrounds : [backgroundUrl];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sources.length <= 1) return;
    
    // Cycle every 35 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sources.length);
    }, 35000);
    
    return () => clearInterval(interval);
  }, [sources.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {sources.map((src, index) => {
        const isVideo = src?.endsWith('.mp4') || src?.endsWith('.webm');
        return (
          <div 
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            {isVideo ? (
              <video
                src={src}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={src}
                alt={`Station Background ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain sm:object-cover"
                priority={index === 0}
              />
            )}
          </div>
        );
      })}

      {/* Dark gradient overlay to ensure the one-liner text is legible */}
      <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
    </div>
  );
});
