import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiNumber, ImiType, ImiPut } from '../../imi'
import { Type } from './Type'
import { TypeImage } from './OpTypeImage'

export class TypeSampledImage extends Type {
  constructor (type: TypeImage) {
    super()
  }

  getSize (): number {
    return 1
  }

  toString () {
    return `TypeSampledImage()`
  }
}
compiler.addInstruction(27, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let typeId = state.consumeWord()

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiType(TypeSampledImage))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = TypeSampledImage(${typeId})`)
})
