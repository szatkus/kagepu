import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiString, ImiPut, ImiLabel } from '../../imi'

compiler.addInstruction(248, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()

  module.ops.push(new ImiLabel())
  module.ops.push(new ImiPut(resultId))

  console.debug(`$${resultId} = OpLabel`)
})
