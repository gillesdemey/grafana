import React, { ReactNode } from 'react';
import { Title } from '../components/Elements';

import { FNode, NodeTypes } from './Node';

// Represents the syntax nodes we don't have special handling for
export class FallbackNode extends FNode {
  // should this extend expr node?
  expr: string;

  constructor(id: number, expr: string) {
    super(id, NodeTypes.Fallback);
    this.expr = expr;
  }

  asReactNode(): ReactNode {
    return (
      <>
        <Title>{this.expr}</Title>
      </>
    );
  }

  getChildren(): FNode[] {
    return [];
  }
}
