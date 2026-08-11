'use client';

import { memo } from 'react';
import Image from 'next/image';

interface HeroBackgroundProps {
  backgroundUrl: string;
}

export const HeroBackground = memo(function HeroBackground({ backgroundUrl }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Background Image — unoptimized to allow instant live updates when file changes */}
      <div className="absolute inset-0">
        <Image
          src={backgroundUrl}
          alt="Station Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    </div>
  );
});
