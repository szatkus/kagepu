import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiNumber, ImiType, ImiPut, ImiGroup } from '../../imi'
import { Type } from './Type'

export class TypeFunction extends Type {
  constructor (public type: Type, public types: Array<Type>) {
    super()
  }

  toString () {
    return ` TypeFunction(${this.types.map(t => t.toString())}): ${this.type.toString()}`
  }
}

compiler.addInstruction(33, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let typeId = state.consumeWord()
  let argumentsIds = state.consumeArray()
  module.ops.push(new ImiGet(typeId))
  argumentsIds.forEach(a => module.ops.push(new ImiGet(a)))
  module.ops.push(new ImiGroup(argumentsIds.length))
  module.ops.push(new ImiType(TypeFunction))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeFunction $${typeId}`)
})
