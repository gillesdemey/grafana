import React, { ReactNode } from 'react';

import { FNode, NodeTypes } from './Node';

// https://prometheus.io/docs/prometheus/latest/querying/basics/#modifier
export class StepInvariantExpressionNode extends FNode {
  expr?: FNode;
  modifiers?: string;

  constructor(id: number) {
    super(id, NodeTypes.StepInvariantExpr);
  }

  asReactNode(): ReactNode {
    return (
      <div>
        <div>@ {this.modifiers ? this.modifiers : '???'}</div>
      </div>
    );
  }
  getChildren(): FNode[] {
    if (this.expr) {
      return [this.expr];
    }
    return [];
  }
}
