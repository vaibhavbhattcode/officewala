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

  // Compact, balanced Portrait Sizing definitions to maintain generous top/bottom padding
  const containerHeightClass = isMobile 
    ? 'h-[320px]' 
    : isTablet 
      ? 'h-[340px]' 
      : isWide 
        ? 'h-[430px]' 
        : 'h-[370px]';

  const cardWidthClass = isMobile 
    ? 'w-[170px] h-[240px]' 
    : isTablet 
      ? 'w-[190px] h-[270px]' 
      : isWide 
        ? 'w-[250px] h-[340px]' 
        : 'w-[215px] h-[305px]';

  const coverHeightClass = isMobile 
    ? 'h-[165px]' 
    : isTablet 
      ? 'h-[190px]' 
      : isWide 
        ? 'h-[245px]' 
        : 'h-[215px]';

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
          className={`absolute left-0 sm:-left-4 2xl:-left-12 z-50 w-8 h-8 sm:w-9 sm:h-9 2xl:w-11 2xl:h-11 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
            isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-40 scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4 2xl:w-5 2xl:h-5 mr-0.5" />
        </button>

        {/* 👉 Right Navigation Arrow */}
        <button
          type="button"
          onClick={() => handleArrowClick('next')}
          aria-label="Next Song"
          className={`absolute right-0 sm:-right-4 2xl:-right-12 z-50 w-8 h-8 sm:w-9 sm:h-9 2xl:w-11 2xl:h-11 rounded-full bg-white/10 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
            isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-40 scale-95'
          }`}
        >
          <ChevronRight className="w-4 h-4 2xl:w-5 2xl:h-5 ml-0.5" />
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
                opacity = 0.45;
                scale = 0.8;
                rotateY = 20;
                translateX = -125;
                translateZ = 0;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.45;
                scale = 0.8;
                rotateY = -20;
                translateX = 125;
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
                translateX = -150;
                translateZ = 10;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.55;
                scale = 0.82;
                rotateY = -20;
                translateX = 150;
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
                translateX = -220;
                translateZ = 30;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.85;
                rotateY = -22;
                translateX = 220;
                translateZ = 30;
              } else if (diff === -2) {
                zIndex = 20;
                opacity = 0.2;
                scale = 0.7;
                rotateY = 32;
                translateX = -390;
                translateZ = -40;
              } else if (diff === 2) {
                zIndex = 20;
                opacity = 0.2;
                scale = 0.7;
                rotateY = -32;
                translateX = 390;
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
              // Standard Desktop / Laptop: Balanced Shazam Style 5-Card Layout
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
                translateX = -185;
                translateZ = 20;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.84;
                rotateY = -22;
                translateX = 185;
                translateZ = 20;
              } else if (diff === -2) {
                zIndex = 20;
                opacity = 0.15;
                scale = 0.68;
                rotateY = 32;
                translateX = -330;
                translateZ = -50;
              } else if (diff === 2) {
                zIndex = 20;
                opacity = 0.15;
                scale = 0.68;
                rotateY = -32;
                translateX = 330;
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
                  className="text-center mb-1.5 sm:mb-2 transition-all duration-300 max-w-[180px] sm:max-w-[220px]"
                  animate={{
                    opacity: isCenter && !isRedirecting ? 1 : 0.4,
                    y: isCenter ? 0 : 4,
                    scale: isCenter ? 1 : 0.88
                  }}
                >
                  <h3 className="text-white text-xs sm:text-base 2xl:text-lg font-bold tracking-tight leading-snug">
                    {item.category}
                  </h3>
                  <p className="text-white/60 text-[8px] sm:text-[10px] xl:text-xs mt-0.5 font-medium leading-tight line-clamp-1">
                    {item.tagline}
                  </p>
                </motion.div>

                {/* Shazam Style Portrait Glass Card */}
                <div 
                  className={`relative ${cardWidthClass} rounded-[22px] sm:rounded-[28px] overflow-hidden border bg-white/[0.05] backdrop-blur-xl shadow-2xl flex flex-col justify-between p-2.5 sm:p-3 transition-all duration-300`}
                  style={{
                    borderColor: isCenter ? `${item.accentColor}60` : 'rgba(255, 255, 255, 0.12)',
                    backgroundColor: isCenter ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    boxShadow: isCenter 
                      ? `0 25px 65px ${item.accentColor}35, inset 0 0 25px ${item.accentColor}15` 
                      : '0 15px 40px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Portrait Album Cover Image taking top 75% */}
                  <div className={`relative w-full ${coverHeightClass} rounded-[16px] sm:rounded-[20px] overflow-hidden bg-zinc-950 border border-white/10 ${
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
                      sizes="(max-width: 768px) 180px, 300px"
                      priority 
                    />
                    {isCenter && !isRedirecting && (
                      <div className="absolute inset-0 bg-black/35 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div 
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border border-white/40 flex items-center justify-center text-white scale-90 hover:scale-100 transition-transform shadow-xl"
                          style={{ backgroundColor: `${item.accentColor}60` }}
                        >
                          <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Shazam Bottom Card Info Bar */}
                  <div className="w-full mt-1.5 sm:mt-2 px-0.5 flex items-end justify-between">
                    <div className="flex flex-col justify-center min-w-0 pr-1.5">
                      <h4 className="text-[10px] sm:text-xs xl:text-sm font-black text-white tracking-wider uppercase truncate">
                        {item.title}
                      </h4>
                      <p className="text-[8px] sm:text-[10px] xl:text-xs font-semibold text-white/70 truncate mt-0.5">
                        {item.artist}
                      </p>
                    </div>

                    {/* Shazam Style Bottom Action Icon */}
                    <div 
                      className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center border border-white/20 shrink-0 text-white shadow-md transition-transform hover:scale-110"
                      style={{ backgroundColor: `${item.accentColor}30` }}
                    >
                      <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 🔘 Dots Pagination Bar */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8 z-40">
        {CAROUSEL_ITEMS.map((item) => {
          const isActive = item.id === centerIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCardClick(item.id)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'w-5 bg-[#38bdf8] shadow-sm shadow-[#38bdf8]/50' 
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to ${item.category}`}
            />
          );
        })}
      </div>
    </div>
  );
}