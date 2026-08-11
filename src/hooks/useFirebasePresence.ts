'use client';

import { useEffect, useState, useRef } from 'react';
import { getFirebaseDatabase } from '@/lib/firebase';

const PRESENCE_STORAGE_KEY = 'office_waala_active_sessions';

export function useFirebasePresence(): number {
  const [listenerCount, setListenerCount] = useState<number>(52);
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

    // Local multi-tab presence heartbeat
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
    }, 4000);

    // Realistic corporate listener base (e.g., 46 - 58) + local active tabs
    let baseOfficeAudience = 48 + Math.floor(Math.random() * 6);
    setListenerCount(baseOfficeAudience + activeLocalTabs);

    const driftInterval = setInterval(() => {
      if (hasFirebaseRef.current) return;
      const change = Math.random() > 0.52 ? 1 : -1;
      baseOfficeAudience = Math.max(42, Math.min(68, baseOfficeAudience + change));
      setListenerCount(baseOfficeAudience + activeLocalTabs);
    }, 5000 + Math.random() * 3000);

    // Firebase presence (if credentials configured)
    const db = getFirebaseDatabase();
    let firebaseCleanup: (() => void) | undefined;

    if (db) {
      (async () => {
        try {
          const { ref, set, onDisconnect, onValue, serverTimestamp } = await import(
            'firebase/database'
          );

          const sessionRef = ref(db, `presence/${myId}`);
          const presenceRoot = ref(db, 'presence');

          await set(sessionRef, {
            connected: true,
            timestamp: serverTimestamp(),
          });

          onDisconnect(sessionRef).remove();

          const unsubscribe = onValue(
            presenceRoot,
            (snapshot) => {
              const data = snapshot.val();
              const count = data ? Object.keys(data).length : 0;
              hasFirebaseRef.current = true;
              setListenerCount(Math.max(1, count + 45)); // Real presence + office floor broadcast
            },
            () => {
              hasFirebaseRef.current = false;
            }
          );

          firebaseCleanup = () => {
            unsubscribe();
            set(sessionRef, null).catch(() => {});
          };
        } catch {
          hasFirebaseRef.current = false;
        }
      })();
    }

    return () => {
      clearInterval(heartbeatInterval);
      clearInterval(driftInterval);
      firebaseCleanup?.();
      try {
        const raw = localStorage.getItem(PRESENCE_STORAGE_KEY);
        if (raw) {
          const sessions = JSON.parse(raw);
          delete sessions[myId];
          localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(sessions));
        }
      } catch {
        // ignore
      }
    };
  }, []);

  return listenerCount;
}
