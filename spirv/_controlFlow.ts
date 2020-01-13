import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'
import { ImiReturn } from '../imi'

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpReturn
    case 253:
      
      state.processed = true
      break
        // OpReturnValue
    case 254:
      let valueId = state.consumeWord()
      module.flow.push((execution: Execution) => {
        execution.returnedValue = execution.get(valueId)
      })
      console.debug(`OpReturn ${valueId}`)
      state.processed = true
      break
        // OpLabel
    case 248:
      {
        
        state.processed = true
      }
      break
  }
}
