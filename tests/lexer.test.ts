const { lexer } = require("../build/src/lexer");

// TODO: Should separate and create tests
// for each tokenize function in tokenize.ts
// TODO: Create a more robust way of testing the lexer.
describe("Lexer:", () => {
  test("should tokenize a function declaration", () => {
    expect(
      lexer(`
        function add(a, b) {
            return a + b;
        }
    `)
    ).toStrictEqual([
      { type: "keyword", value: "function" },
      { type: "identifier", value: "add" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "a" },
      { type: "comma", value: "," },
      { type: "identifier", value: "b" },
      { type: "rightParen", value: ")" },
      { type: "leftBrace", value: "{" },
      { type: "keyword", value: "return" },
      { type: "identifier", value: "a" },
      { type: "plus", value: "+" },
      { type: "identifier", value: "b" },
      { type: "semicolon", value: ";" },
      { type: "rightBrace", value: "}" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("should tokenize a function call", () => {
    expect(lexer(`add(1, 2);`)).toStrictEqual([
      { type: "identifier", value: "add" },
      { type: "leftParen", value: "(" },
      { type: "number", value: "1" },
      { type: "comma", value: "," },
      { type: "number", value: "2" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("should tokenize a variable declaration", () => {
    expect(
      lexer(`
    x = 1;
    t = 2;
    `)
    ).toStrictEqual([
      { type: "identifier", value: "x" },
      { type: "assignment", value: "=" },
      { type: "number", value: "1" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "t" },
      { type: "assignment", value: "=" },
      { type: "number", value: "2" },
      { type: "semicolon", value: ";" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("should tokenize expressions", () => {
    expect(
      lexer(`
        x = 1 + y * (2 + t * (y / g));
    `)
    ).toStrictEqual([
      { type: "identifier", value: "x" },
      { type: "assignment", value: "=" },
      { type: "number", value: "1" },
      { type: "plus", value: "+" },
      { type: "identifier", value: "y" },
      { type: "multiply", value: "*" },
      { type: "leftParen", value: "(" },
      { type: "number", value: "2" },
      { type: "plus", value: "+" },
      { type: "identifier", value: "t" },
      { type: "multiply", value: "*" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "y" },
      { type: "divide", value: "/" },
      { type: "identifier", value: "g" },
      { type: "rightParen", value: ")" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("should tokenize operators", () => {
    expect(lexer(`+ - * / == <= >= && || ! `)).toStrictEqual([
      { type: "plus", value: "+" },
      { type: "minus", value: "-" },
      { type: "multiply", value: "*" },
      { type: "divide", value: "/" },
      { type: "equality", value: "==" },
      { type: "lessThanOrEqual", value: "<=" },
      { type: "greaterThanOrEqual", value: ">=" },
      { type: "logicalAnd", value: "&&" },
      { type: "logicalOr", value: "||" },
      { type: "logicalNot", value: "!" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("should tokenize a full program, Test 1", () => {
    expect(
      lexer(`
        STUFF = 100;

        x = 1;
        y = 2;
        z = 5;
        
        function doStuff(num1, num2, clb) {
            z = STUFF * (num1 + (10 / num2));
            clb(z);
            return z;
        }

        print(doStuff(x, y, print));
    `)
    ).toStrictEqual([
      { type: "identifier", value: "STUFF" },
      { type: "assignment", value: "=" },
      { type: "number", value: "100" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "x" },
      { type: "assignment", value: "=" },
      { type: "number", value: "1" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "y" },
      { type: "assignment", value: "=" },
      { type: "number", value: "2" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "z" },
      { type: "assignment", value: "=" },
      { type: "number", value: "5" },
      { type: "semicolon", value: ";" },
      { type: "keyword", value: "function" },
      { type: "identifier", value: "doStuff" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "num1" },
      { type: "comma", value: "," },
      { type: "identifier", value: "num2" },
      { type: "comma", value: "," },
      { type: "identifier", value: "clb" },
      { type: "rightParen", value: ")" },
      { type: "leftBrace", value: "{" },
      { type: "identifier", value: "z" },
      { type: "assignment", value: "=" },
      { type: "identifier", value: "STUFF" },
      { type: "multiply", value: "*" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "num1" },
      { type: "plus", value: "+" },
      { type: "leftParen", value: "(" },
      { type: "number", value: "10" },
      { type: "divide", value: "/" },
      { type: "identifier", value: "num2" },
      { type: "rightParen", value: ")" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "clb" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "z" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "keyword", value: "return" },
      { type: "identifier", value: "z" },
      { type: "semicolon", value: ";" },
      { type: "rightBrace", value: "}" },
      { type: "identifier", value: "print" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "doStuff" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "x" },
      { type: "comma", value: "," },
      { type: "identifier", value: "y" },
      { type: "comma", value: "," },
      { type: "identifier", value: "print" },
      { type: "rightParen", value: ")" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "EOF", value: "EOF" },
    ]);
  });

  test("should tokenize a full program, Test 2", () => {
    expect(
      lexer(`
        x = 1;
        y = 10;
        in = input("Enter a number");

        if(in > x) {
            print("in is greater than 1");
        } elseif(in < y) {
            print("in is less than 10");
        } else {
            print("Neither");
        }
    `)
    ).toStrictEqual([
      { type: "identifier", value: "x" },
      { type: "assignment", value: "=" },
      { type: "number", value: "1" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "y" },
      { type: "assignment", value: "=" },
      { type: "number", value: "10" },
      { type: "semicolon", value: ";" },
      { type: "identifier", value: "in" },
      { type: "assignment", value: "=" },
      { type: "identifier", value: "input" },
      { type: "leftParen", value: "(" },
      { type: "string", value: "Enter a number" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "keyword", value: "if" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "in" },
      { type: "greaterThan", value: ">" },
      { type: "identifier", value: "x" },
      { type: "rightParen", value: ")" },
      { type: "leftBrace", value: "{" },
      { type: "identifier", value: "print" },
      { type: "leftParen", value: "(" },
      { type: "string", value: "in is greater than 1" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "rightBrace", value: "}" },
      { type: "keyword", value: "elseif" },
      { type: "leftParen", value: "(" },
      { type: "identifier", value: "in" },
      { type: "lessThan", value: "<" },
      { type: "identifier", value: "y" },
      { type: "rightParen", value: ")" },
      { type: "leftBrace", value: "{" },
      { type: "identifier", value: "print" },
      { type: "leftParen", value: "(" },
      { type: "string", value: "in is less than 10" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "rightBrace", value: "}" },
      { type: "keyword", value: "else" },
      { type: "leftBrace", value: "{" },
      { type: "identifier", value: "print" },
      { type: "leftParen", value: "(" },
      { type: "string", value: "Neither" },
      { type: "rightParen", value: ")" },
      { type: "semicolon", value: ";" },
      { type: "rightBrace", value: "}" },
      { type: "EOF", value: "EOF" },
    ]);
  });
});
