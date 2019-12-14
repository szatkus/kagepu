import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";
import { TypeVector, TypeFloat } from "./types";
import { Pointer, Memory } from "./memory";

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
                let resultTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let setId = state.consumeWord()
                let instruction = state.consumeWord()
                let operandsIds = state.consumeArray()
                module.flow.push((execution: Execution) => {
                    let resultType = <TypeVector> execution.heap[resultTypeId]
                    let set = execution.heap[setId]
                    let operands = operandsIds.map(i => execution.heap[i])
                    // normalize
                    if (set === 'GLSL.std.450' && instruction === 69) {
                        if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
                            dontKnow()
                        }
                        let maxValue = 0
                        let vector = (<Pointer> operands[0]).readFloat32Array()
                        vector.forEach(value => maxValue = Math.max(Math.abs(value), maxValue))
                        let result = new Float32Array(vector.map(value => value / maxValue))
                        execution.heap[resultId] = new Pointer(new Memory(result.buffer), 0, resultType)
                        return
                    }
                    dontKnow()
                })
                console.debug(`OpExtInstImport ${name}`)
                state.processed = true
            }
        break
    }
}
