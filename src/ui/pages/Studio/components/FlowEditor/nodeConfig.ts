import { type NodeShape } from './NodeTypes';
import { RectNode, RoundNode, DiamondNode, CircleNode } from './NodeTypes';

export const nodeTypes = {
  rect: RectNode,
  round: RoundNode,
  diamond: DiamondNode,
  circle: CircleNode,
};

export const nodeShapeOptions: { value: NodeShape; label: string }[] = [
  { value: 'rect', label: 'Retângulo' },
  { value: 'round', label: 'Arredondado' },
  { value: 'diamond', label: 'Losango (decisão)' },
  { value: 'circle', label: 'Círculo' },
];
