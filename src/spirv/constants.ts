import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import { Type } from "./types";
import dontKnow from "../dontKnow";
import { ConstantComposite } from "./memory";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpConstant
        case 43:
            {
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                if (state.wordCount > 4) dontKnow()
                let value = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    let pointer = execution.getGlobalMemory().createVariable(type, resultId)
                    execution.getGlobalMemory().writeUint32(pointer, value)
                    execution.heap[resultId] = pointer
                })
                console.debug(`$${resultId} = OpConstant $${typeId} ${value}`)
                state.processed = true
            }
        break
        // OpConstantComposite
        case 44:
            {
                let typeId = state.consumeWord()
                let resultId = state.consumeWord()
                let constituents = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let type = <Type> execution.heap[typeId]
                    execution.heap[resultId] = new ConstantComposite(type, constituents)
                })
                console.debug(`$${resultId} = OpConstantComposite $${typeId} ${constituents}`)
                state.processed = true
            }
        break
    }
}
