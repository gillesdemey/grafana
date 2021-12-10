import React, { ReactNode } from 'react';
import { Icon } from '@grafana/ui';

import { FNode, NodeTypes } from './Node';
import { ExpressionNode } from './ExpressionNode';
import { InfoIcon, NodeBody, NodeContent, Title } from '../components/Elements';
import { Matcher, Matchers } from '../components/Matchers';

export class AggregateExpressionNode extends ExpressionNode {
  op: string = '';
  by: boolean = false;
  without: boolean = false;
  labels: string[] = [];
  exprs: FNode[] = [];

  constructor(id: number) {
    super(id, NodeTypes.AggregateExpression);
  }

  asReactNode(): ReactNode {
    return (
      <>
        {/* @ts-ignore */}
        <Icon name="pathfinder-unite" />
        <NodeBody>
          <Title>
            {this.op}
            {this.by && ' by '}
            {this.without && ' without '}
            <InfoIcon />
          </Title>
          <NodeContent>
            <Matchers style={{ display: 'inline' }}>
              {this.labels.map((label) => (
                <Matcher key={label} label={label} />
              ))}
            </Matchers>
          </NodeContent>
        </NodeBody>
      </>
    );
  }

  getChildren(): FNode[] {
    return this.exprs;
  }
}
