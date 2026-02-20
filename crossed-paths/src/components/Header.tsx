import { Globe, Users, Share2, Map as MapIcon } from 'lucide-react';
import type { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function Header({ viewMode, setViewMode }: HeaderProps) {
  return (
    <header>
      <div className="brand" onClick={() => window.location.reload()}>
        <Globe size={24} /> Crossed Paths
      </div>
      <div className="view-controls">
        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
          <Users size={18} /> Directory
        </button>
        <button className={`view-btn ${viewMode === 'network' ? 'active' : ''}`} onClick={() => setViewMode('network')}>
          <Share2 size={18} /> Network
        </button>
        <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
          <MapIcon size={18} /> Map
        </button>
      </div>
    </header>
  );
}
