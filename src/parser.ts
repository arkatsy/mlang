import { CONSTANTS } from "./helpers";
import { TokenType, Tokens } from "./lexer";

export const enum Definitions {
  VariableAssignment = "VariableAssignment",
  FunctionCall = "FunctionCall",
  FunctionDeclaration = "FunctionDeclaration",
  IfStatement = "IfStatement",
  ElseIfStatement = "ElseIfStatement",
  ElseStatement = "ElseStatement",
  OrExpression = "OrExpression",
  AndExpression = "AndExpression",
  NotExpression = "NotExpression",
  ComparisonExpression = "ComparisonExpression",
  AdditiveExpression = "AdditiveExpression",
  MultiplicativeExpression = "MultiplicativeExpression",
  UnaryExpression = "UnaryExpression",
}

type Statements = VariableAssignment | FunctionCall | FunctionDeclaration | IfStatement;

type FunctionCall = {
  type: Definitions.FunctionCall;
  callee: string;
  args: any[];
};

type VariableAssignment = {
  type: Definitions.VariableAssignment;
  identifier: string;
  expression: any;
};

type FunctionDeclaration = {
  type: Definitions.FunctionDeclaration;
  name: string;
  params: string[];
  body: Statements[];
};

type IfStatement = {
  type: Definitions.IfStatement;
  condition: any;
  consequent: Statements[];
  alternate: (ElseIfStatement | ElseStatement)[];
};

type ElseIfStatement = {
  type: Definitions.ElseIfStatement;
  condition: any;
  consequent: Statements[];
};

type ElseStatement = {
  type: Definitions.ElseStatement;
  body: Statements[];
};

export type AST = {
  type: "Program";
  body: Statements[];
};

const tokenCheck = (
  token: Tokens[number] | undefined,
  tokenTypeShouldBe: TokenType,
  errorMessage: string
): Tokens[number] => {
  if (!token) throw new Error("Unexpected end of file");
  if (token.type !== tokenTypeShouldBe) throw new Error(errorMessage);
  return token;
};

export function parser(tokens: Tokens) {
  const ast: AST = {
    type: "Program",
    body: [],
  };

  while (tokens[0].type !== TokenType.EOF && tokens[1].type !== TokenType.EOF) {
    if (tokens[0].type === TokenType.semicolon) {
      tokens.shift();
      continue;
    }
    ast.body.push(parseStatement(tokens));
  }

  return ast;
}

function parseStatement(tokens: Tokens): Statements {
  const token = tokens.shift();
  if (token && token.type === TokenType.identifier) {
    const nextToken = tokens.shift();
    if (nextToken && nextToken.type === TokenType.leftParen) {
      return parseFunctionCall(tokens, token.value);
    } else {
      return parseVariableAssignment(tokens, token.value);
    }
  } else if (token && token.type === TokenType.keyword) {
    switch (token.value) {
      case CONSTANTS.KEYWORDS[3]: // function
        return parseFunctionDefinition(tokens);
      case CONSTANTS.KEYWORDS[0]: // if
        return parseIfStatement(tokens);
      default:
        throw new Error("Unexpected keyword");
    }
  }
  throw new Error("Unexpected token");
}

// The FunctionCall is being parsed after the TokenType.leftParen token
function parseFunctionCall(tokens: Tokens, callee: string): Statements {
  let args: Tokens[number][] = [];

  let token = tokens.shift();
  while (token && token.type !== TokenType.rightParen) {
    if (token.type === TokenType.comma) {
      token = tokens.shift();
      continue;
    }

    args.push(token);
    token = tokens.shift();
  }
  return {
    type: Definitions.FunctionCall,
    callee,
    args,
  };
}

// Variable assignments are being parsed after the TokenType.assignment token
// The tokens[0] should be the first token of the expression
function parseVariableAssignment(tokens: Tokens, identifier: string): VariableAssignment {
  const expression = parseExpression(tokens);
  tokenCheck(tokens.shift(), TokenType.semicolon, "Expected ';' after the expression");
  return {
    type: Definitions.VariableAssignment,
    identifier,
    expression,
  };
}

// The tokens[0] here should be the first token of the expression
function parseExpression(tokens: Tokens) {
  const token = tokens.shift();
  let isIdentifierButNotFunctionCall = false;
  if (token && token.type === TokenType.identifier) {
    const nextToken = tokens.shift();
    if (nextToken && nextToken.type === TokenType.leftParen) {
      return parseFunctionCall(tokens, token.value);
    } else if (nextToken) {
      tokens.unshift(nextToken);
      isIdentifierButNotFunctionCall = true;
    }
  } else if (token) {
    tokens.unshift(token);
  }
  if (token && isIdentifierButNotFunctionCall) tokens.unshift(token);
  return parseOrExpression(tokens);
}

function parseOrExpression(tokens: Tokens) {
  let expression = parseAndExpression(tokens);
  let token = tokens.shift();
  while (token && token.type === TokenType.logicalOr) {
    expression = {
      type: Definitions.OrExpression,
      left: expression,
      right: parseAndExpression(tokens),
    };

    token = tokens.shift();
  }
  if (token) tokens.unshift(token);
  return expression;
}

function parseAndExpression(tokens: Tokens) {
  let expression = parseNotExpression(tokens);

  let token = tokens.shift();
  while (token && token.type === TokenType.logicalAnd) {
    expression = {
      type: Definitions.AndExpression,
      left: expression,
      right: parseNotExpression(tokens),
    };

    token = tokens.shift();
  }
  if (token) tokens.unshift(token);
  return expression;
}

function parseNotExpression(tokens: Tokens) {
  let token = tokens.shift();
  if (token && token.type === TokenType.logicalNot) {
    return {
      type: Definitions.NotExpression,
      expression: parseComparison(tokens),
    };
  }

  if (token) tokens.unshift(token);

  return parseComparison(tokens);
}

function parseComparison(tokens: Tokens) {
  let expression = parseAdditiveExpression(tokens);
  let token = tokens.shift();
  while (
    token &&
    (token.type === TokenType.equality ||
      token.type === TokenType.greaterThan ||
      token.type === TokenType.lessThan ||
      token.type === TokenType.greaterThanOrEqual ||
      token.type === TokenType.lessThanOrEqual)
  ) {
    expression = {
      type: Definitions.ComparisonExpression,
      operator: token.value,
      left: expression,
      right: parseAdditiveExpression(tokens),
    };

    token = tokens.shift();
  }
  if (token) tokens.unshift(token);
  return expression;
}

function parseAdditiveExpression(tokens: Tokens) {
  let expression = parseMultiplicativeExpression(tokens);
  let token = tokens.shift();

  while (token && (token.type === TokenType.plus || token.type === TokenType.minus)) {
    expression = {
      type: Definitions.AdditiveExpression,
      operator: token.value,
      left: expression,
      right: parseMultiplicativeExpression(tokens),
    };

    token = tokens.shift();
  }
  if (token) tokens.unshift(token);
  return expression;
}

function parseMultiplicativeExpression(tokens: Tokens) {
  let expression = parseUnaryExpression(tokens);

  let token = tokens.shift();

  while (token && (token.type === TokenType.multiply || token.type === TokenType.divide)) {
    expression = {
      type: Definitions.MultiplicativeExpression,
      operator: token.value,
      left: expression,
      right: parseUnaryExpression(tokens),
    };

    token = tokens.shift();
  }
  if (token) tokens.unshift(token);
  return expression;
}

function parseUnaryExpression(tokens: Tokens) {
  let token = tokens.shift();

  if (token && (token.type === TokenType.plus || token.type === TokenType.minus)) {
    return {
      type: Definitions.UnaryExpression,
      operator: token.value,
      expression: parsePrimaryExpression(tokens),
    };
  }

  if (token) tokens.unshift(token);

  return parsePrimaryExpression(tokens);
}

function parsePrimaryExpression(tokens: Tokens): any {
  const token = tokens.shift();
  if (!token) throw new Error("Expected a primary expression");

  switch (token.type) {
    case TokenType.number:
      return {
        type: "NumberLiteral",
        value: token.value,
      };
    case TokenType.string:
      return {
        type: "StringLiteral",
        value: token.value,
      };
    case TokenType.boolean:
      return {
        type: "BooleanLiteral",
        value: token.value,
      };
    case TokenType.identifier:
      return {
        type: "Identifier",
        name: token.value,
      };
    case TokenType.leftParen:
      const expression = parseExpression(tokens);
      tokenCheck(tokens.shift(), TokenType.rightParen, "Expected a ')' after the expression");
      return expression;
    default:
      throw new Error("Unexpected token for primary expression");
  }
}

// Function definitions are being parsed after the function keyword
function parseFunctionDefinition(tokens: Tokens): FunctionDeclaration {
  const name = tokenCheck(tokens.shift(), TokenType.identifier, "Expected a function name").value;
  tokenCheck(tokens.shift(), TokenType.leftParen, "Expected a '(' after the function name");
  let nextToken = tokens.shift();

  // Parse the parameters
  const params: string[] = [];
  while (nextToken && nextToken.type !== TokenType.rightParen) {
    nextToken = tokenCheck(nextToken, TokenType.identifier, "Expected a parameter name");

    params.push(nextToken.value);

    nextToken = tokens.shift();

    if (nextToken && nextToken.type === TokenType.comma) {
      nextToken = tokens.shift();
    }
  }

  nextToken = tokenCheck(nextToken, TokenType.rightParen, "Expected a ')' after the parameters");
  tokenCheck(tokens.shift(), TokenType.leftBrace, "Expected a '{' after the parameters");

  // Parse the function body
  const body: Statements[] = [];
  nextToken = tokens.shift();
  while (nextToken && nextToken.type !== TokenType.rightBrace) {
    if (nextToken.type === TokenType.semicolon) {
      nextToken = tokens.shift();
      continue;
    }
    tokens.unshift(nextToken);
    body.push(parseStatement(tokens));
    nextToken = tokens.shift();
  }

  nextToken = tokenCheck(nextToken, TokenType.rightBrace, "Expected a '}' after the function body");

  return {
    type: Definitions.FunctionDeclaration,
    name,
    params,
    body,
  };
}

// If statements are being parsed after the if keyword
function parseIfStatement(tokens: Tokens): IfStatement {
  tokenCheck(tokens.shift(), TokenType.leftParen, "Expected a '(' after the if keyword");
  const condition = parseExpression(tokens);
  tokenCheck(tokens.shift(), TokenType.rightParen, "Expected a ')' after the if condition");

  let leftBrace = tokens.shift();
  leftBrace = tokenCheck(leftBrace, TokenType.leftBrace, "Expected a '{' after the if condition");

  // Parse the if body
  const consequent: Statements[] = [];
  let nextToken = tokens.shift();
  while (nextToken && nextToken.type !== TokenType.rightBrace) {
    if (nextToken.type === TokenType.semicolon) {
      nextToken = tokens.shift();
      continue;
    }
    tokens.unshift(nextToken);
    consequent.push(parseStatement(tokens));
    nextToken = tokens.shift();
  }

  nextToken = tokenCheck(nextToken, TokenType.rightBrace, "Expected a '}' after the if body");

  const alternate: (ElseIfStatement | ElseStatement)[] = [];
  nextToken = tokens.shift();
  while (nextToken && nextToken.value === CONSTANTS.KEYWORDS[5]) {
    tokenCheck(tokens.shift(), TokenType.leftParen, "Expected a '(' after the elseif keyword");
    const elseifCondition = parseExpression(tokens);
    tokenCheck(tokens.shift(), TokenType.rightParen, "Expected a ')' after the elseif condition");
    tokenCheck(tokens.shift(), TokenType.leftBrace, "Expected a '{' after the elseif condition");

    const elseifConsequent: Statements[] = [];
    nextToken = tokens.shift();
    while (nextToken && nextToken.type !== TokenType.rightBrace) {
      if (nextToken.type === TokenType.semicolon) {
        nextToken = tokens.shift();
        continue;
      }
      tokens.unshift(nextToken);
      elseifConsequent.push(parseStatement(tokens));
      nextToken = tokens.shift();
    }

    nextToken = tokenCheck(nextToken, TokenType.rightBrace, "Expected a '}' after the elseif body");

    alternate.push({
      type: Definitions.ElseIfStatement,
      condition: elseifCondition,
      consequent: elseifConsequent,
    });

    nextToken = tokens.shift();
  }

  if (nextToken && nextToken.value === CONSTANTS.KEYWORDS[1]) {
    tokenCheck(tokens.shift(), TokenType.leftBrace, "Expected a '{' after the else keyword");

    const elseConsequent: Statements[] = [];
    nextToken = tokens.shift();
    while (nextToken && nextToken.type !== TokenType.rightBrace) {
      if (nextToken.type === TokenType.semicolon) {
        nextToken = tokens.shift();
        continue;
      }
      tokens.unshift(nextToken);
      elseConsequent.push(parseStatement(tokens));
      nextToken = tokens.shift();
    }

    nextToken = tokenCheck(nextToken, TokenType.rightBrace, "Expected a '}' after the else body");

    alternate.push({
      type: Definitions.ElseStatement,
      body: elseConsequent,
    });

    nextToken = tokens.shift();
  }

  if (nextToken) tokens.unshift(nextToken);

  return {
    type: Definitions.IfStatement,
    condition,
    consequent,
    alternate,
  };
}
