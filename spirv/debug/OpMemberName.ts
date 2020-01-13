import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'

compiler.addInstruction(6, (state: CompilationState, module: CompiledModule) => {
  let typeId = state.consumeWord()
  let memberNumber = state.consumeWord()
  let name = state.consumeString()
  console.debug(`OpMemberName ${typeId} ${memberNumber} ${name}`)
})
