import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import { Type } from "./types";
import dontKnow from "../dontKnow";

export interface FunctionDeclaration {
    functionType: Type
    returnType: Type
    functionControl: number
    body: Array<Function>
}

export class FunctionEnd {}

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpFunction
        case 54:
            {
                let returnTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let functionControl = state.consumeWord()
                let functionTypeId = state.consumeWord()
                
                module.flow.push((execution: Execution) => {
                    let returnType = <Type> execution.heap[returnTypeId]
                    let functionType = <Type> execution.heap[functionTypeId]
                    execution.heap[resultId] = {
                        functionType,
                        returnType,
                        functionControl,
                        body: []
                    }
                    execution.inFunction = resultId
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
                
                module.flow.push((execution: Execution) => {
                    let parameter = execution.currentFrame!.args.shift()
                    execution.heap[resultId] = parameter
                })
                console.debug(`$${resultId} = OpFunctionParameter`)
                state.processed = true
            }
        break
        // OpFunctionEnd
        case 56:
            {
                console.debug(`FunctionEnd`)
                module.flow.push(new FunctionEnd())
                state.processed = true
            }
        break
        // OpFunctionCall
        case 57:
            {
                let returnTypeId = state.consumeWord()
                let resultId = state.consumeWord()
                let functionId = state.consumeWord()
                let argsIds = state.consumeArray()
                
                module.flow.push((execution: Execution) => {
                    let func = execution.heap[functionId]
                    let result = execution.callFunction(func, argsIds.map(i => execution.heap[i]))
                    execution.heap[resultId] = result
                })
                console.debug(`$${resultId} = OpFunctionCall $${functionId}`)
                state.processed = true
            }
        break
    }
}
