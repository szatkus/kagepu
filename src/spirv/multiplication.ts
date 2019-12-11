import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpFMul
        case 133:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let leftOperand = state.consumeWord()
                let rightOperand = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpFMul $${leftOperand} $${rightOperand}`)
                state.processed = true
            }
        break
        // OpVectorTimesScalar
        case 142:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let vector = state.consumeWord()
                let scalar = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpMatrixTimesVector $${vector} $${scalar}`)
                state.processed = true
            }
        break
        // OpMatrixTimesVector
        case 145:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let matrix = state.consumeWord()
                let vector = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpMatrixTimesVector $${matrix} $${vector}`)
                state.processed = true
            }
        break
        // OpMatrixTimesMatrix
        case 146:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let leftMatrix = state.consumeWord()
                let rightMatrix = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpMatrixTimesMatrix $${leftMatrix} $${rightMatrix}`)
                state.processed = true
            }
        break
    }
}
