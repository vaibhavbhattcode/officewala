'use client';

import { useEffect, useState, useRef } from 'react';
import { getFirebaseDatabase } from '@/lib/firebase';

const PRESENCE_STORAGE_KEY = 'office_waala_active_sessions';

export function useFirebasePresence(): number {
  const [listenerCount, setListenerCount] = useState<number>(1);
  const sessionIdRef = useRef<string>('');
  const hasFirebaseRef = useRef<boolean>(false);

  useEffect(() => {
    // Generate or retrieve unique tab session ID
    if (!sessionIdRef.current) {
      sessionIdRef.current =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `tab-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    const myId = sessionIdRef.current;

    // Local multi-tab presence heartbeat (Fallback if no Firebase)
    const updateLocalPresence = () => {
      try {
        const now = Date.now();
        const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
        let sessions: Record<string, number> = raw ? JSON.parse(raw) : {};

        // Prune dead tabs (>15s old)
        const active: Record<string, number> = {};
        for (const [id, ts] of Object.entries(sessions)) {
          if (now - ts < 15000) {
            active[id] = ts;
          }
        }
        active[myId] = now;
        localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(active));
        return Object.keys(active).length;
      } catch {
        return 1;
      }
    };

    let activeLocalTabs = updateLocalPresence();
    const heartbeatInterval = setInterval(() => {
      activeLocalTabs = updateLocalPresence();
      if (!hasFirebaseRef.current) {
        setListenerCount(activeLocalTabs);
      }
    }, 4000);

    // Initial local set
    setListenerCount(activeLocalTabs);

    // Firebase exact real-time presence
    const db = getFirebaseDatabase();
    let firebaseCleanup: (() => void) | undefined;

    if (db) {
      (async () => {
        try {
          const { ref, set, onDisconnect, onValue, serverTimestamp } = await import(
            'firebase/database'
          );

          const connectedRef = ref(db, '.info/connected');
          const sessionRef = ref(db, `presence/${myId}`);
          const presenceRoot = ref(db, 'presence');

          const connectedUnsub = onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
              // Ensure we remove ourselves on disconnect
              onDisconnect(sessionRef).remove().then(() => {
                set(sessionRef, {
                  connected: true,
                  timestamp: serverTimestamp(),
                });
              });
            }
          });

          const presenceUnsub = onValue(
            presenceRoot,
            (snapshot) => {
              const data = snapshot.val();
              const count = data ? Object.keys(data).length : 0;
              hasFirebaseRef.current = true;
              setListenerCount(Math.max(1, count)); // Exactly real count
            },
            () => {
              hasFirebaseRef.current = false;
            }
          );

          firebaseCleanup = () => {
            connectedUnsub();
            presenceUnsub();
            set(sessionRef, null).catch(() => {});
          };
        } catch {
          hasFirebaseRef.current = false;
        }
      })();
    }

    const handleBeforeUnload = () => {
      try {
        const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
        if (raw) {
          const sessions = JSON.parse(raw);
          delete sessions[myId];
          localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(sessions));
        }
      } catch {}
      if (firebaseCleanup) {
        firebaseCleanup();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  return listenerCount;
}
