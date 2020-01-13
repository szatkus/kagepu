import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiString, ImiPut, ImiGetIndex, ImiGet, ImiNumber } from '../../imi'

compiler.addInstruction(81, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let compositeId = state.consumeWord()
  let indexes = state.consumeArray()

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiGet(compositeId))
  indexes.forEach(i => {
    module.ops.push(new ImiNumber(i))
    module.ops.push(new ImiGetIndex())
  })
  module.ops.push(new ImiPut(resultId))

  console.debug(`$${resultId} = OpCompositeExtract ${typeId} $${compositeId} ${indexes}`)
})
