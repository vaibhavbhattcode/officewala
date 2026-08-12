export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  audio: string;
}

export interface StationConfig {
  name: string;
  subtitle: string;
  tagline: string;
  locationText: string;
  logo: string;
  background: string;
  backgrounds?: string[];
  primaryColor: string;
  secondaryColor: string;
  shuffle: boolean;
  autoplayNext: boolean;
  loopPlaylist: boolean;
  oneLinerInterval: number;
}

export interface PlayerState {
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  isShuffle: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}
