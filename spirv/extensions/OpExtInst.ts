import { CompilationState, CompiledModule } from '../compilation'
import { Execution } from '../execution'
import compiler from '../compiler'
import { ImiString, ImiPut } from '../../imi'
import { TypeVector, TypeFloat } from '../types'
import dontKnow from '../../imi/dontKnow'
import { Pointer, Memory } from '../_memory'

compiler.addInstruction(11, (state: CompilationState, module: CompiledModule) => {
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
  dontKnow()
  console.debug(`OpExtInstImport ${name}`)
})
