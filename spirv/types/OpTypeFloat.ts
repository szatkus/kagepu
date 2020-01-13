import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import dontKnow from '../dontKnow'
import { Type } from './Type'
import { ImiNumber, ImiType, ImiPut } from '../../imi'

export class TypeFloat extends Type {
  constructor (public width: number) {
    super()
    if (width !== 32 && width !== 64) {
      dontKnow()
    }
    // TODO: what could go wrong if float is too precise?
  }

  getSize (): number {
    return this.width / 8
  }

  toString () {
    return `TypeFloat(${this.width})`
  }
}

compiler.addInstruction(22, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let width = state.consumeWord()
  module.ops.push(new ImiNumber(width))
  module.ops.push(new ImiType(TypeFloat))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeFloat ${width}`)
})
