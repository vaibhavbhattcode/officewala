'use client';

import React, { useEffect, useState, useRef } from 'react';

interface AdSenseBannerProps {
  adSlot: string;
  adFormat?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  onStatusChange?: (status: 'loading' | 'filled' | 'unfilled' | 'blocked') => void;
}

export function AdSenseBanner({ 
  adSlot, 
  adFormat = 'auto', 
  responsive = true, 
  style = { display: 'block' },
  onStatusChange
}: AdSenseBannerProps) {
  const [status, setStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');
  const insRef = useRef<HTMLModElement | null>(null);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000';

  useEffect(() => {
    // If client ID is placeholder (not configured), treat as unfilled immediately
    if (adsenseClientId === 'ca-pub-0000000000000000') {
      setStatus('unfilled');
      onStatusChange?.('unfilled');
      return;
    }

    if (typeof window === 'undefined') return;

    // Check if AdSense script is blocked by adblocker
    const isAdblockerActive = !(window as any).adsbygoogle;
    if (isAdblockerActive) {
      setStatus('blocked');
      onStatusChange?.('blocked');
      return;
    }

    let observer: MutationObserver | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      // Safely call push
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});

      // Set up MutationObserver to detect Google's status attribute on the <ins> element
      const insElement = insRef.current;
      if (insElement) {
        observer = new MutationObserver(() => {
          const adStatus = insElement.getAttribute('data-ad-status');
          if (adStatus === 'filled') {
            setStatus('filled');
            onStatusChange?.('filled');
            if (timeoutId) clearTimeout(timeoutId);
          } else if (adStatus === 'unfilled') {
            setStatus('unfilled');
            onStatusChange?.('unfilled');
            if (timeoutId) clearTimeout(timeoutId);
          }
        });

        observer.observe(insElement, { attributes: true, attributeFilter: ['data-ad-status'] });

        // Trigger immediate check in case status is already set
        const existingStatus = insElement.getAttribute('data-ad-status');
        if (existingStatus === 'filled' || existingStatus === 'unfilled') {
          setStatus(existingStatus as any);
          onStatusChange?.(existingStatus as any);
        }
      }

      // 5-second timeout in case it hangs or fails silently without updating attributes
      timeoutId = setTimeout(() => {
        if (insElement && !insElement.getAttribute('data-ad-status')) {
          setStatus('blocked');
          onStatusChange?.('blocked');
        }
      }, 5000);

    } catch (e) {
      console.warn('AdSense execution failed:', e);
      setStatus('blocked');
      onStatusChange?.('blocked');
    }

    return () => {
      if (observer) observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [adsenseClientId, onStatusChange]);

  if (status === 'blocked' || status === 'unfilled' || adsenseClientId === 'ca-pub-0000000000000000') {
    return null; // Render absolutely nothing if ad fails to load, is blocked, or is not configured
  }

  return (
    <div className="w-full overflow-hidden" style={{ minHeight: '90px' }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style}
        data-ad-client={adsenseClientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
