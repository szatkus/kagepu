import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { Type } from './Type'
import { TypeVector } from './OpTypeVector'
import { ImiGet, ImiNumber, ImiType, ImiPut } from '../../imi'

export class TypeMatrix extends Type {
  rows: number
  type: Type
  constructor (public vectorType: TypeVector, public columns: number) {
    super()
    this.rows = vectorType.count
    this.type = vectorType.type
  }

  getSize (): number {
    return this.vectorType.getSize() * this.columns
  }

  toString () {
    return `TypeMatrix(${this.type.toString()}, columns=${this.columns}, rows=${this.rows})`
  }
}

compiler.addInstruction(24, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let typeId = state.consumeWord()
  let count = state.consumeWord()

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiNumber(count))
  module.ops.push(new ImiType(TypeMatrix))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeMatrix $${typeId} ${count}`)
})
