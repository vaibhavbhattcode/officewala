'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { StationConfig } from '@/types/types';
import Image from 'next/image';

interface IntroScreenProps {
  station: StationConfig;
  onEnter: () => void;
}

export function IntroScreen({ station, onEnter }: IntroScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={station.background}
          alt="Office background"
          fill
          className="object-cover bg-slow-zoom"
          priority
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90" />
        {/* Grain */}
        <div className="absolute inset-0 grain-overlay overflow-hidden" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-station-gold/10 border border-station-gold/20 flex items-center justify-center backdrop-blur-sm">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-station-gold to-amber-600 flex items-center justify-center shadow-lg shadow-station-gold/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 md:w-7 md:h-7 text-station-dark"
              >
                <path
                  d="M9 18V5l12-2v13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="6" cy="18" r="3" fill="currentColor" />
                <circle cx="18" cy="16" r="3" fill="currentColor" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Station Name */}
        <motion.h1
          className="font-[var(--font-space-grotesk)] text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider text-station-text mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {station.name}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-station-gold text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {station.subtitle}
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="text-station-text-dim text-sm md:text-base font-light mb-12 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {station.tagline}
        </motion.p>

        {/* Enter Button */}
        <motion.button
          onClick={onEnter}
          className="group relative flex items-center gap-3 px-8 py-4 rounded-full border border-station-gold/30 bg-station-gold/10 backdrop-blur-md text-station-gold hover:bg-station-gold hover:text-station-dark transition-all duration-300 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Enter the station and start playing music"
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="font-[var(--font-space-grotesk)] text-sm md:text-base font-semibold tracking-widest uppercase">
            Enter Station
          </span>
        </motion.button>

        {/* Hint */}
        <motion.p
          className="mt-6 text-station-text-dim text-xs tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          Press play to enter the office station
        </motion.p>
      </motion.div>

      {/* Bottom decoration */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-station-text-dim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <div className="w-1 h-1 rounded-full bg-station-gold pulse-glow" />
        <span className="text-[10px] tracking-[0.25em] uppercase font-[var(--font-space-grotesk)]">
          {station.locationText}
        </span>
      </motion.div>
    </motion.div>
  );
}
