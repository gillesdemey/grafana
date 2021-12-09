import React, { useLayoutEffect, useMemo, useState } from 'react';
import ReactFlow, { useStoreActions, useStoreState } from 'react-flow-renderer';

import { layout, Direction } from './hooks/useLayout';
import { toElements } from './hooks/usePromQlParser';

interface FlowProps {
  query: string;
}

interface AutoLayoutProps {
  direction: Direction;
}

const AutoLayout = ({ direction }: AutoLayoutProps) => {
  const [didLayout, setDidLayout] = useState<boolean>(false);

  const nodes = useStoreState((state) => state.nodes);
  const edges = useStoreState((state) => state.edges);
  const elements = useMemo(() => [...nodes, ...edges], [nodes, edges]);

  const setElements = useStoreActions((actions) => actions.setElements);

  useLayoutEffect(() => {
    if (didLayout || elements.length === 0) {
      return;
    }

    const layoutedElements = layout(elements, direction);
    setElements(layoutedElements);

    setDidLayout(true);
  }, [didLayout, direction, edges, elements, nodes, setElements]);

  return null;
};

const OverviewFlow = ({ query }: FlowProps) => {
  const [elements, edges] = toElements(query);

  return (
    <>
      <ReactFlow elements={[...elements, ...edges]} snapToGrid={false} snapGrid={[15, 15]}>
        <AutoLayout direction="RL" />
      </ReactFlow>
    </>
  );
};

export default OverviewFlow;
