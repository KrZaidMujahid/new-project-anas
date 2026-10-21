/**
 * EQUATION 1 — Core Mathematics Engine Types
 * Pure scientific type definitions for tokens, AST nodes, compiled expressions, and evaluation results.
 */

export type TokenType =
  | 'number'
  | 'identifier'
  | 'operator'
  | 'lparen'
  | 'rparen'
  | 'comma'
  | 'eof';

export interface Token {
  type: TokenType;
  value: string;
  position: number; // 0-based character index in source string
}

export type ASTNodeType =
  | 'number'
  | 'variable'
  | 'constant'
  | 'unary'
  | 'binary'
  | 'function';

export interface NumberNode {
  type: 'number';
  value: number;
}

export interface VariableNode {
  type: 'variable';
  name: string;
}

export interface ConstantNode {
  type: 'constant';
  name: string;
  value: number;
}

export interface UnaryOpNode {
  type: 'unary';
  operator: '+' | '-';
  operand: ASTNode;
}

export type BinaryOperator = '+' | '-' | '*' | '/' | '^' | '%';

export interface BinaryOpNode {
  type: 'binary';
  operator: BinaryOperator;
  left: ASTNode;
  right: ASTNode;
}

export interface FunctionCallNode {
  type: 'function';
  name: string;
  args: ASTNode[];
}

export type ASTNode =
  | NumberNode
  | VariableNode
  | ConstantNode
  | UnaryOpNode
  | BinaryOpNode
  | FunctionCallNode;

export interface EvaluationResult {
  /** Numerical value resulting from evaluation */
  value: number;
  /** True if the result is a finite real number (not NaN, not ±Infinity) */
  isFinite: boolean;
  /** True if result is in the real domain (not NaN) */
  isReal: boolean;
  /** Domain error or division-by-zero notice, if applicable */
  domainError?: string;
}

export interface CompiledExpression {
  /** Original mathematical expression string */
  readonly source: string;
  /** Abstract Syntax Tree root node */
  readonly ast: ASTNode;
  /** Set of distinct variable names present in the expression (excluding constants) */
  readonly variables: readonly string[];
  /**
   * Evaluates the expression given an optional variable-value mapping.
   * Fast numerical evaluation without re-parsing.
   */
  evaluate(scope?: Record<string, number>): EvaluationResult;
  /** Convenience shortcut to evaluate directly as a number (returns NaN or ±Infinity if out of domain) */
  evaluateNum(scope?: Record<string, number>): number;
}
