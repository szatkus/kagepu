import { Type, TypeInt, TypeStruct, TypeArray, TypeVector } from '../spirv/types'
import { CompiledModule } from '../spirv/compilation'
import dontKnow from './dontKnow'
import { DescriptorSet, Binding } from '../spirv/decorations'
import { VertexInputs } from '../webgpu/KQueue'

type ImiId = number

export class ImiOp {
  execute (stack: any[], globals: any[], entryPoints: ImiEntryPoint[], allocator: MemoryAllocator): Instruction[] {
    throw new Error('Method not implemented.')
  }
}

export class ImiString extends ImiOp {
  constructor (public value: string) {
    super()
  }

  execute (stack: any[], globals: any[]) {
    stack.push(this.value)
    return []
  }

}

export class ImiObject extends ImiOp {
  constructor (public value: any) {
    super()
  }

}

export class ImiConstant extends ImiOp {
  constructor (public value: any) {
    super()
  }

  execute (stack: any[]) {
    let type = stack.pop() as Type
    stack.push({
      value: this.value,
      type
    })
    return []
  }
}

export class ImiComposite extends ImiOp {
  constructor () {
    super()
  }

  execute (stack: any[]) {
    let type = stack.pop() as Type
    stack.push({
      type,
      values: []
    })
    return []
  }
}

export class ImiLabel extends ImiOp {
  execute (stack: any[]) {
    return [{
      code: BLOCK,
      arg: NOTYPE
    }]
  }
}

export class ImiNumber extends ImiOp {
  constructor (public value: number) {
    super()
  }

  execute (stack: any[]) {
    stack.push(this.value)
    return []
  }
}

export class ImiBoolean extends ImiOp {
  constructor (public value: boolean) {
    super()
  }

  execute (stack: any[]) {
    stack.push(this.value)
    return []
  }
}

export class ImiGet extends ImiOp {
  constructor (public id: ImiId) {
    super()
  }

  emit (stack: any[], globals: any[]) {
    stack.push(globals[this.id])
  }

  execute (stack: any[], globals: any[]) {
    stack.push(globals[this.id])
    return []
  }
}

export class ImiPut extends ImiOp {
  constructor (public resultId: ImiId) {
    super()
  }

  execute (stack: any[], globals: any[]) {
    let value = stack.pop()
    globals[this.resultId] = value
    return []
  }
}

export class ImiGroup extends ImiOp {
  constructor (public count: number) {
    super()
  }

  emit (stack: any[]) {
    this.execute(stack)
  }

  execute (stack: any[]) {
    let group = stack.slice(stack.length - this.count)
    stack.splice(stack.length - this.count)
    stack.push(group)
    return []
  }
}

export class ImiEntryPoint extends ImiOp {
  constructor (public executionModel: number, public entryPoint: ImiId, public name: string) {
    super()
  }

  execute (stack: any[], globals: any[], entryPoints: ImiEntryPoint[]) {
    entryPoints.push(this)
    return []
  }
}

export class ImiType extends ImiOp {
  constructor (public type: NewableFunction) {
    super()
  }

  execute (stack: any[]) {
    let args = stack.slice(stack.length - this.type.length)
    let type = new (this.type as any)(...args)
    stack.splice(stack.length - this.type.length)
    stack.push(type)
    return []
  }
}

export class ImiPointerType extends ImiOp {

  emit (stack: any[]) {
    this.execute(stack)
  }

  execute (stack: any[]) {
    let type = stack.pop().type
    stack.push(type)
    return []
  }
}

export class ImiCreateVariable extends ImiOp {
  constructor (public storageClass: number, public resultId: number) {
    super()
  }

  execute (stack: any[], globals: any[], _: ImiEntryPoint[], allocator: MemoryAllocator) {
    let type = stack.pop() as Type
    stack.push(allocator.allocate(this.storageClass, type, this.resultId))
    return []
  }
}

export class ImiFunction extends ImiOp {
  constructor (public returnTypeId: ImiId, public functionTypeId: ImiId, public functionControl: number) {
    super()
  }

  emit (stack: any[], globals: any[]) {
    this.execute(stack, globals)
  }

  execute (stack: any[], globals: any[]) {
    let returnType = globals[this.returnTypeId]
    let functionType = globals[this.functionTypeId]
    stack.push({
      returnType,
      functionType,
      functionControl: this.functionControl
    })
    return []
  }
}

export class ImiGetIndex extends ImiOp {
  execute (stack: any[], globals: any[]) {
    let index = stack.pop()
    let pointer = stack.pop() as Variable
    let type = pointer.type
    if (type instanceof TypeStruct) {
      let offset = 0
      for (let i = 0; i < index; i++) {
        offset += type.members[i].getSize()
      }
      stack.push({
        offset: offset,
        type: type.members[index]
      })
      return []
    }
    if (type instanceof TypeArray || type instanceof TypeVector) {
      stack.push({
        offset: pointer.offset + index * type.getSize(),
        type: type.type
      })
      return []
    }
    return dontKnow()
  }

}

export class ImiSetIndex extends ImiOp {
  execute (stack: any[]) {
    let value = stack.pop()
    let index = stack.pop()
    let object = stack.pop()
    object.values[index] = value
    stack.push(object)
    return []
  }
}

export class ImiSwap extends ImiOp {}

export class ImiPointerWrite extends ImiOp {

  execute (stack: any[]) {
    let value = stack.pop()
    let pointer = stack.pop() as Variable
    let type = pointer.type
    stack.push(pointer)
    if (typeof value === 'number' && type instanceof TypeInt && type.width === 32) {
      return [
        {
          code: I32_CONST,
          arg: toUint32(value)
        },
        {
          code: I32_STORE,
          arg: pointer
        }
      ]
    }
    dontKnow()
    return []
  }
}

export class ImiLoad extends ImiOp {
  execute (stack: any[], globals: any[]) {
    let pointer = stack.pop()
    let type = stack.pop()
    stack.push(pointer)
    return [

    ]
  }
}

export class ImiStore extends ImiOp {
  execute (stack: any[], globals: any[]) {
    let object = stack.pop()
    let pointer = stack.pop()
    stack.push(pointer)
    return [
      {
        code: I32_LOAD,
        arg: object
      },
      {
        code: I32_STORE,
        arg: pointer
      }
    ]
  }
}

export class ImiReturn extends ImiOp {
  execute (stack: any[], globals: any[]) {
    return [{
      code: RETURN
    }]
  }
}

export class ImiFunctionEnd extends ImiOp {
  execute (stack: any[], globals: any[]) {
    return [{
      code: END
    }]
  }
}

export class ImiNop extends ImiOp {
  execute (stack: any[], globals: any[]) {
    return []
  }
}

const BLOCK = 0x02
const END = 0x0B
const NOTYPE = 0x40
const INT32 = 0x7f
const LOCAL_GET = 0x20
const LOCAL_SET = 0x21
const LOCAL_TEE = 0x22
const RETURN = 0x0F
const I32_MUL = 0x6C
const I32_CONST = 0x41
const I32_LOAD = 0x28
const I32_STORE = 0x36

function toUint32 (value: number): number[] {
  if (value > 127) {
    dontKnow()
  }
  return [value]
}

interface Instruction {
  code: number,
  arg?: number[] | Variable | number
}

interface Variable {
  descriptorSet?: number,
  binding?: number,
  storageClass: number,
  offset: number,
  type: Type
}

class MemoryAllocator {
  private offset = 0
  private functions: number[] = []
  private currentFunction = 0

  constructor (private module: CompiledModule, private inputs: VertexInputs) {

  }

  setFunction (id: number) {
    this.currentFunction = id
  }

  allocate (storageClass: number, type: Type, resultId: ImiId): Variable {
    if (storageClass === 12) {
      let descriptorSet: DescriptorSet = this.module.decorations.getSingleDecoration(resultId, DescriptorSet)
      let binding: Binding = this.module.decorations.getSingleDecoration(resultId, Binding)
      return {
        descriptorSet: descriptorSet.value,
        binding: binding.value,
        offset: 0,
        storageClass,
        type
      }
    }
    if (storageClass === 0 || storageClass === 1 || storageClass === 3) {
      let offset = this.offset
      this.offset += type.getSize()
      return {
        offset: offset,
        storageClass,
        type
      }
    }
    if (storageClass === 7) {
      let offset = this.functions[this.currentFunction]
      this.functions[this.currentFunction] += type.getSize()
      return {
        offset,
        storageClass,
        type
      }
    }
    return dontKnow()
  }

}

export function imiToWasm (module: CompiledModule, entryPoint: string, inputs: VertexInputs): WebAssembly.Module {
  function createSection (id: number, content: number[]): number[] {
    return [id].concat(toUint32(content.length)).concat(content)
  }
  function createVector (...content: number[][]): number[] {
    return toUint32(content.length).concat(content.reduce((a, u) => a.concat(u), []))
  }
  function createFunctionType (parameterTypes: number[], resultTypes: number[]): number[] {
    return [0x60].concat(createVector(...parameterTypes.map(x => [x]))).concat(createVector(...resultTypes.map(x => [x])))
  }
  function createFunction (locals: number[], instructions: number[]): number[] {
    let expr = instructions.concat([0x0B])
    let func = createVector(...locals.map(x => [1].concat([x]))).concat(expr)
    return toUint32(func.length).concat(func)
  }
  function createString (str: string): number[] {
    return createVector(...str.split('').map(c => toUint32(c.charCodeAt(0))))
  }

  let globals: any[] = []
  let stack: any[] = []
  let entryPoints: ImiEntryPoint[] = []
  let allocator = new MemoryAllocator(module, inputs)
  let instructionsStream: Instruction[] = []
  for (let i = 0; i < module.ops.length; i++) {
    let op = module.ops[i]
    let instructions: Instruction[] = op.execute(stack, globals, entryPoints, allocator)
    instructionsStream.push(...instructions)
  }
  let swapLocal = 0
  let bytes = instructionsStream.map(instruction => {
        if (instruction.code === I32_CONST) {
            return [instruction.code].concat(instruction.arg as number[])
        }
        if (instruction.code === I32_STORE) {
            let offset = (instruction.arg as Variable).offset
            return [LOCAL_SET].concat(toUint32(swapLocal))
                .concat([I32_CONST]).concat(toUint32(offset))
                .concat([LOCAL_GET]).concat(toUint32(swapLocal))
                .concat([instruction.code]).concat(toUint32(1)).concat(toUint32(0))
        }
        if (instruction.code === I32_LOAD) {
          let offset = (instruction.arg as Variable).offset
            return [I32_CONST].concat(toUint32(offset))
                .concat([instruction.code]).concat(toUint32(1)).concat(toUint32(0))
        }
        if (instruction.code === BLOCK) {
          return [BLOCK, instruction.arg as number]
        }
        if (instruction.code === RETURN) {
          return [RETURN]
        }
        if (instruction.code === END) {
          return [END]
        }
        dontKnow()
        return []
    }).reduce((a, v) => a.concat(v), [])
  let code: number[] = [0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00]
        .concat(createSection(1, createVector(createFunctionType([], []))))
        .concat(createSection(2, createVector(createString('inputs').concat(createString('memory')).concat([2, 0, 10]))))
        .concat(createSection(3, createVector([0])))
        .concat(createSection(7, createVector(createString('main').concat([0, 0]))))
        .concat(createSection(10, createVector(createFunction([INT32], bytes))))
  return WebAssembly.compile(new Uint8Array(code))
}
