import { Icon } from '@grafana/ui';
import React, { ReactNode } from 'react';
import { NodeBody, Title } from '../components/Elements';

import { FNode, NodeTypes } from './Node';

export class NumberLiteralNode extends FNode {
  value: string = '';

  constructor(id: number) {
    super(id, NodeTypes.NumberLiteral);
  }

  asReactNode(): ReactNode {
    return (
      <>
        {/* @ts-ignore */}
        <Icon name="dice-three" />
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
