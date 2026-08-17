import React from 'react';
import { InfoPageLayout } from '@/components/InfoPageLayout';

export const metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer and fair use policy for Music Wala.',
};

export default function DisclaimerPage() {
  return (
    <InfoPageLayout title="Disclaimer" subtitle="Legal & Fair Use Statement">
      <div className="space-y-6 text-white/80">
        <p>
          If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <em>musicwalayug@gmail.com</em>.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Information Accuracy</h2>
          <p>
            All the information on this website - <em>musicwala.life</em> - is published in good faith and for general listening and entertainment purposes only. Music Wala does not make any warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website is strictly at your own risk. Music Wala will not be liable for any losses and/or damages in connection with the use of our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Copyright and Fair Use Disclaimer</h2>
          <p>
            Music Wala is a workspace radio directory compiled for personal, non-commercial streaming and work productivity support.
          </p>
          <p>
            We do not sell digital music files, distribute commercial albums, or charge membership fees. The audio files streamed on this site are sourced from user-curated indexes or public directories. All rights, copyright, and distribution licenses for the audio tracks remain with the original songwriters, recording artists, record labels, and producers.
          </p>
          <p>
            If you are the copyright owner of any track or background video listed on this station and wish to request its removal, please contact us at <em>musicwalayug@gmail.com</em> with proper proof of ownership, and we will remove the content from our playlist index immediately (within 24-48 hours).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Third-Party Advertisements</h2>
          <p>
            Our website uses third-party advertising services (specifically <strong>Google AdSense</strong>) to help offset website hosting costs, server maintenance, and CDNs. The presence of advertisements on our website does not constitute an endorsement, recommendation, or warranty of the products or services advertised. We are not responsible for the content, privacy policies, or business practices of the advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. External Links</h2>
          <p>
            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Consent</h2>
          <p>
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
