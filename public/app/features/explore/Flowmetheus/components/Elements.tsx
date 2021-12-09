import React from 'react';
import styled from '@emotion/styled';
import { Elements } from 'react-flow-renderer';

import { Matcher, Matchers } from './Matchers';

export const Title = styled.header`
  font-size: 1rem;
  font-weight: bold;
  word-break: break-all;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled.span`
  width: 1rem;
  height: 1rem;
  font-size: 1rem;
  line-height: 1.3em;
`;

export const InfoIcon = styled(Icon)`
  margin-left: 0.5rem;

  width: 12px;
  height: 12px;

  border: solid 1px white;
  border-radius: 50%;

  text-align: center;

  font-size: 8px;
  line-height: 9px;

  :before {
    display: block;
    content: 'ℹ︎';
  }
`;

export const NodeBody = styled.div`
  margin-left: 0.5rem;
`;

export const NodeContent = styled.div`
  margin: 0.5rem 0;
`;

const initialElements: Elements = [
  // nodes
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          <Icon>∑</Icon>
          <NodeBody>
            <Title>sum by</Title>
            <Matchers>
              <Matcher label="mode" comparator="=" value="user" />
              <Matcher label="cpu" comparator="=" value="1" />
            </Matchers>
          </NodeBody>
        </>
      ),
    },
    position: { x: 225, y: 80 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          <Icon>ƒ</Icon>
          <NodeBody>
            <Title>rate</Title>
          </NodeBody>
        </>
      ),
    },
    position: { x: 250, y: 205 },
  },
  {
    id: '3',
    position: { x: 250, y: 300 },
    data: {
      label: (
        <>
          <Icon>☉</Icon>
          <NodeBody>
            <Title>node_cpu_seconds_total</Title>
            <Matchers>
              <Matcher label="mode" comparator="=" value="user" />
              <Matcher label="mode" comparator="=" value="system" />
            </Matchers>
          </NodeBody>
        </>
      ),
    },
  },

  // edges
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default initialElements;
