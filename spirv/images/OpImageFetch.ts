import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../dontKnow'

compiler.addInstruction(95, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let imageId = state.consumeWord()
  let coordinateId = state.consumeWord()
  let imageOperands = state.pos < state.endPos ? state.consumeWord() : 0
  let ids = state.consumeArray()
  // module.flow.push((execution: Execution) => {
  //   let type = execution.get(typeId) as TypeImage
  //   let image = execution.get(imageId) as SampledImage
  //   let coordinate = execution.get(coordinateId) as ConstantComposite
  //   if (coordinate.constituents.length !== 2 || imageOperands !== 0 || ids.length > 0) {
  //     dontKnow()
  //   }
  //   let x = coordinate.constituents[0]
  //   let y = coordinate.constituents[1]
  //   debugger
  //       // execution.put(resultId, sampledImage
  // })
  dontKnow()
  console.debug(`OpImageFetch $${typeId} $${resultId} $${imageId}`)
})
