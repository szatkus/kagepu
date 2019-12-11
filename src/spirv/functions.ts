import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import { Type } from "./types";
import dontKnow from "../dontKnow";

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
                state.processed = true
            }
        break
        // OpFunctionParameter
        case 55:
            {
                let returnTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                
                //if (entryPoint != resultId) dontKnow()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpFunctionParameter`)
                state.processed = true
            }
        break
        // OpFunctionEnd
        case 56:
            {
                console.debug(`FunctionEnd`)
                state.processed = true
            }
        break
        // OpFunctionCall
        case 57:
            {
                let returnTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let functionId = state.consumeWord()
                let args = state.consumeArray()
                
                //if (entryPoint != resultId) dontKnow()
                module.flow.push((execution: Execution) => {
                    dontKnow()
                })
                console.debug(`$${resultId} = OpFunctionCall $${functionId}`)
                state.processed = true
            }
        break
    }
}
