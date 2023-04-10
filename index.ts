import * as fs from "node:fs";
import { lexer } from "./src/lexer";
import { parser } from "./src/parser";
import { generateCode, executeCode } from "./src/generator";

let file = (process.argv.slice(2)[0] || "1") + ".txt";

const source = fs.readFileSync(`./examples/${file}`, "utf-8");

const lexerResult = lexer(source);
const parserResult = parser(lexerResult);
const codegenResult = generateCode(parserResult.body);

const jsCode = codegenResult;

fs.writeFile("./build/generated.js", jsCode.trim(), (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
});
// console.log(JSON.stringify(parserResult, null, 4));
executeCode(codegenResult);
