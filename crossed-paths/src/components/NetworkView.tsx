import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import type { Person } from '../types';

interface NetworkViewProps {
  people: Person[];
  filteredIds: string[];
}

interface Node extends Person {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Edge {
  source: string;
  target: string;
}

interface Position {
  x: number;
  y: number;
}

export function NetworkView({ people, filteredIds }: NetworkViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<{ id: string; simX: number; simY: number } | null>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const requestRef = useRef<number>(0);

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

    const edgeSet = new Set<string>();
    const newEdges: Edge[] = [];
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

      const updatedPositions: Record<string, Position> = {};
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

  const toSimCoords = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left - transform.x) / transform.k;
    const y = (clientY - rect.top - transform.y) / transform.k;
    return { x, y };
  };

  const handlePointerDown = (e: React.PointerEvent, node: Node | null) => {
    e.stopPropagation();
    if (node) {
      const coords = toSimCoords(e.clientX, e.clientY);
      setDraggingNode({ id: node.id, simX: coords.x, simY: coords.y });
    } else {
      setIsPanning(true);
      panStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
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

  const handleWheel = (e: React.WheelEvent) => {
    const delta = -e.deltaY;
    const factor = Math.pow(1.1, delta / 100);
    if (!containerRef.current) return;
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

  const adjustZoom = (delta: number) => {
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
