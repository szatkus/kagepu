import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiString, ImiPut, ImiReturn } from '../../imi'

compiler.addInstruction(253, (state: CompilationState, module: CompiledModule) => {
  module.ops.push(new ImiReturn())

  console.debug('OpReturn')
})
