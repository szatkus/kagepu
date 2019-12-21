import { CompilationState, CompiledModule } from "../compilation";
import { Execution } from "../execution";
import { TypeSampledImage, TypeImage, TypeSampler } from "../types";
import compiler from "../compiler";
import { Pointer } from "../memory";
import { GPUTexture } from "../../textures";
import { GPUSampler } from "../../samplers";

export class SampledImage {
    constructor(private type: TypeSampledImage, private image: GPUTexture, private sampler: GPUSampler) {
        
    }
}

compiler.addInstruction(86, (state: CompilationState, module: CompiledModule) => {
    let typeId = state.consumeWord()
    let resultId = state.consumeWord()
    let imageId = state.consumeWord()
    let samplerId = state.consumeWord()
    module.flow.push((execution: Execution) => {
        let type = <TypeSampledImage> execution.get(typeId)
        let image = <Pointer> execution.get(imageId)
        let sampler = <Pointer> execution.get(samplerId)
        let sampledImage = new SampledImage(type, <GPUTexture> image.getObject(), <GPUSampler> sampler.getObject())
        execution.put(resultId, sampledImage)
    })
    console.debug(`OpSampledImage $${typeId} $${resultId} $${imageId} $${samplerId}`)
})
