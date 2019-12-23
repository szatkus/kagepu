import { CompilationState, CompiledModule } from "./compilation";
import dontKnow from "../dontKnow";
import { ImiEntryPoint } from "./imi";

const CAPABILITY_SHADER = 1

export function compile (state: CompilationState, module: CompiledModule) {
    switch(state.opCode) {
        // OpMemoryModel
        case 14:
            let addressingModel = state.consumeWord()
            let memoryModel = state.consumeWord()
            console.debug(`OpMemoryModel ${addressingModel} ${memoryModel}`)
            state.processed = true
        break
        // OpEntryPoint
        case 15:
            let executionModel = state.consumeWord()
            let entryPoint = state.consumeWord()
            let name = state.consumeString()
            let interfaces = state.consumeArray()
            console.debug(`OpEntryPoint ${executionModel} $${entryPoint} ${name} ${interfaces}`)
            module.ops.push(new ImiEntryPoint(executionModel, entryPoint, name))
            state.processed = true
            module.entryPoints.set(name, entryPoint)
        break
        // OpExecutionMode
        case 16:
            entryPoint = state.consumeWord()
            let executionMode = state.consumeWord()
            console.debug(`OpExecutionMode ${entryPoint} ${executionMode}`)
            state.processed = true
        break
        // OpCapability
        case 17:
            let capability = state.consumeWord()
            if (capability != CAPABILITY_SHADER) {
                dontKnow()
            }
            console.debug(`OpCapability ${capability}`)
            state.processed = true
        break
    }
}
