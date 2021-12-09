import React, { ReactNode } from 'react';
import { Icon, NodeBody, Title } from '../components/Elements';

import { FNode, NodeTypes } from './Node';

export class NumberLiteralNode extends FNode {
  value: string = '';

  constructor(id: number) {
    super(id, NodeTypes.NumberLiteral);
  }

  asReactNode(): ReactNode {
    return (
      <>
        <Icon>🎲</Icon>
        <NodeBody>
          <Title>{this.value}</Title>
        </NodeBody>
      </>
    );
  }

  getChildren(): FNode[] {
    return [];
  }
}
