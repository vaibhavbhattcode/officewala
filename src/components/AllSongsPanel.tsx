'use client';

import { useState, useMemo, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Search, Music, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import { Song } from '@/types/types';

interface AllSongsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentIndex: number;
  isPlaying: boolean;
  onPlaySong: (index: number) => void;
}

export const AllSongsPanel = memo(function AllSongsPanel({
  isOpen,
  onClose,
  songs,
  currentIndex,
  isPlaying,
  onPlaySong,
}: AllSongsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const query = searchQuery.toLowerCase().trim();
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.album.toLowerCase().includes(query)
    );
  }, [songs, searchQuery]);

  // Get original index for proper playback
  const getOriginalIndex = (song: Song) => songs.findIndex((s) => s.id === song.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed z-40 inset-4 md:inset-x-[15%] md:inset-y-12 lg:inset-x-[20%] glass-panel rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-station-border flex-shrink-0">
              <div>
                <h3 className="font-[var(--font-space-grotesk)] text-sm md:text-base font-semibold tracking-[0.15em] uppercase text-station-text">
                  All Songs
                </h3>
                <p className="text-xs text-station-text-dim mt-0.5">
                  {filteredSongs.length} of {songs.length} tracks
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-station-surface-hover transition-colors text-station-text-dim hover:text-station-text cursor-pointer"
                aria-label="Close all songs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 md:px-6 py-3 border-b border-station-border flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-station-text-dim" />
                <input
                  type="text"
                  placeholder="Search songs, artists, albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-station-surface border border-station-border text-sm text-station-text placeholder:text-station-text-dim/50 focus:outline-none focus:border-station-gold/30 focus:ring-1 focus:ring-station-gold/20 transition-all"
                  aria-label="Search songs"
                />
              </div>
            </div>

            {/* Song Grid */}
            <div className="flex-1 overflow-y-auto py-2">
              {filteredSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-station-text-dim">
                  <Music className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">No songs found</p>
                </div>
              ) : (
                filteredSongs.map((song) => {
                  const originalIndex = getOriginalIndex(song);
                  const isActive = originalIndex === currentIndex;

                  return (
                    <button
                      key={song.id}
                      onClick={() => onPlaySong(originalIndex)}
                      className={`w-full flex items-center gap-4 px-5 md:px-6 py-3 text-left transition-all duration-200 cursor-pointer hover:bg-station-surface-hover ${
                        isActive ? 'bg-station-gold/8' : ''
                      }`}
                      aria-label={`Play ${song.title} by ${song.artist}`}
                    >
                      {/* Cover */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-station-surface flex-shrink-0 border border-station-border relative">
                        {song.cover ? (
                          <Image
                            src={song.cover}
                            alt={song.title}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Music className="w-5 h-5 text-station-text-dim" />
                          </div>
                        )}
                        {/* Play overlay on hover */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play className="w-5 h-5 text-white fill-white" />
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {isPlaying ? (
                              <div className="flex items-center gap-0.5">
                                <span className="w-0.5 h-3 bg-station-gold rounded-full animate-pulse" />
                                <span className="w-0.5 h-4 bg-station-gold rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
                                <span className="w-0.5 h-2.5 bg-station-gold rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                              </div>
                            ) : (
                              <Pause className="w-4 h-4 text-station-gold" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-station-gold' : 'text-station-text'
                        }`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-station-text-dim truncate">
                          {song.artist} · {song.album}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
