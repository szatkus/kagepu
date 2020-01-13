import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'

compiler.addInstruction(5, (state: CompilationState, module: CompiledModule) => {
  let targetId = state.consumeWord()
  module.names[targetId] = state.consumeString()
  console.debug(`$${targetId} OpName ` + module.names[targetId].toString())
})
