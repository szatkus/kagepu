import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../../imi/dontKnow'
import { RelaxedPrecision, Builtin, ArrayStride, Binding, DescriptorSet, Decoration, Location } from '../decorations'

compiler.addInstruction(72, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let memberNumber = state.consumeWord()
  let decoration = state.consumeWord()
  if (decoration === 11) {
    console.debug(`${typeId} ${memberNumber} Builtin ${state.consumeWord()}`)
  } else if (decoration === 35) {
    console.debug(`${typeId} ${memberNumber} offset ${state.consumeWord()}`)
  } else if (decoration === 5) {
    console.debug(`${typeId} ${memberNumber} ColMajor`)
  } else if (decoration === 7) {
    console.debug(`${typeId} ${memberNumber} MatrixStride ${state.consumeWord()}`)
  } else {
    dontKnow()
  }
  if (state.pos !== state.endPos) {
    dontKnow()
  }
})
