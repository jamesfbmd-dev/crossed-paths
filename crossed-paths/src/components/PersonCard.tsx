import { Edit2, Trash2 } from 'lucide-react';
import type { Person } from '../types';

interface PersonCardProps {
  person: Person;
  people: Person[];
  onEdit: (p: Person) => void;
  onDelete: (id: string) => void;
}

export function PersonCard({ person, people, onEdit, onDelete }: PersonCardProps) {
  return (
    <div className="person-card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <img src={person.avatar} alt={person.name} className="avatar-large" />
        <div className="actions">
          <button className="icon-btn" onClick={() => onEdit(person)}><Edit2 size={14} /></button>
          <button className="icon-btn" style={{color: 'var(--danger)'}} onClick={() => onDelete(person.id)}><Trash2 size={14} /></button>
        </div>
      </div>
      <div>
        <h3 style={{fontSize: '1rem', color: 'white', marginBottom: '0.2rem'}}>{person.name}</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem'}}>
          {person.countries.map(c => <span key={c} className="tag">{c}</span>)}
        </div>
      </div>
      <div style={{marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <div style={{display: 'flex'}}>
          {person.connections.slice(0, 4).map(cId => (
            <img key={cId} src={people.find(x => x.id === cId)?.avatar} style={{width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #020617', marginLeft: '-6px'}} />
          ))}
        </div>
        <span style={{fontSize: '0.65rem', color: 'var(--text-muted)'}}>
          {person.connections.length} Network Nodes
        </span>
      </div>
    </div>
  );
}
