import { CompilationState, CompiledModule } from './compilation'

type InstructionHandler = (state: CompilationState, module: CompiledModule) => void

export default {
  handlers: [] as InstructionHandler[],

  addInstruction (opCode: number, handler: InstructionHandler) {
    this.handlers[opCode] = handler
  },

  handleInstruction (opCode: number, state: CompilationState, module: CompiledModule): boolean {
    if (!this.handlers[opCode]) {
      return false
    }
    this.handlers[opCode](state, module)
    return true
  }
}
