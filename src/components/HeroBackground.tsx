'use client';

import { memo, useEffect, useState } from 'react';
import Image from 'next/image';

interface HeroBackgroundProps {
  backgroundUrl: string;
  backgrounds?: string[];
  currentIndex: number;
}

export const HeroBackground = memo(function HeroBackground({ backgroundUrl, backgrounds, currentIndex }: HeroBackgroundProps) {
  const allBackgrounds = backgrounds && backgrounds.length > 0 ? backgrounds : [backgroundUrl];
  
  const [prevIndex, setPrevIndex] = useState(-1);
  const [activeIdx, setActiveIdx] = useState(currentIndex);

  useEffect(() => {
    if (currentIndex !== activeIdx) {
      setPrevIndex(activeIdx);
      setActiveIdx(currentIndex);
    }
  }, [currentIndex, activeIdx]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0c0c0c]">
      {allBackgrounds.map((bg, idx) => {
        const isActive = idx === activeIdx;
        const isPrev = idx === prevIndex;
        const isVideo = bg.endsWith('.mp4') || bg.endsWith('.webm');
        
        let zIndex = 0;
        if (isActive) zIndex = 10;
        else if (isPrev) zIndex = 5;

        // If it's active or was just active, keep opacity 1. 
        // This ensures the new image fades IN on top of the old image, eliminating dip-to-black.
        const opacity = (isActive || isPrev) ? 1 : 0;
        // Fade duration 2 seconds. When it stops being isPrev, it fades out invisibly behind the new active one.
        const transitionClass = isActive || isPrev ? 'transition-opacity duration-[2000ms] ease-in-out' : '';

        return (
          <div
            key={bg + idx}
            className={`absolute inset-0 ${transitionClass}`}
            style={{ opacity, zIndex }}
          >
            {isVideo ? (
              <video
                src={bg}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={bg}
                alt="Station Background"
                fill
                className="object-cover"
                priority={idx === 0 || idx === activeIdx}
                unoptimized
              />
            )}
          </div>
        );
      })}
    </div>
  );
});
