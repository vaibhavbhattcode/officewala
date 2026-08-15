'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Song, StationConfig, PlayerState } from '@/types/types';
import { AudioPlayerActions } from '@/hooks/useAudioPlayer';
import { HeroBackground } from './HeroBackground';
import { StationHeader } from './StationHeader';
import { OneLinerRotator } from './OneLinerRotator';
import { NowPlaying } from './NowPlaying';
import { PlaylistDrawer } from './PlaylistDrawer';
import { AdSenseBanner } from './AdSenseBanner';

interface MainStationProps {
  station: StationConfig;
  songs: Song[];
  oneLiners: string[];
  playerState: PlayerState;
  playerActions: AudioPlayerActions;
  started: boolean;
  onFirstPlay: () => void;
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
  isFavoritesMode: boolean;
  onToggleFavoritesMode: () => void;
}

export function MainStation({
  station,
  songs,
  oneLiners,
  playerState,
  playerActions,
  started,
  onFirstPlay,
  favorites,
  onToggleFavorite,
  isFavoritesMode,
  onToggleFavoritesMode,
}: MainStationProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [topAdStatus, setTopAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');
  const [bottomAdStatus, setBottomAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');
  const [leftAdStatus, setLeftAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');
  const [rightAdStatus, setRightAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');

  // Active playlist based on mode
  const displayedSongs = useMemo(() => {
    if (isFavoritesMode) {
      const favs = songs.filter((s) => favorites.includes(s.id));
      return favs.length > 0 ? favs : songs;
    }
    return songs;
  }, [isFavoritesMode, favorites, songs]);

  const isCurrentFav = playerState.currentSong
    ? favorites.includes(playerState.currentSong.id)
    : false;

  const allBackgrounds = station.backgrounds && station.backgrounds.length > 0 ? station.backgrounds : [station.background];
  const [bgIndex, setBgIndex] = useState(0);

  const handleNextBackground = useCallback(() => {
    setBgIndex(curr => (curr + 1) % allBackgrounds.length);
  }, [allBackgrounds.length]);

  useEffect(() => {
    if (allBackgrounds.length <= 1) return;
    const interval = setInterval(() => {
      setBgIndex(curr => (curr + 1) % allBackgrounds.length);
    }, 35000);
    return () => clearInterval(interval);
  }, [allBackgrounds.length]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none">
      {/* Background (Spans full screen behind semi-transparent ads) */}
      <HeroBackground
        backgroundUrl={station.background}
        backgrounds={station.backgrounds}
        currentIndex={bgIndex}
      />

      {/* Sticky Top Ad Bar */}
      <div 
        className={`w-full shrink-0 relative z-20 bg-black/45 backdrop-blur-md border-white/5 flex items-center justify-center pointer-events-auto transition-all duration-300 ${
          topAdStatus === 'filled' 
            ? 'h-[60px] sm:h-[90px] border-b opacity-100' 
            : topAdStatus === 'loading' 
              ? 'h-0 opacity-0 pointer-events-none overflow-hidden' 
              : 'hidden'
        }`}
      >
        <AdSenseBanner adSlot="home-sticky-top" onStatusChange={setTopAdStatus} />
      </div>

      {/* Floating Left Skyscraper Ad (Visible on Desktop) */}
      <div className={`fixed left-4 top-[18%] bottom-[18%] w-[120px] xl:w-[160px] z-20 items-center justify-center pointer-events-auto border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden transition-all duration-300 ${
        leftAdStatus === 'filled' 
          ? 'hidden lg:flex opacity-100 scale-100' 
          : leftAdStatus === 'loading' 
            ? 'hidden lg:flex opacity-0 scale-95 pointer-events-none' 
            : 'hidden'
      }`}>
        <AdSenseBanner adSlot="home-left-skyscraper" style={{ display: 'block', width: '100%', height: '100%' }} onStatusChange={setLeftAdStatus} />
      </div>

      {/* Floating Right Skyscraper Ad (Visible on Desktop) */}
      <div className={`fixed right-4 top-[18%] bottom-[18%] w-[120px] xl:w-[160px] z-20 items-center justify-center pointer-events-auto border border-white/5 bg-white/[0.01] rounded-xl overflow-hidden transition-all duration-300 ${
        rightAdStatus === 'filled' 
          ? 'hidden lg:flex opacity-100 scale-100' 
          : rightAdStatus === 'loading' 
            ? 'hidden lg:flex opacity-0 scale-95 pointer-events-none' 
            : 'hidden'
      }`}>
        <AdSenseBanner adSlot="home-right-skyscraper" style={{ display: 'block', width: '100%', height: '100%' }} onStatusChange={setRightAdStatus} />
      </div>


      {/* Main App Content Wrapper */}
      <div className="flex-1 relative flex flex-col overflow-hidden z-10">
        {/* Top Header inside wrapper */}
        <StationHeader
          station={station}
          favoritesCount={favorites.length}
          isFavoritesMode={isFavoritesMode}
          onToggleFavoritesMode={onToggleFavoritesMode}
        />

        {/* Main Center Area */}
        <main
          className="relative z-10 flex-1 flex flex-col items-center justify-between w-full h-full"
          style={{
            padding: `max(var(--edge), env(safe-area-inset-top)) var(--edge) max(var(--edge), env(safe-area-inset-bottom))`,
          }}
        >
          {/* Center spacing spacer */}
          <div className="flex-1" />

          {/* Bottom Dock: Playlist Popup + Bumper Quote + Pill Player */}
          <div
            className="anim-rise w-full flex flex-col items-center relative px-2 sm:px-0"
            style={{
              maxWidth: '48rem',
              marginBottom: '0.45rem',
              animationDelay: '0.16s',
            }}
          >
            {/* Playlist popup directly above the dock */}
            <PlaylistDrawer
              isOpen={showPlaylist}
              onClose={() => setShowPlaylist(false)}
              songs={displayedSongs}
              currentIndex={playerState.currentIndex}
              isPlaying={playerState.isPlaying}
              onPlaySong={(idx) => {
                playerActions.playSong(idx);
                if (!started) onFirstPlay();
              }}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              isFavoritesMode={isFavoritesMode}
            />

            {/* One-Liner Quote / Bumper */}
            <OneLinerRotator
              oneLiners={oneLiners}
              intervalMs={station.oneLinerInterval}
            />

            {/* Core Player Pill */}
            <NowPlaying
              currentBackgroundUrl={allBackgrounds[bgIndex]}
              onNextBackground={handleNextBackground}
              playerState={playerState}
              playerActions={playerActions}
              station={station}
              started={started}
              onFirstPlay={onFirstPlay}
              isPlaylistOpen={showPlaylist}
              onTogglePlaylist={() => setShowPlaylist((p) => !p)}
              isFavorite={isCurrentFav}
              onToggleFavorite={() => {
                if (playerState.currentSong) {
                  onToggleFavorite(playerState.currentSong.id);
                }
              }}
            />
          </div>
        </main>

        {/* Subtle legal footer bar above bottom ad */}
        <footer className="w-full shrink-0 z-30 flex justify-center flex-wrap gap-x-4 gap-y-1 px-4 py-2 bg-black/20 border-t border-white/5 text-center text-[10px] text-white/35 font-medium tracking-widest uppercase select-none pointer-events-auto">
          <Link href="/about" className="hover:text-station-gold hover:underline transition-all">About Us</Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link href="/contact" className="hover:text-station-gold hover:underline transition-all">Contact Us</Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link href="/privacy" className="hover:text-station-gold hover:underline transition-all">Privacy Policy</Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-station-gold hover:underline transition-all">Terms & Conditions</Link>
          <span className="text-white/10 hidden sm:inline">•</span>
          <Link href="/disclaimer" className="hover:text-station-gold hover:underline transition-all">Disclaimer</Link>
        </footer>

      </div>

      {/* Sticky Bottom Ad Bar */}
      <div 
        className={`w-full shrink-0 relative z-20 bg-black/45 backdrop-blur-md border-white/5 flex items-center justify-center pointer-events-auto transition-all duration-300 ${
          bottomAdStatus === 'filled' 
            ? 'h-[60px] sm:h-[90px] border-t opacity-100' 
            : bottomAdStatus === 'loading' 
              ? 'h-0 opacity-0 pointer-events-none overflow-hidden' 
              : 'hidden'
        }`}
      >
        <AdSenseBanner adSlot="home-sticky-bottom" onStatusChange={setBottomAdStatus} />
      </div>
    </div>
  );
}
