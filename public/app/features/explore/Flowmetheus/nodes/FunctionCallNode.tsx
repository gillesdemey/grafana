import { Icon } from '@grafana/ui';
import React, { ReactNode } from 'react';
import { InfoIcon, NodeBody, Title } from '../components/Elements';

import { FNode, NodeTypes } from './Node';

export class FunctionCallNode extends FNode {
  identifier?: string;
  args: FNode[] = [];

  constructor(id: number) {
    super(id, NodeTypes.FunctionCall);
  }

  asReactNode(): ReactNode {
    return (
      <>
        {/* @ts-ignore */}
        <Icon name="brackets-curly" style={{ fill: '#6E9FFF' }} />
        <NodeBody>
          <Title>
            {this.identifier} <InfoIcon />
          </Title>
        </NodeBody>
      </>
    );
  }

  getChildren(): FNode[] {
    return this.args;
  }
}
