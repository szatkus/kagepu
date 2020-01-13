import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiType, ImiPut } from '../../imi'
import { Type } from './Type'

export class TypeVoid extends Type {
  toString () {
    return `TypeVoid`
  }
}

compiler.addInstruction(19, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  module.ops.push(new ImiType(TypeVoid))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeVoid`)
})
