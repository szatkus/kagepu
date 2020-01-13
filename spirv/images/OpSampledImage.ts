import { CompilationState, CompiledModule } from '../compilation'
import { Execution } from '../execution'
import { TypeSampledImage, TypeImage, TypeSampler } from '../types'
import compiler from '../compiler'
import dontKnow from '../dontKnow'

export class SampledImage {
  constructor (private type: TypeSampledImage, private image: GPUTexture, private sampler: GPUSampler) {

  }
}

compiler.addInstruction(86, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let imageId = state.consumeWord()
  let samplerId = state.consumeWord()
  // module.flow.push((execution: Execution) => {
  //   let type = execution.get(typeId) as TypeSampledImage
  //   let image = execution.get(imageId) as Pointer
  //   let sampler = execution.get(samplerId) as Pointer
  //   let sampledImage = new SampledImage(type, image.getObject() as GPUTexture, sampler.getObject() as GPUSampler)
  //   execution.put(resultId, sampledImage)
  // })
  dontKnow()
  console.debug(`OpSampledImage $${typeId} $${resultId} $${imageId} $${samplerId}`)
})
