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
  accentColor: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    id: 0,
    category: 'Officewala',
    tagline: 'Deep focus beats & workspace flow',
    title: 'Study Flow Lofi',
    artist: 'Officewala Stream',
    cover: '/landing/cover_lofi.jpg',
    accentColor: '#38bdf8', // Sky Cyan
  },
  {
    id: 1,
    category: 'Tapriwala',
    tagline: 'Chai tapri classic melodies & vintage tunes',
    title: 'MAHEBOOBA MAHEBOOBA',
    artist: 'Tapriwala Classics',
    cover: '/landing/cover_bollywood.jpg',
    accentColor: '#f59e0b', // Amber Gold
  },
  {
    id: 2,
    category: 'Bhajanwala',
    tagline: 'Peaceful morning bhajans & spiritual vibes',
    title: 'Aigiri Nandini & Chants',
    artist: 'Bhajanwala Devotional',
    cover: '/landing/cover_acoustic.jpg',
    accentColor: '#fb923c', // Saffron Gold
  },
  {
    id: 3,
    category: 'Loriwala',
    tagline: 'Highway dhaba beats & long-haul truck tunes',
    title: 'Highway Dhaba Beats',
    artist: 'Loriwala Truck Drivers',
    cover: '/landing/cover_jazz.jpg',
    accentColor: '#ef4444', // Highway Crimson
  },
  {
    id: 4,
    category: 'Saloonwala',
    tagline: 'Trendy saloon grooming jams & chill hits',
    title: 'Warm Saloon Coffee',
    artist: 'Saloonwala Vibes',
    cover: '/landing/cover_midnight.jpg',
    accentColor: '#c084fc', // Grooming Violet
  },
  {
    id: 5,
    category: 'Partywala',
    tagline: 'High-energy synthwave & night mood beats',
    title: 'Terminal Neon Synth',
    artist: 'Partywala Night',
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

    setTimeout(() => {
      router.push('/radio');
    }, 1200);
  };

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const isWide = viewport === 'wide';

  // Sizing definitions for Carousel layout across viewports
  const containerHeightClass = isMobile 
    ? 'h-[250px]' 
    : isTablet 
      ? 'h-[300px]' 
      : isWide 
        ? 'h-[430px]' 
        : 'h-[360px]';

  const cardWidthClass = isMobile 
    ? 'w-[180px] h-[180px]' 
    : isTablet 
      ? 'w-[190px] h-[190px]' 
      : isWide 
        ? 'w-[280px] h-[280px]' 
        : 'w-[230px] h-[230px]';

  const coverHeightClass = isMobile 
    ? 'h-[115px]' 
    : isTablet 
      ? 'h-[120px]' 
      : isWide 
        ? 'h-[190px]' 
        : 'h-[155px]';

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* 🎡 3D Carousel Viewport */}
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
          className={`absolute left-0 sm:-left-4 2xl:-left-12 z-50 w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-black border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
            isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-40 scale-95'
          }`}
        >
          <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6 mr-0.5" />
        </button>

        {/* 👉 Right Navigation Arrow */}
        <button
          type="button"
          onClick={() => handleArrowClick('next')}
          aria-label="Next Song"
          className={`absolute right-0 sm:-right-4 2xl:-right-12 z-50 w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full bg-white/5 hover:bg-[#D9A441] hover:text-black border border-white/10 flex items-center justify-center text-white/80 transition-all duration-300 backdrop-blur-md shadow-lg outline-none focus:outline-none ${
            isHovered && !isRedirecting ? 'opacity-100 scale-100' : 'opacity-0 sm:opacity-40 scale-95'
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
              // Mobile View: Larger cards (220px) with wide 3D perspective spread like Web
              if (isCenter) {
                zIndex = 40;
                opacity = 1;
                scale = 1;
                rotateY = 0;
                translateX = 0;
                translateZ = 60;
              } else if (diff === -1) {
                zIndex = 30;
                opacity = 0.55;
                scale = 0.82;
                rotateY = 22;
                translateX = -145;
                translateZ = 10;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.55;
                scale = 0.82;
                rotateY = -22;
                translateX = 145;
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
            } else if (isTablet) {
              // Tablet: 3 cards
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
                translateX = -135;
                translateZ = 10;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.55;
                scale = 0.78;
                rotateY = -18;
                translateX = 135;
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
              // Big Monitors (>= 1536px / 2K / 4K): Full-width 5-card 3D cover flow
              if (isCenter) {
                zIndex = 40;
                opacity = 1;
                scale = 1;
                rotateY = 0;
                translateX = 0;
                translateZ = 130;
              } else if (diff === -1) {
                zIndex = 30;
                opacity = 0.7;
                scale = 0.85;
                rotateY = 18;
                translateX = -250;
                translateZ = 30;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.7;
                scale = 0.85;
                rotateY = -18;
                translateX = 250;
                translateZ = 30;
              } else if (diff === -2) {
                zIndex = 20;
                opacity = 0.25;
                scale = 0.7;
                rotateY = 30;
                translateX = -450;
                translateZ = -40;
              } else if (diff === 2) {
                zIndex = 20;
                opacity = 0.25;
                scale = 0.7;
                rotateY = -30;
                translateX = 450;
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
              // Standard Desktop / Laptop: Full-width 5-card layout
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
                translateX = -200;
                translateZ = 20;
              } else if (diff === 1) {
                zIndex = 30;
                opacity = 0.65;
                scale = 0.82;
                rotateY = -20;
                translateX = 200;
                translateZ = 20;
              } else if (diff === -2) {
                zIndex = 20;
                opacity = 0.2;
                scale = 0.66;
                rotateY = 32;
                translateX = -360;
                translateZ = -50;
              } else if (diff === 2) {
                zIndex = 20;
                opacity = 0.2;
                scale = 0.66;
                rotateY = -32;
                translateX = 360;
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
                {/* Category label above card with custom theme colors */}
                <motion.div 
                  className="text-center mb-2.5 sm:mb-4 transition-all duration-300"
                  animate={{
                    opacity: isCenter && !isRedirecting ? 1 : 0,
                    y: isCenter ? 0 : 8,
                    scale: isCenter ? 1 : 0.85
                  }}
                >
                  <div 
                    className="px-3 py-0.5 rounded-full border inline-block"
                    style={{
                      backgroundColor: `${item.accentColor}15`,
                      borderColor: `${item.accentColor}40`,
                    }}
                  >
                    <h4 
                      className="text-[9px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-[0.18em]"
                      style={{ color: item.accentColor }}
                    >
                      {item.category}
                    </h4>
                  </div>
                  <p className="text-white/60 text-[8px] sm:text-[10px] 2xl:text-xs mt-1 font-semibold">{item.tagline}</p>
                </motion.div>

                {/* Card Container with custom dynamic color glow on center */}
                <div 
                  className={`relative ${cardWidthClass} rounded-[22px] 2xl:rounded-[28px] overflow-hidden border bg-white/[0.02] backdrop-blur-md shadow-2xl flex flex-col items-center justify-center p-2.5 sm:p-3 2xl:p-4 transition-all duration-300`}
                  style={{
                    borderColor: isCenter ? `${item.accentColor}50` : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: isCenter ? `${item.accentColor}08` : 'rgba(255, 255, 255, 0.02)',
                    boxShadow: isCenter 
                      ? `0 20px 60px ${item.accentColor}30, inset 0 0 20px ${item.accentColor}10` 
                      : '0 20px 40px rgba(0,0,0,0.45)',
                  }}
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
                      sizes="(max-width: 768px) 180px, 320px"
                      priority 
                    />
                    {isCenter && !isRedirecting && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div 
                          className="w-[34px] h-[34px] sm:w-[42px] sm:h-[42px] 2xl:w-[50px] 2xl:h-[50px] rounded-full backdrop-blur-md border border-white/40 flex items-center justify-center text-white scale-90 hover:scale-100 transition-transform shadow-lg"
                          style={{ backgroundColor: `${item.accentColor}40` }}
                        >
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
                      <Music className="w-1.5 h-1.5 sm:w-2 sm:h-2 2xl:w-3 2xl:h-3" style={{ color: item.accentColor }} /> {item.artist}
                    </p>
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
                  ? 'w-6 bg-[#D9A441] shadow-sm shadow-[#D9A441]/50' 
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