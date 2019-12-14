import { compile as debugCompile } from "./debug"
import { compile as annotationsCompile, Decorations } from "./annotations"
import { compile as extensionsCompile } from "./extensions"
import { compile as modeSettingCompile } from "./mode"
import { compile as typeSettingCompile } from "./types"
import { compile as constantsCompile } from "./constants"
import { compile as memoryCompile } from "./memory"
import { compile as functionsCompile, FunctionEnd } from "./functions"
import { compile as compositesCompile } from "./composites"
import { compile as controlFlowCompile } from "./controlFlow"
import { compile as multiplicationCompile } from "./multiplication"
import { compile as vectorsCompile } from "./vectors"
import { compile as additionCompile } from "./addition"

export type CodeStream = Uint32Array

export class CompiledModule {
    names: String[] = []
    decorations = new Decorations()
    flow: (Function | FunctionEnd)[] = []
    entryPoints: Map<String, number> = new Map()
}

export class CompilationState {
    pos: number = 0
    opCode: number = 0
    wordCount: number = 0
    startPos: number = 0
    endPos: number = 0
    processed: boolean = false
    constructor(readonly code: CodeStream, public module: CompiledModule) {}

    consumeString(): String {
        let start = this.pos
        let end = start
        while ((this.code[this.pos] & 0xFF) != 0 && this.pos < this.endPos - 1) {
            this.pos++
            end = this.pos
        }
        let stringBuffer = this.code.slice(start, end + 1).buffer
        let decoder = new TextDecoder('utf-8')
        let rawString = decoder.decode(stringBuffer)
        let i = rawString.length - 1
        while (rawString.codePointAt(i) == 0) {
            i--
        }
        return rawString.substring(0, i + 1)
    }

    consumeWord(): number {
        return this.code[this.pos++]
    }

    consumeArray(): number[] {
        let elements = []
        while (this.pos < this.endPos) {
            elements.push(this.consumeWord())
        }
        this.pos--
        return elements
    }
}

export function compile(code: CodeStream) {
    
    
    let module = new CompiledModule()
    let state = new CompilationState(code, module)
    while (state.pos < code.length) {
        if (state.pos == 1) {
            let majorVersion = (code[state.pos] & 0xFF0000) >> 16
            let minorVersion = (code[state.pos] & 0xFF00) >> 8
            console.debug(`version ${majorVersion}.${minorVersion}`)
        }
        if (state.pos >= 5) {
            state.opCode = code[state.pos] & 0xFF
            state.wordCount = (code[state.pos] & 0xFF0000) >> 16
            state.startPos = state.pos
            state.endPos = state.startPos + state.wordCount
            state.pos++
            state.processed = false

            // instructions are grouped in the same way as in the specification
            // https://www.khronos.org/registry/spir-v/specs/1.0/SPIRV.html#_a_id_instructions_a_instructions
            debugCompile(state, module)
            annotationsCompile(state, module)
            extensionsCompile(state, module)
            modeSettingCompile(state, module)
            typeSettingCompile(state, module)
            constantsCompile(state, module)
            memoryCompile(state, module)
            functionsCompile(state, module)
            compositesCompile(state, module)
            controlFlowCompile(state, module)
            multiplicationCompile(state, module)
            vectorsCompile(state, module)
            additionCompile(state, module)

            // processing an instruction should change state of the program counter, otherwise it means that instruction is not supported
            if (!state.processed) {
                console.debug(code[state.pos])
                console.debug(code[state.pos + 1])
                console.debug(code[state.pos + 2])
                console.debug(code[state.pos + 3])
                throw new Error(`Unknown opcode ${state.opCode}`)
            }
            state.pos = state.endPos
        } else {
            state.pos++
        }
    }
    return module
}
