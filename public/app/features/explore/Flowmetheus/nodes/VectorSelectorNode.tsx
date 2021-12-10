import { Icon } from '@grafana/ui';
import React, { ReactNode } from 'react';
import { NodeBody, NodeContent, Title } from '../components/Elements';
import { Matcher, Matchers } from '../components/Matchers';
import { FNode, NodeTypes } from './Node';

interface MatcherProps {
  label: string;
  operator: string;
  value: string;
}

export class VectorSelectorNode extends FNode {
  identifier: string = '';
  matchers: MatcherProps[] = [];

  constructor(id: number) {
    super(id, NodeTypes.VectorSelector);
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
