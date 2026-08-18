import React from 'react';
import Link from 'next/link';
import { LandingCarousel } from '@/components/LandingCarousel';
import { ArrowRight, Music, Radio, Volume2 } from 'lucide-react';

export const metadata = {
  title: 'Music Wala | Stream Non-Stop Lofi, Vintage Classics & Bhajans',
  description: 'Stream curated vintage Bollywood, lofi, morning bhajans, highway dhaba beats, and groom jams with zero audio ads.',
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen lg:h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#381f08] via-[#140b04] to-[#050508] text-white overflow-y-auto lg:overflow-hidden font-[var(--font-inter)] flex flex-col justify-between">
      
      {/* 🔮 Ambient Depth Glow Spots */}
      <div className="absolute top-[-20%] left-[-10%] w-[65vw] h-[65vw] rounded-full bg-[#D9A441]/10 blur-[170px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[65vw] h-[65vw] rounded-full bg-orange-600/10 blur-[170px] pointer-events-none z-0" />

      {/* 🚀 Header */}
      <header className="relative z-10 w-full max-w-full px-4 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 h-16 sm:h-20 2xl:h-24 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3.5">
          <div className="w-7 h-7 sm:w-9 sm:h-9 2xl:w-11 2xl:h-11 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/30 flex items-center justify-center text-[#D9A441] shadow-inner">
            <Radio className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 2xl:w-5.5 2xl:h-5.5" />
          </div>
          <span className="font-[var(--font-space-grotesk)] text-base sm:text-lg 2xl:text-2xl font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
            Music Wala
            <span className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full bg-[#D9A441] animate-pulse" />
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 xl:gap-12 2xl:gap-16 text-[11px] xl:text-xs 2xl:text-sm font-bold text-white/70 tracking-[0.15em] uppercase">
          <Link href="/about" className="hover:text-white transition-colors relative group py-1">
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D9A441] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors relative group py-1">
            Support
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D9A441] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors relative group py-1">
            Privacy
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D9A441] transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        <div>
          <Link 
            href="/radio" 
            className="flex items-center gap-1.5 sm:gap-2.5 px-3.5 py-1.5 sm:px-6 sm:py-2.5 2xl:px-8 2xl:py-3.5 rounded-full bg-gradient-to-r from-[#D9A441] to-[#f59e0b] text-[#0a0a0f] text-[9px] sm:text-[11px] 2xl:text-xs font-extrabold uppercase tracking-[0.12em] hover:shadow-xl hover:shadow-[#D9A441]/30 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Listen Live <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4" />
          </Link>
        </div>
      </header>

      {/* 🌟 Main Content Section */}
      <main className="relative z-10 w-full max-w-full px-4 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 xl:gap-16 2xl:gap-20 items-center py-4 lg:py-6 overflow-hidden">
        
        {/* Left Column: Bold Typography & Universal Text */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10 justify-center py-1 sm:py-2 max-h-full">
          <div className="flex items-center gap-2 px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/30 text-[9px] xl:text-[10px] 2xl:text-xs font-bold text-[#D9A441] uppercase tracking-[0.18em] mb-2.5 sm:mb-4 2xl:mb-6 shrink-0">
            <span className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full bg-[#D9A441]" /> Updated Daily
          </div>
          
          <h1 className="font-[var(--font-space-grotesk)] text-[22px] sm:text-[34px] md:text-[40px] lg:text-[46px] xl:text-[56px] 2xl:text-[68px] font-bold leading-[1.06] tracking-[-0.04em] text-white max-w-sm sm:max-w-lg xl:max-w-xl 2xl:max-w-2xl mb-2.5 sm:mb-4 2xl:mb-6 shrink-0">
            What people are listening to on Music Wala right now
          </h1>

          <p className="text-white/80 text-[11px] sm:text-xs md:text-sm xl:text-base 2xl:text-lg leading-relaxed max-w-xs sm:max-w-md xl:max-w-lg 2xl:max-w-xl mb-4 sm:mb-6 2xl:mb-8 shrink-0 font-normal">
            Your 24/7 radio destination. Stream non-stop Lofi, Vintage Classics, Morning Bhajans, Highway Dhaba Tunes & Grooming Beats with zero audio ads.
          </p>

          {/* Quick stats / Features list */}
          <div className="hidden lg:grid grid-cols-2 gap-4 2xl:gap-6 max-w-md xl:max-w-lg w-full shrink-0">
            <div className="p-3.5 2xl:p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center gap-3.5 2xl:gap-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
              <div className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-11 2xl:h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#D9A441] shrink-0">
                <Volume2 className="w-4 h-4 2xl:w-5.5 2xl:h-5.5" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-[0.1em] text-white">0% Audio Ads</h4>
                <p className="text-[9px] sm:text-[10px] 2xl:text-xs text-white/60 mt-0.5 leading-normal">Uninterrupted focus flow</p>
              </div>
            </div>
            <div className="p-3.5 2xl:p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center gap-3.5 2xl:gap-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05]">
              <div className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-11 2xl:h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#D9A441] shrink-0">
                <Music className="w-4 h-4 2xl:w-5.5 2xl:h-5.5" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs 2xl:text-sm font-bold uppercase tracking-[0.1em] text-white">Curated Edits</h4>
                <p className="text-[9px] sm:text-[10px] 2xl:text-xs text-white/60 mt-0.5 leading-normal">Selected vintage tracks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Cards Carousel */}
        <div className="lg:col-span-7 xl:col-span-7 w-full flex items-center justify-center z-10 overflow-visible mt-2 lg:mt-0">
          <LandingCarousel />
        </div>
      </main>

      {/* 📝 Footer Links */}
      <footer className="relative z-10 w-full max-w-full px-4 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 py-5 sm:py-7 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 text-[8px] sm:text-[9px] 2xl:text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 gap-3">
        <span>&copy; {new Date().getFullYear()} Music Wala. All rights reserved.</span>
        <div className="flex items-center gap-6 sm:gap-8 xl:gap-12">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </div>
      </footer>
    </div>
  );
}