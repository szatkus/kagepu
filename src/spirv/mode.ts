import { CompilationState, CompiledModule } from "./compilation";
import { Execution } from "./execution";
import dontKnow from "../dontKnow";

const CAPABILITY_SHADER = 1

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpMemoryModel
        case 14:
            let addressingModel = state.consumeWord()
            let memoryModel = state.consumeWord()
            console.debug(`OpMemoryModel ${addressingModel} ${memoryModel}`)
        break
    
        // OpEntryPoint
        case 15:
            let executionModel = state.consumeWord()
            let entryPoint = state.consumeWord()
            let name = state.consumeString()
            let interfaces = state.consumeArray()
            //if (vertexStage.entryPoint !== name) dontKnow()
            console.debug(`OpEntryPoint ${executionModel} $${entryPoint} ${name} ${interfaces}`)
        break
        // OpExecutionMode
        case 16:
            entryPoint = state.consumeWord()
            let executionMode = state.consumeWord()
            console.debug(`OpExecutionMode ${entryPoint} ${executionMode}`)
        break
        // OpCapability
        case 17:
            let capability = state.consumeWord()
            if (capability != CAPABILITY_SHADER) {
                dontKnow()
            }
            console.debug(`OpCapability ${capability}`)
        break
    }
}
