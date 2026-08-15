'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdSenseBanner } from './AdSenseBanner';

interface InfoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  const [topAdStatus, setTopAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');
  const [bottomAdStatus, setBottomAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');

  return (
    <div 
      className="h-screen w-full relative overflow-y-auto overflow-x-hidden px-4 py-8 md:py-16 flex flex-col items-center justify-start gap-y-6 md:gap-y-8 select-text" 
      style={{ 
        background: 'radial-gradient(circle at center, #0f0f15 0%, #050508 100%)',
      }}
    >
      {/* Decorative blurred glow elements */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #D9A441 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Floating Back Button */}
      <div className="w-full max-w-3xl flex justify-start relative z-10 shrink-0">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs md:text-sm font-semibold tracking-wider text-white/70 hover:text-white hover:border-[#D9A441]/40 hover:bg-[#D9A441]/10 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#D9A441]" />
          BACK TO RADIO
        </Link>
      </div>


      {/* Main Glass Panel */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl rounded-[28px] p-6 md:p-10 relative z-10 shadow-2xl shadow-black/80 mb-10 shrink-0"
        style={{
          background: 'rgba(15, 15, 20, 0.65)',
          backdropFilter: 'blur(24px) saturate(120%)',
          WebkitBackdropFilter: 'blur(24px) saturate(120%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >

        {/* Header */}
        <header className="mb-8 pb-6 border-b border-white/10">
          <h1 className="font-[var(--font-space-grotesk)] text-2xl md:text-4xl font-extrabold tracking-wide text-white uppercase">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-[#D9A441] font-semibold tracking-[0.2em] uppercase mt-2">
              {subtitle}
            </p>
          )}
        </header>

        {/* AdSense Top Ad Slot Space */}
        <div className={`w-full overflow-hidden transition-all duration-300 ${
          topAdStatus === 'filled' 
            ? 'mb-8 opacity-100' 
            : topAdStatus === 'loading' 
              ? 'h-0 opacity-0' 
              : 'hidden'
        }`}>
          <AdSenseBanner adSlot="info-page-top" onStatusChange={setTopAdStatus} />
        </div>

        {/* Content Body */}
        <article className="info-page-prose">
          {children}
        </article>

        {/* AdSense Bottom Ad Slot Space */}
        <div className={`w-full overflow-hidden transition-all duration-300 ${
          bottomAdStatus === 'filled' 
            ? 'mt-10 opacity-100' 
            : bottomAdStatus === 'loading' 
              ? 'h-0 opacity-0' 
              : 'hidden'
        }`}>
          <AdSenseBanner adSlot="info-page-bottom" onStatusChange={setBottomAdStatus} />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} Music Wala. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </footer>
      </motion.main>
    </div>
  );
}
