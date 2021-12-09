import React, { ReactNode } from 'react';

import { FNode, NodeTypes } from './Node';

// TODO: how to visualise? should we just visualise the expression within the brackets?
export class ParenExpressionNode extends FNode {
  expr: FNode;

  constructor(id: number, expr: FNode) {
    super(id, NodeTypes.ParenExpression);
    this.expr = expr;
  }

  asReactNode(): ReactNode {
    return (
      <div>
        <div>()</div>
      </div>
    );
  }
  getChildren(): FNode[] {
    return [this.expr];
  }
}
