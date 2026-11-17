import { ReactFlow, Controls, Background, BackgroundVariant, ConnectionMode } from '@xyflow/react';
import { Check, Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/ui/components/ui/button';
import { nodeTypes, nodeShapeOptions } from './nodeConfig';
import { type NodeShape } from './NodeTypes';
import { useFlowEditorController } from './useFlowEditorController';
import '@xyflow/react/dist/style.css';

export function FlowEditor() {
  const {
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
    handleNodeClick,
    handlePaneClick,
    handleCopy,
  } = useFlowEditorController();

  return (
    <div className="flow-editor">
      <div className="flow-toolbar">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAddNode('rect')}>
            <Plus className="size-3.5" />Adicionar nó
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={!selectedNode}
          >
            <Trash2 className="size-3.5" />Remover
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copiado!' : 'Copiar mermaid'}
        </Button>
      </div>

      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => handleNodeClick(node.id)}
          onPaneClick={handlePaneClick}
          connectionMode={ConnectionMode.Loose}
          fitView
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        </ReactFlow>
      </div>

      {selectedNode && (
        <div className="flow-node-editor">
          <input
            className="flow-node-input"
            value={String(selectedNode.data.label)}
            onChange={e => handleLabelChange(e.target.value)}
            placeholder="Label do nó"
          />
          <div className="flow-shape-selector">
            {nodeShapeOptions.map(opt => (
              <button
                key={opt.value}
                className={`flow-shape-btn ${selectedNode.type === opt.value ? 'active' : ''}`}
                onClick={() => handleShapeChange(opt.value as NodeShape)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flow-output">
        <div className="flow-output-header"><span>Mermaid gerado</span></div>
        <pre className="flow-output-code">{mermaid}</pre>
      </div>
    </div>
  );
}
