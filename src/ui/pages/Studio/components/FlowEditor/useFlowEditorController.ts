import { useCallback, useState } from 'react';
import {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import { toast } from 'sonner';
import { type NodeShape } from './NodeTypes';
const initialNodes: Node[] = [
  { id: '1', type: 'circle', position: { x: 220, y: 60 }, data: { label: 'Início' } },
  { id: '2', type: 'rect', position: { x: 220, y: 180 }, data: { label: 'Processo' } },
  { id: '3', type: 'diamond', position: { x: 220, y: 300 }, data: { label: 'Decisão?' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

function nodeToMermaid(n: Node): string {
  const label = String(n.data.label);
  const id = n.id;
  switch (n.type as NodeShape) {
    case 'circle':   return `    ${id}(("${label}"))`;
    case 'round':    return `    ${id}("${label}")`;
    case 'diamond':  return `    ${id}{"${label}"}`;
    default:         return `    ${id}["${label}"]`;
  }
}

function toMermaid(nodes: Node[], edges: Edge[]): string {
  const lines = ['graph TD'];
  nodes.forEach(n => lines.push(nodeToMermaid(n)));
  edges.forEach(e => {
    const label = e.label ? ` |${String(e.label)}|` : '';
    lines.push(`    ${e.source} -->${label} ${e.target}`);
  });
  return '```mermaid\n' + lines.join('\n') + '\n```';
}

export function useFlowEditorController() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [copied, setCopied] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) ?? null;
  const mermaid = toMermaid(nodes, edges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges(eds => addEdge(connection, eds)),
    [setEdges],
  );

  function handleAddNode(shape: NodeShape = 'rect') {
    const id = String(Date.now());
    setNodes(nds => [...nds, {
      id,
      type: shape,
      position: { x: 150 + Math.random() * 200, y: 80 + nds.length * 100 },
      data: { label: 'Novo nó' },
    }]);
    setSelectedNodeId(id);
  }

  function handleDeleteSelected() {
    if (!selectedNodeId) return;
    setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
    setEdges(eds => eds.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
    setSelectedNodeId(null);
  }

  function handleLabelChange(label: string) {
    if (!selectedNodeId) return;
    setNodes(nds => nds.map(n =>
      n.id === selectedNodeId ? { ...n, data: { ...n.data, label } } : n,
    ));
  }

  function handleShapeChange(shape: NodeShape) {
    if (!selectedNodeId) return;
    setNodes(nds => nds.map(n =>
      n.id === selectedNodeId ? { ...n, type: shape } : n,
    ));
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(mermaid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Bloco mermaid copiado!');
    } catch {
      toast.error('Não foi possível copiar.');
    }
  }

  return {
    nodes,
    edges,
    mermaid,
    copied,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleAddNode,
    handleDeleteSelected,
    handleLabelChange,
    handleShapeChange,
    handleCopy,
    handleNodeClick: setSelectedNodeId,
    handlePaneClick: () => setSelectedNodeId(null),
  };
}
