import React from 'react';
import { InfoPageLayout } from '@/components/InfoPageLayout';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Music Wala Privacy Policy. Learn how we handle cookies, ads, and user data.',
};

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" subtitle="Last Updated: August 2026">
      <div className="space-y-6 text-white/80">
        <p>
          At <strong>Music Wala</strong>, accessible from <em>musicwala.life</em>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Music Wala and how we use it.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
          <p>
            Music Wala does not require user registration. We do not store or collect personal names, emails, addresses, or phone numbers unless you contact us directly.
          </p>
          <p>
            We use browser <strong>LocalStorage</strong> to save your favorites playlist preferences. This data remains on your physical machine and is never transmitted to our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Log Files</h2>
          <p>
            Music Wala follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic info.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Google DoubleClick DART Cookie & AdSense</h2>
          <p>
            Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <em>musicwala.life</em> and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
          </p>
          <a 
            href="https://policies.google.com/technologies/ads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-[#D9A441] hover:underline text-xs md:text-sm font-semibold"
          >
            https://policies.google.com/technologies/ads
          </a>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Advertising Partners Privacy Policies</h2>
          <p>
            Our advertising partners may use cookies and web beacons on our site. Our primary advertising partner is <strong>Google AdSense</strong>. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Music Wala, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="text-xs text-white/50">
            Note that Music Wala has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Third Party Privacy Policies</h2>
          <p>
            Music Wala's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">6. Consent</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}
