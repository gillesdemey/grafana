import React, { ReactNode } from 'react';
import { Icon } from '@grafana/ui';

import { FNode, NodeTypes } from './Node';
import { ExpressionNode } from './ExpressionNode';
import { InfoIcon, NodeBody, NodeContent, Title } from '../components/Elements';
import { Matcher, Matchers } from '../components/Matchers';
import { MatrixSelectorNode } from './MatrixSelector';

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
            <button
              onClick={() =>
                window.open(
                  'https://prometheus.io/docs/prometheus/latest/querying/operators/#aggregation-operators',
                  '_blank'
                )
              }
            >
              <InfoIcon />
            </button>
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

  getWarnings(): string[] {
    if (this.exprs.length === 0) {
      return [];
    }
    const expr = this.exprs[0];
    if (this.op && expr.type === NodeTypes.MatrixSelector && (expr as MatrixSelectorNode).identifier) {
      const vExpr = expr as MatrixSelectorNode;
      const expected = this.op + '(rate(' + vExpr.identifier + '{...}[1m]))';
      return [
        "You can't call " + this.op + ' directly on a range vector selector, did you mean to write ' + expected + '?',
      ];
    }
    return [];
  }
}
