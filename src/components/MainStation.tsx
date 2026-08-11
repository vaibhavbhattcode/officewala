'use client';

import { useState, useMemo } from 'react';
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

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden select-none">
      {/* Background */}
      <HeroBackground backgroundUrl={station.background} />

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
        {/* Logo / Corporate Station Wordmark */}
        <div
          className="anim-rise flex flex-col items-center select-none"
          style={{
            marginTop: 'clamp(5vh, 8vh, 11vh)',
            animationDelay: '0.06s',
          }}
        >
          <h1
            className="font-[var(--font-space-grotesk)] font-black text-white leading-none tracking-tight text-center"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              textShadow: '0 4px 30px rgba(0,0,0,0.65)',
            }}
          >
            {station.name}
          </h1>
          <span
            className="text-[10px] sm:text-xs font-bold text-white/50 tracking-[0.35em] uppercase mt-2"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            {isFavoritesMode ? '❤️ FAVORITES STATION' : station.subtitle}
          </span>
        </div>

        {/* Bottom Dock: Playlist Popup + Bumper Quote + Pill Player */}
        <div
          className="anim-rise w-full flex flex-col items-center relative px-2 sm:px-0"
          style={{
            maxWidth: '31rem',
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
