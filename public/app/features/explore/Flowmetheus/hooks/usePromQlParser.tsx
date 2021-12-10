import { ReactNode } from 'react';
import { parser } from 'lezer-promql';
import { Tree, TreeCursor } from 'lezer-tree';
import { ArrowHeadType, Edge, Elements, Position } from 'react-flow-renderer';

import { parseQuery } from '../parser';
import { FNode } from '../nodes/Node';

export function usePromQlParser(query: string): [TreeCursor, Tree] {
  const tree = parser.parse(query);
  const cursor = tree.cursor();

  return [cursor, tree];
}

interface ElementData {
  label: ReactNode;
}

export function toElements(query: string): [Elements<ElementData>, Edge[]] {
  try {
    return toElementsInner(query);
  } catch (e) {
    console.error('could not convert elements: ' + e);
    return [
      [
        {
          id: 'unknown',
          data: {
            label: 'Could not display tree for ' + query,
          },
          position: { x: 100, y: 100 },
          sourcePosition: Position.Top,
          targetPosition: Position.Bottom,
        },
      ],
      [],
    ];
  }
}

export function toElementsInner(query: string): [Elements<ElementData>, Edge[]] {
  const elements: Elements = [];
  const edges: Edge[] = [];

  const root = parseQuery(query);
  if (!root) {
    return [elements, edges];
  }

  // some fun with positioning, 3p libs would do a better job though
  const nodes = getAllNodes(root);

  nodes.forEach((node) => {
    addNode(node, elements);
    node.getChildren().forEach((child) => addEdge(String(child.id), String(node.id), edges));
  });

  return [elements, edges];
}

function addNode(node: FNode, elements: Elements): void {
  elements.push({
    id: String(node.id),
    data: { label: node.asReactNode() },
    position: { x: 100, y: (node.id + 1) * 100 },
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
  });
}

function addEdge(source: string, target: string, edges: Edge[]) {
  edges.push({
    id: String(source) + '_' + String(target),
    source: String(source),
    target: String(target),
    animated: true,
    type: 'default',
    arrowHeadType: ArrowHeadType.ArrowClosed,
    style: { strokeWidth: 2 },
  });
}

// returns a list of all the nodes in the tree
export function getAllNodes(root: FNode): FNode[] {
  const nodes: FNode[] = [];
  getAllNodesInner(root, nodes);

  function getAllNodesInner(node: FNode, nodes: FNode[]): void {
    nodes.push(node);
    node.getChildren().forEach((child) => getAllNodesInner(child, nodes));
  }

  return nodes;
}
