import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { Type } from '.'
import dontKnow from '../../imi/dontKnow'
import { ImiNumber, ImiBoolean, ImiType, ImiPut } from '../../imi'

export class TypeInt extends Type {
  constructor (public width: number, public signed: boolean) {
    super()
    if (width !== 32 && width !== 64) {
      dontKnow()
    }
  }

  getSize (): number {
    return this.width / 8
  }

  toString () {
    return `TypeInt(width=${this.width}, signed=${this.signed})`
  }
}

compiler.addInstruction(21, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let width = state.consumeWord()
  let signed = state.consumeWord() === 1
  module.ops.push(new ImiNumber(width))
  module.ops.push(new ImiBoolean(signed))
  module.ops.push(new ImiType(TypeInt))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeInt ${width}  ${signed}`)
})
