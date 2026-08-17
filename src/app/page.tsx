import React from 'react';
import Link from 'next/link';
import { LandingCarousel } from '@/components/LandingCarousel';
import { ArrowRight, Music, Radio, Volume2 } from 'lucide-react';

export const metadata = {
  title: 'Music Wala | Discover Your Workspace Flow',
  description: 'Stream curated vintage Bollywood, lofi, and focus acoustic tunes with zero audio ads. Connect with colleagues in real-time.',
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen lg:h-screen w-full bg-[#050508] text-white overflow-y-auto lg:overflow-hidden font-[var(--font-inter)] flex flex-col justify-between">
      
      {/* 🔮 Ambient Depth Glow Spots */}
      <div className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full bg-[#D9A441]/8 blur-[160px] pointer-events-none z-0" />
      <div className="absolute bottom-[-25%] right-[-15%] w-[65vw] h-[65vw] rounded-full bg-violet-600/8 blur-[160px] pointer-events-none z-0" />

      {/* 🚀 Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-12 h-16 sm:h-20 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#D9A441]/10 border border-[#D9A441]/20 flex items-center justify-center text-[#D9A441] shadow-inner">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="font-[var(--font-space-grotesk)] text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
            Music Wala
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441] animate-pulse" />
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-[11px] font-bold text-white/60 tracking-[0.15em] uppercase">
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
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#D9A441] to-[#eebc5e] text-[#0a0a0f] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.12em] hover:shadow-lg hover:shadow-[#D9A441]/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Listen Live <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* 🌟 Main Content Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-4 lg:py-6">
        
        {/* Left Column: Bold Typography & Taglines */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left z-10 pr-0 lg:pr-6 justify-center py-1 sm:py-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/10 border border-[#D9A441]/20 text-[9px] font-bold text-[#D9A441] uppercase tracking-[0.18em] mb-3 sm:mb-4 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]" /> Updated Daily
          </div>
          
          <h1 className="font-[var(--font-space-grotesk)] text-[22px] sm:text-[34px] md:text-[38px] lg:text-[44px] xl:text-[50px] font-bold leading-[1.08] tracking-[-0.04em] text-white max-w-lg mb-3 shrink-0">
            What developers are finding with Music Wala right now
          </h1>

          <p className="text-white/70 text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-md mb-6 shrink-0 font-normal">
            Your premium workspace radio stream. Tap into retro Bollywood melodies, lo-fi focus beats, and acoustic chill edits designed to keep you in the zone all day.
          </p>

          {/* Quick stats / Features list (Hidden on Mobile & Tablet to prevent stack overflow) */}
          <div className="hidden lg:grid grid-cols-2 gap-4 max-w-md w-full shrink-0">
            <div className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3 transition-all duration-300 hover:border-white/[0.1]">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#D9A441] shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">0% Audio Ads</h4>
                <p className="text-[9px] text-white/50 mt-0.5 leading-normal">Uninterrupted focus flow</p>
              </div>
            </div>
            <div className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.01] flex items-center gap-3 transition-all duration-300 hover:border-white/[0.1]">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-[#D9A441] shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-white">Curated Edits</h4>
                <p className="text-[9px] text-white/50 mt-0.5 leading-normal">Selected vintage tracks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Cards Carousel */}
        <div className="lg:col-span-6 w-full flex items-center justify-center z-10 overflow-visible mt-2 lg:mt-0">
          <LandingCarousel />
        </div>
      </main>

      {/* 📝 Footer Links */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-12 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between border-t border-white/[0.05] text-[8px] sm:text-[9px] text-white/40 uppercase tracking-[0.2em] shrink-0 gap-3">
        <span>&copy; {new Date().getFullYear()} Music Wala. All rights reserved.</span>
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </div>
      </footer>
    </div>
  );
}