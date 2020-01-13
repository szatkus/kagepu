import { CompilationState, CompiledModule } from '../compilation'
import compiler from '../compiler'
import { ImiGet, ImiNumber, ImiType, ImiPut, ImiBoolean, ImiObject } from '../../imi'
import { Type } from './Type'

export enum AccessQualifier {
  ReadOnly,
  WriteOnly,
  ReadWrite
}

export class TypeImage extends Type {
  constructor (public descriptor: {
        // TODO: add enums for some
    type: Type,
    dimensionality: number,
    depth: number,
    arrayed: boolean,
    multisampled: boolean,
    sampled: number,
    format: number,
    access: AccessQualifier
  }) {
    super()
  }

  getSize (): number {
    return 1
  }

  toString () {
    return `TypeImage()`
  }
}

compiler.addInstruction(25, (state: CompilationState, module: CompiledModule) => {
  let resultId = state.consumeWord()
  let typeId = state.consumeWord()
  let dimensionality = state.consumeWord()
  let depth = state.consumeWord()
  let arrayed = state.consumeWord() === 1
  let multisampled = state.consumeWord() === 1
  let sampled = state.consumeWord()
  let format = state.consumeWord()
  let access = state.pos < state.endPos ? state.consumeWord() : AccessQualifier.ReadWrite

  module.ops.push(new ImiGet(typeId))
  module.ops.push(new ImiNumber(dimensionality))
  module.ops.push(new ImiNumber(depth))
  module.ops.push(new ImiBoolean(arrayed))
  module.ops.push(new ImiBoolean(multisampled))
  module.ops.push(new ImiNumber(sampled))
  module.ops.push(new ImiNumber(format))
  module.ops.push(new ImiObject(access))
  module.ops.push(new ImiType(TypeImage))
  module.ops.push(new ImiPut(resultId))
  console.debug(`$${resultId} = OpTypeImage $${typeId} ${dimensionality} ${depth} ${access}`)
})
