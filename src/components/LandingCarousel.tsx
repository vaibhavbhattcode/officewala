'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, ChevronLeft, ChevronRight, Radio } from 'lucide-react';

interface CarouselItem {
  id: number;
  slug: string;
  category: string;
  tagline: string;
  title: string;
  artist: string;
  cover: string;
  accentColor: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 0,
    slug: 'officewala',
    category: 'Focus & Code',
    tagline: 'Deep Lofi Beats to Stay in Flow',
    title: 'OFFICEWALA',
    artist: 'Study Flow Lofi',
    cover: '/landing/cover_lofi.jpg',
    accentColor: '#38bdf8', // Sky Cyan
  },
  {
    id: 1,
    slug: 'tapriwala',
    category: 'Chai Tapri Hits',
    tagline: 'Retro Classics & Vintage Melodies',
    title: 'TAPRIWALA',
    artist: 'MAHEBOOBA MAHEBOOBA',
    cover: '/landing/cover_bollywood.jpg',
    accentColor: '#f59e0b', // Amber Gold
  },
  {
    id: 2,
    slug: 'bhajanwala',
    category: 'Morning Devotional',
    tagline: 'Peaceful Bhajans & Spiritual Chants',
    title: 'BHAJANWALA',
    artist: 'Aigiri Nandini & Chants',
    cover: '/landing/cover_acoustic.jpg',
    accentColor: '#fb923c', // Saffron Gold
  },
  {
    id: 3,
    slug: 'loriwala',
    category: 'Highway Dhaba Jams',
    tagline: 'Long-Haul Truck Beats & Folk Tunes',
    title: 'LORIWALA',
    artist: 'Highway Dhaba Beats',
    cover: '/landing/cover_jazz.jpg',
    accentColor: '#ef4444', // Highway Crimson
  },
  {
    id: 4,
    slug: 'saloonwala',
    category: 'Saloon Grooming',
    tagline: 'Chill Lounge Pop & Grooming Vibes',
    title: 'SALOONWALA',
    artist: 'Warm Saloon Coffee',
    cover: '/landing/cover_midnight.jpg',
    accentColor: '#c084fc', // Grooming Violet
  },
  {
    id: 5,
    slug: 'partywala',
    category: 'Night Party Beats',
    tagline: 'High-Energy Synthwave & Remixes',
    title: 'PARTYWALA',
    artist: 'Terminal Neon Synth',
    cover: '/landing/cover_synthwave.jpg',
    accentColor: '#f43f5e', // Neon Pink
  },
];

export function LandingCarousel() {
  const router = useRouter();
  const [centerIndex, setCenterIndex] = useState(1); // Default center card is index 1
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectingCardId, setRedirectingCardId] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const introTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop' | 'wide'>('desktop');

  // Check width dynamically to adapt screen formats cleanly across mobile, laptop, desktop, and 2K/4K big screens
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setViewport('mobile');
      } else if (width < 1024) {
        setViewport('tablet');
      } else if (width < 1536) {
        setViewport('desktop');
      } else {
        setViewport('wide');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up auto cycle (5.5s delay)
  const rotateNext = () => {
    setCenterIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
  };

  const rotatePrev = () => {
    setCenterIndex((prev) => (prev - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
  };

  const startAutoCycle = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(rotateNext, 5500);
  };

  useEffect(() => {
    // ⚡ Fast Intro Spin
    let stepCount = 0;
    const maxSteps = 5;
    
    introTimerRef.current = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
      stepCount++;
      
      if (stepCount >= maxSteps) {
        if (introTimerRef.current) clearInterval(introTimerRef.current);
        introTimerRef.current = null;
        startAutoCycle();
      }
    }, 450);

    return () => {
      if (introTimerRef.current) clearInterval(introTimerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCardClick = (id: number) => {
    if (isRedirecting) return;
    
    if (introTimerRef.current) {
      clearInterval(introTimerRef.current);
      introTimerRef.current = null;
    }

    if (id === centerIndex) {
      triggerPortalRedirect(id);
    } else {
      setCenterIndex(id);
      startAutoCycle();
    }
  };

  const handleArrowClick = (direction: 'next' | 'prev') => {
    if (isRedirecting) return;

    if (introTimerRef.current) {
      clearInterval(introTimerRef.current);
      introTimerRef.current = null;
    }

    if (direction === 'next') {
      rotateNext();
    } else {
      rotatePrev();
    }
    startAutoCycle();
  };

  const triggerPortalRedirect = (cardId: number) => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    setRedirectingCardId(cardId);
    
    if (introTimerRef.current) clearInterval(introTimerRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    const selectedItem = CAROUSEL_ITEMS.find((c) => c.id === cardId) || CAROUSEL_ITEMS[0];

    setTimeout(() => {
      router.push(`/radio?station=${selectedItem.slug}`);
    }, 1200);
  };

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const isWide = viewport === 'wide';

  // Shazam-matched Portrait Sizing definitions
  const containerHeightClass = isMobile 
    ? 'h-[360px]' 
    : isTablet 
      ? 'h-[400px]' 
      : isWide 
        ? 'h-[480px]' 
        : 'h-[440px]';

  const cardWidthClass = isMobile 
    ? 'w-[200px] h-[280px]' 
    : isTablet 
      ? 'w-[220px] h-[320px]' 
      : isWide 
        ? 'w-[300px] h-[400px]' 
        : 'w-[260px] h-[360px]';

  const coverHeightClass = isMobile 
    ? 'h-[200px]' 
    : isTablet 
      ? 'h-[230px]' 
      : isWide 
        ? 'h-[290px]' 
        : 'h-[260px]';

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 🎡 3D Carousel Viewport (Shazam Portrait Card Layout) */}
      <div 
        className={`relative w-full ${containerHeightClass} flex items-center justify-center overflow-visible select-none [perspective:1200px]`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 👈 Left Navigation Arrow */}
        <button
          type="button"
          onClick={() => handleArrowClick('prev')}
          aria-label="Previous Song"
          className={`absolute left-0 sm:-left-4 2xl:-left-12 z-50 w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
            isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-40 scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5 2xl:w-6 2xl:h-6 mr-0.5" />
        </button>

        {/* 👉 Right Navigation Arrow */}
        <button
          type="button"
          onClick={() => handleArrowClick('next')}
          aria-label="Next Song"
          className={`absolute right-0 sm:-right-4 2xl:-right-12 z-50 w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
            isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-40 scale-95'
          }`}
        >
          <ChevronRight className="w-5 h-5 2xl:w-6 2xl:h-6 ml-0.5" />
        </button>

        <AnimatePresence mode="popLayout">
          {CAROUSEL_ITEMS.map((item) => {
            let diff = item.id - centerIndex;
            const len = CAROUSEL_ITEMS.length;

            if (diff < -3) diff += len;
            if (diff > 2) diff -= len;

            const isCenter = diff === 0;
            const isZoomed = isRedirecting && redirectingCardId === item.id;

            let zIndex = 10;
            let opacity = 0;
            let scale = 0.5;
            let rotateY = 0;
            let translateX = 0;
            let translateZ = 0;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (isMobile) {
              // Mobile View
              if (isCenter) {
                zIndex = 40;
                opacity = 1;
                scale = 1;
                rotateY = 0;
                translateX = 0;
                translateZ = 50;
              } else if (diff === -1) {
                zIndex = 30;
                opacity = 0.5;
                scale = 0.82;
                rotateY = 22;
                translateX = -140;
                translateZ = 0;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.5;
                scale = 0.82;
                rotateY = -22;
                translateX = 140;
                translateZ = 0;
              } else {
                zIndex = 10;
                opacity = 0;
                scale = 0.5;
                rotateY = 0;
                translateX = 0;
                translateZ = -100;
                pointerEvents = 'none';
              }
            } else if (isTablet) {
              // Tablet View
              if (isCenter) {
                zIndex = 40;
                opacity = 1;
                scale = 1;
                rotateY = 0;
                translateX = 0;
                translateZ = 80;
              } else if (diff === -1) {
                zIndex = 30;
                opacity = 0.55;
                scale = 0.82;
                rotateY = 20;
                translateX = -170;
                translateZ = 10;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.55;
                scale = 0.82;
                rotateY = -20;
                translateX = 170;
                translateZ = 10;
              } else {
                zIndex = 10;
                opacity = 0;
                scale = 0.5;
                rotateY = 0;
                translateX = 0;
                translateZ = -100;
                pointerEvents = 'none';
              }
            } else if (isWide) {
              // Big Monitors (>= 1536px / 2K / 4K): Shazam Style 5-Card Spread
              if (isCenter) {
                zIndex = 40;
                opacity = 1;
                scale = 1;
                rotateY = 0;
                translateX = 0;
                translateZ = 120;
              } else if (diff === -1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.85;
                rotateY = 22;
                translateX = -260;
                translateZ = 30;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.85;
                rotateY = -22;
                translateX = 260;
                translateZ = 30;
              } else if (diff === -2) {
                zIndex = 20;
                opacity = 0.25;
                scale = 0.7;
                rotateY = 32;
                translateX = -460;
                translateZ = -40;
              } else if (diff === 2) {
                zIndex = 20;
                opacity = 0.25;
                scale = 0.7;
                rotateY = -32;
                translateX = 460;
                translateZ = -40;
              } else {
                zIndex = 10;
                opacity = 0;
                scale = 0.5;
                rotateY = 0;
                translateX = 0;
                translateZ = -200;
                pointerEvents = 'none';
              }
            } else {
              // Standard Desktop / Laptop: Shazam Style 5-Card Layout
              if (isCenter) {
                zIndex = 40;
                opacity = 1;
                scale = 1;
                rotateY = 0;
                translateX = 0;
                translateZ = 100;
              } else if (diff === -1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.84;
                rotateY = 22;
                translateX = -220;
                translateZ = 20;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.84;
                rotateY = -22;
                translateX = 220;
                translateZ = 20;
              } else if (diff === -2) {
                zIndex = 20;
                opacity = 0.2;
                scale = 0.68;
                rotateY = 32;
                translateX = -380;
                translateZ = -50;
              } else if (diff === 2) {
                zIndex = 20;
                opacity = 0.2;
                scale = 0.68;
                rotateY = -32;
                translateX = 380;
                translateZ = -50;
              } else {
                zIndex = 10;
                opacity = 0;
                scale = 0.5;
                rotateY = 0;
                translateX = 0;
                translateZ = -200;
                pointerEvents = 'none';
              }
            }

            return (
              <motion.div
                key={item.id}
                className={`absolute flex flex-col items-center cursor-pointer`}
                style={{
                  zIndex: isZoomed ? 99 : zIndex,
                  transformStyle: 'preserve-3d',
                  pointerEvents,
                }}
                animate={{
                  x: isZoomed ? 0 : translateX,
                  scale: isZoomed ? 2.2 : scale,
                  rotateY: isZoomed ? 0 : rotateY,
                  opacity: isZoomed ? 1 : opacity,
                  z: isZoomed ? 200 : translateZ,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 24,
                  opacity: { duration: 0.35 }
                }}
                onClick={() => handleCardClick(item.id)}
              >
                {/* Category label ABOVE card (Shazam Style) */}
                <motion.div 
                  className="text-center mb-2.5 sm:mb-3.5 transition-all duration-300 max-w-[220px] sm:max-w-[260px]"
                  animate={{
                    opacity: isCenter && !isRedirecting ? 1 : 0.45,
                    y: isCenter ? 0 : 6,
                    scale: isCenter ? 1 : 0.88
                  }}
                >
                  <h3 className="text-white text-sm sm:text-lg 2xl:text-xl font-bold tracking-tight leading-snug">
                    {item.category}
                  </h3>
                  <p className="text-white/60 text-[9px] sm:text-xs mt-0.5 font-medium leading-tight line-clamp-1">
                    {item.tagline}
                  </p>
                </motion.div>

                {/* Shazam Style Portrait Glass Card */}
                <div 
                  className={`relative ${cardWidthClass} rounded-[28px] sm:rounded-[36px] overflow-hidden border bg-white/[0.05] backdrop-blur-xl shadow-2xl flex flex-col justify-between p-3 sm:p-4 transition-all duration-300`}
                  style={{
                    borderColor: isCenter ? `${item.accentColor}60` : 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: isCenter ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    boxShadow: isCenter 
                      ? `0 30px 80px ${item.accentColor}35, inset 0 0 30px ${item.accentColor}15` 
                      : '0 20px 50px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Portrait Album Cover Image taking top 75% */}
                  <div className={`relative w-full ${coverHeightClass} rounded-[20px] sm:rounded-[26px] overflow-hidden bg-zinc-950 border border-white/10 ${
                    isZoomed ? 'animate-spin' : ''
                  }`}
                  style={{
                    animationDuration: isZoomed ? '1.5s' : '0s',
                  }}
                  >
                    <Image 
                      src={item.cover} 
                      alt={item.title} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 220px, 340px"
                      priority 
                    />
                    {isCenter && !isRedirecting && (
                      <div className="absolute inset-0 bg-black/35 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div 
                          className="w-11 h-11 sm:w-13 sm:h-13 rounded-full backdrop-blur-md border border-white/40 flex items-center justify-center text-white scale-90 hover:scale-100 transition-transform shadow-xl"
                          style={{ backgroundColor: `${item.accentColor}60` }}
                        >
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shazam Bottom Card Info Bar */}
                  <div className="w-full mt-2 sm:mt-3 px-1 flex items-end justify-between">
                    <div className="flex flex-col justify-center min-w-0 pr-2">
                      <h4 className="text-xs sm:text-base font-black text-white tracking-wider uppercase truncate">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs font-semibold text-white/70 truncate mt-0.5">
                        {item.artist}
                      </p>
                    </div>

                    {/* Shazam Style Bottom Action Icon */}
                    <div 
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border border-white/20 shrink-0 text-white shadow-md transition-transform hover:scale-110"
                      style={{ backgroundColor: `${item.accentColor}30` }}
                    >
                      <Radio className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 🔘 Dots Pagination Bar (Shazam Mobile Style) */}
      <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3 z-40">
        {CAROUSEL_ITEMS.map((item) => {
          const isActive = item.id === centerIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCardClick(item.id)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-6 bg-[#38bdf8] shadow-sm shadow-[#38bdf8]/50' 
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to ${item.category}`}
            />
          );
        })}
      </div>
    </div>
  );
}