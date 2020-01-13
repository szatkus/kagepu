import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiPut, ImiGet, ImiConstant } from '../../imi'
import dontKnow from '../../imi/dontKnow'

compiler.addInstruction(43, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  if (state.wordCount > 4) dontKnow()
  let value = state.consumeWord()

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiConstant(value))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpConstant $${typeId} ${value}`)
})
