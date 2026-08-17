import React from 'react';
import { InfoPageLayout } from '@/components/InfoPageLayout';
import { Mail, MessageSquare, Music } from 'lucide-react';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Music Wala feedback, support, or track requests.',
};

export default function ContactPage() {
  return (
    <InfoPageLayout title="Contact Us" subtitle="Feedback • Support • Collaboration">
      <div className="text-white/90">
        <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
          Have feedback, found a bug, or want to suggest some retro classic songs to add to our playlist? We would love to hear from you. Get in touch with the team!
        </p>

        {/* Contact Methods Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 

            className="p-6 rounded-2xl border border-white/8 flex flex-col items-start transition-all duration-300 hover:border-[#D9A441]/40 hover:bg-white/[0.04] shadow-lg shadow-black/10"
            style={{ background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <div className="p-3 rounded-xl bg-[#D9A441]/10 border border-[#D9A441]/20 mb-4 text-[#D9A441]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">Email Support</h3>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              Reach out directly for general support, partnership queries, or DMCA inquiries.
            </p>
            <a 
              href="mailto:musicwalayug@gmail.com" 
              className="mt-5 text-xs font-semibold text-[#D9A441] hover:underline"
            >
              musicwalayug@gmail.com
            </a>
          </div>

          <div 
            className="p-6 rounded-2xl border border-white/8 flex flex-col items-start transition-all duration-300 hover:border-[#D9A441]/40 hover:bg-white/[0.04] shadow-lg shadow-black/10"
            style={{ background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <div className="p-3 rounded-xl bg-[#D9A441]/10 border border-[#D9A441]/20 mb-4 text-[#D9A441]">
              <Music className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase">Submit Songs</h3>
            <p className="text-xs text-white/50 mt-2 leading-relaxed">
              Have high-quality classic MP3/Lofi tracks? Send us suggestions for the next batch update.
            </p>
            <a 
              href="mailto:musicwalayug@gmail.com" 
              className="mt-5 text-xs font-semibold text-[#D9A441] hover:underline"
            >
              musicwalayug@gmail.com
            </a>
          </div>
        </div>

        {/* Feedback block */}
        <section 
          className="p-6 rounded-2xl border border-white/8 shadow-md shadow-black/10"
          style={{ background: 'rgba(255, 255, 255, 0.01)' }}
        >
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-[#D9A441]" /> Send us Feedback
          </h2>
          <p className="text-xs leading-relaxed text-white/60">
            Music Wala is a passion project built for the community. If you have recommendations for UI layouts, background video loops, equalizer profiles, or general styling themes, drop us an email. We actively read all emails and try to implement features in our weekend pushes.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  );
}

