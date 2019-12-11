import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpVectorShuffle
        case 79:
            {
                let resultType = state.consumeWord()
                let resultId = state.consumeWord()
                let leftVector = state.consumeWord()
                let rightVector = state.consumeWord()
                let components = state.consumeArray
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpVectorShuffle ${leftVector} ${rightVector}`)
                state.processed = true
            }
        break
    }
}
