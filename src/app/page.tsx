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
    <div className="relative min-h-screen lg:h-screen w-full bg-gradient-to-br from-[#1e3b45] via-[#0f232b] to-[#061014] text-white overflow-y-auto lg:overflow-hidden font-[var(--font-inter)] flex flex-col justify-between">
      
      {/* 🔮 Ambient Depth Glow Spots */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#38bdf8]/10 blur-[170px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-600/10 blur-[170px] pointer-events-none z-0" />

      {/* 🚀 Header */}
      <header className="relative z-10 w-full max-w-full px-4 sm:px-10 lg:px-14 xl:px-16 2xl:px-20 h-14 sm:h-16 2xl:h-20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-7 h-7 sm:w-9 sm:h-9 2xl:w-10 2xl:h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-md backdrop-blur-md">
            <Radio className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 2xl:w-5 2xl:h-5 text-[#38bdf8]" />
          </div>
          <span className="font-[var(--font-space-grotesk)] text-base sm:text-lg 2xl:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
            Music Wala
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 xl:gap-12 2xl:gap-16 text-[11px] xl:text-xs 2xl:text-sm font-bold text-white/70 tracking-[0.15em] uppercase">
          <Link href="/about" className="hover:text-white transition-colors relative group py-1">
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#38bdf8] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors relative group py-1">
            Support
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#38bdf8] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors relative group py-1">
            Privacy
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#38bdf8] transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        <div>
          <Link 
            href="/radio" 
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2 2xl:px-6 2xl:py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
          >
            Connect Player <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
          </Link>
        </div>
      </header>

      {/* 🌟 Main Content Section */}
      <main className="relative z-10 w-full max-w-full px-4 sm:px-10 lg:px-14 xl:px-16 2xl:px-20 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center py-2 lg:py-3 overflow-hidden">
        
        {/* Left Column: Bold Shazam Hero Typography */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-10 justify-center py-1 max-h-full">
          <div className="flex items-center gap-2 px-3 py-0.5 2xl:px-3.5 2xl:py-1 rounded-full bg-white/10 border border-white/20 text-[9px] xl:text-[10px] font-bold text-white uppercase tracking-[0.18em] mb-2 shrink-0 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" /> Updated Weekly
          </div>
          
          <h1 className="font-[var(--font-space-grotesk)] text-[22px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] 2xl:text-[54px] font-bold leading-[1.08] tracking-[-0.03em] text-white max-w-sm sm:max-w-md xl:max-w-lg 2xl:max-w-xl mb-2 sm:mb-3 shrink-0">
            What people are finding with Music Wala right now
          </h1>

          <p className="text-white/70 text-[11px] sm:text-xs xl:text-sm 2xl:text-base leading-relaxed max-w-xs sm:max-w-md xl:max-w-lg mb-4 xl:mb-5 shrink-0 font-normal">
            Stream non-stop Lofi, Vintage Classics, Morning Bhajans, Highway Dhaba Tunes & Grooming Beats with 0% audio ads.
          </p>

          {/* Feature Badges */}
          <div className="hidden lg:grid grid-cols-2 gap-3 xl:gap-4 max-w-md xl:max-w-lg w-full shrink-0">
            <div className="p-3 2xl:p-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
              <div className="w-8 h-8 2xl:w-9.5 2xl:h-9.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#38bdf8] shrink-0">
                <Volume2 className="w-4 h-4 2xl:w-5 2xl:h-5" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-white">0% Audio Ads</h4>
                <p className="text-[9px] sm:text-[10px] text-white/60 mt-0.5 leading-normal">Uninterrupted focus flow</p>
              </div>
            </div>
            <div className="p-3 2xl:p-3.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3 transition-all duration-300 hover:border-white/20 hover:bg-white/10">
              <div className="w-8 h-8 2xl:w-9.5 2xl:h-9.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#38bdf8] shrink-0">
                <Music className="w-4 h-4 2xl:w-5 2xl:h-5" />
              </div>
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-white">Curated Edits</h4>
                <p className="text-[9px] sm:text-[10px] text-white/60 mt-0.5 leading-normal">Selected vintage tracks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Shazam Style Portrait 3D Cards Carousel */}
        <div className="lg:col-span-7 xl:col-span-7 w-full flex items-center justify-center z-10 overflow-visible">
          <LandingCarousel />
        </div>
      </main>

      {/* 📝 Footer Links */}
      <footer className="relative z-10 w-full max-w-full px-4 sm:px-10 lg:px-14 xl:px-16 2xl:px-20 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 text-[8px] sm:text-[9px] 2xl:text-[10px] text-white/50 uppercase tracking-[0.2em] shrink-0 gap-2">
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