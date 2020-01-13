import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiString, ImiPut, ImiFunction } from '../../imi'

compiler.addInstruction(54, (state: CompilationState, module: CompiledModule) => {
  let returnTypeId = state.consumeWord()
  let resultId = state.consumeWord()
  let functionControl = state.consumeWord()
  let functionTypeId = state.consumeWord()

  module.ops.push(new ImiFunction(returnTypeId, functionTypeId, functionControl))
  module.ops.push(new ImiPut(resultId))

  console.debug(`$${resultId} = OpFunction $${functionTypeId} $${returnTypeId} ${functionControl}`)
})
