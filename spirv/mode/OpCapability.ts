import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../dontKnow'

const CAPABILITY_SHADER = 1

compiler.addInstruction(17, (state: CompilationState, module: CompiledModule) => {
  let capability = state.consumeWord()
  if (capability !== CAPABILITY_SHADER) {
    dontKnow()
  }
  console.debug(`OpCapability ${capability}`)
})
