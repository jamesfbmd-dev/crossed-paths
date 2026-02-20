import type { Person } from '../types';

export const INITIAL_PEOPLE: Person[] = [
  { id: '1', name: 'Elena Rossi', avatar: 'https://i.pravatar.cc/150?u=1', locationIds: ['portugal'], connections: ['2', '4', '8', '12'] },
  { id: '2', name: 'Kenji Tanaka', avatar: 'https://i.pravatar.cc/150?u=2', locationIds: ['japan', 'usa'], connections: ['1', '3', '5', '15'] },
  { id: '3', name: 'Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=3', locationIds: ['uk', 'france'], connections: ['2', '6', '10'] },
  { id: '4', name: 'Mateo Garcia', avatar: 'https://i.pravatar.cc/150?u=4', locationIds: ['brazil'], connections: ['1', '7', '14'] },
  { id: '5', name: 'Chen Wei', avatar: 'https://i.pravatar.cc/150?u=5', locationIds: ['china'], connections: ['2', '9', '11'] },
  { id: '6', name: 'Amara Okafor', avatar: 'https://i.pravatar.cc/150?u=6', locationIds: ['nigeria', 'canada'], connections: ['3', '12', '18'] },
  { id: '7', name: 'Liam Wilson', avatar: 'https://i.pravatar.cc/150?u=7', locationIds: ['australia'], connections: ['4', '13', '20'] },
  { id: '8', name: 'Sofia Müller', avatar: 'https://i.pravatar.cc/150?u=8', locationIds: ['germany'], connections: ['1', '10', '16'] },
  { id: '9', name: 'Aarav Patel', avatar: 'https://i.pravatar.cc/150?u=9', locationIds: ['india'], connections: ['5', '11', '17'] },
  { id: '10', name: 'Isabelle Dubois', avatar: 'https://i.pravatar.cc/150?u=10', locationIds: ['france'], connections: ['3', '8', '19'] },
  { id: '11', name: 'Yuki Sato', avatar: 'https://i.pravatar.cc/150?u=11', locationIds: ['japan'], connections: ['5', '9', '15'] },
  { id: '12', name: 'Luca Mancini', avatar: 'https://i.pravatar.cc/150?u=12', locationIds: ['germany'], connections: ['1', '6', '16'] },
  { id: '13', name: 'Chloe Thompson', avatar: 'https://i.pravatar.cc/150?u=13', locationIds: ['usa', 'uk'], connections: ['7', '14', '20'] },
  { id: '14', name: 'Diego Silva', avatar: 'https://i.pravatar.cc/150?u=14', locationIds: ['brazil', 'portugal'], connections: ['4', '13', '18'] },
  { id: '15', name: 'Hana Kim', avatar: 'https://i.pravatar.cc/150?u=15', locationIds: ['usa'], connections: ['2', '11', '17'] },
  { id: '16', name: 'Hans Weber', avatar: 'https://i.pravatar.cc/150?u=16', locationIds: ['germany'], connections: ['8', '12', '19'] },
  { id: '17', name: 'Zoya Ahmed', avatar: 'https://i.pravatar.cc/150?u=17', locationIds: ['uk'], connections: ['9', '15', '20'] },
  { id: '18', name: 'Gabriel Santos', avatar: 'https://i.pravatar.cc/150?u=18', locationIds: ['brazil'], connections: ['6', '14', '19'] },
  { id: '19', name: 'Emma Larsen', avatar: 'https://i.pravatar.cc/150?u=19', locationIds: ['france'], connections: ['10', '16', '18'] },
  { id: '20', name: 'James Cook', avatar: 'https://i.pravatar.cc/150?u=20', locationIds: ['australia'], connections: ['7', '13', '17'] },
];
