import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'

compiler.addInstruction(16, (state: CompilationState, module: CompiledModule) => {
  let entryPoint = state.consumeWord()
  let executionMode = state.consumeWord()
  console.debug(`OpExecutionMode ${entryPoint} ${executionMode}`)
})
