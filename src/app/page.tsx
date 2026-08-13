import fs from 'fs';
import path from 'path';
import { StationApp } from '@/components/StationApp';
import { Song, StationConfig } from '@/types/types';

export default function Home() {
  // trigger refresh
  const stationRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'station.json'), 'utf-8');
  const songsRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'songs.json'), 'utf-8');
  const oneLinersRaw = fs.readFileSync(path.join(process.cwd(), 'data', 'oneliners.json'), 'utf-8');

  const station: StationConfig = JSON.parse(stationRaw);
  const songs: Song[] = JSON.parse(songsRaw);
  const oneLiners: string[] = JSON.parse(oneLinersRaw);

  return (
    <main className="h-screen w-screen overflow-hidden">
      <StationApp
        station={station}
        songs={songs}
        oneLiners={oneLiners}
      />
    </main>
  );
}
