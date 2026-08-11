'use client';

import { useState, useCallback, useMemo } from 'react';
import { Song, StationConfig } from '@/types/types';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { useFavorites } from '@/hooks/useFavorites';
import { MainStation } from './MainStation';

interface StationAppProps {
  station: StationConfig;
  songs: Song[];
  oneLiners: string[];
}

export function StationApp({ station, songs, oneLiners }: StationAppProps) {
  const [started, setStarted] = useState(false);
  const {
    favorites,
    toggleFavorite,
    favoritesOnlyMode,
    toggleFavoritesOnlyMode,
  } = useFavorites();

  // Active song list based on favorites mode
  const activeSongs = useMemo(() => {
    if (favoritesOnlyMode) {
      const favList = songs.filter((s) => favorites.includes(s.id));
      return favList.length > 0 ? favList : songs;
    }
    return songs;
  }, [favoritesOnlyMode, favorites, songs]);

  const [playerState, playerActions] = useAudioPlayer({
    songs: activeSongs,
    shuffle: station.shuffle,
    autoplayNext: station.autoplayNext,
    loopPlaylist: station.loopPlaylist,
  });

  useKeyboardControls({
    onTogglePlay: playerActions.togglePlay,
    onSeekForward: playerActions.seekForward,
    onSeekBackward: playerActions.seekBackward,
    onVolumeUp: playerActions.volumeUp,
    onVolumeDown: playerActions.volumeDown,
    enabled: started,
  });

  const handleFirstPlay = useCallback(() => {
    if (!started) {
      setStarted(true);
    }
    playerActions.play();
  }, [started, playerActions]);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: '#0a0a0f' }}>
      <MainStation
        station={station}
        songs={songs}
        oneLiners={oneLiners}
        playerState={playerState}
        playerActions={playerActions}
        started={started}
        onFirstPlay={handleFirstPlay}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        isFavoritesMode={favoritesOnlyMode}
        onToggleFavoritesMode={toggleFavoritesOnlyMode}
      />
    </div>
  );
}
