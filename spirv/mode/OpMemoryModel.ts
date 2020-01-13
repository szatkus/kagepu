import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'

compiler.addInstruction(14, (state: CompilationState, module: CompiledModule) => {
  let addressingModel = state.consumeWord()
  let memoryModel = state.consumeWord()
  console.debug(`OpMemoryModel ${addressingModel} ${memoryModel}`)
})
