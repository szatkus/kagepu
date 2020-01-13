import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../../imi/dontKnow'
import { ImiGet, ImiLoad, ImiPut } from '../../imi'

compiler.addInstruction(61, (state: CompilationState, module: CompiledModule) => {
  if (state.wordCount > 4) dontKnow()
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let loadId = state.consumeWord()
  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiGet(loadId))
  module.ops.push(new ImiLoad())
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpLoad $${typeId} $${loadId}`)
})
