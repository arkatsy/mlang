# **Mlang**
Mlang is my attempt to create a mini programming language just for fun and to learn more about lexing and parsing.

More correct wording would be to say this is a transpiler for my mini programming language (since I ended up generating js code and package the whole node environment into the binary).

One of the hardest parts was the expression parsing. The expressions except when they are actual literals and we are comparing strings are either not parsed correctly or the generated js code is not correct.

For example parsing comparisons between identifiers which are number literals will result in comparison between strings. Of course I could convert them into numbers when I generate the js code but because I approached it in this very naive way I'd have to patch every edge case which would result in a very frustrated unreadable mess. Also as I said the goal was to learn more about lexing and parsing and not to create a "proper" programming language.

Example syntax: 
```js
x = input("Enter a number");
y = input("Enter another number");

function add(x, y) {
  return x + y;
}

result = add(x, y);
print(result);

```

*`input()` and `print()` are the native methods that I provide. You can probably guess what they do.*

---
#### Cli flags you can provide to the binary or by running `pnpm build:run` for unix systems or unix like: 
- `-t [file]` or `--tokens [file]` : Prints the tokens from the output of the lexer (if you provide a file, the output will be saved there in json format).
- `-a [file]` or `--ast [file]`: Prints the ast from the output of the parser (if you provide a file, the output will be saved there in json format).

If you are on windows you can do all of the above with WSL if you use it else if you don't use the binary, you can compile the typescript yourself with `npx tsc` and then run node with the build you created or 
you can run `npx ts-node ./index.ts <source_filename>.mlang` to compile and run everything immediately.

Of course you can compile the binary yourself with `pnpm build:pkg` (only on unix / unix like, on windows compile the typescript first `npx tsc` and then `npx pkg build/index.js --target node18-macos-x64,node18-linux-x64,node18-win-x64 --output ./bin/mlang`).

#### Grammar: 

```ebnf
<program> ::= (<statement>)*

<statement> ::= <variable-assignment>
              | <expression>
              | <function-definition>
              | <function-call>
              | <if-statement>
              | <return-statement>

<variable-assignment> ::= <identifier> "=" <expression> ";"

<expression> ::= <or-expression> | <function-call>

<or-expression> ::= <and-expression> ( "||" <and-expression> )*

<and-expression> ::= <not-expression> ( "&&" <not-expression> )*

<not-expression> ::= "!" <comparison> | <comparison>

<comparison> ::= <additive-expression> ( ( "==" | ">" | "<" | ">=" | "<=" ) <additive-expression> )*

<additive-expression> ::= <multiplicative-expression> ( ( "+" | "-" ) <multiplicative-expression> )*

<multiplicative-expression> ::= <unary-expression> ( ( "*" | "/" ) <unary-expression> )*

<unary-expression> ::= ( "+" | "-" ) <primary-expression> | <primary-expression>

<primary-expression> ::= <number> | <string> | <boolean> | <identifier> | "(" <expression> ")"

<boolean> ::= "true" | "false"

<function-definition> ::= "function" <identifier> "(" (<identifier> ("," <identifier>)*)? ")" "{" (<statement> | ("return" <expression>))* "}"

<function-call> ::= <identifier> "(" (<arg> "," (<arg>)*)? ")"

<arg> ::= <string> | <identifier> | <number> | <boolean>

<if-statement> ::= "if" "(" <expression> ")" "{" (<statement>)* "}" ( "elseif" "(" <expression> ")" "{" (<statement>)* "}" )* ( "else" "{" (<statement>)* "}" )?

<return-statement ::= <expression>

<number> ::= ( "-" )? ( "0" | <digit-nonzero> <digit>* ) ( "." <digit>+ )?

<string> ::= '"' <char>* '"'

<boolean> ::= "true" | "false"

<identifier> ::= (<letter> | "_") (<letter> | <number> | "_")*

<letter> ::= [a-zA-Z]

<digit> ::= [0-9]

<digit-nonzero> ::= [1-9]

<char> ::= [^"]

```
