import * as fs from "node:fs";
import { lexer } from "./src/lexer";
import { parser } from "./src/parser";

let file = (process.argv.slice(2)[0] || "1") + ".txt";

const source = fs.readFileSync(`./examples/${file}`, "utf-8");

console.log(JSON.stringify(parser(lexer(source)), null, 4));
