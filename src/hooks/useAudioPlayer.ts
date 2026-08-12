'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Song, PlayerState, AudioPreset } from '@/types/types';
import youtubePlayer from 'youtube-player';
import type { YouTubePlayer } from 'youtube-player/dist/types';

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
  setPreset: (preset: AudioPreset) => void;
}

const PRESET_CONFIGS: Record<AudioPreset, { low: number; mid: number; high: number }> = {
  'Flat': { low: 0, mid: 0, high: 0 },
  'Bass Boost': { low: 8, mid: 0, high: -2 },
  'Vocal Focus': { low: -2, mid: 6, high: 2 },
  'Office Warmth': { low: 4, mid: -2, high: -4 },
  'Studio HD': { low: 4, mid: -1, high: 5 },
};

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function useAudioPlayer(options: UseAudioPlayerOptions): [PlayerState, AudioPlayerActions] {
  const { songs, shuffle: initialShuffle, autoplayNext, loopPlaylist } = options;

  // HTML5 Engine Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const filtersRef = useRef<{ low: BiquadFilterNode; mid: BiquadFilterNode; high: BiquadFilterNode } | null>(null);

  // YouTube Engine Refs
  const ytPlayerRef = useRef<YouTubePlayer | null>(null);
  const ytDivRef = useRef<HTMLDivElement | null>(null);
  const ytIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State Refs
  const shuffleHistoryRef = useRef<number[]>([]);
  const volumeBeforeMuteRef = useRef<number>(0.8);
  const isShuffleRef = useRef<boolean>(initialShuffle);
  const currentIndexRef = useRef<number>(0);
  const songsRef = useRef<Song[]>(songs);
  const isYouTubeRef = useRef<boolean>(false);

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
    activePreset: 'Flat',
    isYouTube: false,
  });

  isShuffleRef.current = state.isShuffle;
  isYouTubeRef.current = state.isYouTube || false;

  const clearYtInterval = () => {
    if (ytIntervalRef.current) {
      clearInterval(ytIntervalRef.current);
      ytIntervalRef.current = null;
    }
  };

  const applyPresetToFilters = useCallback((preset: AudioPreset) => {
    const filters = filtersRef.current;
    if (!filters) return;
    const config = PRESET_CONFIGS[preset];
    if (!config) return;
    try {
      filters.low.gain.value = config.low;
      filters.mid.gain.value = config.mid;
      filters.high.gain.value = config.high;
    } catch (e) {
      console.error("Error applying filter preset:", e);
    }
  }, []);

  const setPreset = useCallback((preset: AudioPreset) => {
    applyPresetToFilters(preset);
    setState(prev => ({ ...prev, activePreset: preset }));
  }, [applyPresetToFilters]);

  // Unified loader
  const loadSong = useCallback((index: number, autoplay: boolean = true) => {
    const list = songsRef.current;
    const audio = audioRef.current;
    const yt = ytPlayerRef.current;
    if (!audio || !yt || list.length === 0) return;

    const safeIndex = Math.max(0, Math.min(index, list.length - 1));
    const targetSong = list[safeIndex];
    currentIndexRef.current = safeIndex;

    const ytId = extractYouTubeId(targetSong.audio);
    const isYt = !!ytId;
    isYouTubeRef.current = isYt;

    setState(prev => ({
      ...prev,
      currentSong: targetSong,
      currentIndex: safeIndex,
      currentTime: 0,
      duration: 0,
      isLoading: true,
      error: null,
      isYouTube: isYt,
    }));

    if (isYt && ytId) {
      // Pause HTML5
      audio.pause();
      // Load YouTube
      if (autoplay) {
        yt.loadVideoById(ytId);
      } else {
        yt.cueVideoById(ytId);
      }
    } else {
      // Pause YT
      yt.pauseVideo();
      // Load HTML5
      const targetSrc = encodeURI(targetSong.audio);
      if (!audio.src.endsWith(targetSrc) && audio.src !== targetSrc) {
        audio.src = targetSrc;
        audio.load();
      }
      if (autoplay) {
        if (audioCtxRef.current?.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        audio.play().catch(e => console.warn(e));
      }
    }
  }, []);

  // Sync YT Time
  const startYtInterval = useCallback(() => {
    clearYtInterval();
    ytIntervalRef.current = setInterval(async () => {
      const yt = ytPlayerRef.current;
      if (yt && isYouTubeRef.current) {
        const cTime = await yt.getCurrentTime();
        const dur = await yt.getDuration();
        setState(prev => ({ ...prev, currentTime: cTime, duration: dur }));
      }
    }, 500);
  }, []);

  // Init Engine
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Init HTML5 Engine
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      audio.volume = state.volume;
      audio.muted = state.isMuted;
      audioRef.current = audio;

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaElementSource(audio);
        sourceNodeRef.current = source;

        const lowFilter = ctx.createBiquadFilter();
        lowFilter.type = 'lowshelf';
        lowFilter.frequency.value = 250;

        const midFilter = ctx.createBiquadFilter();
        midFilter.type = 'peaking';
        midFilter.frequency.value = 1000;
        midFilter.Q.value = 1.0;

        const highFilter = ctx.createBiquadFilter();
        highFilter.type = 'highshelf';
        highFilter.frequency.value = 4000;

        filtersRef.current = { low: lowFilter, mid: midFilter, high: highFilter };

        source.connect(lowFilter);
        lowFilter.connect(midFilter);
        midFilter.connect(highFilter);
        highFilter.connect(ctx.destination);
        applyPresetToFilters('Flat');
      } catch (err) {
        console.warn('Web Audio API not supported', err);
      }
    }

    // 2. Init YouTube Engine
    if (!ytDivRef.current) {
      const div = document.createElement('div');
      div.id = 'yt-fallback-container';
      div.style.position = 'fixed';
      div.style.top = '-9999px';
      div.style.left = '-9999px';
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.opacity = '0';
      div.style.pointerEvents = 'none';
      document.body.appendChild(div);
      ytDivRef.current = div;

      const yt = youtubePlayer(div, {
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1
        }
      });
      ytPlayerRef.current = yt;

      yt.setVolume(state.volume * 100);
      if (state.isMuted) yt.mute();

      yt.on('stateChange', (event) => {
        // PlayerState: UNSTARTED = -1, ENDED = 0, PLAYING = 1, PAUSED = 2, BUFFERING = 3, CUED = 5
        const ytState = event.data;
        if (!isYouTubeRef.current) return;

        if (ytState === 1) { // PLAYING
          setState(prev => ({ ...prev, isPlaying: true, isLoading: false, error: null }));
          startYtInterval();
        } else if (ytState === 2) { // PAUSED
          setState(prev => ({ ...prev, isPlaying: false }));
          clearYtInterval();
        } else if (ytState === 3) { // BUFFERING
          setState(prev => ({ ...prev, isLoading: true }));
        } else if (ytState === 0) { // ENDED
          clearYtInterval();
          if (autoplayNext) nextSong();
          else setState(prev => ({ ...prev, isPlaying: false }));
        }
      });
      
      yt.on('error', (event) => {
        if (!isYouTubeRef.current) return;
        setState(prev => ({ ...prev, error: 'YT Error ' + event.data, isLoading: false, isPlaying: false }));
      });
    }

    // Initial load
    if (songs.length > 0 && !audioRef.current.src && !isYouTubeRef.current) {
       loadSong(0, false);
    }

    return () => {
      clearYtInterval();
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
    } while (history.includes(nextIndex) && attempts < list.length * 2);

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
        if (loopPlaylist) nextIndex = 0;
        else {
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
    
    // Simple 3s reset logic
    if (state.currentTime > 3) {
      seek(0);
      return;
    }

    const current = currentIndexRef.current;
    let prevIndex = current - 1;
    if (prevIndex < 0) {
      prevIndex = loopPlaylist ? list.length - 1 : 0;
    }
    loadSong(prevIndex, true);
  }, [loopPlaylist, loadSong, state.currentTime]);

  // HTML5 Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (isYouTubeRef.current) return;
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    const onLoadedMetadata = () => {
      if (isYouTubeRef.current) return;
      setState(prev => ({ ...prev, duration: audio.duration || 0, isLoading: false, error: null }));
    };
    const onEnded = () => {
      if (isYouTubeRef.current) return;
      if (autoplayNext) nextSong();
      else setState(prev => ({ ...prev, isPlaying: false }));
    };
    const onError = () => {
      if (isYouTubeRef.current) return;
      setState(prev => ({ ...prev, isLoading: false, error: 'Error', isPlaying: false }));
    };
    const onWaiting = () => { if (!isYouTubeRef.current) setState(prev => ({ ...prev, isLoading: true })); };
    const onCanPlay = () => { if (!isYouTubeRef.current) setState(prev => ({ ...prev, isLoading: false, error: null })); };
    const onPlay = () => { if (!isYouTubeRef.current) setState(prev => ({ ...prev, isPlaying: true })); };
    const onPause = () => { if (!isYouTubeRef.current) setState(prev => ({ ...prev, isPlaying: false })); };

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
    if (isYouTubeRef.current && ytPlayerRef.current) {
      ytPlayerRef.current.playVideo();
    } else if (audioRef.current) {
      if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
      audioRef.current.play().catch(e => console.warn(e));
    }
  }, []);

  const pause = useCallback(() => {
    if (isYouTubeRef.current && ytPlayerRef.current) {
      ytPlayerRef.current.pauseVideo();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) pause();
    else play();
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    const newTime = Math.max(0, Math.min(time, state.duration || 0));
    if (isYouTubeRef.current && ytPlayerRef.current) {
      ytPlayerRef.current.seekTo(newTime, true);
    } else if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setState(prev => ({ ...prev, currentTime: newTime }));
  }, [state.duration]);

  const setVolume = useCallback((vol: number) => {
    const clampedVol = Math.max(0, Math.min(1, vol));
    if (ytPlayerRef.current) {
      ytPlayerRef.current.setVolume(clampedVol * 100);
      if (clampedVol === 0) ytPlayerRef.current.mute();
      else ytPlayerRef.current.unMute();
    }
    if (audioRef.current) {
      audioRef.current.volume = clampedVol;
      audioRef.current.muted = clampedVol === 0;
    }
    setState(prev => ({ ...prev, volume: clampedVol, isMuted: clampedVol === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    setState(prev => {
      const nextMuted = !prev.isMuted;
      const nextVol = nextMuted ? 0 : (volumeBeforeMuteRef.current || 0.8);
      if (!prev.isMuted) volumeBeforeMuteRef.current = prev.volume;
      
      if (ytPlayerRef.current) {
        if (nextMuted) ytPlayerRef.current.mute();
        else ytPlayerRef.current.unMute();
      }
      if (audioRef.current) {
        audioRef.current.muted = nextMuted;
        audioRef.current.volume = nextVol;
      }
      return { ...prev, volume: nextVol, isMuted: nextMuted };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setState(prev => {
      const next = !prev.isShuffle;
      isShuffleRef.current = next;
      return { ...prev, isShuffle: next };
    });
  }, []);

  const playSong = useCallback((index: number) => {
    loadSong(index, true);
  }, [loadSong]);

  const seekForward = useCallback((seconds: number = 5) => {
    seek(state.currentTime + seconds);
  }, [seek, state.currentTime]);

  const seekBackward = useCallback((seconds: number = 5) => {
    seek(state.currentTime - seconds);
  }, [seek, state.currentTime]);

  const volumeUp = useCallback((step: number = 0.1) => {
    setVolume(state.volume + step);
  }, [state.volume, setVolume]);

  const volumeDown = useCallback((step: number = 0.1) => {
    setVolume(state.volume - step);
  }, [state.volume, setVolume]);

  const actions: AudioPlayerActions = {
    play, pause, togglePlay, next: nextSong, previous, seek, setVolume, toggleMute, toggleShuffle,
    playSong, seekForward, seekBackward, volumeUp, volumeDown, setPreset,
  };

  return [state, actions];
}
