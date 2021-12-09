import React, { ReactNode } from 'react';
import { Title } from '../components/Elements';

import { FNode, NodeTypes } from './Node';

export class UnaryExpressionNode extends FNode {
  expr?: FNode;
  op?: string;

  constructor(id: number) {
    super(id, NodeTypes.UnaryExpr);
  }

  asReactNode(): ReactNode {
    return (
      <>
        <Title>{this.op ? this.op : '???'}</Title>
      </>
    );
  }
  getChildren(): FNode[] {
    if (this.expr) {
      return [this.expr];
    }
    return [];
  }
}
