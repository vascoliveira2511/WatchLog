"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  target?: 'document' | 'window';
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  target = 'document'
}: UseKeyboardShortcutsOptions) {
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);
  const router = useRouter();

  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in input fields
      const activeElement = document.activeElement;
      const isInputElement = 
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.contentEditable === 'true';

      if (isInputElement) return;

      // Find matching shortcut
      const matchingShortcut = shortcutsRef.current.find(shortcut => {
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
        const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
        const altMatch = !!shortcut.altKey === event.altKey;
        const metaMatch = !!shortcut.metaKey === event.metaKey;

        return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
      });

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          event.preventDefault();
        }
        matchingShortcut.action();
      }
    };

    const targetElement = target === 'document' ? document : window;
    targetElement.addEventListener('keydown', handleKeyDown as any);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [enabled, target]);

  return {
    shortcuts: shortcutsRef.current,
  };
}

// Pre-defined shortcut sets for common use cases
export const useGlobalShortcuts = (enabled = true) => {
  const router = useRouter();

  return useKeyboardShortcuts({
    enabled,
    shortcuts: [
      {
        key: '/',
        action: () => {
          // Focus search input
          const searchInput = document.querySelector('input[placeholder*="search" i], input[type="search"]') as HTMLInputElement;
          searchInput?.focus();
        },
        description: 'Focus search',
      },
      {
        key: 'd',
        action: () => router.push('/dashboard'),
        description: 'Go to Dashboard',
      },
      {
        key: 'm',
        action: () => router.push('/movies'),
        description: 'Go to Movies',
      },
      {
        key: 't',
        action: () => router.push('/shows'),
        description: 'Go to TV Shows',
      },
      {
        key: 'h',
        action: () => router.push('/history'),
        description: 'Go to History',
      },
      {
        key: 's',
        action: () => router.push('/stats'),
        description: 'Go to Statistics',
      },
      {
        key: 'c',
        action: () => router.push('/calendar'),
        description: 'Go to Calendar',
      },
      {
        key: '?',
        shiftKey: true,
        action: () => {
          // Show keyboard shortcuts modal
          const event = new CustomEvent('show-shortcuts-modal');
          document.dispatchEvent(event);
        },
        description: 'Show keyboard shortcuts',
      },
    ],
  });
};

export const useMediaShortcuts = (
  onMarkWatched?: () => void,
  onToggleWatchlist?: () => void,
  onRate?: (rating: number) => void,
  enabled = true
) => {
  return useKeyboardShortcuts({
    enabled,
    shortcuts: [
      {
        key: ' ', // Spacebar
        action: () => onMarkWatched?.(),
        description: 'Mark as watched',
      },
      {
        key: 'w',
        action: () => onToggleWatchlist?.(),
        description: 'Add to watchlist',
      },
      {
        key: '1',
        action: () => onRate?.(1),
        description: 'Rate 1 star',
      },
      {
        key: '2',
        action: () => onRate?.(2),
        description: 'Rate 2 stars',
      },
      {
        key: '3',
        action: () => onRate?.(3),
        description: 'Rate 3 stars',
      },
      {
        key: '4',
        action: () => onRate?.(4),
        description: 'Rate 4 stars',
      },
      {
        key: '5',
        action: () => onRate?.(5),
        description: 'Rate 5 stars',
      },
    ],
  });
};

export const useEpisodeShortcuts = (
  onNextEpisode?: () => void,
  onPrevEpisode?: () => void,
  onMarkWatched?: () => void,
  enabled = true
) => {
  return useKeyboardShortcuts({
    enabled,
    shortcuts: [
      {
        key: 'ArrowRight',
        action: () => onNextEpisode?.(),
        description: 'Next episode',
      },
      {
        key: 'ArrowLeft',
        action: () => onPrevEpisode?.(),
        description: 'Previous episode',
      },
      {
        key: ' ', // Spacebar
        action: () => onMarkWatched?.(),
        description: 'Toggle watched',
      },
      {
        key: 'Enter',
        action: () => onMarkWatched?.(),
        description: 'Toggle watched',
      },
    ],
  });
};