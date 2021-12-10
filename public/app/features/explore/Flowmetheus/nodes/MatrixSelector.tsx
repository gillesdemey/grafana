import React, { ReactNode } from 'react';

import { FNode, NodeTypes } from './Node';
import { NodeBody, NodeContent, Title } from '../components/Elements';
import { Matcher, Matchers } from '../components/Matchers';
import { Icon } from '@grafana/ui';

interface MatcherProps {
  label: string;
  operator: string;
  value: string;
}

class MatrixSelectorNode extends FNode {
  identifier?: string;
  matchers: MatcherProps[] = [];
  duration?: string;

  constructor(id: number) {
    super(id, NodeTypes.MatrixSelector);
  }

  asReactNode(): ReactNode {
    return (
      <>
        {/* @ts-ignore */}
        <Icon name="crosshair" />
        <NodeBody>
          <Title>{this.identifier}</Title>
          <NodeContent>
            <Matchers>
              {this.matchers.map(({ label, operator, value }) => (
                <Matcher key={label + operator + value} label={label} comparator={operator} value={value} />
              ))}
              <Matcher value={this.duration} />
            </Matchers>
          </NodeContent>
        </NodeBody>
      </>
    );
  }

  getChildren(): FNode[] {
    return [];
  }
}

export { MatrixSelectorNode };
