import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { RelaxedPrecision, Builtin, ArrayStride, Binding, DescriptorSet, Decoration, Location } from '../decorations'
import dontKnow from '../../imi/dontKnow'

compiler.addInstruction(71, (state: CompilationState, module: CompiledModule) => {
  let targetId = state.consumeWord()
  let decorationCode = state.consumeWord()
  let decoration
  if (decorationCode === 2) {
    decoration = 2
  } else if (decorationCode === 0) {
    decoration = new RelaxedPrecision()
    console.debug(`Decorate $${targetId} with RelaxedPrecision()`)
  } else if (decorationCode === 11) {
    decoration = new Builtin(state.consumeWord())
    console.debug(`Decorate $${targetId} with Builtin(${decoration.value})`)
  } else if (decorationCode === 6) {
    decoration = new ArrayStride(state.consumeWord())
    console.debug(`Decorate $${targetId} with ArrayStride(${decoration.stride})`)
  } else if (decorationCode === 30) {
    decoration = new Location(state.consumeWord())
    console.debug(`Decorate $${targetId} with Location(${decoration.value})`)
  } else if (decorationCode === 33) {
    decoration = new Binding(state.consumeWord())
    console.debug(`Decorate $${targetId} with Binding(${decoration.value})`)
  } else if (decorationCode === 34) {
    decoration = new DescriptorSet(state.consumeWord())
    console.debug(`Decorate $${targetId} with DescriptorSet(${decoration.value})`)
  } else {
    dontKnow()
  }
  module.decorations.putDecoration(targetId, decoration as Decoration)
})
