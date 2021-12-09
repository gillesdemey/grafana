import React from 'react';
import styled from '@emotion/styled';

interface MatcherProps {
  label?: string;
  value?: string;
  comparator?: string;
}

const Matcher = ({ label, value, comparator }: MatcherProps) => (
  <Wrapper>
    <Key>{label}</Key>
    <Comparator>{comparator}</Comparator>
    <Value>{value}</Value>
  </Wrapper>
);

const Matchers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-start;
`;

const Wrapper = styled.div`
  display: inline-block;
  border: 1px solid #343b40;
  color: hsl(240deg 19% 83%);
  opacity: 0.85;
  border-radius: 2px;

  padding: 0.25rem 0.5rem;
`;

const Key = styled.span`
  color: #779ff8;
`;

const Value = styled.span`
  color: hsl(141deg 51% 62%);
`;

const Comparator = styled.span`
  color: #90919d;
`;

export { Matcher, Matchers };
