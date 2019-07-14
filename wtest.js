const antlr4 = require('antlr4')
const WHLSLLexer = require('./grammar/WHLSLLexer.js')
const WHLSLParser = require('./grammar/WHLSLParser.js')

const chars = new antlr4.FileStream('a.whlsl')
const lexer = new WHLSLLexer.WHLSLLexer(chars)

const tokens = new antlr4.CommonTokenStream(lexer)
const parser = new WHLSLParser.WHLSLParser(tokens)

let level = 0

function visit(node) {
    console.log('  '.repeat(level) + node.constructor.name)
    
    if (node.children) {
        level += 1
        node.children.forEach(visit)
        level -= 1
    }
}

visit(parser.file())