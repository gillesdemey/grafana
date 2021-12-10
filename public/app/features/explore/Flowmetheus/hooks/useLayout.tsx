import dagre from 'dagre';
import { Elements, isNode } from 'react-flow-renderer';

export type Direction = 'BT' | 'TB' | 'RL' | 'LR';

function layout(elements: Elements, direction: Direction = 'RL') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutedElements = () => {
    const isHorizontal = direction === 'LR' || direction === 'RL';
    const isInverted = direction.startsWith('R') || direction.startsWith('B');

    dagreGraph.setGraph({
      rankdir: direction,
      marginx: 50,
      marginy: 50,
      edgesep: 25,
    });

    elements.forEach((el) => {
      if (isNode(el)) {
        const domNode = document.querySelector(`[data-id="${el.id}"]`);
        if (!domNode) {
          return;
        }

        const { width, height } = domNode.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);
        dagreGraph.setNode(el.id, { width, height });
      } else {
        dagreGraph.setEdge(el.source, el.target);
      }
    });

    dagre.layout(dagreGraph);

    return elements.map((el) => {
      if (isNode(el)) {
        const domNode = document.querySelector(`[data-id="${el.id}"]`);
        if (!domNode) {
          return el;
        }

        const { width, height } = domNode.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);

        const nodeWithPosition = dagreGraph.node(el.id);
        // @ts-ignore
        el.targetPosition = isHorizontal ? (isInverted ? 'right' : 'left') : isInverted ? 'bottom' : 'top';
        // @ts-ignore
        el.sourcePosition = isHorizontal ? (isInverted ? 'left' : 'right') : isInverted ? 'top' : 'bottom';

        // unfortunately we need this little hack to pass a slightly different position
        // to notify react flow about the change. Moreover we are shifting the dagre node position
        // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
        el.position = {
          x: nodeWithPosition.x - width / 2,
          y: nodeWithPosition.y - height / 2,
        };
      }

      return el;
    });
  };

  return getLayoutedElements();
}

export { layout };
