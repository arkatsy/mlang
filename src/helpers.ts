export const CONSTANTS = Object.freeze({
  KEYWORDS: ["if", "else", "while", "function", "return", "elseif", "for"] as const,
  TRUE: "true",
  FALSE: "false",
  LEFT_PARENTHESIS: "(",
  RIGHT_PARENTHESIS: ")",
  LEFT_BRACKET: "[",
  RIGHT_BRACKET: "]",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
  COMMA: ",",
  SEMICOLON: ";",
  PLUS: "+",
  MINUS: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  EQUAL: "=",
  DOUBLE_EQUALS: "==",
  LEFT_ANGLEBRACKET: "<",
  RIGHT_ANGLEBRACKET: ">",
  DOUBLE_QUOTE: '"',
  NEWLINE: "\n",
  SPACE: " ",
  TAB: "\t",
  OR: "||",
  EOF: "EOF",
  AND: "&&",
  NOT: "!",
  DOT: ".",
});

export const isNewline = (char: string) => char === CONSTANTS.NEWLINE;
export const isSpace = (char: string) => char === CONSTANTS.SPACE;
export const isTab = (char: string) => char === CONSTANTS.TAB;
export const isWhitespace = (char: string) => isSpace(char) || isTab(char) || isNewline(char);
export const isDigit = (char: string) => char >= "0" && char <= "9";
export const isLetter = (char: string) => (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
export const isParen = (char: string) => isLeftParen(char) || isRightParen(char);
export const isLeftParen = (char: string) => char === CONSTANTS.LEFT_PARENTHESIS;
export const isRightParen = (char: string) => char === CONSTANTS.RIGHT_PARENTHESIS;
export const isQuote = (char: string) => char === CONSTANTS.DOUBLE_QUOTE;
export const isTrue = (str: string) => str === CONSTANTS.TRUE;
export const isFalse = (str: string) => str === CONSTANTS.FALSE;
export const isComma = (char: string) => char === CONSTANTS.COMMA;
export const isEquality = (str: string) => str === CONSTANTS.DOUBLE_EQUALS;
export const isAssignment = (char: string) => char === CONSTANTS.EQUAL;
export const isEqual = (str: string) => str === CONSTANTS.EQUAL;
export const isAngleBracket = (char: string) =>
  char === CONSTANTS.LEFT_ANGLEBRACKET || char === CONSTANTS.RIGHT_ANGLEBRACKET;
export const isOpeningAngleBracket = (char: string) => char === CONSTANTS.LEFT_ANGLEBRACKET;
export const isClosingAngleBracket = (char: string) => char === CONSTANTS.RIGHT_ANGLEBRACKET;
export const isSemicolon = (char: string) => char === CONSTANTS.SEMICOLON;
export const isMathOperator = (char: string) =>
  char === CONSTANTS.PLUS ||
  char === CONSTANTS.MINUS ||
  char === CONSTANTS.MULTIPLY ||
  char === CONSTANTS.DIVIDE;
export const isPlus = (char: string) => char === CONSTANTS.PLUS;
export const isMinus = (char: string) => char === CONSTANTS.MINUS;
export const isMultiply = (char: string) => char === CONSTANTS.MULTIPLY;
export const isDivide = (char: string) => char === CONSTANTS.DIVIDE;
export const isLogicalOperator = (char: string) =>
  char === CONSTANTS.OR || char === CONSTANTS.AND || char === CONSTANTS.NOT;
export const isLogicalOr = (char: string) => char === CONSTANTS.OR;
export const isLogicalAnd = (char: string) => char === CONSTANTS.AND;
export const isLogicalNot = (char: string) => char === CONSTANTS.NOT;
export const isLeftBracket = (char: string) => char === CONSTANTS.LEFT_BRACKET;
export const isRightBracket = (char: string) => char === CONSTANTS.RIGHT_BRACKET;
export const isBracket = (char: string) => isLeftBracket(char) || isRightBracket(char);
export const isBrace = (char: string) => isLeftBrace(char) || isRightBrace(char);
export const isLeftBrace = (char: string) => char === CONSTANTS.LEFT_BRACE;
export const isRightBrace = (char: string) => char === CONSTANTS.RIGHT_BRACE;
