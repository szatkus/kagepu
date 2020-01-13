import { CompilationState, CompiledModule } from '../compilation'
import { Execution } from '../execution'
import compiler from '../compiler'
import { ImiString, ImiPut } from '../../imi'

compiler.addInstruction(11, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let name = state.consumeString()
  module.flow.push((execution: Execution) => {
    execution.put(resultId, name)
  })
  module.ops.push(new ImiString(name))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpExtInstImport ${name}`)
  state.processed = true
})
