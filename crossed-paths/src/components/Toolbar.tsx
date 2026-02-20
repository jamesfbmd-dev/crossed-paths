import { Search, Undo2 } from 'lucide-react';
import { MultiSelect } from './MultiSelect';
import type { Person } from '../types';

interface ToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  allLocationOptions: { label: string; value: string }[];
  selectedLocationIds: string[];
  setSelectedLocationIds: (val: string[]) => void;
  people: Person[];
  selectedConnections: string[];
  setSelectedConnections: (val: string[]) => void;
}

export function Toolbar({
  search,
  setSearch,
  allLocationOptions,
  selectedLocationIds,
  setSelectedLocationIds,
  people,
  selectedConnections,
  setSelectedConnections
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search-wrapper">
        <Search size={18} />
        <input className="search-input" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <MultiSelect
        label="Countries"
        options={allLocationOptions}
        selected={selectedLocationIds}
        setSelected={setSelectedLocationIds}
      />
      <MultiSelect
        label="Connections"
        options={people.map(p => ({ label: p.name, value: p.id }))}
        selected={selectedConnections}
        setSelected={setSelectedConnections}
      />
      <button
        className="toolbar-reset"
        onClick={() => {
          setSelectedConnections([]);
          setSelectedLocationIds([]);
          setSearch('');
        }}
      >
        <Undo2 size={18} /> Reset Filters
      </button>
    </div>
  );
}
