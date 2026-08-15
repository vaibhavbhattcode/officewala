import React from 'react';
import { InfoPageLayout } from '@/components/InfoPageLayout';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Music Wala Terms and Conditions of service.',
};

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms & Conditions" subtitle="Last Updated: August 2026">
      <div className="space-y-6 text-white/80">
        <p>
          Welcome to <strong>Music Wala</strong>! These terms and conditions outline the rules and regulations for the use of Music Wala's Website, located at <em>musicwala.life</em>.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Music Wala if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Intellectual Property & Streaming Rights</h2>
          <p>
            Unless otherwise stated, Music Wala is a streaming radio directory designed for workspace listening appreciation. The music tracks, song recordings, and cover arts remain the sole property of their respective copyright owners, record labels, and artists.
          </p>
          <p>
            Streaming of these media files is provided purely for personal, non-commercial, focus-appreciation purposes. You must not:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Republish or sell audio tracks from Music Wala.</li>
            <li>Redistribute, duplicate, download, or copy audio files directly from the stream assets.</li>
            <li>Hotlink directly to any `.mp3` or `.mp4` background sources hosted on this project.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. User Conduct</h2>
          <p>
            You agree not to use any automated scripts, scrapers, bots, or browser extension tools to query the audio streams, scrape the playlist directories, or bypass visual elements of the application.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Hyperlinking to our Content</h2>
          <p>
            Organizations, blogs, and developers may link to our home page (`musicwala.life`) so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Disclaimer of Warranties</h2>
          <p>
            The materials and audio streams on Music Wala's website are provided on an 'as is' basis. Music Wala makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Modifications to Terms</h2>
          <p>
            Music Wala may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
