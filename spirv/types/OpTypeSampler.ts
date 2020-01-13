import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiType, ImiPut } from '../../imi'
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

export class TypeSampler extends Type {}

compiler.addInstruction(26, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  module.ops.push(new ImiType(TypeSampler))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeSampler`)
})
