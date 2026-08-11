'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Song, PlayerState } from '@/types/types';

interface UseAudioPlayerOptions {
  songs: Song[];
  shuffle: boolean;
  autoplayNext: boolean;
  loopPlaylist: boolean;
}

export interface AudioPlayerActions {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  playSong: (index: number) => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
  volumeUp: (step?: number) => void;
  volumeDown: (step?: number) => void;
}

export function useAudioPlayer(options: UseAudioPlayerOptions): [PlayerState, AudioPlayerActions] {
  const { songs, shuffle: initialShuffle, autoplayNext, loopPlaylist } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shuffleHistoryRef = useRef<number[]>([]);
  const volumeBeforeMuteRef = useRef<number>(0.8);
  const isShuffleRef = useRef<boolean>(initialShuffle);
  const currentIndexRef = useRef<number>(0);
  const songsRef = useRef<Song[]>(songs);

  // Keep songsRef updated
  songsRef.current = songs;

  const [state, setState] = useState<PlayerState>({
    currentSong: songs.length > 0 ? songs[0] : null,
    currentIndex: 0,
    isPlaying: false,
    isShuffle: initialShuffle,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    isLoading: false,
    error: null,
  });

  isShuffleRef.current = state.isShuffle;

  // Exact loadSong function that guarantees audio.src matches songs[index]
  const loadSong = useCallback((index: number, autoplay: boolean = true) => {
    const list = songsRef.current;
    const audio = audioRef.current;
    if (!audio || list.length === 0) return;

    const safeIndex = Math.max(0, Math.min(index, list.length - 1));
    const targetSong = list[safeIndex];
    currentIndexRef.current = safeIndex;

    const targetSrc = encodeURI(targetSong.audio);

    // Only change src if different or not set
    if (!audio.src.endsWith(targetSrc) && audio.src !== targetSrc) {
      audio.src = targetSrc;
      audio.load();
    }

    setState(prev => ({
      ...prev,
      currentSong: targetSong,
      currentIndex: safeIndex,
      currentTime: 0,
      duration: 0,
      isLoading: true,
      error: null,
    }));

    if (autoplay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setState(prev => ({ ...prev, isPlaying: true, isLoading: false, error: null }));
          })
          .catch((err) => {
            if (err.name !== 'AbortError') {
              console.warn('Playback notice:', err.message);
            }
            setState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
          });
      }
    }
  }, []);

  // Initialize audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.volume = state.volume;
      audio.muted = state.isMuted;
      audioRef.current = audio;
    }

    const audio = audioRef.current;
    if (!audio.src && songs.length > 0 && songs[0].audio) {
      audio.src = encodeURI(songs[0].audio);
    }

    return () => {
      // We only clean up when the component fully unmounts
      // but since this effect depends on `songs` (which can change),
      // we shouldn't destroy the audio element here.
      // Instead, we just let it be. It will be garbage collected when unmounted.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNextShuffleIndex = useCallback((): number => {
    const list = songsRef.current;
    if (list.length <= 1) return 0;

    const history = shuffleHistoryRef.current;
    let nextIndex: number;
    let attempts = 0;

    do {
      nextIndex = Math.floor(Math.random() * list.length);
      attempts++;
    } while (
      history.includes(nextIndex) &&
      attempts < list.length * 2
    );

    history.push(nextIndex);
    if (history.length > Math.min(list.length - 1, 10)) {
      history.shift();
    }

    return nextIndex;
  }, []);

  const nextSong = useCallback(() => {
    const list = songsRef.current;
    if (list.length === 0) return;

    let nextIndex: number;
    const current = currentIndexRef.current;

    if (isShuffleRef.current) {
      nextIndex = getNextShuffleIndex();
    } else {
      nextIndex = current + 1;
      if (nextIndex >= list.length) {
        if (loopPlaylist) {
          nextIndex = 0;
        } else {
          setState(prev => ({ ...prev, isPlaying: false }));
          return;
        }
      }
    }

    loadSong(nextIndex, true);
  }, [loopPlaylist, getNextShuffleIndex, loadSong]);

  const previous = useCallback(() => {
    const list = songsRef.current;
    if (list.length === 0) return;
    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const current = currentIndexRef.current;
    let prevIndex = current - 1;
    if (prevIndex < 0) {
      prevIndex = loopPlaylist ? list.length - 1 : 0;
    }
    loadSong(prevIndex, true);
  }, [loopPlaylist, loadSong]);

  // Event Listeners on Audio Element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        currentTime: audio.currentTime,
      }));
    };

    const onLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration || 0,
        isLoading: false,
        error: null,
      }));
    };

    const onEnded = () => {
      if (autoplayNext) {
        nextSong();
      } else {
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    };

    const onError = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Unable to play this track',
        isPlaying: false,
      }));
    };

    const onWaiting = () => {
      setState(prev => ({ ...prev, isLoading: true }));
    };

    const onCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false, error: null }));
    };

    const onPlay = () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    };

    const onPause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [autoplayNext, nextSong]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    const list = songsRef.current;
    if (!audio || list.length === 0) return;

    const current = currentIndexRef.current;
    const currentSong = list[current];

    if (!audio.src || audio.src === window.location.href || audio.src.endsWith('/')) {
      loadSong(current, true);
      return;
    }

    // Ensure audio src corresponds to current
    const expectedSrc = encodeURI(currentSong.audio);
    if (!audio.src.endsWith(expectedSrc)) {
      loadSong(current, true);
      return;
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setState(prev => ({ ...prev, isPlaying: true, error: null })))
        .catch((err) => {
          console.warn('Audio play prevented:', err);
          setState(prev => ({ ...prev, isPlaying: false }));
        });
    }
  }, [loadSong]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused && !audio.ended && audio.currentTime > 0) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(time, audio.duration || 0));
  }, []);

  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clampedVol = Math.max(0, Math.min(1, vol));
    audio.volume = clampedVol;
    audio.muted = clampedVol === 0;
    setState(prev => ({
      ...prev,
      volume: clampedVol,
      isMuted: clampedVol === 0,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setState(prev => {
      if (prev.isMuted) {
        const restored = volumeBeforeMuteRef.current || 0.8;
        audio.volume = restored;
        audio.muted = false;
        return {
          ...prev,
          volume: restored,
          isMuted: false,
        };
      } else {
        volumeBeforeMuteRef.current = prev.volume;
        audio.volume = 0;
        audio.muted = true;
        return {
          ...prev,
          volume: 0,
          isMuted: true,
        };
      }
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => {
      const next = !prev.isShuffle;
      isShuffleRef.current = next;
      return {
        ...prev,
        isShuffle: next,
      };
    });
  }, []);

  const playSong = useCallback((index: number) => {
    loadSong(index, true);
  }, [loadSong]);

  const seekForward = useCallback((seconds: number = 5) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.currentTime + seconds, audio.duration || 0);
  }, []);

  const seekBackward = useCallback((seconds: number = 5) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(audio.currentTime - seconds, 0);
  }, []);

  const volumeUp = useCallback((step: number = 0.1) => {
    setVolume(state.volume + step);
  }, [state.volume, setVolume]);

  const volumeDown = useCallback((step: number = 0.1) => {
    setVolume(state.volume - step);
  }, [state.volume, setVolume]);

  const actions: AudioPlayerActions = {
    play,
    pause,
    togglePlay,
    next: nextSong,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    playSong,
    seekForward,
    seekBackward,
    volumeUp,
    volumeDown,
  };

  return [state, actions];
}
