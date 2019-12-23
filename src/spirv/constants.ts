import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'
import { Type } from './types'
import dontKnow from '../dontKnow'
import { ConstantComposite } from './memory'
import { ImiNumber, ImiGet, ImiCreateVariable, ImiPut, ImiPointerWrite } from './imi'

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpConstant
    case 43:
      {
        let typeId = state.consumeWord()
        let resultId = state.consumeWord()
        if (state.wordCount > 4) dontKnow()
        let value = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          let pointer = execution.getGlobalMemory().createVariable(type, resultId)
          pointer.writeUint32(value)
          execution.put(resultId, pointer)
        })
        module.ops.push(new ImiGet(typeId))
        module.ops.push(new ImiCreateVariable(0, resultId))
        module.ops.push(new ImiNumber(value))
        module.ops.push(new ImiPointerWrite())
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpConstant $${typeId} ${value}`)
        state.processed = true
      }
      break
        // OpConstantComposite
    case 44:
      {
        let typeId = state.consumeWord()
        let resultId = state.consumeWord()
        let constituents = state.consumeArray()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          execution.put(resultId, new ConstantComposite(type, constituents))
        })
        console.debug(`$${resultId} = OpConstantComposite $${typeId} ${constituents}`)
        state.processed = true
      }
      break
  }
}
