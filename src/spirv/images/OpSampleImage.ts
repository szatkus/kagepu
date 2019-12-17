import { CompilationState, CompiledModule } from "../compilation";
import { Execution } from "../execution";
import { TypeSampledImage, TypeImage, TypeSampler } from "../types";
import compiler from "../compiler";

export class SampledImage {
    constructor(private type: TypeSampledImage, private image: TypeImage, private sampler: TypeSampler) {
        
    }
}

compiler.addInstruction(86, (state: CompilationState, module: CompiledModule) => {
    let typeId = state.consumeWord()
    let resultId = state.consumeWord()
    let imageId = state.consumeWord()
    let samplerId = state.consumeWord()
    module.flow.push((execution: Execution) => {
        let type = <TypeSampledImage> execution.heap[typeId]
        let image = <TypeImage> execution.heap[imageId]
        let sampler = <TypeSampler> execution.heap[samplerId]
        let sampledImage = new SampledImage(type, image, sampler)
        execution.heap[resultId] = sampledImage
    })
    console.debug(`OpSampledImage $${typeId} $${resultId} $${imageId} $${samplerId}`)
    state.processed = true
})
