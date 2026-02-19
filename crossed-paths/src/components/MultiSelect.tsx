import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: any[];
  selected: any[];
  setSelected: (val: any) => void;
}

export function MultiSelect({ label, options, selected, setSelected }: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const click = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setIsOpen(false);
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
                 onClick={() => setSelected((prev: any[]) => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])}>
              <div className="checkbox-visual">{isSelected && <Check size={12} strokeWidth={3} />}</div>
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
