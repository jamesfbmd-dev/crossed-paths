import { useState, useEffect, useRef, useMemo } from 'react';
import { Users, Share2, Plus, X, MapPin, Edit2, Trash2, Search, Filter, Globe, ChevronDown, Check, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

// --- STYLES ---
const cssStyles = `
  :root {
    --bg-base: #020617;
    --bg-panel: #0a0f1e;
    --bg-surface: rgba(13, 18, 36, 0.8);
    --bg-card: rgba(15, 23, 42, 0.9);
    --primary: #6366f1;
    --primary-bright: #818cf8;
    --primary-glow: rgba(99, 102, 241, 0.3);
    --danger: #ef4444;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --border-color: rgba(99, 102, 241, 0.25);
    --card-radius: 20px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    background-color: var(--bg-base);
    color: var(--text-main);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #020617 70%);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2rem;
    border-bottom: 1px solid var(--border-color);
    background: rgba(2, 6, 23, 0.85);
    backdrop-filter: blur(20px);
    z-index: 1000; /* High header z-index */
  }

  .brand {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--primary-bright);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
  }

  .toolbar {
    background: rgba(10, 15, 30, 0.6);
    padding: 1rem 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 500; /* Lower than header but higher than cards */
  }

  .search-wrapper {
    position: relative;
    flex: 1;
    min-width: 250px;
  }

  .search-wrapper svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary-bright);
    opacity: 0.8;
  }

  .search-input {
    width: 100%;
    background: #020617;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.7rem 1rem 0.7rem 2.8rem;
    color: white;
    font-size: 0.9rem;
    outline: none;
    transition: var(--transition);
  }

  .multi-select-container {
    position: relative;
    min-width: 200px;
  }

  .multi-select-trigger {
    background: #020617;
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 0.7rem 1rem;
    border-radius: 12px;
    font-size: 0.85rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    transition: var(--transition);
  }

  .multi-select-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: #0f172a;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.5rem;
    z-index: 2000; /* Highest z-index to fly over cards */
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
    display: none;
  }

  .multi-select-container.open .multi-select-dropdown {
    display: block;
  }

  .multi-option {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--text-main);
  }

  .multi-option:hover {
    background: rgba(99, 102, 241, 0.2);
  }

  .checkbox-visual {
    width: 18px;
    height: 18px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #020617;
    flex-shrink: 0;
  }

  .selected .checkbox-visual {
    background: var(--primary);
    border-color: var(--primary);
  }

  .view-controls {
    display: flex;
    background: #020617;
    padding: 0.25rem;
    border-radius: 14px;
    border: 1px solid var(--border-color);
  }

  .view-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 0.5rem 1rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: var(--transition);
  }

  .view-btn.active {
    background: var(--primary);
    color: white;
  }

  .list-view {
    padding: 2rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    align-content: start;
    z-index: 10; /* Base level for content */
  }

  .person-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--card-radius);
    padding: 1.5rem;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    z-index: 20;
  }

  .person-card:hover {
    transform: translateY(-6px);
    border-color: var(--primary);
    z-index: 21;
  }

  .avatar-large {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    object-fit: cover;
    border: 1px solid var(--border-color);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: 0.2s;
  }

  .person-card:hover .actions {
    opacity: 1;
  }

  .icon-btn {
    background: #020617;
    border: 1px solid var(--border-color);
    color: var(--primary-bright);
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
  }

  .tag {
    background: rgba(99, 102, 241, 0.2);
    color: #c7d2fe;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  .fab {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 20px;
    background: var(--primary);
    color: white;
    border: none;
    cursor: pointer;
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 23, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4000;
  }

  .modal-content {
    background: #0a0f1e;
    border: 1px solid var(--border-color);
    border-radius: 24px;
    width: 90%;
    max-width: 500px;
    padding: 2.5rem;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .modal-input {
    width: 100%;
    padding: 0.9rem 1rem;
    background: #020617;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: white;
    margin-bottom: 1.25rem;
    outline: none;
    font-size: 0.95rem;
    transition: var(--transition);
  }

  .modal-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-glow);
  }

  .connection-select-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
    padding: 0.5rem;
    background: #020617;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    margin-bottom: 2rem;
  }

  .connection-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: var(--transition);
    border: 1px solid transparent;
  }

  .connection-item:hover {
    background: rgba(99, 102, 241, 0.1);
  }

  .connection-item.selected {
    background: rgba(99, 102, 241, 0.2);
    border-color: var(--primary-glow);
  }

  .connection-item .name {
    color: #f1f5f9;
    font-size: 0.9rem;
    font-weight: 500;
    flex: 1;
  }

  .connection-item .checkbox-ui {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 2px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    background: transparent;
  }

  .connection-item.selected .checkbox-ui {
    background: var(--primary);
    border-color: var(--primary);
  }

  .network-container {
    position: absolute;
    inset: 0;
    cursor: grab;
    user-select: none;
    touch-action: none;
    overflow: hidden;
    z-index: 10;
  }
`;

// --- DATA ---
const INITIAL_PEOPLE = [
  { id: '1', name: 'Elena Rossi', avatar: 'https://i.pravatar.cc/150?u=1', countries: ['Italy', 'Spain'], connections: ['2', '4', '8', '12'] },
  { id: '2', name: 'Kenji Tanaka', avatar: 'https://i.pravatar.cc/150?u=2', countries: ['Japan', 'USA'], connections: ['1', '3', '5', '15'] },
  { id: '3', name: 'Sarah Smith', avatar: 'https://i.pravatar.cc/150?u=3', countries: ['UK', 'France'], connections: ['2', '6', '10'] },
  { id: '4', name: 'Mateo Garcia', avatar: 'https://i.pravatar.cc/150?u=4', countries: ['Spain', 'Brazil'], connections: ['1', '7', '14'] },
  { id: '5', name: 'Chen Wei', avatar: 'https://i.pravatar.cc/150?u=5', countries: ['China', 'Singapore'], connections: ['2', '9', '11'] },
  { id: '6', name: 'Amara Okafor', avatar: 'https://i.pravatar.cc/150?u=6', countries: ['Nigeria', 'Canada'], connections: ['3', '12', '18'] },
  { id: '7', name: 'Liam Wilson', avatar: 'https://i.pravatar.cc/150?u=7', countries: ['Australia'], connections: ['4', '13', '20'] },
  { id: '8', name: 'Sofia Müller', avatar: 'https://i.pravatar.cc/150?u=8', countries: ['Germany', 'Austria'], connections: ['1', '10', '16'] },
  { id: '9', name: 'Aarav Patel', avatar: 'https://i.pravatar.cc/150?u=9', countries: ['India', 'UAE'], connections: ['5', '11', '17'] },
  { id: '10', name: 'Isabelle Dubois', avatar: 'https://i.pravatar.cc/150?u=10', countries: ['France', 'Belgium'], connections: ['3', '8', '19'] },
  { id: '11', name: 'Yuki Sato', avatar: 'https://i.pravatar.cc/150?u=11', countries: ['Japan', 'South Korea'], connections: ['5', '9', '15'] },
  { id: '12', name: 'Luca Mancini', avatar: 'https://i.pravatar.cc/150?u=12', countries: ['Italy', 'Switzerland'], connections: ['1', '6', '16'] },
  { id: '13', name: 'Chloe Thompson', avatar: 'https://i.pravatar.cc/150?u=13', countries: ['USA', 'UK'], connections: ['7', '14', '20'] },
  { id: '14', name: 'Diego Silva', avatar: 'https://i.pravatar.cc/150?u=14', countries: ['Brazil', 'Portugal'], connections: ['4', '13', '18'] },
  { id: '15', name: 'Hana Kim', avatar: 'https://i.pravatar.cc/150?u=15', countries: ['South Korea', 'USA'], connections: ['2', '11', '17'] },
  { id: '16', name: 'Hans Weber', avatar: 'https://i.pravatar.cc/150?u=16', countries: ['Germany', 'Netherlands'], connections: ['8', '12', '19'] },
  { id: '17', name: 'Zoya Ahmed', avatar: 'https://i.pravatar.cc/150?u=17', countries: ['Pakistan', 'UK'], connections: ['9', '15', '20'] },
  { id: '18', name: 'Gabriel Santos', avatar: 'https://i.pravatar.cc/150?u=18', countries: ['Brazil', 'Spain'], connections: ['6', '14', '19'] },
  { id: '19', name: 'Emma Larsen', avatar: 'https://i.pravatar.cc/150?u=19', countries: ['Denmark', 'Norway'], connections: ['10', '16', '18'] },
  { id: '20', name: 'James Cook', avatar: 'https://i.pravatar.cc/150?u=20', countries: ['Australia', 'New Zealand'], connections: ['7', '13', '17'] },
];

export default function App() {
  const [people, setPeople] = useState(INITIAL_PEOPLE);
  const [viewMode, setViewMode] = useState('list');
  const [search, setSearch] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [modalMode, setModalMode] = useState(null); 
  const [editingPerson, setEditingPerson] = useState(null);

  const allCountries = useMemo(() => {
    const set = new Set();
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

  const handleSave = (data) => {
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

  const deletePerson = (id) => {
    setPeople(prev => prev.filter(p => p.id !== id).map(p => ({
      ...p, connections: p.connections.filter(c => c !== id)
    })));
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div className="app-layout">
        <header>
          <div className="brand" onClick={() => window.location.reload()}>
            <Globe size={24} /> GlobeTrotter
          </div>
          <div className="view-controls">
            <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
              <Users size={18} /> Directory
            </button>
            <button className={`view-btn ${viewMode === 'network' ? 'active' : ''}`} onClick={() => setViewMode('network')}>
              <Share2 size={18} /> Network
            </button>
          </div>
        </header>

        <div className="toolbar">
          <div className="search-wrapper">
            <Search size={18} />
            <input className="search-input" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <MultiSelect label="Countries" options={allCountries} selected={selectedCountries} setSelected={setSelectedCountries} />
          <MultiSelect label="Connections" options={people.map(p => ({ label: p.name, value: p.id }))} selected={selectedConnections} setSelected={setSelectedConnections} />
        </div>

        <main style={{flex: 1, position: 'relative', overflow: 'hidden'}}>
          {viewMode === 'list' ? (
            <div className="list-view">
              {filteredPeople.map(p => (
                <div key={p.id} className="person-card">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <img src={p.avatar} alt={p.name} className="avatar-large" />
                    <div className="actions">
                      <button className="icon-btn" onClick={() => { setEditingPerson(p); setModalMode('edit'); }}><Edit2 size={14} /></button>
                      <button className="icon-btn" style={{color: 'var(--danger)'}} onClick={() => deletePerson(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div>
                    <h3 style={{fontSize: '1rem', color: 'white', marginBottom: '0.2rem'}}>{p.name}</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem'}}>
                      {p.countries.map(c => <span key={c} className="tag">{c}</span>)}
                    </div>
                  </div>
                  <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <div style={{display: 'flex'}}>
                      {p.connections.slice(0, 4).map(cId => (
                        <img key={cId} src={people.find(x => x.id === cId)?.avatar} style={{width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #020617', marginLeft: '-6px'}} />
                      ))}
                    </div>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>
                      {p.connections.length} Network Nodes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : <NetworkView people={people} filteredIds={filteredPeople.map(p => p.id)} />}
          <button className="fab" onClick={() => setModalMode('add')}><Plus size={32} /></button>
        </main>

        {modalMode && (
          <PersonModal mode={modalMode} onClose={() => setModalMode(null)} onSubmit={handleSave} existingPeople={people} initialData={editingPerson} />
        )}
      </div>
    </>
  );
}

function MultiSelect({ label, options, selected, setSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const click = (e) => ref.current && !ref.current.contains(e.target) && setIsOpen(false);
    document.addEventListener('mousedown', click);
    return () => document.removeEventListener('mousedown', click);
  }, []);

  return (
    <div className={`multi-select-container ${isOpen ? 'open' : ''}`} ref={ref}>
      <button className="multi-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected.length === 0 ? `All ${label}` : `${selected.length} ${label}`}</span>
        <ChevronDown size={14} />
      </button>
      <div className="multi-select-dropdown">
        {options.map((opt) => {
          const val = opt.value || opt;
          const name = opt.label || opt;
          const isSelected = selected.includes(val);
          return (
            <div key={val} className={`multi-option ${isSelected ? 'selected' : ''}`}
                 onClick={() => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])}>
              <div className="checkbox-visual">{isSelected && <Check size={12} strokeWidth={3} />}</div>
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PersonModal({ mode, onClose, onSubmit, existingPeople, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [countries, setCountries] = useState(initialData?.countries.join(', ') || '');
  const [conns, setConns] = useState(initialData?.connections || []);

  const toggleConnection = (id) => {
    setConns(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: 'white', margin: 0 }}>{mode === 'add' ? 'New Contact' : 'Edit Profile'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
        </div>
        
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit({
            id: initialData?.id || Date.now().toString(),
            name,
            avatar: initialData?.avatar || `https://i.pravatar.cc/150?u=${name}`,
            countries: countries.split(',').map(s => s.trim()).filter(Boolean),
            connections: conns
          });
        }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. John Doe" />
          
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Countries visited</label>
          <input className="modal-input" value={countries} onChange={e => setCountries(e.target.value)} placeholder="e.g. Italy, USA, Japan" />

          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Connect with your network</label>
          <div className="connection-select-list">
            {existingPeople.filter(p => p.id !== initialData?.id).map(p => {
              const isSelected = conns.includes(p.id);
              return (
                <div 
                  key={p.id} 
                  className={`connection-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleConnection(p.id)}
                >
                  <img src={p.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                  <span className="name">{p.name}</span>
                  <div className="checkbox-ui">
                    {isSelected && <Check size={14} strokeWidth={3} color="white" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button type="submit" style={{
            width: '100%', 
            padding: '1rem', 
            background: 'var(--primary)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: '600',
            fontSize: '1rem',
            marginTop: '0.5rem',
            transition: 'var(--transition)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            {mode === 'add' ? 'Create Contact' : 'Update Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function NetworkView({ people, filteredIds }) {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const requestRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;

    nodesRef.current = people.map(p => {
      const existing = nodesRef.current.find(n => n.id === p.id);
      return {
        ...p,
        x: existing?.x || w / 2 + (Math.random() - 0.5) * 200,
        y: existing?.y || h / 2 + (Math.random() - 0.5) * 200,
        vx: 0,
        vy: 0
      };
    });

    const edgeSet = new Set();
    const newEdges = [];
    people.forEach(p => p.connections.forEach(tId => {
      const id = [p.id, tId].sort().join('-');
      if (!edgeSet.has(id)) {
        edgeSet.add(id);
        newEdges.push({ source: p.id, target: tId });
      }
    }));
    edgesRef.current = newEdges;

  }, [people]);

  useEffect(() => {
    const frame = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const nodes = nodesRef.current;
      const edges = edgesRef.current;

      const repulsion = 2000;
      const attraction = 0.05;
      const friction = 0.82;
      const centerForce = 0.01;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);
          const force = repulsion / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          n1.vx += fx; n1.vy += fy;
          n2.vx -= fx; n2.vy -= fy;
        }
      }

      edges.forEach(edge => {
        const s = nodes.find(n => n.id === edge.source);
        const t = nodes.find(n => n.id === edge.target);
        if (!s || !t) return;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 150) * attraction;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        s.vx += fx; s.vy += fy;
        t.vx -= fx; t.vy -= fy;
      });

      const updatedPositions = {};
      nodes.forEach(n => {
        n.vx += (w / 2 - n.x) * centerForce;
        n.vy += (h / 2 - n.y) * centerForce;

        if (n.id === draggingNode?.id) {
          n.x = draggingNode.simX;
          n.y = draggingNode.simY;
          n.vx = 0;
          n.vy = 0;
        } else {
          n.vx *= friction;
          n.vy *= friction;
          n.x += n.vx;
          n.y += n.vy;
        }
        updatedPositions[n.id] = { x: n.x, y: n.y };
      });

      setPositions(updatedPositions);
      requestRef.current = requestAnimationFrame(frame);
    };

    requestRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(requestRef.current);
  }, [draggingNode]);

  const toSimCoords = (clientX, clientY) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - transform.x) / transform.k;
    const y = (clientY - rect.top - transform.y) / transform.k;
    return { x, y };
  };

  const handlePointerDown = (e, node) => {
    e.stopPropagation();
    if (node) {
      const coords = toSimCoords(e.clientX, e.clientY);
      setDraggingNode({ id: node.id, simX: coords.x, simY: coords.y });
    } else {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handlePointerMove = (e) => {
    if (draggingNode) {
      const coords = toSimCoords(e.clientX, e.clientY);
      setDraggingNode({ ...draggingNode, simX: coords.x, simY: coords.y });
    } else if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      }));
    }
  };

  const handlePointerUp = () => {
    setDraggingNode(null);
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = Math.pow(1.1, delta / 100);
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setTransform(prev => {
      const newK = Math.min(Math.max(prev.k * factor, 0.1), 5);
      const kRatio = newK / prev.k;
      return {
        k: newK,
        x: mouseX - (mouseX - prev.x) * kRatio,
        y: mouseY - (mouseY - prev.y) * kRatio
      };
    });
  };

  const adjustZoom = (delta) => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const factor = delta > 0 ? 1.2 : 0.8;
    setTransform(prev => {
      const newK = Math.min(Math.max(prev.k * factor, 0.1), 5);
      const kRatio = newK / prev.k;
      return {
        k: newK,
        x: (w / 2) - ((w / 2) - prev.x) * kRatio,
        y: (h / 2) - ((h / 2) - prev.y) * kRatio
      };
    });
  };

  const nodeInverseScale = 1 / transform.k;

  return (
    <div 
      ref={containerRef} 
      className="network-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerDown={(e) => handlePointerDown(e, null)}
      onWheel={handleWheel}
    >
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={(e) => { e.stopPropagation(); adjustZoom(1); }}><ZoomIn size={18} /></button>
        <button className="zoom-btn" onClick={(e) => { e.stopPropagation(); adjustZoom(-1); }}><ZoomOut size={18} /></button>
        <button className="zoom-btn" onClick={(e) => { e.stopPropagation(); setTransform({ x: 0, y: 0, k: 1 }); }}><Maximize size={18} /></button>
      </div>

      <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {edgesRef.current.map((e) => {
            const s = positions[e.source];
            const t = positions[e.target];
            if (!s || !t) return null;
            const isActive = hoveredNode === e.source || hoveredNode === e.target || draggingNode?.id === e.source || draggingNode?.id === e.target;
            return (
              <line 
                key={`${e.source}-${e.target}`} 
                x1={s.x} y1={s.y} x2={t.x} y2={t.y} 
                stroke={isActive ? "var(--primary)" : "rgba(99, 102, 241, 0.15)"} 
                strokeWidth={isActive ? 2.5 * nodeInverseScale : 1 * nodeInverseScale}
              />
            );
          })}

          {nodesRef.current.map(n => {
            const p = positions[n.id];
            if (!p) return null;
            const isFiltered = filteredIds.includes(n.id);
            const isHovered = hoveredNode === n.id;
            const isFocused = isHovered || (draggingNode?.id === n.id) || (hoveredNode && n.connections.includes(hoveredNode));

            return (
              <g 
                key={n.id} 
                className="node"
                transform={`translate(${p.x},${p.y}) scale(${nodeInverseScale})`}
                onPointerDown={(e) => handlePointerDown(e, n)}
                onMouseEnter={() => setHoveredNode(n.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ opacity: isFiltered ? (hoveredNode || draggingNode ? (isFocused ? 1 : 0.2) : 1) : 0.05 }}
              >
                <circle r={isFocused ? 26 : 22} fill="var(--bg-base)" stroke={isFocused ? "var(--primary-bright)" : "var(--border-color)"} strokeWidth={isFocused ? 3 : 1} />
                <clipPath id={`clip-${n.id}`}><circle r="20" /></clipPath>
                <image href={n.avatar} x="-20" y="-20" width="40" height="40" clipPath={`url(#clip-${n.id})`} />
                <g transform="translate(0, 38)">
                  <text textAnchor="middle" fill="white" fontSize="11" fontWeight="600" style={{ paintOrder: 'stroke', stroke: 'var(--bg-base)', strokeWidth: '4px', pointerEvents: 'none' }}>
                    {n.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}