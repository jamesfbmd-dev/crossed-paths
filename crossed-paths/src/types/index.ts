export interface Person {
  id: string;
  name: string;
  avatar: string;
  countries: string[];
  connections: string[];
  locationId: string;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
}
