export interface Person {
  id: string;
  name: string;
  avatar: string;
  locationIds: string[];
  connections: string[];
}

export interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
}

export type ViewMode = 'list' | 'network' | 'map';

export type ModalMode = 'add' | 'edit' | null;
