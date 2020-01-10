import dontKnow from './dontKnow'
import { CompilationState, CompiledModule } from './compilation'
import { Execution } from './execution'
import { ImiPut, ImiType, ImiNumber, ImiBoolean, ImiGet, ImiGroup } from '../imi'

export class Type {
  getSize (): number {
    dontKnow()
    return 0
  }
}

export class TypeVoid extends Type {
  toString () {
    return `TypeVoid`
  }
}

export class TypeFunction extends Type {
  constructor (public type: Type, public types: Array<Type>) {
    super()
  }

  toString () {
    return ` TypeFunction(${this.types.map(t => t.toString())}): ${this.type.toString()}`
  }
}

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

export class TypePointer extends Type {
  constructor (public storageClass: number, public type: Type) {
    super()
  }

  toString () {
    return `TypePointer(${this.type.toString()}, storageClass=${this.storageClass})`
  }
}

export class TypeArray extends Type {
  constructor (public type: Type, public count: number) {
    super()
  }

  getSize (): number {
    return this.type.getSize() * this.count
  }

  toString () {
    return `TypeArray(${this.type.toString()}, count=${this.count})`
  }
}

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

export class TypeSampler extends Type {}

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

export function compile (state: CompilationState, module: CompiledModule) {
  switch (state.opCode) {
        // OpTypeVoid
    case 19:
      {
        let resultId = state.consumeWord()
        module.flow.push((execution: Execution) => {
          execution.put(resultId, new TypeVoid())
        })
        module.ops.push(new ImiType(TypeVoid))
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpTypeVoid`)
        state.processed = true
      }
      break
        // OpTypeInt
    case 21:
      {
        let resultId = state.consumeWord()
        let width = state.consumeWord()
        let signed = state.consumeWord() === 1
        module.flow.push((execution: Execution) => {
          execution.put(resultId, new TypeInt(width, signed))
        })
        module.ops.push(new ImiNumber(width))
        module.ops.push(new ImiBoolean(signed))
        module.ops.push(new ImiType(TypeInt))
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpTypeInt ${width}  ${signed}`)
        state.processed = true
      }
      break
        // OpTypeFloat
    case 22:
      {
        let resultId = state.consumeWord()
        let width = state.consumeWord()
        module.flow.push((execution: Execution) => {
          execution.put(resultId, new TypeFloat(width))
        })
        console.debug(`$${resultId} = OpTypeFloat ${width}`)
        state.processed = true
      }
      break
        // OpTypeVector
    case 23:
      {
        let resultId = state.consumeWord()
        let typeId = state.consumeWord()
        let count = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          execution.put(resultId, new TypeVector(type, count))
        })
        console.debug(`$${resultId} = OpTypeVector $${typeId} ${count}`)
        state.processed = true
      }
      break
        // OpTypeMatrix
    case 24:
      {
        let resultId = state.consumeWord()
        let typeId = state.consumeWord()
        let count = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as TypeVector
          execution.put(resultId, new TypeMatrix(type, count))
        })
        console.debug(`$${resultId} = OpTypeMatrix $${typeId} ${count}`)
        state.processed = true
      }
      break
        // OpTypeImage
    case 25:
      {
        let resultId = state.consumeWord()
        let typeId = state.consumeWord()
        let dimensionality = state.consumeWord()
        let depth = state.consumeWord()
        let arrayed = state.consumeWord() === 1
        let multisampled = state.consumeWord() === 1
        let sampled = state.consumeWord()
        let format = state.consumeWord()
        let access = state.pos < state.endPos ? state.consumeWord() : AccessQualifier.ReadWrite
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          execution.put(resultId, new TypeImage({
            type,
            dimensionality,
            depth,
            arrayed,
            multisampled,
            sampled,
            format,
            access
          }))
        })
        console.debug(`$${resultId} = OpTypeImage $${typeId} ${dimensionality} ${depth} ${access}`)
        state.processed = true
      }
      break
        // OpTypeSampler
    case 26:
      {
        let resultId = state.consumeWord()
        module.flow.push((execution: Execution) => {
          execution.put(resultId, new TypeSampler())
        })
        console.debug(`$${resultId} = OpTypeSampler`)
        state.processed = true
      }
      break
        // OpTypeSampledImage
    case 27:
      {
        let resultId = state.consumeWord()
        let typeId = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId)
          execution.put(resultId, new TypeSampledImage(type))
        })
        console.debug(`$${resultId} = OpTypeSampler`)
        state.processed = true
      }
      break
        // OpTypeArray
    case 28:
      {
        let resultId = state.consumeWord()
        let typeId = state.consumeWord()
        let count = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          execution.put(resultId, new TypeArray(type, count))
        })
        console.debug(`$${resultId} = OpTypeArray $${typeId} ${count}`)
        state.processed = true
      }
      break
        // OpTypeStruct
    case 30:
      {
        let resultId = state.consumeWord()
        let typeIds: number[] = state.consumeArray()
        module.flow.push((execution: Execution) => {
          let types = typeIds.map(t => execution.get(t))
          execution.put(resultId, new TypeStruct(types))
        })
        typeIds.forEach(t => module.ops.push(new ImiGet(t)))
        module.ops.push(new ImiGroup(typeIds.length))
        module.ops.push(new ImiType(TypeStruct))
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpTypeStruct ${typeIds}`)
        state.processed = true
      }
      break
        // OpTypePointer
    case 32:
      {
        let resultId = state.consumeWord()
        let storageClass = state.consumeWord()
        let typeId = state.consumeWord()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          execution.put(resultId, new TypePointer(storageClass, type))
        })
        module.ops.push(new ImiNumber(storageClass))
        module.ops.push(new ImiGet(typeId))
        module.ops.push(new ImiType(TypePointer))
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpTypePointer ${storageClass} $${typeId}`)
        state.processed = true
      }
      break
        // OpTypeFunction
    case 33:
      {
        let resultId = state.consumeWord()
        let typeId = state.consumeWord()
        let argumentsIds = state.consumeArray()
        module.flow.push((execution: Execution) => {
          let type = execution.get(typeId) as Type
          execution.put(resultId, new TypeFunction(type, argumentsIds.map(id => execution.get(id) as Type)))
        })
        module.ops.push(new ImiGet(typeId))
        argumentsIds.forEach(a => module.ops.push(new ImiGet(a)))
        module.ops.push(new ImiGroup(argumentsIds.length))
        module.ops.push(new ImiType(TypeFunction))
        module.ops.push(new ImiPut(resultId))
        console.debug(`$${resultId} = OpTypeFunction $${typeId}`)
        state.processed = true
      }
      break
  }
}
