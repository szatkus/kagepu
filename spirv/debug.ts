import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpSource
        // OpSourceExtension
    case 3:
    case 4:
      console.debug('OpSource')
      state.pos += state.wordCount - 1
      state.processed = true
      break
        // OpName
    case 5:
      {
        let targetId = state.consumeWord()
        module.names[targetId] = state.consumeString()
        console.debug(`$${targetId} OpName  ` + module.names[targetId].toString())
        state.processed = true
      }
      break
        // OpMemberName
    case 6:
      {
        let typeId = state.consumeWord()
        let memberNumber = state.consumeWord()
        let name = state.consumeString()
        console.debug(`OpMemberName ${name} ${typeId}`)
        state.processed = true
      }
      break
        // OpString
    case 7:
      {
        let resultId = state.consumeWord()
        let str = state.consumeString()
        module.flow.push((execution: Execution) => {
          execution.put(resultId, str)
        })
        console.debug(`$${resultId} = OpString ${str}`)
        state.processed = true
      }
      break
  }
}