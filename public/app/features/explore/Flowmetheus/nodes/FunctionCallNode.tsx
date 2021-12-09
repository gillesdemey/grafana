import React, { ReactNode } from 'react';
import { Icon, InfoIcon, NodeBody, Title } from '../components/Elements';

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
        <Icon>ƒ</Icon>
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
