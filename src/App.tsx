import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import './styles/App.css';
import { INITIAL_PEOPLE } from './data/people';
import { LOCATIONS } from './data/locations';
import type { Person, ViewMode, ModalMode } from './types';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { PersonCard } from './components/PersonCard';
import { PersonModal } from './components/PersonModal';
import { NetworkView } from './components/NetworkView';
import { MapView } from './components/MapView';

export default function App() {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);


  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesLocations = selectedLocationIds.length === 0 ||
        selectedLocationIds.some(id => p.locationIds.includes(id));
      const matchesConnections = selectedConnections.length === 0 || 
        selectedConnections.some(id => p.connections.includes(id));
      return matchesSearch && matchesLocations && matchesConnections;
    });
  }, [people, search, selectedLocationIds, selectedConnections]);

  const handleSave = (data: Person) => {
    if (modalMode === 'add') {
      setPeople(prev => {
        const updated = [...prev, data];
        return updated.map(p => {
          if (data.connections.includes(p.id) && !p.connections.includes(data.id)) {
            return { ...p, connections: [...p.connections, data.id] };
          }
          return p;
        });
      });
    } else {
      setPeople(prev => prev.map(p => {
        if (p.id === data.id) return data;
        const isNowConnected = data.connections.includes(p.id);
        const wasConnected = p.connections.includes(data.id);
        if (isNowConnected && !wasConnected) return { ...p, connections: [...p.connections, data.id] };
        if (!isNowConnected && wasConnected) return { ...p, connections: p.connections.filter(id => id !== data.id) };
        return p;
      }));
    }
    setModalMode(null);
  };

  const deletePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id).map(p => ({
      ...p, connections: p.connections.filter(c => c !== id)
    })));
  };

  return (
    <>
      <div className="app-layout">
        <Header viewMode={viewMode} setViewMode={setViewMode} />

        <Toolbar
          search={search}
          setSearch={setSearch}
          allLocationOptions={LOCATIONS.map(l => ({ label: l.name, value: l.id }))}
          selectedLocationIds={selectedLocationIds}
          setSelectedLocationIds={setSelectedLocationIds}
          people={people}
          selectedConnections={selectedConnections}
          setSelectedConnections={setSelectedConnections}
        />

        <main style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
          {viewMode === 'list' && (
            <div className="list-view">
              {filteredPeople.map(p => (
                <PersonCard
                  key={p.id}
                  person={p}
                  people={people}
                  onEdit={(person) => { setEditingPerson(person); setModalMode('edit'); }}
                  onDelete={deletePerson}
                />
              ))}
            </div>
          )}
          {viewMode === 'network' && <NetworkView people={people} filteredIds={filteredPeople.map(p => p.id)} />}
          {viewMode === 'map' && <MapView people={filteredPeople} />}

          <button className="fab" onClick={() => { setEditingPerson(null); setModalMode('add'); }}><Plus size={32} /></button>
        </main>

        {modalMode && (
          <PersonModal
            mode={modalMode}
            onClose={() => setModalMode(null)}
            onSubmit={handleSave}
            existingPeople={people}
            initialData={editingPerson}
          />
        )}
      </div>
    </>
  );
}
