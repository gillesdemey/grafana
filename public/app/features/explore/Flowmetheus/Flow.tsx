import React, { useLayoutEffect, useMemo, useState } from 'react';
import ReactFlow, { Elements } from 'react-flow-renderer';

import { layout } from './hooks/useLayout';
import { toElements } from './hooks/usePromQlParser';

interface FlowProps {
  query: string;
}

const OverviewFlow = ({ query }: FlowProps) => {
  const [nodes, edges] = useMemo(() => toElements(query), [query]);
  const [elements, setElements] = useState<Elements>([...nodes, ...edges]);

  useLayoutEffect(() => {
    const [nodes, edges] = toElements(query);
    setElements(layout([...nodes, ...edges], 'RL'));
  }, [query]);

  return (
    <>
      <ReactFlow elements={elements} snapToGrid={false} snapGrid={[15, 15]}></ReactFlow>
    </>
  );
};

export default OverviewFlow;
