import React, { ReactNode } from 'react';

import { FNode, NodeTypes } from './Node';

export class StringLiteralNode extends FNode {
  val?: string;

  constructor(id: number) {
    super(id, NodeTypes.StringLiteral);
  }

  asReactNode(): ReactNode {
    return (
      <div>
        <div>{this.val ?? '???'}</div>
      </div>
    );
  }
  getChildren(): FNode[] {
    return [];
  }
}
