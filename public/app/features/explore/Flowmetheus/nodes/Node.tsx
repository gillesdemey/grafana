import { ReactNode } from 'react';
import { FlowElement, Position } from 'react-flow-renderer';

// types mapped from exprs in https://github.com/prometheus/lezer-promql/blob/main/src/promql.grammar#L27
export enum NodeTypes {
  FunctionCall,
  MatrixSelector,
  AggregateExpression,

  // TODO: these expressions need to be prettier
  BinaryExpression,
  VectorSelector,
  ParenExpression,
  NumberLiteral,
  OffsetExpr,
  SubqueryExpr,
  UnaryExpr,
  StepInvariantExpr,
  StringLiteral,

  Fallback, // additional node type for any expressions we don't have special handling for
}

abstract class FNode {
  id: number;
  type: NodeTypes;

  constructor(id: number, type: NodeTypes) {
    this.id = id;
    this.type = type;
  }

  makeFlowNode(label: ReactNode): FlowElement {
    return {
      id: String(this.id),
      data: { label },
      position: { x: 100, y: (this.id + 1) * 50 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  }

  // TODO: consider moving method out of node class to separate data from view
  abstract asReactNode(): ReactNode;
  abstract getChildren(): FNode[];

  getWarnings(): string[] {
    return [];
  }
}

export { FNode };
