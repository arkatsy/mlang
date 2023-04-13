import { Definitions, type AST } from "./parser";
import StdLib from "./stdlib";
import { question } from "readline-sync";

export const executeCode = (code: string) => new Function("input", code)(question);

export function generateCode(ast: AST["body"]) {
  let code = "";

  for (const node of ast) {
    switch (node.type) {
      case Definitions.VariableAssignment: {
        let temp = "";
        temp += `let ${node.identifier} = `;

        if (node.expression.type === Definitions.FunctionCall) {
          let args = node.expression.args.map((arg: any) =>
            arg.type === "string" ? '"' + arg.value + '"' : arg.value
          );
          if (node.expression.callee === "input") {
            temp = `${StdLib.input(args[0], node.identifier)}\n`;
          } else {
            temp += `${node.expression.callee}(${args.toString()});\n`;
          }
        } else {
          temp += `${generateExpressionCode(node.expression)};\n`;
        }

        code += temp;
        break;
      }
      case Definitions.FunctionCall: {
        let temp = "";
        let args = node.args.map((arg: any) => (arg.type === "string" ? '"' + arg.value + '"' : arg.value));
        temp += `${node.callee}(${args});\n`;
        if (node.callee === "print") {
          temp = `${StdLib.print(...args)}\n`;
        } else if (node.callee === "input") {
          temp = `${StdLib.input(args[0])}\n`;
        }

        code += temp;
        break;
      }
      case Definitions.FunctionDeclaration: {
        code += `function ${node.name}(${node.params.toString()}) {\n`;
        code += generateCode(node.body);
        code += `}\n`;
        break;
      }
      case Definitions.IfStatement: {
        code += `if (${generateExpressionCode(node.condition)}) {\n`;
        code += generateCode(node.consequent);
        code += `}\n`;
        for (const alt of node.alternate) {
          if (alt.type === Definitions.ElseIfStatement) {
            let condition = generateExpressionCode(alt.condition);
            code += `else if (${condition}) {\n`;
            code += generateCode(alt.consequent);
            code += `}\n`;
          } else {
            code += `else {\n`;
            code += generateCode(alt.body);
            code += `}\n`;
          }
        }
        break;
      }
      case Definitions.ReturnStatement: {
        code += `return ${generateExpressionCode(node.expression)};\n`;
        break;
      }
      default: {
        throw new Error("Unknown node type");
      }
    }
  }

  return code;
}

function generateExpressionCode(expression: any): any {
  switch (expression.type) {
    case Definitions.OrExpression: {
      return `${generateExpressionCode(expression.left)} || ${generateExpressionCode(expression.right)}`;
    }
    case Definitions.AndExpression: {
      return `${generateExpressionCode(expression.left)} && ${generateExpressionCode(expression.right)}`;
    }
    case Definitions.NotExpression: {
      return `!${generateExpressionCode(expression.expression)}`;
    }
    case Definitions.ComparisonExpression: {
      return `${generateExpressionCode(expression.left)} ${
        expression.operator === "==" ? "===" : expression.operator
      } ${generateExpressionCode(expression.right)}`;
    }
    case Definitions.AdditiveExpression: {
      return `+${generateExpressionCode(expression.left)} ${expression.operator} +${generateExpressionCode(
        expression.right
      )}`;
    }
    case Definitions.MultiplicativeExpression: {
      return `${generateExpressionCode(expression.left)} ${expression.operator} ${generateExpressionCode(
        expression.right
      )}`;
    }
    case Definitions.UnaryExpression: {
      return `${expression.operator}${generateExpressionCode(expression.expression)}`;
    }
    case "StringLiteral": {
      return `"${expression.value}"`;
    }
    case "BooleanLiteral": {
      return expression.value;
    }
    case "NumberLiteral": {
      return expression.value;
    }
    case Definitions.FunctionCall: {
      return generateCode(expression);
    }
    default: {
      if (expression.type === "Identifier") {
        return expression.name;
      } else {
        throw new Error("Unknown expression type");
      }
    }
  }
}
