// TODO: eventually will need collection of trees rather than a single tree (if a new unattached node is made
import {
  AggregateExpr,
  AggregateModifier,
  AggregateOp,
  AtModifierPreprocessors,
  BinaryExpr,
  BinModifiers,
  By,
  Duration,
  Expr,
  FunctionCall,
  FunctionCallArgs,
  FunctionCallBody,
  FunctionIdentifier,
  GroupingLabel,
  GroupingLabels,
  LabelMatchers,
  LabelName,
  MatchOp,
  MatrixSelector,
  MetricIdentifier,
  NumberLiteral,
  OffsetExpr,
  ParenExpr,
  parser,
  PromQL,
  StepInvariantExpr,
  StringLiteral,
  Sub,
  SubqueryExpr,
  UnaryExpr,
  UnaryOp,
  VectorSelector,
  Without,
} from 'lezer-promql';
import { SyntaxNode } from 'lezer-tree';
import { zip } from 'lodash';
import { AggregateExpressionNode } from './nodes/AggregateExpressionNode';
import { BinaryExpressionNode } from './nodes/BinaryExpressionNode';
import { FallbackNode } from './nodes/FallbackNode';
import { FunctionCallNode } from './nodes/FunctionCallNode';
import { MatrixSelectorNode } from './nodes/MatrixSelector';

import { FNode } from './nodes/Node';
import { NumberLiteralNode } from './nodes/NumberLiteralNode';
import { OffsetExpressionNode } from './nodes/OffsetExpressionNode';
import { ParenExpressionNode } from './nodes/ParenExpressionNode';
import { StepInvariantExpressionNode } from './nodes/StepInvariantExpressionNode';
import { StringLiteralNode } from './nodes/StringLiteralNode';
import { SubqueryExpressionNode } from './nodes/SubqueryExpressionNode';
import { UnaryExpressionNode } from './nodes/UnaryExpressionNode';
import { VectorSelectorNode } from './nodes/VectorSelectorNode';

// TODO: restrict convert to certain types of nodes? (e.g. you can't pass in a function body and get a valid tree)
export function parseQuery(query: string): FNode | null {
  var nodeCount = 0;

  const tree = parser.parse(query);
  if (!tree.topNode || !tree.topNode.firstChild) {
    //top node should be promql
    return null;
  }

  // const cursor = tree.cursor()
  // do {
  // 	console.log(`[${cursor.type.name}]: ` + nodeToExpression(cursor.node))
  // } while (cursor.next())

  /*
	print(tree.topNode, 0)
  function print(node: SyntaxNode, indent: number): void {
    console.log("-".repeat(indent) + " " + node.type.name + ": " + nodeToExpression(node).replaceAll("\n", ""))
		var child = node.firstChild
		if (child) {
			print(child, indent + 1)
			const cursor = child.cursor;
			while (cursor.nextSibling()) {
				print(cursor.node, indent + 1)
			}
		}
  }
	*/

  return convertNode(tree.topNode);

  function convertNode(node: SyntaxNode): FNode {
    // TODO: how to make sure this list stays in sync with the models being defined?
    switch (node.type.id) {
      case PromQL:
        return convertNode(node.firstChild!);
      case Expr:
        return convertNode(node.firstChild!);
      case AggregateExpr:
        return convertAggregateExpr(node);
      case FunctionCall:
        return convertFunctionCall(node);
      case MatrixSelector:
        return convertMatrixSelector(node);
      case BinaryExpr:
        return convertBinaryExpression(node);
      case VectorSelector:
        return convertVectorSelector(node);
      case ParenExpr:
        return convertParenExpr(node);
      case NumberLiteral:
        return convertNumberLiteral(node);
      case OffsetExpr:
        return convertOffsetExpr(node);
      case SubqueryExpr:
        return convertSubqueryExpr(node);
      case UnaryExpr:
        return convertUnaryExpr(node);
      case StepInvariantExpr:
        return convertStepInvariantExpr(node);
      case StringLiteral:
        return convertStringLiteral(node);
      default:
        return convertFallbackNode(node);
    }
  }

  // specific node conversions
  function convertAggregateExpr(node: SyntaxNode): AggregateExpressionNode {
    const newNode = new AggregateExpressionNode(newId());
    newNode.op = nodeToExpression(node.getChild(AggregateOp)!);

    const modifier = node.getChild(AggregateModifier);
    newNode.by = modifier?.getChild(By) != null;
    newNode.without = modifier?.getChild(Without) != null;
    newNode.labels = findAll(modifier?.getChild(GroupingLabels), GroupingLabel).map(nodeToExpression);
    newNode.exprs = convertFunctionCallBody(node.getChild(FunctionCallBody)!);

    return newNode;
  }

  // FunctionIdentifier FunctionCallBody
  function convertFunctionCall(node: SyntaxNode): FunctionCallNode {
    const newNode = new FunctionCallNode(newId());

    newNode.identifier = nodeToExpression(node.getChild(FunctionIdentifier)!);
    newNode.args = convertFunctionCallBody(node.getChild(FunctionCallBody)!);
    return newNode;
  }

  /*
	FunctionCallBody {
		"(" FunctionCallArgs ")" |
		"(" ")"
	}*/
  // returns a list of the function arguments as nodes
  function convertFunctionCallBody(node: SyntaxNode): FNode[] {
    const args = node.getChild(FunctionCallArgs);
    if (args) {
      return convertFunctionCallArgs(args);
    }
    return [];
  }

  /*
	FunctionCallArgs {
		FunctionCallArgs "," Expr |
		Expr
	}
  */
  function convertFunctionCallArgs(node: SyntaxNode): FNode[] {
    if (node.type.id !== FunctionCallArgs) {
      throw new TypeError('Node Type is not FunctionCallArgs');
    }

    // we can't use findAll because if there are nested expressions, we'd end up getting all of the nested expression nodes too
    // TODO: probably a more generic way we can be unrolling this though
    const innerArgs = node.getChild(FunctionCallArgs);
    var nodes: FNode[] = [];
    if (innerArgs) {
      nodes = convertFunctionCallArgs(innerArgs);
    }
    const expr = node.getChild(Expr)!; //this can be null in cases like histogram_quantile(a,"
    if (expr) {
      nodes.push(convertNode(expr));
    }
    return nodes;
  }

  // Expr "[" Duration "]"
  function convertMatrixSelector(node: SyntaxNode): MatrixSelectorNode {
    const newNode = new MatrixSelectorNode(newId());

    const identifier = node.getChild(Expr)?.getChild(VectorSelector)?.getChild(MetricIdentifier);
    if (identifier) {
      newNode.identifier = nodeToExpression(identifier);
    }

    const matchers = node.getChild(Expr)?.getChild(VectorSelector)?.getChild(LabelMatchers);
    if (matchers) {
      const labelNames = findAll(matchers, LabelName).map(nodeToExpression);
      const matchOperation = findAll(matchers, MatchOp).map(nodeToExpression);
      const labelValues = findAll(matchers, StringLiteral)
        .map(nodeToExpression)
        .map((expr) => JSON.parse(expr)); // for some reason these are JSON encoded

      newNode.matchers = zip<string, string, string>(labelNames, matchOperation, labelValues).map(
        ([label, operator, value]) => ({
          label: label ?? '<unknown>',
          operator: operator ?? '=',
          value: value ?? '<unknown>',
        })
      );
    }

    newNode.duration = nodeToExpression(node.getChild(Duration)!);

    return newNode;
  }

  // Example:
  // Expr !pow Pow    BinModifiers Expr
  function convertBinaryExpression(node: SyntaxNode): BinaryExpressionNode {
    const newNode = new BinaryExpressionNode(newId());
    newNode.lhs = convertNode(node.firstChild!);
    newNode.rhs = convertNode(node.lastChild!);
    newNode.op = nodeToExpression(node.firstChild!.nextSibling!);
    newNode.modifiers = node.getChild(BinModifiers) ? nodeToExpression(node.getChild(BinModifiers)!) : '';
    return newNode;
  }

  function convertParenExpr(node: SyntaxNode): ParenExpressionNode {
    return new ParenExpressionNode(newId(), convertNode(node.firstChild!));
  }

  function convertNumberLiteral(node: SyntaxNode): NumberLiteralNode {
    const newNode = new NumberLiteralNode(newId());
    newNode.value = nodeToExpression(node);
    return newNode;
  }
  function convertVectorSelector(node: SyntaxNode): VectorSelectorNode {
    const newNode = new VectorSelectorNode(newId());
    newNode.identifier = nodeToExpression(node.getChild(MetricIdentifier)!);
    const matchers = node.getChild(LabelMatchers)!;

    const labelNames = findAll(matchers, LabelName).map(nodeToExpression);
    const matchOperation = findAll(matchers, MatchOp).map(nodeToExpression);
    const labelValues = findAll(matchers, StringLiteral)
      .map(nodeToExpression)
      .map((expr) => JSON.parse(expr)); // for some reason these are JSON encoded

    newNode.matchers = zip<string, string, string>(labelNames, matchOperation, labelValues).map(
      ([label, operator, value]) => ({
        label: label ?? '<unknown>',
        operator: operator ?? '=',
        value: value ?? '<unknown>',
      })
    );

    return newNode;
  }

  function convertOffsetExpr(node: SyntaxNode): OffsetExpressionNode {
    const newNode = new OffsetExpressionNode(newId());
    newNode.sub = node.getChild(Sub) != null;
    newNode.duration = nodeToExpression(node.getChild(Duration)!);
    newNode.expr = convertNode(node.getChild(Expr)!);
    return newNode;
  }

  // Expr "[" Duration ":" ("" | Duration) "]"
  function convertSubqueryExpr(node: SyntaxNode): SubqueryExpressionNode {
    const newNode = new SubqueryExpressionNode(newId());
    const durations = node.getChildren(Duration);
    newNode.range = nodeToExpression(durations[0]);
    if (durations.length > 1) {
      newNode.resolution = nodeToExpression(durations[1]);
    }
    newNode.expr = convertNode(node.getChild(Expr)!);
    return newNode;
  }

  // Expr At ( NumberLiteral | AtModifierPreprocessors "(" ")" )
  function convertStepInvariantExpr(node: SyntaxNode): StepInvariantExpressionNode {
    const newNode = new StepInvariantExpressionNode(newId());
    newNode.expr = convertNode(node.getChild(Expr)!);
    if (node.getChild(NumberLiteral)) {
      newNode.modifiers = nodeToExpression(node.getChild(NumberLiteral)!);
    } else if (node.getChild(AtModifierPreprocessors)) {
      newNode.modifiers = nodeToExpression(node.getChild(AtModifierPreprocessors)!) + '()';
    }
    return newNode;
  }

  function convertStringLiteral(node: SyntaxNode): StringLiteralNode {
    const newNode = new StringLiteralNode(newId());
    newNode.val = nodeToExpression(node);
    return newNode;
  }

  // !mul UnaryOp~signed Expr
  function convertUnaryExpr(node: SyntaxNode): StringLiteralNode {
    const newNode = new UnaryExpressionNode(newId());
    newNode.op = nodeToExpression(node.getChild(UnaryOp)!);
    newNode.expr = convertNode(node.getChild(Expr)!);
    return newNode;
  }

  function convertFallbackNode(node: SyntaxNode): FallbackNode {
    const fallback = new FallbackNode(newId(), nodeToExpression(node));
    return fallback;
  }

  // helpers
  function newId(): number {
    return nodeCount++;
  }

  function nodeToExpression(node: SyntaxNode): string {
    if (!node) {
      return '';
    }
    return query.substring(node.from, node.to);
  }

  function findAll(node: SyntaxNode | null | undefined, type: number): SyntaxNode[] {
    if (!node) {
      return [];
    }

    const matches: SyntaxNode[] = [];
    const cursor = node.cursor;

    // find all nodes that match type
    do {
      if (cursor.node.type.id === type) {
        matches.push(cursor.node);
      }
    } while (cursor.next());
    return matches;
  }
}
