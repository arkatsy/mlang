import { Definitions, type AST } from "./parser";

export const executeCode = (code: string) => new Function(code)();

export function generateCode(ast: AST["body"]) {
  let code = "";
  debugger;
  for (const node of ast) {
    switch (node.type) {
      case Definitions.VariableAssignment: {
        code += `let ${node.identifier} = `;
        if (node.expression.type === Definitions.FunctionCall) {
          code += `${node.expression.callee}(${node.expression.args
            .map((arg: any) => (arg.type === "string" ? '"' + arg.value + '"' : arg.value))
            .toString()});\n`;
        } else {
          code += `${generateExpressionCode(node.expression)};\n`;
        }

        break;
      }
      case Definitions.FunctionCall: {
        code += `${node.callee}(${node.args
          .map((arg: any) => (arg.type === "string" ? '"' + arg.value + '"' : arg.value))
          .toString()});\n`;
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
      return `${generateExpressionCode(expression.left)} ${expression.operator} ${generateExpressionCode(
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
    case "NumberLiteral" || "StringLiteral" || "BooleanLiteral": {
      return expression.value;
    }
    case Definitions.FunctionCall: {
      return `${expression.callee}(${expression.args.map((arg: any) => arg.value).toString()})`;
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
