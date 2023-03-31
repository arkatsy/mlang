import {
  isNewline,
  isSpace,
  isQuote,
  isDigit,
  isTrue,
  isFalse,
  isComma,
  isEquality,
  isAssignment,
  isLetter,
  isSemicolon,
  isMathOperator,
  isAngleBracket,
  CONSTANTS,
  isLogicalOperator,
  isBrace,
  isParen,
  isBracket,
} from "./helpers";
import { tokenize } from "./tokenize";

export const enum TokenType {
  leftParen = "leftParen",
  rightParen = "rightParen",
  string = "string",
  number = "number",
  boolean = "boolean",
  leftBrace = "leftBrace",
  rightBrace = "rightBrace",
  comma = "comma",
  equality = "equality",
  assignment = "assignment",
  greaterThan = "greaterThan",
  lessThan = "lessThan",
  greaterThanOrEqual = "greaterThanOrEqual",
  lessThanOrEqual = "lessThanOrEqual",
  keyword = "keyword",
  identifier = "identifier",
  semicolon = "semicolon",
  logicalAnd = "logicalAnd",
  logicalOr = "logicalOr",
  logicalNot = "logicalNot",
  plus = "plus",
  minus = "minus",
  multiply = "multiply",
  divide = "divide",
  leftBracket = "leftBracket",
  rightBracket = "rightBracket",
  EOF = "EOF",
}

export type Tokens = Array<{
  type: TokenType;
  value: string;
}>;

export type Source = string;

export type Scanner = {
  source: Source;
  cursor: number;
  slice: (start: number, end: number) => string;
};

export function isEof(scanner: Scanner): boolean {
  return scanner.cursor >= scanner.source.length;
}

// TODO: Add position tracking (line, column)
export function lexer(source: Source): Tokens {
  const tokens: Tokens = [];
  const scanner: Scanner = {
    source: source,
    cursor: 0,
    slice: function (start: number, end: number) {
      return this.source.slice(start, end);
    },
  };
  let currentToken: Source | null = null;

  while (!isEof(scanner)) {
    currentToken = scanner.source[scanner.cursor];
    switch (true) {
      case isNewline(currentToken) || isSpace(currentToken):
        break;
      case isParen(currentToken):
        tokens.push(tokenize.tokenizeParentheses(currentToken));
        break;
      case isQuote(currentToken):
        tokens.push(tokenize.tokenizeString(scanner));
        break;
      case isDigit(currentToken):
        tokens.push(tokenize.tokenizeDigit(scanner));
        break;
      case isTrue(scanner.slice(scanner.cursor, scanner.cursor + CONSTANTS.TRUE.length)) ||
        isFalse(scanner.slice(scanner.cursor, scanner.cursor + CONSTANTS.FALSE.length)):
        tokens.push(tokenize.tokenizeBoolean(scanner));
        break;
      case isBrace(currentToken):
        tokens.push(tokenize.tokenizeBraces(currentToken));
        break;
      case isComma(currentToken):
        tokens.push(tokenize.tokenizeComma());
        break;
      case isEquality(scanner.slice(scanner.cursor, scanner.cursor + 2)):
        tokens.push(tokenize.tokenizeEquality(scanner));
        break;
      case isAssignment(currentToken) && !isEquality(scanner.slice(scanner.cursor, scanner.cursor + 2)):
        tokens.push(tokenize.tokenizeAssignment());
        break;
      case isAngleBracket(currentToken):
        tokens.push(tokenize.tokenizeComparison(scanner));
        break;
      case isLetter(currentToken):
        tokens.push(tokenize.tokenizeKeywordOrIdentifier(scanner));
        break;
      case isSemicolon(currentToken):
        tokens.push(tokenize.tokenizeSemicolon());
        break;
      case isMathOperator(currentToken):
        tokens.push(tokenize.tokenizeMathOperator(scanner));
        break;
      case isLogicalOperator(currentToken) ||
        isLogicalOperator(scanner.slice(scanner.cursor, scanner.cursor + 2)):
        tokens.push(tokenize.tokenizeLogicalOperator(scanner));
        break;
      case isBracket(currentToken):
        tokens.push(tokenize.tokenizeBrackets(currentToken));
        break;
      default:
        throw new SyntaxError(`Unexpected token ${currentToken}`);
    }
    scanner.cursor++;
  }
  tokens.push({
    type: TokenType.EOF,
    value: CONSTANTS.EOF,
  });
  return tokens;
}
