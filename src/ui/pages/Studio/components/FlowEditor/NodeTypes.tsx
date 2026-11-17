import { Handle, Position, type NodeProps } from '@xyflow/react';

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Top} id="top-in" />
      <Handle type="source" position={Position.Bottom} id="bottom-out" />
      <Handle type="target" position={Position.Left} id="left-in" />
      <Handle type="source" position={Position.Right} id="right-out" />
    </>
  );
}

export function RectNode({ data, selected }: NodeProps) {
  return (
    <div className={`flow-node flow-node--rect ${selected ? 'selected' : ''}`}>
      <Handles />
      {String(data.label)}
    </div>
  );
}

export function RoundNode({ data, selected }: NodeProps) {
  return (
    <div className={`flow-node flow-node--round ${selected ? 'selected' : ''}`}>
      <Handles />
      {String(data.label)}
    </div>
  );
}

export function DiamondNode({ data, selected }: NodeProps) {
  return (
    <div className={`flow-node flow-node--diamond ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} id="left-in" />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="right" />
      <div className="flow-node--diamond-inner">
        <span>{String(data.label)}</span>
      </div>
    </div>
  );
}

export function CircleNode({ data, selected }: NodeProps) {
  return (
    <div className={`flow-node flow-node--circle ${selected ? 'selected' : ''}`}>
      <Handles />
      {String(data.label)}
    </div>
  );
}

export type NodeShape = 'rect' | 'round' | 'diamond' | 'circle';
