import * as fs from "node:fs";
import { lexer } from "./src/lexer";

let file = (process.argv.slice(2)[0] || "1") + ".txt";

// The input for now is the source from ./examples/<id>.txt
// To pass a differente source file: `pnpm example <id>`
const source = fs.readFileSync(`./examples/${file}`, "utf-8");

console.log(lexer(source));
