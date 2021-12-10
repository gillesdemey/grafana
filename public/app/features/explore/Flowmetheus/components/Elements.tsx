import React from 'react';
import styled from '@emotion/styled';
import { Icon } from '@grafana/ui';

export const Title = styled.header`
  font-size: 1rem;
  font-weight: bold;
  word-break: break-all;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const InfoIcon = () => <Icon name="info-circle" style={{ marginLeft: '0.5rem' }} />;

export const NodeBody = styled.div`
  margin-left: 0.5rem;
`;

export const NodeContent = styled.div`
  margin: 0.5rem 0;
`;
