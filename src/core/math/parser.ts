/**
 * EQUATION 1 — Safe Mathematical Expression Parser
 * Tokenizes, injects conventional implicit multiplications, and constructs an Abstract Syntax Tree (AST).
 * Zero eval(), zero new Function(), 100% deterministic and secure.
 */

import {
  Token,
  TokenType,
  ASTNode,
  BinaryOperator,
  NumberNode,
  VariableNode,
  ConstantNode,
  UnaryOpNode,
  BinaryOpNode,
  FunctionCallNode,
} from './types';
import { MathSyntaxError } from './errors';
import {
  isConstant,
  getConstantValue,
  isFunction,
  getFunctionDef,
} from './functions';

/**
 * Multi-character mathematical symbols and Greek letters that represent a single entity
 * and should not be split into single-character variable juxtapositions.
 */
const KNOWN_MULTI_CHAR_SYMBOLS = new Set([
  'pi', 'tau', 'phi', 'e',
  'theta', 'alpha', 'beta', 'gamma', 'delta', 'epsilon',
  'zeta', 'eta', 'iota', 'kappa', 'lambda', 'mu', 'nu',
  'xi', 'omicron', 'rho', 'sigma', 'upsilon', 'chi', 'psi', 'omega',
]);

/**
 * Step 1: Lexical Analyzer (Tokenizer)
 * Converts source string into an array of typed Tokens.
 */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = source.length;

  while (i < n) {
    const ch = source[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number literal: integers, decimals, and scientific notation (e.g. 1.25e-3)
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < n && /[0-9]/.test(source[i + 1]))) {
      const startPos = i;
      let hasDot = ch === '.';
      i++;

      while (i < n) {
        const c = source[i];
        if (c === '.') {
          if (hasDot) {
            throw new MathSyntaxError('Multiple decimal points in number literal', i, source);
          }
          hasDot = true;
          i++;
        } else if (/[0-9]/.test(c)) {
          i++;
        } else {
          break;
        }
      }

      // Check scientific exponent (e.g., 1.5e3, 2.4e-5, 1E+2)
      if (i < n && (source[i] === 'e' || source[i] === 'E')) {
        const nextChar = i + 1 < n ? source[i + 1] : '';
        if (/[0-9]/.test(nextChar) || ((nextChar === '+' || nextChar === '-') && i + 2 < n && /[0-9]/.test(source[i + 2]))) {
          i++; // consume 'e'/'E'
          if (source[i] === '+' || source[i] === '-') {
            i++; // consume sign
          }
          while (i < n && /[0-9]/.test(source[i])) {
            i++;
          }
        }
      }

      tokens.push({
        type: 'number',
        value: source.slice(startPos, i),
        position: startPos,
      });
      continue;
    }

    // Identifiers (variables, constants, function names)
    if (/[a-zA-Z_]/.test(ch)) {
      const startPos = i;
      while (i < n && /[a-zA-Z0-9_]/.test(source[i])) {
        i++;
      }
      const rawIdent = source.slice(startPos, i);

      // Check if followed by '(' (ignoring whitespace), meaning it is syntactically a function call
      let lookAhead = i;
      while (lookAhead < n && /\s/.test(source[lookAhead])) {
        lookAhead++;
      }
      const isFunctionCall = lookAhead < n && source[lookAhead] === '(';

      // Recognized multi-character names that should not be split
      const isKnownMultiChar =
        isFunctionCall ||
        isFunction(rawIdent) ||
        isConstant(rawIdent) ||
        rawIdent.includes('_') ||
        /[0-9]/.test(rawIdent) ||
        KNOWN_MULTI_CHAR_SYMBOLS.has(rawIdent.toLowerCase());

      if (isKnownMultiChar || rawIdent.length === 1) {
        tokens.push({
          type: 'identifier',
          value: rawIdent,
          position: startPos,
        });
      } else {
        // Multi-letter variable juxtaposition: e.g. "xy" -> 'x', 'y' (which later receives implicit '*')
        for (let c = 0; c < rawIdent.length; c++) {
          tokens.push({
            type: 'identifier',
            value: rawIdent[c],
            position: startPos + c,
          });
        }
      }
      continue;
    }

    // Operators and delimiters
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^' || ch === '%') {
      tokens.push({
        type: 'operator',
        value: ch,
        position: i,
      });
      i++;
      continue;
    }

    if (ch === '(') {
      tokens.push({
        type: 'lparen',
        value: '(',
        position: i,
      });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({
        type: 'rparen',
        value: ')',
        position: i,
      });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({
        type: 'comma',
        value: ',',
        position: i,
      });
      i++;
      continue;
    }

    // Unrecognized character
    throw new MathSyntaxError(`Unexpected character '${ch}'`, i, source);
  }

  tokens.push({
    type: 'eof',
    value: '',
    position: n,
  });

  return tokens;
}

/**
 * Step 2: Implicit Multiplication Insertion
 * Transforms expressions like:
 * - 2x -> 2 * x
 * - 2(x+1) -> 2 * (x+1)
 * - (x+1)(x-1) -> (x+1) * (x-1)
 * - 3sin(x) -> 3 * sin(x)
 * - x y -> x * y
 * - (x+1)x -> (x+1) * x
 */
export function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    result.push(curr);

    if (i + 1 >= tokens.length) break;
    const next = tokens[i + 1];

    if (curr.type === 'eof' || next.type === 'eof') continue;

    // Conditions where an implicit multiplication token should be inserted between curr and next:
    // 1. number followed by identifier, constant, or lparen: (2x, 2pi, 2(x+1))
    const isCurrNumber = curr.type === 'number';
    const isNextIdentOrLParen = next.type === 'identifier' || next.type === 'lparen';

    // 2. rparen followed by lparen, number, or identifier: ((a)(b), (a)2, (a)x)
    const isCurrRParen = curr.type === 'rparen';
    const isNextNumberOrIdentOrLParen =
      next.type === 'number' || next.type === 'identifier' || next.type === 'lparen';

    // 3. identifier followed by another identifier or number:
    // E.g.: "x y" -> x * y, "x sin(x)" -> x * sin(x), "x 2" -> x * 2
    // Note: identifier followed by '(' is reserved for function calls (e.g. sin(x), foobar(x))
    const isCurrNonFunctionIdent =
      curr.type === 'identifier' && !isFunction(curr.value);
    const isNextAfterIdent =
      next.type === 'identifier' || next.type === 'number';

    if (
      (isCurrNumber && isNextIdentOrLParen) ||
      (isCurrRParen && isNextNumberOrIdentOrLParen) ||
      (isCurrNonFunctionIdent && isNextAfterIdent)
    ) {
      result.push({
        type: 'operator',
        value: '*',
        position: next.position,
      });
    }
  }

  return result;
}

/**
 * Step 3: Recursive Descent / Precedence Parser
 * Builds an AST from tokens with correct mathematical associativity and precedence.
 */
class Parser {
  private tokens: Token[];
  private current = 0;
  private source: string;

  constructor(tokens: Token[], source: string) {
    this.tokens = tokens;
    this.source = source;
  }

  public parse(): ASTNode {
    if (this.peek().type === 'eof') {
      throw new MathSyntaxError('Expression is empty', 0, this.source);
    }

    const ast = this.parseExpression();

    if (!this.isAtEnd()) {
      const extra = this.peek();
      throw new MathSyntaxError(`Unexpected token '${extra.value}'`, extra.position, this.source);
    }

    return ast;
  }

  /**
   * Level 1: Addition and Subtraction (+, -)
   * Left-associative: a - b - c => (a - b) - c
   */
  private parseExpression(): ASTNode {
    let node = this.parseTerm();

    while (this.matchOperator('+', '-')) {
      const opToken = this.previous();
      const right = this.parseTerm();
      node = {
        type: 'binary',
        operator: opToken.value as BinaryOperator,
        left: node,
        right,
      };
    }

    return node;
  }

  /**
   * Level 2: Multiplication, Division, and Modulo (*, /, %)
   * Left-associative: a / b * c => (a / b) * c
   */
  private parseTerm(): ASTNode {
    let node = this.parseUnary();

    while (this.matchOperator('*', '/', '%')) {
      const opToken = this.previous();
      const right = this.parseUnary();
      node = {
        type: 'binary',
        operator: opToken.value as BinaryOperator,
        left: node,
        right,
      };
    }

    return node;
  }

  /**
   * Level 3: Unary prefix operators (+, -)
   * E.g.: -x, +5, -sin(x)
   * Note on mathematical convention:
   * In standard algebra, -x^2 means -(x^2). Exponentiation binds tighter than unary minus.
   */
  private parseUnary(): ASTNode {
    if (this.matchOperator('+', '-')) {
      const opToken = this.previous();
      // Exponentiation has higher precedence than unary operator in standard algebraic syntax:
      // -x^2 => -(x^2)
      const operand = this.parseExponent();
      return {
        type: 'unary',
        operator: opToken.value as '+' | '-',
        operand,
      };
    }

    return this.parseExponent();
  }

  /**
   * Level 4: Exponentiation (^)
   * Right-associative: a ^ b ^ c => a ^ (b ^ c)
   */
  private parseExponent(): ASTNode {
    const left = this.parsePrimary();

    if (this.matchOperator('^')) {
      const opToken = this.previous();
      // Right-associative recursion: call parseUnary() so -x in exponent or chained powers evaluate correctly
      const right = this.parseUnary();
      return {
        type: 'binary',
        operator: '^',
        left,
        right,
      };
    }

    return left;
  }

  /**
   * Level 5: Primary expressions
   * Numbers, variables, constants, function calls, and parenthesized sub-expressions.
   */
  private parsePrimary(): ASTNode {
    const token = this.peek();

    // 1. Number literal
    if (token.type === 'number') {
      this.advance();
      const val = parseFloat(token.value);
      if (Number.isNaN(val)) {
        throw new MathSyntaxError(`Invalid numerical literal '${token.value}'`, token.position, this.source);
      }
      return {
        type: 'number',
        value: val,
      };
    }

    // 2. Identifiers: function calls, registered constants, or variables
    if (token.type === 'identifier') {
      this.advance();
      const name = token.value;

      // Function call: name followed by '('
      if (this.peek().type === 'lparen') {
        return this.parseFunctionCall(name, token.position);
      }

      // Check if it's a known mathematical constant (pi, e, tau, phi)
      if (isConstant(name)) {
        const constVal = getConstantValue(name)!;
        return {
          type: 'constant',
          name,
          value: constVal,
        };
      }

      // If it's a known function name not followed by '(', that's a syntax error (e.g. "sin + 5")
      if (isFunction(name)) {
        throw new MathSyntaxError(
          `Function '${name}' must be followed by parentheses and arguments, e.g. ${name}(x)`,
          token.position,
          this.source
        );
      }

      // Otherwise, it's a variable (x, y, t, a, b, c, etc.)
      return {
        type: 'variable',
        name,
      };
    }

    // 3. Parentheses: ( <expression> )
    if (token.type === 'lparen') {
      const openParenPos = token.position;
      this.advance();

      // Check for empty parentheses ()
      if (this.peek().type === 'rparen') {
        throw new MathSyntaxError('Empty parentheses are not allowed', openParenPos, this.source);
      }

      const inner = this.parseExpression();

      if (this.peek().type !== 'rparen') {
        throw new MathSyntaxError('Missing closing parenthesis \')\'', openParenPos, this.source);
      }
      this.advance(); // consume ')'

      return inner;
    }

    // 4. Missing operand / unexpected token
    if (token.type === 'eof') {
      throw new MathSyntaxError('Unexpected end of expression, expected an operand', token.position, this.source);
    }

    throw new MathSyntaxError(`Unexpected token '${token.value}'`, token.position, this.source);
  }

  /**
   * Parses function call: name ( arg1, arg2, ... )
   */
  private parseFunctionCall(name: string, fnPos: number): FunctionCallNode {
    const openParenPos = this.peek().position;
    this.advance(); // consume '('

    const args: ASTNode[] = [];

    if (this.peek().type !== 'rparen') {
      while (true) {
        args.push(this.parseExpression());
        if (this.peek().type === 'comma') {
          this.advance();
        } else {
          break;
        }
      }
    }

    if (this.peek().type !== 'rparen') {
      throw new MathSyntaxError(
        `Missing closing parenthesis ')' for function '${name}'`,
        openParenPos,
        this.source
      );
    }
    this.advance(); // consume ')'

    // Validate arity if registered function
    const fnDef = getFunctionDef(name);
    if (fnDef) {
      if (args.length < fnDef.minArgs || args.length > fnDef.maxArgs) {
        const arityMsg =
          fnDef.minArgs === fnDef.maxArgs
            ? `exactly ${fnDef.minArgs} argument(s)`
            : `between ${fnDef.minArgs} and ${fnDef.maxArgs} arguments`;
        throw new MathSyntaxError(
          `Function '${name}' requires ${arityMsg}, but received ${args.length}`,
          fnPos,
          this.source
        );
      }
    } else {
      throw new MathSyntaxError(
        `Unknown function '${name}'`,
        fnPos,
        this.source
      );
    }

    return {
      type: 'function',
      name: name.toLowerCase(),
      args,
    };
  }

  private matchOperator(...ops: string[]): boolean {
    const t = this.peek();
    if (t.type === 'operator' && ops.includes(t.value)) {
      this.advance();
      return true;
    }
    return false;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'eof', value: '', position: this.source.length };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'eof';
  }
}

/**
 * Extracts all distinct variable names present in an AST.
 */
export function extractVariables(node: ASTNode): string[] {
  const vars = new Set<string>();

  function traverse(n: ASTNode) {
    switch (n.type) {
      case 'variable':
        vars.add(n.name);
        break;
      case 'unary':
        traverse(n.operand);
        break;
      case 'binary':
        traverse(n.left);
        traverse(n.right);
        break;
      case 'function':
        for (const arg of n.args) {
          traverse(arg);
        }
        break;
      case 'number':
      case 'constant':
        break;
    }
  }

  traverse(node);
  return Array.from(vars);
}

/**
 * Parses a raw math expression string into an AST.
 */
export function parseMathToAST(source: string): ASTNode {
  const rawTokens = tokenize(source);
  const withImplicit = insertImplicitMultiplication(rawTokens);
  const parser = new Parser(withImplicit, source);
  return parser.parse();
}
