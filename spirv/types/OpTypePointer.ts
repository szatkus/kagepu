import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiNumber, ImiType, ImiPut } from '../../imi'
import { Type } from './Type'

export class TypePointer extends Type {
  constructor (public storageClass: number, public type: Type) {
    super()
  }

  toString () {
    return `TypePointer(${this.type.toString()}, storageClass=${this.storageClass})`
  }
}

compiler.addInstruction(32, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let storageClass = state.consumeWord()
  let typeId = state.consumeWord()
  module.ops.push(new ImiNumber(storageClass))
  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiType(TypePointer))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypePointer ${storageClass} $${typeId}`)
})
