'use client';

import { useEffect } from 'react';

interface KeyboardControlsOptions {
  onTogglePlay: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  enabled: boolean;
}

export function useKeyboardControls(options: KeyboardControlsOptions): void {
  const { onTogglePlay, onSeekForward, onSeekBackward, onVolumeUp, onVolumeDown, enabled } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSeekForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSeekBackward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onTogglePlay, onSeekForward, onSeekBackward, onVolumeUp, onVolumeDown]);
}
