import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../../imi/dontKnow'
import { ImiGet, ImiStore } from '../../imi'

compiler.addInstruction(62, (state: CompilationState, module: CompiledModule) => {
  if (state.wordCount > 4) dontKnow()
  let pointerId = state.consumeWord()
  let objectId = state.consumeWord()

  module.ops.push(new ImiGet(pointerId))
  module.ops.push(new ImiGet(objectId))
  module.ops.push(new ImiStore())

  console.debug(`OpStore $${pointerId} $${objectId}`)
})
