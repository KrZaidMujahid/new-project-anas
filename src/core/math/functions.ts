/**
 * EQUATION 1 — Mathematical Built-in Functions and Constants
 * Complete registry of pure, deterministic functions, arity checks, and standard physical/mathematical constants.
 */

export interface MathFunctionDef {
  /** Function handler taking evaluated numerical arguments */
  fn: (...args: number[]) => number;
  /** Minimum number of required arguments */
  minArgs: number;
  /** Maximum number of allowed arguments */
  maxArgs: number;
  /** Human-readable description */
  description: string;
}

export const MATH_CONSTANTS: Readonly<Record<string, number>> = {
  pi: Math.PI,
  PI: Math.PI,
  e: Math.E,
  E: Math.E,
  tau: 2 * Math.PI,
  TAU: 2 * Math.PI,
  phi: (1 + Math.sqrt(5)) / 2, // Golden ratio ≈ 1.6180339887
};

export const MATH_FUNCTIONS: Readonly<Record<string, MathFunctionDef>> = {
  // Trigonometric functions
  sin: {
    fn: Math.sin,
    minArgs: 1,
    maxArgs: 1,
    description: 'Sine function',
  },
  cos: {
    fn: Math.cos,
    minArgs: 1,
    maxArgs: 1,
    description: 'Cosine function',
  },
  tan: {
    fn: (x) => {
      const c = Math.cos(x);
      if (Math.abs(c) < 1e-15) {
        return Math.sin(x) >= 0 ? Infinity : -Infinity;
      }
      return Math.tan(x);
    },
    minArgs: 1,
    maxArgs: 1,
    description: 'Tangent function',
  },
  sec: {
    fn: (x) => {
      const c = Math.cos(x);
      if (Math.abs(c) < 1e-15) return Infinity;
      return 1 / c;
    },
    minArgs: 1,
    maxArgs: 1,
    description: 'Secant function (1 / cos(x))',
  },
  csc: {
    fn: (x) => {
      const s = Math.sin(x);
      if (Math.abs(s) < 1e-15) return Infinity;
      return 1 / s;
    },
    minArgs: 1,
    maxArgs: 1,
    description: 'Cosecant function (1 / sin(x))',
  },
  cot: {
    fn: (x) => {
      const s = Math.sin(x);
      if (Math.abs(s) < 1e-15) return Infinity;
      return Math.cos(x) / s;
    },
    minArgs: 1,
    maxArgs: 1,
    description: 'Cotangent function (1 / tan(x))',
  },

  // Inverse trigonometric functions
  asin: {
    fn: Math.asin,
    minArgs: 1,
    maxArgs: 1,
    description: 'Arcsine (inverse sine)',
  },
  acos: {
    fn: Math.acos,
    minArgs: 1,
    maxArgs: 1,
    description: 'Arccosine (inverse cosine)',
  },
  atan: {
    fn: Math.atan,
    minArgs: 1,
    maxArgs: 1,
    description: 'Arctangent (inverse tangent)',
  },
  atan2: {
    fn: Math.atan2,
    minArgs: 2,
    maxArgs: 2,
    description: 'Two-argument arctangent atan2(y, x)',
  },

  // Hyperbolic functions
  sinh: {
    fn: Math.sinh,
    minArgs: 1,
    maxArgs: 1,
    description: 'Hyperbolic sine',
  },
  cosh: {
    fn: Math.cosh,
    minArgs: 1,
    maxArgs: 1,
    description: 'Hyperbolic cosine',
  },
  tanh: {
    fn: Math.tanh,
    minArgs: 1,
    maxArgs: 1,
    description: 'Hyperbolic tangent',
  },

  // Roots, powers, and absolute value
  sqrt: {
    fn: (x) => (x < 0 ? NaN : Math.sqrt(x)),
    minArgs: 1,
    maxArgs: 1,
    description: 'Square root (defined for real x ≥ 0)',
  },
  cbrt: {
    fn: Math.cbrt,
    minArgs: 1,
    maxArgs: 1,
    description: 'Cube root (real root for all real x)',
  },
  abs: {
    fn: Math.abs,
    minArgs: 1,
    maxArgs: 1,
    description: 'Absolute value |x|',
  },
  exp: {
    fn: Math.exp,
    minArgs: 1,
    maxArgs: 1,
    description: 'Exponential e^x',
  },

  // Logarithms
  ln: {
    fn: (x) => (x <= 0 ? (x === 0 ? -Infinity : NaN) : Math.log(x)),
    minArgs: 1,
    maxArgs: 1,
    description: 'Natural logarithm (base e)',
  },
  log: {
    // Standard scientific laboratory convention: log(x) defaults to common log (base 10)
    // Supports optional arbitrary base via log(x, base), e.g. log(8, 2) = 3
    fn: (x, base) => {
      if (x <= 0) return x === 0 ? -Infinity : NaN;
      if (base !== undefined) {
        if (base <= 0 || base === 1) return NaN;
        return Math.log(x) / Math.log(base);
      }
      return Math.log10(x);
    },
    minArgs: 1,
    maxArgs: 2,
    description: 'Common logarithm (base 10) or arbitrary base logarithm log(x, base)',
  },
  log10: {
    fn: (x) => (x <= 0 ? (x === 0 ? -Infinity : NaN) : Math.log10(x)),
    minArgs: 1,
    maxArgs: 1,
    description: 'Common logarithm (base 10)',
  },
  log2: {
    fn: (x) => (x <= 0 ? (x === 0 ? -Infinity : NaN) : Math.log2(x)),
    minArgs: 1,
    maxArgs: 1,
    description: 'Binary logarithm (base 2)',
  },

  // Rounding & sign
  floor: {
    fn: Math.floor,
    minArgs: 1,
    maxArgs: 1,
    description: 'Floor function ⌊x⌋',
  },
  ceil: {
    fn: Math.ceil,
    minArgs: 1,
    maxArgs: 1,
    description: 'Ceiling function ⌈x⌉',
  },
  round: {
    fn: Math.round,
    minArgs: 1,
    maxArgs: 1,
    description: 'Nearest integer rounding',
  },
  sign: {
    fn: Math.sign,
    minArgs: 1,
    maxArgs: 1,
    description: 'Signum function (-1, 0, or 1)',
  },

  // Extremum / Multi-argument helpers
  min: {
    fn: (...args) => Math.min(...args),
    minArgs: 1,
    maxArgs: 10,
    description: 'Minimum of arguments',
  },
  max: {
    fn: (...args) => Math.max(...args),
    minArgs: 1,
    maxArgs: 10,
    description: 'Maximum of arguments',
  },
};

/** Checks if a name is a registered constant (case-insensitive check) */
export function isConstant(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(MATH_CONSTANTS, name.toLowerCase());
}

/** Resolves constant value */
export function getConstantValue(name: string): number | undefined {
  return MATH_CONSTANTS[name.toLowerCase()];
}

/** Checks if a name is a registered function (case-insensitive) */
export function isFunction(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(MATH_FUNCTIONS, name.toLowerCase());
}

/** Gets function definition */
export function getFunctionDef(name: string): MathFunctionDef | undefined {
  return MATH_FUNCTIONS[name.toLowerCase()];
}
