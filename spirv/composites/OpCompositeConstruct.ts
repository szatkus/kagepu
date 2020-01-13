import { CompilationState, CompiledModule } from '../compilation'
import { Execution } from '../execution'
import compiler from '../compiler'
import { ImiString, ImiPut, ImiComposite, ImiGet, ImiNumber, ImiSetIndex } from '../../imi'

compiler.addInstruction(80, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let resultId = state.consumeWord()
  let constituents = state.consumeArray()

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiComposite())
  constituents.forEach((c, i) => {
    module.ops.push(new ImiNumber(i))
    module.ops.push(new ImiGet(c))
    module.ops.push(new ImiSetIndex())
  })
  module.ops.push(new ImiPut(resultId))

  console.debug(`$${resultId} = OpCompositeConstruct $${typeId} ${constituents}`)
})
