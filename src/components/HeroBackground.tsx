'use client';

import { memo } from 'react';
import Image from 'next/image';

interface HeroBackgroundProps {
  backgroundUrl: string;
}

export const HeroBackground = memo(function HeroBackground({ backgroundUrl }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Background Image with slow zoom */}
      <div className="absolute inset-0 bg-slow-zoom">
        <Image
          src={backgroundUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      {/* Bottom gradient for player readability */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Subtle top vignette */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Floating lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-station-gold/5 blur-3xl floating-light" />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-station-gold/3 blur-3xl floating-light"
        style={{ animationDelay: '4s' }}
      />

      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay overflow-hidden pointer-events-none" />
    </div>
  );
});
