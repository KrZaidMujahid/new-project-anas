/**
 * EQUATION 1 — Core Mathematics Syntax and Domain Errors
 * Provides exact character positions and human-readable diagnostics for syntax and evaluation issues.
 */

export class MathSyntaxError extends Error {
  public readonly position: number;
  public readonly source: string;

  constructor(message: string, position: number, source: string) {
    const formatted = MathSyntaxError.formatMessage(message, position, source);
    super(formatted);
    this.name = 'MathSyntaxError';
    this.position = position;
    this.source = source;
  }

  private static formatMessage(message: string, position: number, source: string): string {
    const clampedPos = Math.max(0, Math.min(source.length, position));
    const pointer = ' '.repeat(clampedPos) + '^';
    return `${message} at column ${clampedPos + 1}:\n  ${source}\n  ${pointer}`;
  }
}

export class MathEvaluationError extends Error {
  public readonly variableName?: string;

  constructor(message: string, variableName?: string) {
    super(message);
    this.name = 'MathEvaluationError';
    this.variableName = variableName;
  }
}
