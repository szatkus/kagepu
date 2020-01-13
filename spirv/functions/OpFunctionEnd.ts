import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiString, ImiPut, ImiFunctionEnd } from '../../imi'

compiler.addInstruction(56, (state: CompilationState, module: CompiledModule) => {
  module.ops.push(new ImiFunctionEnd())

  console.debug(`FunctionEnd`)
})
