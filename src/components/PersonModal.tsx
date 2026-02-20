import { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { Person, ModalMode } from '../types';
import { LOCATIONS } from '../data/locations';
import { MultiSelect } from './MultiSelect';

interface PersonModalProps {
  mode: ModalMode;
  onClose: () => void;
  onSubmit: (data: Person) => void;
  existingPeople: Person[];
  initialData: Person | null;
}

export function PersonModal({ mode, onClose, onSubmit, existingPeople, initialData }: PersonModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [locationIds, setLocationIds] = useState<string[]>(initialData?.locationIds || []);
  const [conns, setConns] = useState<string[]>(initialData?.connections || []);

  const toggleConnection = (id: string) => {
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
            locationIds,
            connections: conns
          });
        }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Name</label>
          <input className="modal-input" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. John Doe" />

          <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>Countries visited</label>
          <div style={{ marginBottom: '1.25rem' }}>
            <MultiSelect
              label="Countries"
              options={LOCATIONS.map(l => ({ label: l.name, value: l.id }))}
              selected={locationIds}
              setSelected={setLocationIds}
            />
          </div>

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
