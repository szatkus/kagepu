import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiGetIndex, ImiPut } from '../../imi'

compiler.addInstruction(65, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let baseId = state.consumeWord()
  let indexes = state.consumeArray()

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiGet(baseId))
  indexes.forEach(i => {
    module.ops.push(new ImiGet(i))
    module.ops.push(new ImiGetIndex())
  })
  module.ops.push(new ImiPut(resultId))

  console.debug(`$${resultId} = OpAccessChain $${typeId} $${baseId} ${indexes}`)
})
