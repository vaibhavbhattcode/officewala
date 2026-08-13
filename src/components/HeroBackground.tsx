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

        // Active is 1, everything else fades to 0
        const opacity = isActive ? 1 : 0;
        // Apply a smooth 3-second fade transition to all elements
        const transitionClass = 'transition-opacity duration-[3000ms] ease-in-out';

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
                priority={true}
                unoptimized
              />
            )}
          </div>
        );
      })}
    </div>
  );
});
