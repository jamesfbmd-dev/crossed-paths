export interface Person {
  id: string;
  name: string;
  avatar: string;
  countries: string[];
  connections: string[];
}

export type ViewMode = 'list' | 'network';

export type ModalMode = 'add' | 'edit' | null;
