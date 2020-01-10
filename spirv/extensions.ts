import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'
import dontKnow from './dontKnow'
import { TypeVector, TypeFloat } from './types'
import { Pointer, Memory } from './memory'
import { ImiPut, ImiString } from '../imi'

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpExtInstImport
    case 11:
      {
        let resultId = state.consumeWord()
        let name = state.consumeString()
        module.flow.push((execution: Execution) => {
          execution.put(resultId, name)
        })
        module.ops.push(new ImiString(name))
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpExtInstImport ${name}`)
        state.processed = true
      }
      break
        // OpExtInst
    case 12:
      {
        let resultTypeId = state.consumeWord()
        let resultId = state.consumeWord()
        let setId = state.consumeWord()
        let instruction = state.consumeWord()
        let operandsIds = state.consumeArray()
        module.flow.push((execution: Execution) => {
          let resultType = execution.get(resultTypeId) as TypeVector
          let set = execution.get(setId)
          let operands = operandsIds.map(i => execution.get(i))
                    // normalize
          if (set === 'GLSL.std.450' && instruction === 69) {
            if (!(resultType.type instanceof TypeFloat) || resultType.type.width !== 32) {
              dontKnow()
            }
            let maxValue = 0
            let vector = (operands[0] as Pointer).readFloat32Array()
            vector.forEach(value => maxValue = Math.max(Math.abs(value), maxValue))
            if (maxValue !== 0) {
              let result = new Float32Array(vector.map(value => value / maxValue))
              execution.put(resultId, new Pointer(new Memory(result.buffer), 0, resultType))
            } else {
              execution.put(resultId, new Pointer(new Memory(new Float32Array(vector.length)), 0, resultType))
            }
            return
          }
          dontKnow()
        })
        console.debug(`OpExtInstImport ${name}`)
        state.processed = true
      }
      break
  }
}
