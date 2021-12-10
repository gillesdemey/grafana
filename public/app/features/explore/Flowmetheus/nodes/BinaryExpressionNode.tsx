import { Icon } from '@grafana/ui';
import React, { ReactNode } from 'react';
import { FNode, NodeTypes } from './Node';
import { InfoIcon } from '../components/Elements';
import { StringLiteralNode } from './StringLiteralNode';

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
        <Icon name="calculator-alt" style={{ fill: '#FF5286' }} />
        <span style={{ marginLeft: '0.5rem' }}>
          {this.op ?? '???'} {this.modifiers}
        </span>
        <button
          className="doc-link-button"
          onClick={() =>
            window.open('https://prometheus.io/docs/prometheus/latest/querying/operators/#binary-operators', '_blank')
          }
        >
          <InfoIcon />
        </button>
      </div>
    );
  }

  getChildren(): FNode[] {
    return [this.lhs, this.rhs].filter((node) => node !== undefined).map((node) => node!);
  }

  getWarnings(): string[] {
    const warnings: string[] = [];
    if (!this.op || this.op === '') {
      warnings.push('this is missing the operation (e.g. /, *, +)');
    }
    if (!this.rhs) {
      warnings.push('this is missing a rhs');
    }
    if (this.lhs && this.lhs.type === NodeTypes.StringLiteral) {
      warnings.push((this.lhs as StringLiteralNode).val! + " is an invalid value for the lhs because it's a string");
    }
    if (this.rhs && this.rhs.type === NodeTypes.StringLiteral) {
      warnings.push((this.rhs as StringLiteralNode).val! + " is an invalid value for the rhs because it's a string");
    }
    return warnings;
  }
}
