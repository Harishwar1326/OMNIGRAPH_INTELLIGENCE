import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { GraphData } from '../types';
import { toFlowEdges, toFlowNodes } from '../utils/graphLayout';

interface GraphCanvasProps {
  data: GraphData | null;
  onNodeClick?: (nodeId: string, label: string) => void;
}

export default function GraphCanvas({ data, onNodeClick }: GraphCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (data?.nodes?.length) {
      setNodes(toFlowNodes(data.nodes) as Node[]);
      setEdges(toFlowEdges(data.edges) as Edge[]);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [data, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node.id, String(node.data?.label ?? ''));
    },
    [onNodeClick]
  );

  if (!data?.nodes?.length) {
    return (
      <div className="flex h-[850px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-700/40">
        <p className="text-slate-500">No graph data yet. Upload a PDF to build your knowledge graph.</p>
      </div>
    );
  }

  return (
    <div className="h-[850px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#334155" gap={20} />
        <Controls className="!bg-slate-800 !border-slate-700 !shadow-lg" />
        <MiniMap
          nodeColor={(n) => {
            const t = (n.data as { type?: string })?.type ?? '';
            const colors: Record<string, string> = {
              Topic: '#3b82f6',
              Concept: '#10b981',
              Person: '#8b5cf6',
              Organization: '#6366f1',
              Technology: '#14b8a6',
              Event: '#f59e0b',
              Project: '#ec4899',
            };
            return colors[t] || '#6366f1';
          }}
          className="!bg-slate-900 !border-slate-700"
        />
      </ReactFlow>
    </div>
  );
}
