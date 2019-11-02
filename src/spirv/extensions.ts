import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";

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
            }
        break
    }
}
