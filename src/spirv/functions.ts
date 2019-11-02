import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import { Type } from "./types";

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpFunction
        case 54:
            {
                let returnTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let functionControl = state.consumeWord()
                let functionTypeId = state.consumeWord()
                
                //if (entryPoint != resultId) dontKnow()
                module.flow.push((execution: Execution) => {
                    let returnType = <Type> execution.heap[returnTypeId]
                    let functionType = <Type> execution.heap[functionTypeId]
                    execution.heap[resultId] = {
                        functionType,
                        returnType,
                        functionControl
                    }
                })
                console.debug(`$${resultId} = OpFunction $${functionTypeId} $${returnTypeId} ${functionControl}`)
            }
        break
        
    }
}
