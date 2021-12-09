import React, { ReactNode } from 'react';
import { FNode, NodeTypes } from './Node';

export class BinaryExpressionNode extends FNode {
  lhs?: FNode;
  rhs?: FNode;
  op?: string;
  modifiers?: string; //TODO: more advanced representation

  constructor(id: number) {
    super(id, NodeTypes.BinaryExpression);
  }

  asReactNode(): ReactNode {
    return (
      <div>
        {this.op} {this.modifiers}
      </div>
    );
  }

  getChildren(): FNode[] {
    return [this.lhs, this.rhs].filter((node) => node !== undefined).map((node) => node!);
  }
}
