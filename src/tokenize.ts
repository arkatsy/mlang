import {
  CONSTANTS,
  isDigit,
  isEqual,
  isLeftBrace,
  isLeftBracket,
  isLeftParen,
  isLetter,
  isLogicalAnd,
  isLogicalOperator,
  isMinus,
  isMultiply,
  isOpeningAngleBracket,
  isPlus,
  isQuote,
  isSpace,
} from "./helpers";
import { Scanner, TokenType, Tokens, isEof } from "./lexer";

function includes<T extends U, U>(array: ReadonlyArray<T>, element: U): element is T {
  return array.includes(element as T);
}

export const tokenize = {
  tokenizeBraces: function (token: string): Tokens[number] {
    return isLeftBrace(token)
      ? { type: TokenType.leftBrace, value: CONSTANTS.LEFT_BRACE }
      : { type: TokenType.rightBrace, value: CONSTANTS.RIGHT_BRACE };
  },
  tokenizeParentheses: function (token: string): Tokens[number] {
    return isLeftParen(token)
      ? { type: TokenType.leftParen, value: CONSTANTS.LEFT_PARENTHESIS }
      : { type: TokenType.rightParen, value: CONSTANTS.RIGHT_PARENTHESIS };
  },
  tokenizeBrackets: function (token: string): Tokens[number] {
    return isLeftBracket(token)
      ? { type: TokenType.leftBracket, value: CONSTANTS.LEFT_BRACKET }
      : { type: TokenType.rightBracket, value: CONSTANTS.RIGHT_BRACKET };
  },
  tokenizeString: function (scanner: Scanner): Tokens[number] {
    let string = "";
    scanner.cursor++;
    while (!isQuote(scanner.source[scanner.cursor])) {
      if (isEof(scanner)) {
        throw new SyntaxError("Unterminated string");
      }
      string += scanner.source[scanner.cursor];
      scanner.cursor++;
    }
    return {
      type: TokenType.string,
      value: string,
    };
  },
  tokenizeDigit: function (scanner: Scanner): Tokens[number] {
    let number = scanner.source[scanner.cursor];
    scanner.cursor++;
    let pseudoCursor = scanner.cursor;
    let dots = 0;
    while (isDigit(scanner.source[pseudoCursor]) || scanner.source[pseudoCursor] === CONSTANTS.DOT) {
      if (scanner.source[pseudoCursor] === CONSTANTS.DOT) {
        dots++;
      }
      number += scanner.source[pseudoCursor];
      pseudoCursor++;
    }
    if (dots > 1) {
      throw new SyntaxError("Invalid number");
    }
    scanner.cursor = pseudoCursor - 1;
    return {
      type: TokenType.number,
      value: number,
    };
  },
  tokenizeBoolean: function (scanner: Scanner): Tokens[number] {
    let boolean = "";
    scanner.cursor++;
    let pseudoCursor = scanner.cursor;
    while (!isSpace(scanner.source[pseudoCursor])) {
      boolean += scanner.source[pseudoCursor];
      pseudoCursor++;
    }
    scanner.cursor = pseudoCursor - 1;
    return {
      type: TokenType.boolean,
      value: boolean,
    };
  },
  tokenizeComma: function (): Tokens[number] {
    return {
      type: TokenType.comma,
      value: CONSTANTS.COMMA,
    };
  },
  tokenizeEquality: function (scanner: Scanner): Tokens[number] {
    scanner.cursor += 2;
    return {
      type: TokenType.equality,
      value: CONSTANTS.DOUBLE_EQUALS,
    };
  },
  tokenizeAssignment: function (): Tokens[number] {
    return {
      type: TokenType.assignment,
      value: CONSTANTS.EQUAL,
    };
  },
  tokenizeComparison: function (scanner: Scanner): Tokens[number] {
    let operator = scanner.source[scanner.cursor];
    scanner.cursor++;
    let currentToken = scanner.source[scanner.cursor];
    let isSingle = true;
    if (isEqual(currentToken)) {
      operator += currentToken;
      isSingle = false;
    } else {
      scanner.cursor--;
    }

    let tokenType: TokenType;
    if (isSingle) {
      tokenType = isOpeningAngleBracket(operator) ? TokenType.lessThan : TokenType.greaterThan;
    } else {
      tokenType = isOpeningAngleBracket(operator.charAt(0))
        ? TokenType.lessThanOrEqual
        : TokenType.greaterThanOrEqual;
    }

    return {
      type: tokenType,
      value: operator,
    };
  },
  tokenizeKeywordOrIdentifier: function (scanner: Scanner): Tokens[number] {
    let chars = scanner.source[scanner.cursor];
    scanner.cursor++;
    let pseudoCursor = scanner.cursor;
    while (isLetter(scanner.source[pseudoCursor]) || isDigit(scanner.source[pseudoCursor])) {
      chars += scanner.source[pseudoCursor];
      pseudoCursor++;
    }
    scanner.cursor = pseudoCursor - 1;

    if (includes(CONSTANTS.KEYWORDS, chars)) {
      return {
        type: TokenType.keyword,
        value: chars,
      };
    } else {
      return {
        type: TokenType.identifier,
        value: chars,
      };
    }
  },
  tokenizeSemicolon: function (): Tokens[number] {
    return {
      type: TokenType.semicolon,
      value: CONSTANTS.SEMICOLON,
    };
  },
  tokenizeMathOperator: function (scanner: Scanner): Tokens[number] {
    let token = scanner.source[scanner.cursor];
    let tokenType: TokenType = isPlus(token)
      ? TokenType.plus
      : isMinus(token)
      ? TokenType.minus
      : isMultiply(token)
      ? TokenType.multiply
      : TokenType.divide;

    return {
      type: tokenType,
      value: token,
    };
  },
  tokenizeLogicalOperator: function (scanner: Scanner): Tokens[number] {
    let operator = scanner.source[scanner.cursor];
    let isSingle = true;
    if (isLogicalOperator(scanner.slice(scanner.cursor, scanner.cursor + 2))) {
      operator += scanner.source[scanner.cursor + 1];
      isSingle = false;
      scanner.cursor++;
    }

    let tokenType: TokenType = isSingle
      ? TokenType.logicalNot
      : isLogicalAnd(operator)
      ? TokenType.logicalAnd
      : TokenType.logicalOr;

    return {
      type: tokenType,
      value: operator,
    };
  },
};
