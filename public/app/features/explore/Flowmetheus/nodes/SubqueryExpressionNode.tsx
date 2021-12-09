import React, { ReactNode } from 'react';

import { FNode, NodeTypes } from './Node';

export class SubqueryExpressionNode extends FNode {
  expr?: FNode;
  range?: string;
  resolution?: string;

  constructor(id: number) {
    super(id, NodeTypes.SubqueryExpr);
  }

  asReactNode(): ReactNode {
    return (
      <div>
        <div>
          {' '}
          [{this.range ? this.range : '???'}:{this.resolution ? this.resolution : ''}]
        </div>
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
