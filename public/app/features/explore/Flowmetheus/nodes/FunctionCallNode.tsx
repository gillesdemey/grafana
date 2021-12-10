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
    var link = 'https://prometheus.io/docs/prometheus/latest/querying/functions/';
    if (this.identifier) {
      var anchor = this.identifier;
      if (this.identifier.endsWith('_over_time')) {
        anchor = 'aggregation_over_time';
      } else if (
        this.identifier.indexOf('sin') !== -1 ||
        this.identifier.indexOf('cos') !== -1 ||
        this.identifier.indexOf('tan') !== -1 ||
        this.identifier === 'deg' ||
        this.identifier === 'pi' ||
        this.identifier === 'rad'
      ) {
        anchor = 'trigonometric-functions';
      }
      link = 'https://prometheus.io/docs/prometheus/latest/querying/functions/#' + anchor;
    }
    return (
      <>
        {/* @ts-ignore */}
        <Icon name="brackets-curly" style={{ fill: '#6E9FFF' }} />
        <NodeBody>
          <Title>
            {this.identifier}
            <button onClick={() => window.open(link, '_blank')}>
              <InfoIcon />
            </button>
          </Title>
        </NodeBody>
      </>
    );
  }

  getChildren(): FNode[] {
    return this.args;
  }
}
