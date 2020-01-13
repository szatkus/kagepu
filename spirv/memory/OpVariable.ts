import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../../imi/dontKnow'
import { ImiGet, ImiPointerType, ImiCreateVariable, ImiPut } from '../../imi'

compiler.addInstruction(59, (state: CompilationState, module: CompiledModule) => {
  if (state.wordCount > 4) dontKnow()
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let storageClass = state.consumeWord()
  let initializerId = state.pos < state.endPos ? state.consumeWord() : 0
  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiPointerType())
  module.ops.push(new ImiCreateVariable(storageClass, resultId))
  if (initializerId !== 0) {
    dontKnow()
  }
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpVariable $${typeId} ${storageClass}`)
})
