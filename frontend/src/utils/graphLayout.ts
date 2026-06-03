import type { GraphEdge, GraphNode } from '../types';

const TYPE_COLORS: Record<string, string> = {
  Topic: '#3b82f6',
  Concept: '#10b981',
  Person: '#8b5cf6',
  Organization: '#6366f1',
  Technology: '#14b8a6',
  Event: '#f59e0b',
  Project: '#ec4899',
  default: '#64748b',
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}

export function toFlowNodes(nodes: GraphNode[]) {
  const cols = Math.ceil(Math.sqrt(nodes.length)) || 1;
  return nodes.map((n, i) => ({
    id: n.id,
    data: { label: n.label, type: n.type },
    position: {
      x: (i % cols) * 220 + 40,
      y: Math.floor(i / cols) * 120 + 40,
    },
    style: {
      background: 
        n.status === 'REMOVED' ? '#7f1d1d' : 
        n.status === 'ADDED' ? '#065f46' : 
        n.status === 'MODIFIED' ? '#1e3a8a' : 
        getTypeColor(n.type),
      color: '#fff',
      border: 
        n.status === 'REMOVED' ? '2px dashed #f87171' : 
        n.status === 'ADDED' ? '2px solid #34d399' : 
        n.status === 'MODIFIED' ? '2px solid #60a5fa' : 
        '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: '12px 16px',
      fontSize: 13,
      fontWeight: '700',
      minWidth: 140,
      textAlign: 'center' as const,
      boxShadow: n.status ? '0 0 25px rgba(0, 0, 0, 0.4)' : 'none',
      opacity: n.status === 'REMOVED' ? 0.6 : 1,
    },
  }));
}

export function toFlowEdges(edges: GraphEdge[]) {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label?.replace(/_/g, ' '),
    animated: true,
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    labelStyle: { fill: '#64748b', fontSize: 10, fontWeight: 500 },
  }));
}
