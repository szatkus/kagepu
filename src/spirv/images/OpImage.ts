import { CompilationState, CompiledModule } from "../compilation";
import { Execution } from "../execution";
import { TypeImage } from "../types";
import compiler from "../compiler";
import { SampledImage } from "./OpSampledImage";

compiler.addInstruction(100, (state: CompilationState, module: CompiledModule) => {
    let typeId = state.consumeWord()
    let resultId = state.consumeWord()
    let imageId = state.consumeWord()
    module.flow.push((execution: Execution) => {
        let type = <TypeImage> execution.get(typeId)
        let image = <SampledImage> execution.get(imageId)
        execution.put(resultId, image)
    })
    console.debug(`OpImage $${typeId} $${resultId} $${imageId}`)
})
