const { parser } = require("../build/src/parser");
const { lexer } = require("../build/src/lexer");

describe("Parser:", () => {
  test("should parse a simple program 1", () => {
    expect(
      parser(
        lexer(`

    x = input("Enter a number: ");

    y = input("Enter a number: ");

    z = x * 2 / y;

    print("z is : ", z);

    if(z > 10) {
        print("z is greater than 10");
    } else {
        print("z is less than 10");
    }

    `)
      )
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableAssignment",
          identifier: "x",
          expression: {
            type: "FunctionCall",
            callee: "input",
            args: [
              {
                type: "string",
                value: "Enter a number: ",
              },
            ],
          },
        },
        {
          type: "VariableAssignment",
          identifier: "y",
          expression: {
            type: "FunctionCall",
            callee: "input",
            args: [
              {
                type: "string",
                value: "Enter a number: ",
              },
            ],
          },
        },
        {
          type: "VariableAssignment",
          identifier: "z",
          expression: {
            type: "MultiplicativeExpression",
            operator: "/",
            left: {
              type: "MultiplicativeExpression",
              operator: "*",
              left: {
                type: "Identifier",
                name: "x",
              },
              right: {
                type: "NumberLiteral",
                value: "2",
              },
            },
            right: {
              type: "Identifier",
              name: "y",
            },
          },
        },
        {
          type: "FunctionCall",
          callee: "print",
          args: [
            {
              type: "string",
              value: "z is : ",
            },
            {
              type: "identifier",
              value: "z",
            },
          ],
        },
        {
          type: "IfStatement",
          condition: {
            type: "ComparisonExpression",
            operator: ">",
            left: {
              type: "Identifier",
              name: "z",
            },
            right: {
              type: "NumberLiteral",
              value: "10",
            },
          },
          consequent: [
            {
              type: "FunctionCall",
              callee: "print",
              args: [
                {
                  type: "string",
                  value: "z is greater than 10",
                },
              ],
            },
          ],
          alternate: [
            {
              type: "ElseStatement",
              body: [
                {
                  type: "FunctionCall",
                  callee: "print",
                  args: [
                    {
                      type: "string",
                      value: "z is less than 10",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test("should parse a simple program 2", () => {
    expect(
      parser(
        lexer(`
      x = input("Enter a number: ");
      t = input("Enter another number: ");

      function calc(x, t) {   
        if (x / 2 * t) {
          print("true");
        } else {
          print("false");
        }
      }

      calc(x, t);
      `)
      )
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "VariableAssignment",
          identifier: "x",
          expression: {
            type: "FunctionCall",
            callee: "input",
            args: [
              {
                type: "string",
                value: "Enter a number: ",
              },
            ],
          },
        },
        {
          type: "VariableAssignment",
          identifier: "t",
          expression: {
            type: "FunctionCall",
            callee: "input",
            args: [
              {
                type: "string",
                value: "Enter another number: ",
              },
            ],
          },
        },
        {
          type: "FunctionDeclaration",
          name: "calc",
          params: ["x", "t"],
          body: [
            {
              type: "IfStatement",
              condition: {
                type: "MultiplicativeExpression",
                operator: "*",
                left: {
                  type: "MultiplicativeExpression",
                  operator: "/",
                  left: {
                    type: "Identifier",
                    name: "x",
                  },
                  right: {
                    type: "NumberLiteral",
                    value: "2",
                  },
                },
                right: {
                  type: "Identifier",
                  name: "t",
                },
              },
              consequent: [
                {
                  type: "FunctionCall",
                  callee: "print",
                  args: [
                    {
                      type: "string",
                      value: "true",
                    },
                  ],
                },
              ],
              alternate: [
                {
                  type: "ElseStatement",
                  body: [
                    {
                      type: "FunctionCall",
                      callee: "print",
                      args: [
                        {
                          type: "string",
                          value: "false",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "FunctionCall",
          callee: "calc",
          args: [
            {
              type: "identifier",
              value: "x",
            },
            {
              type: "identifier",
              value: "t",
            },
          ],
        },
      ],
    });
  });

  test("should parse a simple program 3", () => {
    expect(
      parser(
        lexer(`
    function add(a,b){
      return a+b
    }

    add(1, 2);

    x = "Hello";
    y = "World";
    z = 123;
    d = add(z, 2);

    print(x, y, z, d);
    `)
      )
    ).toStrictEqual({
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: "add",
          params: ["a", "b"],
          body: [
            {
              type: "ReturnStatement",
              expression: {
                type: "AdditiveExpression",
                operator: "+",
                left: {
                  type: "Identifier",
                  name: "a",
                },
                right: {
                  type: "Identifier",
                  name: "b",
                },
              },
            },
          ],
        },
        {
          type: "FunctionCall",
          callee: "add",
          args: [
            {
              type: "number",
              value: "1",
            },
            {
              type: "number",
              value: "2",
            },
          ],
        },
        {
          type: "VariableAssignment",
          identifier: "x",
          expression: {
            type: "StringLiteral",
            value: "Hello",
          },
        },
        {
          type: "VariableAssignment",
          identifier: "y",
          expression: {
            type: "StringLiteral",
            value: "World",
          },
        },
        {
          type: "VariableAssignment",
          identifier: "z",
          expression: {
            type: "NumberLiteral",
            value: "123",
          },
        },
        {
          type: "VariableAssignment",
          identifier: "d",
          expression: {
            type: "FunctionCall",
            callee: "add",
            args: [
              {
                type: "identifier",
                value: "z",
              },
              {
                type: "number",
                value: "2",
              },
            ],
          },
        },
        {
          type: "FunctionCall",
          callee: "print",
          args: [
            {
              type: "identifier",
              value: "x",
            },
            {
              type: "identifier",
              value: "y",
            },
            {
              type: "identifier",
              value: "z",
            },
            {
              type: "identifier",
              value: "d",
            },
          ],
        },
      ],
    });
  });
});
