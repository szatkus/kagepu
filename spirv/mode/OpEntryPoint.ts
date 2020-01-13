import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiEntryPoint } from '../../imi'

compiler.addInstruction(15, (state: CompilationState, module: CompiledModule) => {
  let executionModel = state.consumeWord()
  let entryPoint = state.consumeWord()
  let name = state.consumeString()
  let interfaces = state.consumeArray()
  console.debug(`OpEntryPoint ${executionModel} $${entryPoint} ${name} ${interfaces}`)
  module.ops.push(new ImiEntryPoint(executionModel, entryPoint, name))
  module.entryPoints.set(name, entryPoint)
})
