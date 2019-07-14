const antlr4 = require('antlr4');
const WHLSLLexer = require('./grammar/WHLSLLexer.js');
const WHLSLParser = require('./grammar/WHLSLParser.js');

const chars = new antlr4.FileStream('a.whlsl');
const lexer = new WHLSLLexer.WHLSLLexer(chars);

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new WHLSLParser.WHLSLParser(tokens);

console.log(parser.file());