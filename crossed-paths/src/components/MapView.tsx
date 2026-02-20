import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LOCATIONS } from '../data/locations';
import type { Person } from '../types';
import { LocationMarker } from './LocationMarker';

interface MapViewProps {
  people: Person[];
}

function MapEvents({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => {
      onMapClick();
    },
  });
  return null;
}

export function MapView({ people }: MapViewProps) {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(null);

  const peopleByLocation = useMemo(() => {
    const map: Record<string, Person[]> = {};
    people.forEach(p => {
      p.locationIds.forEach(locId => {
        if (!map[locId]) map[locId] = [];
        map[locId].push(p);
      });
    });
    return map;
  }, [people]);

  const handleMapClick = () => {
    setExpandedLocationId(null);
  };

  return (
    <div className="map-view-container">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <MapEvents onMapClick={handleMapClick} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {LOCATIONS.map(location => {
          const peopleAtLocation = peopleByLocation[location.id] || [];
          if (peopleAtLocation.length === 0) return null;

          const isExpanded = expandedLocationId === location.id;

          return (
            <LocationMarker
              key={location.id}
              location={location}
              people={peopleAtLocation}
              isExpanded={isExpanded}
              onToggle={(e: L.LeafletMouseEvent) => {
                if (e.originalEvent) {
                  e.originalEvent.stopPropagation();
                }
                setExpandedLocationId(isExpanded ? null : location.id);
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
