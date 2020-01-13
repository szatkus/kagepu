import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiNumber, ImiType, ImiPut, ImiGroup } from '../../imi'
import { Type } from './Type'

export class TypeStruct extends Type {
  constructor (public members: Type[]) {
    super()
  }

  getSize (): number {
    return this.members.reduce((a, t) => a + t.getSize(), 0)
  }

  toString () {
    return `TypeStruct(${this.members.map(t => t.toString())})`
  }
}

compiler.addInstruction(30, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let typeIds: number[] = state.consumeArray()

  typeIds.forEach(t => module.ops.push(new ImiGet(t)))
  module.ops.push(new ImiGroup(typeIds.length))
  module.ops.push(new ImiType(TypeStruct))
  module.ops.push(new ImiPut(resultId))

  console.debug(`$${resultId} = OpTypeStruct ${typeIds}`)
})
