import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'

compiler.addInstruction(3, (state: CompilationState, module: CompiledModule) => {
  console.debug('OpSource')
})
