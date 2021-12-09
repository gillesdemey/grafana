import React, { ReactNode } from 'react';

import { FNode, NodeTypes } from './Node';

export class OffsetExpressionNode extends FNode {
  expr?: FNode;
  sub: boolean = false;
  duration?: string;

  constructor(id: number) {
    super(id, NodeTypes.OffsetExpr);
  }

  asReactNode(): ReactNode {
    return (
      <div>
        <div>
          offset {this.sub && '-'} {this.duration ? this.duration : '???'}{' '}
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
