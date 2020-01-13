import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'

compiler.addInstruction(4, (state: CompilationState, module: CompiledModule) => {
  console.debug('OpSourceExtension')
})
