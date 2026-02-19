import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import './styles/App.css';
import { INITIAL_PEOPLE } from './data/people';
import type { Person, ViewMode, ModalMode } from './types';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { PersonCard } from './components/PersonCard';
import { PersonModal } from './components/PersonModal';
import { NetworkView } from './components/NetworkView';

export default function App() {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [search, setSearch] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const allCountries = useMemo(() => {
    const set = new Set<string>();
    people.forEach(p => p.countries.forEach(c => set.add(c)));
    return Array.from(set).sort();
  }, [people]);

  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCountries = selectedCountries.length === 0 || 
        selectedCountries.some(c => p.countries.includes(c));
      const matchesConnections = selectedConnections.length === 0 || 
        selectedConnections.some(id => p.connections.includes(id));
      return matchesSearch && matchesCountries && matchesConnections;
    });
  }, [people, search, selectedCountries, selectedConnections]);

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
          allCountries={allCountries}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          people={people}
          selectedConnections={selectedConnections}
          setSelectedConnections={setSelectedConnections}
        />

        <main style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
          {viewMode === 'list' ? (
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
          ) : <NetworkView people={people} filteredIds={filteredPeople.map(p => p.id)} />}
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
