import * as fs from "node:fs";
import { lexer } from "./src/lexer";

let file = (process.argv.slice(2)[0] || "2") + ".txt";

const source = fs.readFileSync(`./examples/${file}`, "utf-8");

console.log(lexer(source));
