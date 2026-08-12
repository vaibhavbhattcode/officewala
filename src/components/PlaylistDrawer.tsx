'use client';

import { memo } from 'react';
import { Music, Heart } from 'lucide-react';
import Image from 'next/image';
import { Song } from '@/types/types';

interface PlaylistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  currentIndex: number;
  isPlaying: boolean;
  onPlaySong: (index: number) => void;
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
  isFavoritesMode?: boolean;
}

export const PlaylistDrawer = memo(function PlaylistDrawer({
  isOpen,
  songs,
  currentIndex,
  isPlaying,
  onPlaySong,
  favorites,
  onToggleFavorite,
  isFavoritesMode = false,
}: PlaylistDrawerProps) {
  return (
    <section
      className={`playlist-popup w-full sm:w-[380px] sm:max-w-[380px] origin-bottom-right mb-3.5 select-none transition-all duration-300 ${
        isOpen ? 'is-open pointer-events-auto opacity-100 translate-y-0 scale-100' : 'pointer-events-none opacity-0 translate-y-3 sm:translate-y-0 sm:scale-95'
      }`}
      style={{
        borderRadius: '1.5rem',
        background: 'rgba(20, 20, 24, 0.75)',
        backdropFilter: 'blur(32px) saturate(150%)',
        WebkitBackdropFilter: 'blur(32px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        maxHeight: 'min(50dvh, 24rem)',
        overflow: 'hidden',
      }}
      aria-label="Playlist"
    >
      <div
        className="w-full h-full overflow-y-auto overscroll-contain"
        style={{
          maxHeight: 'min(50dvh, 24rem)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.24) transparent',
        }}
      >
        {songs.length === 0 ? (
          <div className="py-8 text-center text-white/50 text-sm font-medium px-4">
            {isFavoritesMode
              ? 'No favorite songs yet. Click ❤️ to add!'
              : 'No songs in playlist.'}
          </div>
        ) : (
          <ol className="list-none m-0 p-3 sm:p-4 space-y-1">
            {songs.map((song, index) => {
              const isActive = index === currentIndex;
              const isFav = favorites.includes(song.id);

              return (
                <li key={song.id}>
                  <div
                    className={`w-full flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-150 rounded-2xl group ${
                      isActive
                        ? 'bg-white/[0.18] text-white shadow-sm font-extrabold'
                        : 'text-white/80 hover:bg-white/[0.12] hover:text-white font-semibold'
                    }`}
                  >
                    {/* Track play button */}
                    <button
                      type="button"
                      onClick={() => onPlaySong(index)}
                      className="flex-1 flex items-center gap-3 sm:gap-3.5 min-w-0 cursor-pointer text-left bg-transparent border-0 p-0"
                    >
                      {/* Track number or Equalizer animation */}
                      <div className="flex-none w-5 text-center flex items-center justify-center">
                        {isActive && isPlaying ? (
                          <div className="flex items-end gap-[3px] h-3 pb-0.5">
                            <span
                              className="w-[3px] h-3 bg-amber-400 rounded-full anim-eq"
                              style={{ animationDuration: '0.9s' }}
                            />
                            <span
                              className="w-[3px] h-3 bg-amber-400 rounded-full anim-eq"
                              style={{ animationDuration: '0.6s', animationDelay: '0.15s' }}
                            />
                            <span
                              className="w-[3px] h-3 bg-amber-400 rounded-full anim-eq"
                              style={{ animationDuration: '0.8s', animationDelay: '0.3s' }}
                            />
                          </div>
                        ) : (
                          <span
                            className={`text-[11px] sm:text-xs tabular-nums ${
                              isActive ? 'text-amber-400 font-extrabold' : 'text-white/40'
                            }`}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      {/* Small Album Artwork */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white/5 flex-none border border-white/10 relative shadow-sm">
                        {song.cover ? (
                          <Image
                            src={song.cover}
                            alt=""
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Music className="w-4 h-4 text-white/30" />
                          </div>
                        )}
                      </div>

                      {/* Song Title and Artist block */}
                      <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
                        <p
                          className={`text-sm sm:text-[14px] truncate leading-tight ${
                            isActive ? 'font-bold text-white' : 'font-semibold text-white/95'
                          }`}
                        >
                          {song.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-white/55 truncate font-medium mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                    </button>

                    {/* Heart Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(song.id);
                      }}
                      className="flex-none p-2 rounded-full hover:bg-white/15 transition-all cursor-pointer"
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      title={isFav ? 'Liked' : 'Like song'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform active:scale-125 ${
                          isFav
                            ? 'fill-red-500 text-red-500'
                            : 'text-white/30 group-hover:text-white/70 hover:text-red-400'
                        }`}
                      />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
});
