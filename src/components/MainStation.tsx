'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Song, StationConfig, PlayerState } from '@/types/types';
import { AudioPlayerActions } from '@/hooks/useAudioPlayer';
import { HeroBackground } from './HeroBackground';
import { StationHeader } from './StationHeader';
import { OneLinerRotator } from './OneLinerRotator';
import { NowPlaying } from './NowPlaying';
import { PlaylistDrawer } from './PlaylistDrawer';

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
      {/* Background */}
      <HeroBackground
        backgroundUrl={station.background}
        backgrounds={station.backgrounds}
        currentIndex={bgIndex}
      />

      {/* Top Header with Live Presence and Favorites button */}
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
            marginBottom: 'clamp(0.6rem, 4vh, 2.5rem)',
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
    </div>
  );
}
