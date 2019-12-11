import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpFAdd
        case 129:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let leftOperand = state.consumeWord()
                let rightOperand = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpFAdd $${leftOperand} $${rightOperand}`)
                state.processed = true
            }
        break
        // OpFSub
        case 131:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let leftOperand = state.consumeWord()
                let rightOperand = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpFSub $${leftOperand} $${rightOperand}`)
                state.processed = true
            }
        break
    }
}
