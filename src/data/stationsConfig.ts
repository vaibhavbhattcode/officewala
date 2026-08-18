export interface StationDetail {
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  category: string;
  description: string;
  keywords: string[];
  bannerCover: string;
}

export const STATIONS_MAP: Record<string, StationDetail> = {
  officewala: {
    slug: 'officewala',
    name: 'Officewala Stream',
    subtitle: 'FOCUS • CODE • FLOW',
    tagline: 'Deep focus beats & workspace flow',
    primaryColor: '#38bdf8', // Sky Cyan
    secondaryColor: '#0c4a6e',
    category: 'Lofi & Focus Beats',
    description: 'Ambient lofi beats and deep focus rhythms designed to keep developers and office workers in flow state all day.',
    keywords: ['lofi', 'focus', 'study', 'code', 'chill'],
    bannerCover: '/landing/cover_lofi.jpg',
  },
  tapriwala: {
    slug: 'tapriwala',
    name: 'Tapriwala Radio',
    subtitle: 'CHAI • NOSTALGIA • RETRO',
    tagline: 'Chai tapri classic melodies & vintage tunes',
    primaryColor: '#f59e0b', // Amber Gold
    secondaryColor: '#78350f',
    category: 'Vintage Bollywood',
    description: 'Golden era Bollywood classics, Kishore Kumar, RD Burman, and evergreen retro melodies loved at every chai tapri.',
    keywords: ['bollywood', 'retro', 'vintage', 'sholay', 'classic'],
    bannerCover: '/landing/cover_bollywood.jpg',
  },
  bhajanwala: {
    slug: 'bhajanwala',
    name: 'Bhajanwala Devotional',
    subtitle: 'PEACE • BHAKTI • MORNING CHANTS',
    tagline: 'Peaceful morning bhajans & spiritual vibes',
    primaryColor: '#fb923c', // Saffron Gold
    secondaryColor: '#7c2d12',
    category: 'Spiritual & Bhajans',
    description: 'Soothing morning bhajans, mantras, Aigiri Nandini, and meditative acoustic strums to start your day with divine peace.',
    keywords: ['bhajan', 'devotional', 'mantra', 'peace', 'spiritual'],
    bannerCover: '/landing/cover_acoustic.jpg',
  },
  loriwala: {
    slug: 'loriwala',
    name: 'Loriwala Highway Beats',
    subtitle: 'HIGHWAY • TRUCK • DHABA CLASSICS',
    tagline: 'Highway dhaba beats & long-haul truck tunes',
    primaryColor: '#ef4444', // Highway Crimson
    secondaryColor: '#7f1d1d',
    category: 'Highway Dhaba & Folk',
    description: 'High-energy highway truck jams, Punjabi folk, and dhaba classics played across Grand Trunk Road night drives.',
    keywords: ['highway', 'truck', 'dhaba', 'folk', 'punjabi'],
    bannerCover: '/landing/cover_jazz.jpg',
  },
  saloonwala: {
    slug: 'saloonwala',
    name: 'Saloonwala Grooming',
    subtitle: 'CHILL • GROOMING • POP VIBES',
    tagline: 'Trendy saloon grooming jams & chill hits',
    primaryColor: '#c084fc', // Grooming Violet
    secondaryColor: '#581c87',
    category: 'Saloon Grooming Hits',
    description: 'Smooth saloon lounge music, commercial pop edits, and relaxing beats playing at your favorite hair salon.',
    keywords: ['saloon', 'grooming', 'pop', 'chill', 'lounge'],
    bannerCover: '/landing/cover_midnight.jpg',
  },
  partywala: {
    slug: 'partywala',
    name: 'Partywala Night',
    subtitle: 'NEON • SYNTH • HIGH ENERGY',
    tagline: 'High-energy synthwave & night mood beats',
    primaryColor: '#f43f5e', // Neon Rose
    secondaryColor: '#881337',
    category: 'Party Synth & Beats',
    description: 'Pulsating neon synthwave, party remixes, and late-night electronic energy to turn up the mood anytime.',
    keywords: ['party', 'synthwave', 'dance', 'night', 'energy'],
    bannerCover: '/landing/cover_synthwave.jpg',
  },
};
