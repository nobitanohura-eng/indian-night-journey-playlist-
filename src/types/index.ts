export interface Route {
  id: string;
  from: string;
  to: string;
  highway: string;
  departureTime: string;
  duration: string;
  nextStop: string;
  fare?: string;
  type?: string;
}

export interface Ticket {
  pnr: string;
  seat: string;
  route: Route;
  boardingTime: string;
  journeyNumber: string;
}

export type ViewMode = 'WINDOW' | 'DRIVER' | 'LAST_SEAT';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
}

export interface ExternalLinks {
  spotify?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  icon?: string;
  tracks: Track[];
  externalLinks?: ExternalLinks;
}
