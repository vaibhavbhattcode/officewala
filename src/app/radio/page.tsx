import fs from 'fs';
import path from 'path';
import { StationApp } from '@/components/StationApp';
import { Song, StationConfig } from '@/types/types';
import { STATIONS_MAP, StationDetail } from '@/data/stationsConfig';

type Props = {
  searchParams: Promise<{ station?: string }>;
};

export default async function RadioPage({ searchParams }: Props) {
  const params = await searchParams;
  const slug = params.station?.toLowerCase() || 'officewala';
  const detail: StationDetail = STATIONS_MAP[slug] || STATIONS_MAP.officewala;

  const stationRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'station.json'), 'utf-8');
  const songsRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'songs.json'), 'utf-8');
  const oneLinersRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'oneliners.json'), 'utf-8');

  const defaultStation: StationConfig = JSON.parse(stationRaw);
  const allSongs: Song[] = JSON.parse(songsRaw);
  const oneLiners: string[] = JSON.parse(oneLinersRaw);

  // Customize station config dynamically based on selected station slug
  const station: StationConfig = {
    ...defaultStation,
    name: detail.name,
    subtitle: detail.subtitle,
    tagline: detail.tagline,
    primaryColor: detail.primaryColor,
    secondaryColor: detail.secondaryColor,
  };

  // Assign dedicated song subset for each station to give each station its own unique vibe & playlist
  const filteredSongs = allSongs.filter((song) => {
    const num = parseInt(song.id.replace(/\D/g, ''), 10) || 0;
    if (slug === 'officewala') return num % 2 === 0;
    if (slug === 'tapriwala') return num % 2 === 1;
    if (slug === 'bhajanwala') return num % 3 === 0;
    if (slug === 'loriwala') return num % 3 === 1;
    if (slug === 'saloonwala') return num % 3 === 2;
    if (slug === 'partywala') return num % 4 === 0;
    return true;
  });

  const songsToPlay = filteredSongs.length >= 3 ? filteredSongs : allSongs;

  return (
    <main className="h-screen w-screen overflow-hidden">
      <StationApp
        station={station}
        songs={songsToPlay}
        oneLiners={oneLiners}
      />
    </main>
  );
}
