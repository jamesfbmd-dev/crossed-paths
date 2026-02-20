import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Person, Location } from '../types';

interface LocationMarkerProps {
  location: Location;
  people: Person[];
  isExpanded: boolean;
  onToggle: (e: L.LeafletMouseEvent) => void;
}

export function LocationMarker({ location, people, isExpanded, onToggle }: LocationMarkerProps) {
  const icon = useMemo(() => {
    // If there's only one person and not expanded, show their avatar directly
    if (people.length === 1 && !isExpanded) {
      const person = people[0];
      return L.divIcon({
        html: `
          <div class="person-marker-single-wrapper">
            <div class="person-marker-single">
              <img src="${person.avatar}" alt="${person.name}" />
            </div>
            <div class="person-name-tooltip">${person.name}</div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    }

    // Show cluster marker with count
    const peopleHtml = isExpanded ? people.map((person, index) => {
      const angle = (index / people.length) * 2 * Math.PI;
      const radius = 60;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return `
        <div class="person-marker-expanded-outer" style="transform: translate(${x}px, ${y}px)">
          <div class="person-marker-expanded-inner">
            <img src="${person.avatar}" alt="${person.name}" />
            <span class="person-name-label">${person.name}</span>
          </div>
        </div>
      `;
    }).join('') : '';

    const iconHtml = `
      <div class="cluster-marker-container">
        <div class="cluster-marker">${people.length}</div>
        ${isExpanded ? `<div class="expanded-people-wrapper">${peopleHtml}</div>` : ''}
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-div-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  }, [people, isExpanded]);

  return (
    <Marker
      position={location.coordinates}
      icon={icon}
      eventHandlers={{ click: onToggle }}
    />
  );
}
