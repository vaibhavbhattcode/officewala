import React from 'react';
import { InfoPageLayout } from '@/components/InfoPageLayout';
import { Radio, Heart, Sparkles, Flame } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: 'Learn more about Music Wala, your premium workspace radio station.',
};

export default function AboutPage() {
  return (
    <InfoPageLayout title="About Us" subtitle="Play • Chill • Connect">
      <div className="space-y-6 text-white/90">
        <p className="text-base md:text-lg text-white/95 font-medium leading-relaxed">
          Welcome to <strong className="text-[#D9A441]">Music Wala</strong>, the ultimate workspace radio designed specifically for developers, designers, writers, and creative professionals who need a perfect soundscape to fuel their workday.
        </p>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#D9A441]" /> Our Concept
          </h2>
          <p>
            We believe that a productive day is built on good focus, structured breaks, and an inspiring flow state. Music Wala streams a continuous flow of vintage Bollywood melodies, retro lofi edits, and chill acoustic tunes. We focus on low-intensity, non-distracting tracks that stimulate creative output while keeping you grounded.
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#D9A441]" /> Key Features
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Premium EQ Audio Engine:</strong> Customize your sound on the fly with presets like <em>Bass Boost</em>, <em>Vocal Focus</em>, and <em>Studio HD</em>.
            </li>
            <li>
              <strong>Real-Time Office Presence:</strong> Feel connected with teammates and colleagues. See how many other listeners are in the office streaming at any moment.
            </li>
            <li>
              <strong>Keyboard Shortcuts:</strong> Control your audio completely without lifting your hands from the keyboard.
            </li>
            <li>
              <strong>Bumper Memes:</strong> Lighten your work pressure with quick, humorous office one-liners rotated on your dashboard.
            </li>
          </ul>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#D9A441]" /> Free & Ad-Supported
          </h2>
          <p>
            To keep Music Wala free for developers and workspaces worldwide, we support our server costs and streaming licenses through Google AdSense. We make sure all advertisements are clean, non-intrusive, and don't interrupt your streaming or productivity workspace.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
