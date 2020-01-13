import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiNumber, ImiType, ImiPut } from '../../imi'
import { Type } from './Type'

export class TypeVector extends Type {
  constructor (public type: Type, public count: number) {
    super()
  }

  getSize (): number {
    return this.type.getSize() * this.count
  }

  toString () {
    return `TypeVector(${this.type.toString()}, count=${this.count})`
  }
}

compiler.addInstruction(23, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let typeId = state.consumeWord()
  let count = state.consumeWord()
  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiNumber(count))
  module.ops.push(new ImiType(TypeVector))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeVector $${typeId} ${count}`)
})
