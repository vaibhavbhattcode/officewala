'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  category: string;
  tagline: string;
  title: string;
  artist: string;
  cover: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 0,
    category: 'Retro Bollywood',
    tagline: 'Classic melodies, vintage vibes',
    title: 'MAHEBOOBA MAHEBOOBA',
    artist: 'SHOLAY',
    cover: '/landing/cover_bollywood.jpg',
  },
  {
    id: 1,
    category: 'Lofi Study & Focus',
    tagline: 'Chill beats to stay focused',
    title: 'Study Flow Lofi',
    artist: 'Music Wala Special',
    cover: '/landing/cover_lofi.jpg',
  },
  {
    id: 2,
    category: 'Acoustic Sunset',
    tagline: 'Soft strums to unwind',
    title: 'Acoustic Chill Beats',
    artist: 'Geet & Acoustic',
    cover: '/landing/cover_acoustic.jpg',
  },
  {
    id: 3,
    category: 'Rainy Jazz Lounge',
    tagline: 'Rainy night ambient piano',
    title: 'Midnight Piano Jazz',
    artist: 'Coffee Shop Sessions',
    cover: '/landing/cover_jazz.jpg',
  },
  {
    id: 4,
    category: 'Coding Flow',
    tagline: 'Neon synth beats for coding',
    title: 'Terminal Synthwave',
    artist: 'Geek Code flow',
    cover: '/landing/cover_synthwave.jpg',
  },
  {
    id: 5,
    category: 'Cozy Midnight Coffee',
    tagline: 'Cozy guitar and warm coffee',
    title: 'Warm Neon Coffee',
    artist: 'Late Night Acoustic',
    cover: '/landing/cover_midnight.jpg',
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

    setTimeout(() => {
      router.push('/radio');
    }, 1200);
  };

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const isWide = viewport === 'wide';

  // Sizing definitions for Carousel layout across viewports
  const containerHeightClass = isMobile 
    ? 'h-[280px]' 
    : isTablet 
      ? 'h-[340px]' 
      : isWide 
        ? 'h-[460px]' 
        : 'h-[400px]';

  const cardWidthClass = isMobile 
    ? 'w-[150px] h-[150px]' 
    : isTablet 
      ? 'w-[190px] h-[190px]' 
      : isWide 
        ? 'w-[280px] h-[280px]' 
        : 'w-[230px] h-[230px]';

  const coverHeightClass = isMobile 
    ? 'h-[90px]' 
    : isTablet 
      ? 'h-[120px]' 
      : isWide 
        ? 'h-[190px]' 
        : 'h-[155px]';

  return (
    <div 
      className={`relative w-full ${containerHeightClass} flex items-center justify-center overflow-visible select-none [perspective:1000px] sm:[perspective:1400px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 👈 Left Navigation Arrow */}
      <button
        type="button"
        onClick={() => handleArrowClick('prev')}
        aria-label="Previous Song"
        className={`absolute left-0 sm:-left-6 2xl:-left-10 z-50 w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-black border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
          isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 mr-0.5" />
      </button>

      {/* 👉 Right Navigation Arrow */}
      <button
        type="button"
        onClick={() => handleArrowClick('next')}
        aria-label="Next Song"
        className={`absolute right-0 sm:-right-6 2xl:-right-10 z-50 w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-black border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
          isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 ml-0.5" />
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
            // Mobile: 3 cards
            if (isCenter) {
              zIndex = 40;
              opacity = 1;
              scale = 0.95;
              rotateY = 0;
              translateX = 0;
              translateZ = 50;
            } else if (diff === -1) {
              zIndex = 30;
              opacity = 0.4;
              scale = 0.76;
              rotateY = 16;
              translateX = -95;
              translateZ = 0;
            } else if (diff === 1) {
              zIndex = 30;
              opacity = 0.4;
              scale = 0.76;
              rotateY = -16;
              translateX = 95;
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
            // Tablet: 3 cards spaced slightly wider
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
              scale = 0.78;
              rotateY = 18;
              translateX = -130;
              translateZ = 10;
            } else if (diff === 1) {
              zIndex = 30;
              opacity = 0.55;
              scale = 0.78;
              rotateY = -18;
              translateX = 130;
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
            // Big Monitors (>= 1536px / 2K / 4K): Expanded 5-card 3D cover flow
            if (isCenter) {
              zIndex = 40;
              opacity = 1;
              scale = 1;
              rotateY = 0;
              translateX = 0;
              translateZ = 120;
            } else if (diff === -1) {
              zIndex = 30;
              opacity = 0.7;
              scale = 0.85;
              rotateY = 18;
              translateX = -230;
              translateZ = 30;
            } else if (diff === 1) {
              zIndex = 30;
              opacity = 0.7;
              scale = 0.85;
              rotateY = -18;
              translateX = 230;
              translateZ = 30;
            } else if (diff === -2) {
              zIndex = 20;
              opacity = 0.25;
              scale = 0.7;
              rotateY = 30;
              translateX = -410;
              translateZ = -40;
            } else if (diff === 2) {
              zIndex = 20;
              opacity = 0.25;
              scale = 0.7;
              rotateY = -30;
              translateX = 410;
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
            // Standard Desktop / Laptop: Balanced 5-card layout
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
              scale = 0.82;
              rotateY = 20;
              translateX = -180;
              translateZ = 20;
            } else if (diff === 1) {
              zIndex = 30;
              opacity = 0.65;
              scale = 0.82;
              rotateY = -20;
              translateX = 180;
              translateZ = 20;
            } else if (diff === -2) {
              zIndex = 20;
              opacity = 0.2;
              scale = 0.66;
              rotateY = 32;
              translateX = -310;
              translateZ = -50;
            } else if (diff === 2) {
              zIndex = 20;
              opacity = 0.2;
              scale = 0.66;
              rotateY = -32;
              translateX = 310;
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
                scale: isZoomed ? 2.5 : scale,
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
              <motion.div 
                className="text-center mb-2.5 sm:mb-4 transition-all duration-300"
                animate={{
                  opacity: isCenter && !isRedirecting ? 1 : 0,
                  y: isCenter ? 0 : 8,
                  scale: isCenter ? 1 : 0.85
                }}
              >
                <h4 className="text-[#D9A441] text-[9px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-[0.18em]">{item.category}</h4>
                <p className="text-white/60 text-[8px] sm:text-[10px] 2xl:text-xs mt-0.5 font-semibold">{item.tagline}</p>
              </motion.div>

              <div 
                className={`relative ${cardWidthClass} rounded-[22px] 2xl:rounded-[28px] overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-2.5 sm:p-3 2xl:p-4 transition-transform duration-300 ${
                  isCenter 
                    ? 'shadow-black/75 hover:shadow-black/90 hover:scale-[1.02] border-white/[0.14] bg-white/[0.03]' 
                    : 'shadow-black/45'
                }`}
              >
                <div className={`relative w-full ${coverHeightClass} rounded-[14px] 2xl:rounded-[18px] overflow-hidden bg-zinc-950 border border-white/5 ${
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
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] 2xl:w-[50px] 2xl:h-[50px] rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-90 hover:scale-100 transition-transform shadow-lg shadow-black/25">
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full mt-2 sm:mt-2.5 2xl:mt-3 px-0.5 text-left flex flex-col justify-center">
                  <h5 className="text-[9px] sm:text-xs 2xl:text-sm font-bold text-white tracking-tight truncate m-0">
                    {item.title}
                  </h5>
                  <p className="text-[8px] sm:text-[10px] 2xl:text-xs font-medium text-white/50 leading-relaxed mt-0.5 truncate m-0 flex items-center gap-1">
                    <Music className="w-1.5 h-1.5 sm:w-2 sm:h-2 2xl:w-3 2xl:h-3 text-[#D9A441]" /> {item.artist}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}