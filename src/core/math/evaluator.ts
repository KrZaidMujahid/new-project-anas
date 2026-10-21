/**
 * EQUATION 1 — Mathematical AST Evaluator and Expression Compiler
 * Fast, deterministic numerical evaluation with variable substitution, domain error detection, and reusable compiled expressions.
 */

import { ASTNode, EvaluationResult, CompiledExpression } from './types';
import { MathEvaluationError } from './errors';
import { parseMathToAST, extractVariables } from './parser';
import { getFunctionDef } from './functions';

/**
 * Evaluates an AST node with the provided variable scope.
 * Throws MathEvaluationError if an undefined variable is encountered.
 */
export function evaluateAST(node: ASTNode, scope: Record<string, number> = {}): number {
  switch (node.type) {
    case 'number':
      return node.value;

    case 'constant':
      return node.value;

    case 'variable': {
      if (Object.prototype.hasOwnProperty.call(scope, node.name)) {
        return scope[node.name];
      }
      // Case-insensitive fallback
      const lower = node.name.toLowerCase();
      for (const [k, v] of Object.entries(scope)) {
        if (k.toLowerCase() === lower) {
          return v;
        }
      }
      throw new MathEvaluationError(
        `Variable '${node.name}' is undefined in the evaluation scope`,
        node.name
      );
    }

    case 'unary': {
      const val = evaluateAST(node.operand, scope);
      return node.operator === '-' ? -val : val;
    }

    case 'binary': {
      const left = evaluateAST(node.left, scope);
      const right = evaluateAST(node.right, scope);

      switch (node.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          // In JavaScript: x / 0 produces Infinity or -Infinity, 0 / 0 produces NaN
          return left / right;
        case '%':
          return left % right;
        case '^':
          // Math.pow handles real numbers: negative base with fractional power yields NaN
          return Math.pow(left, right);
        default: {
          const unknownOp = (node as { operator: string }).operator;
          throw new MathEvaluationError(`Unsupported binary operator '${unknownOp}'`);
        }
      }
    }

    case 'function': {
      const def = getFunctionDef(node.name);
      if (!def) {
        throw new MathEvaluationError(`Undefined function '${node.name}'`);
      }
      const evalArgs = node.args.map((arg) => evaluateAST(arg, scope));
      return def.fn(...evalArgs);
    }
  }
}

/**
 * Compiles a mathematical expression into a reusable CompiledExpression object.
 * Parsing happens once; evaluation can be called millions of times per second.
 */
export function compileExpression(source: string): CompiledExpression {
  const ast = parseMathToAST(source);
  const variables = Object.freeze(extractVariables(ast));

  return {
    source,
    ast,
    variables,
    evaluate(scope: Record<string, number> = {}): EvaluationResult {
      try {
        const value = evaluateAST(ast, scope);
        const isReal = !Number.isNaN(value);
        const isFinite = Number.isFinite(value);

        let domainError: string | undefined;
        if (!isReal) {
          domainError = 'Result is outside real domain (NaN)';
        } else if (!isFinite) {
          domainError = value > 0 ? 'Division by zero / Positive Infinity' : 'Division by zero / Negative Infinity';
        }

        return {
          value,
          isFinite,
          isReal,
          domainError,
        };
      } catch (err) {
        if (err instanceof MathEvaluationError) {
          return {
            value: NaN,
            isFinite: false,
            isReal: false,
            domainError: err.message,
          };
        }
        throw err;
      }
    },
    evaluateNum(scope: Record<string, number> = {}): number {
      return evaluateAST(ast, scope);
    },
  };
}

/**
 * Evaluates an expression directly from string or pre-compiled object.
 */
export function evaluateExpression(
  sourceOrCompiled: string | CompiledExpression,
  scope: Record<string, number> = {}
): EvaluationResult {
  const compiled =
    typeof sourceOrCompiled === 'string'
      ? compileExpression(sourceOrCompiled)
      : sourceOrCompiled;
  return compiled.evaluate(scope);
}
