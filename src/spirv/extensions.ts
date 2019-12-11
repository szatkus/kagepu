import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpExtInstImport
        case 11:
            {
                let resultId = state.consumeWord()
                let name = state.consumeString()
                module.flow.push((execution: Execution) => {
                    execution.heap[resultId] = name
                })
                console.debug(`OpExtInstImport ${name}`)
                state.processed = true
            }
        break
        // OpExtInst
        case 12:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let set = state.consumeWord()
                let instruction = state.consumeWord()
                let operands = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`OpExtInstImport ${name}`)
                state.processed = true
            }
        break
    }
}
