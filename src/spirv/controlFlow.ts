import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpReturn
        case 253:
            console.debug('OpReturn')
            state.processed = true
        break;
        // OpReturnValue
        case 254:
            let valueId = state.consumeWord()
            module.flow.push((execution: Execution) => {
                execution.returnedValue = execution.get(valueId)
            })
            console.debug(`OpReturn ${valueId}`)
            state.processed = true
        break;
        // OpLabel
        case 248:
            {
                let resultId = state.consumeWord()
                module.flow.push((execution: Execution) => {
                    execution.put(resultId, 'noidea')
                })
                console.debug(`$${resultId} = OpLabel`)
                state.processed = true
            }
        break
    }
}
