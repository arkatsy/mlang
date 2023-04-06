# **A mini programming language written in Typescript**

### Grammar:

```ebnf
<program> ::= (<statement>)*

<statement> ::= <variable-assignment>
              | <array-assignment>
              | <expression>
              | <function-definition>
              | <function-call>
              | <if-statement>
              | <for-loop>
              | <while-loop>

<variable-assignment> ::= <identifier> "=" <expression> ";"

<array-assignment> ::= <identifier> "[" <expression> "]" "=" <expression> ";"

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

<function-definition> ::= "function" <identifier> "(" (<identifier> ("," <identifier>)*)? ")" "{" (<statement>)* "}"

<function-call> ::= <identifier> "(" (<arg> "," (<arg>)*)? ")"

<arg> ::= <string> | <identifier> | <number> | <boolean>

<if-statement> ::= "if" "(" <expression> ")" "{" (<statement>)* "}" ( "elseif" "(" <expression> ")" "{" (<statement>)* "}" )* ( "else" "{" (<statement>)* "}" )?

<for-loop> ::= "for" "(" <variable-assignment> ";" <expression> ";" <expression> ")" "{" (<statement>)* "}"

<while-loop> ::= "while" "(" <expression> ")" "{" (<statement>)* "}"

<number> ::= ( "-" )? ( "0" | <digit-nonzero> <digit>* ) ( "." <digit>+ )?

<string> ::= '"' <char>* '"'

<boolean> ::= "true" | "false"

<identifier> ::= (<letter> | "_") (<letter> | <number> | "_")*

<letter> ::= [a-zA-Z]

<digit> ::= [0-9]

<digit-nonzero> ::= [1-9]

<char> ::= [^"]

```
