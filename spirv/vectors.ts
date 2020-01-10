import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'
import dontKnow from './dontKnow'
import { Pointer, Memory } from './memory'
import { TypeVector, TypeFloat } from './types'

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpVectorShuffle
    case 79:
      {
        let resultTypeId = state.consumeWord()
        let resultId = state.consumeWord()
        let leftVectorId = state.consumeWord()
        let rightVectorId = state.consumeWord()
        let components = state.consumeArray()
        module.flow.push((execution: Execution) => {
          const UNDEFINED = 0xFFFFFFFF
          let resultType = execution.get(resultTypeId) as TypeVector
          if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
            dontKnow()
          }
          let leftVector = execution.get(leftVectorId) as Pointer
          let rightVector = execution.get(rightVectorId) as Pointer
          let result = new Float32Array(resultType.count)
          components.forEach((component, index) => {
            if (component === UNDEFINED) {
              result[index] = 0
              return
            }
            if (index % 2 === 0) {
              result[index] = leftVector.readFloat32Array()[component]
            } else {
              result[index] = rightVector.readFloat32Array()[component]
            }
          })
          execution.put(resultId, new Pointer(new Memory(result.buffer), 0, resultType))
        })
        console.debug(`$${resultId} = OpVectorShuffle ${leftVectorId} ${rightVectorId}`)
        state.processed = true
      }
      break
  }
}
