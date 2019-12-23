import { Type, TypeInt, TypePointer, TypeStruct } from "./types"
import { CompiledModule } from "./compilation"
import dontKnow from "../dontKnow"
import { Pointer } from "./memory"
import { VertexInputs } from "../KQueue"
import { DescriptorSet, Binding } from "./annotations"
import { GPUSampler } from "../samplers"
import { GPUBufferBinding } from "../bindGroups"

type ImiId = number

export class ImiOp {
    execute(stack: any[], globals: any[], entryPoints: ImiEntryPoint[], allocator: MemoryAllocator): Instruction[] {
        throw new Error("Method not implemented.")
    }
}

export class ImiString extends ImiOp {
    constructor(public value: string) {
        super()
    }

    emit(stack: any[]) {
        stack.push(this.value)
    }

    execute(stack: any[], globals: any[]) {
        stack.push(this.value)
        return []
    }
    
}

export class ImiNumber extends ImiOp {
    constructor(public value: number) {
        super()
    }

    emit(stack: any[]) {
        this.execute(stack)
    }

    execute(stack: any[]) {
        stack.push(this.value)
        return []
    }
}

export class ImiBoolean extends ImiOp {
    constructor(public value: boolean) {
        super()
    }

    emit(stack: any[]) {
        this.execute(stack)
    }

    execute(stack: any[]) {
        stack.push(this.value)
        return []
    }
}

export class ImiGet extends ImiOp {
    constructor(public id: ImiId) {
        super()
    }

    emit(stack: any[], globals: any[]) {
        stack.push(globals[this.id])
    }

    execute(stack: any[], globals: any[]) {
        stack.push(globals[this.id])
        return []
    }
}

export class ImiPut extends ImiOp {
    constructor(public resultId: ImiId) {
        super()
    }

    execute(stack: any[], globals: any[]) {
        let value = stack.pop()
        globals[this.resultId] = value
        return []
    }
}

export class ImiGroup extends ImiOp {
    constructor(public count: number) {
        super()
    }

    emit(stack: any[]) {
        this.execute(stack)
    }

    execute(stack: any[]) {
        let group = stack.slice(stack.length - this.count)
        stack.splice(stack.length - this.count)
        stack.push(group)
        return []
    }
}

export class ImiEntryPoint extends ImiOp {
    constructor(public executionModel: number, public entryPoint: ImiId, public name: string) {
        super()
    }

    emit() {
    }

    execute(stack: any[], globals: any[], entryPoints: ImiEntryPoint[]) {
        entryPoints.push(this)
        return []
    }
}

export class ImiType extends ImiOp {
    constructor(public type: NewableFunction) {
        super()
    }

    emit() {
    }

    execute(stack: any[]) {
        let args = stack.slice(stack.length - this.type.length)
        let type = new (<any>this.type)(...args)
        stack.splice(stack.length - this.type.length)
        stack.push(type)
        return []
    }
}

export class ImiPointerType extends ImiOp {

    emit(stack: any[]) {
        this.execute(stack)
    }

    execute(stack: any[]) {
        let type = stack.pop().type
        stack.push(type)
        return []
    }
}

class Memory {}

class GlobalMemory implements Memory {}

class BindedResource implements Memory {
    constructor(public descriptorSet: number, public bindingGroup: number) {

    }
}

interface Variable {
    memory: Memory,
    offset: number,
    type: Type
}

export class ImiCreateVariable extends ImiOp {
    constructor(public storageClass: number, public resultId: number) {
        super()
    }

    execute(stack: any[], globals: any[], _: ImiEntryPoint[], allocator: MemoryAllocator) {
        let type = <Type> stack.pop()
        stack.push(allocator.allocate(this.storageClass, type, this.resultId))
        return []
    }
}

export class ImiFunction extends ImiOp {
    constructor(public returnTypeId: ImiId, public functionTypeId: ImiId, public functionControl: number) {
        super()
    }

    emit(stack: any[], globals: any[]) {
        this.execute(stack, globals)
    }

    execute(stack: any[], globals: any[]) {
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
    execute(stack: any[], globals: any[]) {
        let index = stack.pop()
        let pointer = <Variable> stack.pop()
        let struct = <TypeStruct> pointer.type
        if (struct.members.length > 1) {
            dontKnow()
        }
        stack.push({
            memory: pointer.memory,
            offset: pointer.offset,
            type: struct.members[0]
        })
        return []
    }
    
}

export class ImiPointerWrite extends ImiOp {

    execute(stack: any[]) {
        let value = stack.pop()
        let pointer = <Variable> stack.pop()
        let type = <Type> pointer.type
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
    execute(stack: any[], globals: any[]) {
        let pointer = stack.pop()
        let type = stack.pop()
        stack.push(pointer)
        return [

        ]
    }
}

export class ImiStore extends ImiOp {
    execute(stack: any[], globals: any[]) {
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
    execute(stack: any[], globals: any[]) {
        return []
    }
}

export class ImiFunctionEnd extends ImiOp {
    execute(stack: any[], globals: any[]) {
        return []
    }
}

export class ImiNop extends ImiOp {
    execute(stack: any[], globals: any[]) {
        return []
    }
}

const INT32 = 0x7f
const LOCAL_GET = 0x20
const LOCAL_SET = 0x21
const LOCAL_TEE = 0x22
const RETURN = 0x0F
const I32_MUL = 0x6C
const I32_CONST = 0x41
const I32_LOAD = 0x28
const I32_STORE = 0x36

function toUint32(value: number): number[] {
    if (value > 127) {
        dontKnow()
    }
    return [value]
}

interface Instruction {
    code: number,
    arg?: number[] | Variable
}

class MemoryAllocator {
    constructor(private module: CompiledModule, private inputs: VertexInputs) {

    }
    allocate(storageClass: number, type: Type, resultId: ImiId): Variable {
        if (storageClass === 12) {
            let descriptorSet = <DescriptorSet> this.module.decorations.getSingleDecoration(resultId, DescriptorSet)
            let binding = <Binding> this.module.decorations.getSingleDecoration(resultId, Binding)
            return {
                memory: new BindedResource(descriptorSet.value, binding.value),
                offset: 0,
                type
            }
        }
        if (storageClass === 0) {
            let offset = this.offsets[storageClass]
            this.offsets[storageClass] += type.getSize()
            return {
                memory: new GlobalMemory,
                offset: offset,
                type
            }
        }
        dontKnow()
        return <Variable> {}
    }
    getUnifiedOffset(variable: Variable): number {
        if (variable.memory instanceof GlobalMemory) {
            return variable.offset
        }
        let offset = this.offsets[0]
        if (offset % 4 !== 0) {
            offset += 4 - offset % 4
        }
        if (variable.memory instanceof BindedResource) {
            this.inputs.bindGroups.forEach((value, set) => {
                value.descriptor.bindings.forEach(value => {
                    if (variable.memory instanceof BindedResource && set <= variable.memory.descriptorSet && value.binding < variable.memory.bindingGroup) {
                        if (value.resource instanceof GPUSampler) {
                            return
                        }
                        let bufferBinding = <GPUBufferBinding> value.resource
                        if (bufferBinding.size) {
                            offset += bufferBinding.size
                            return
                        }
                        dontKnow()
                    }
                })
            })
            return offset
        }
        return -1
    }
    offsets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

export function imiToWasm(module: CompiledModule, entryPoint: string, inputs: VertexInputs): WebAssembly.Module {
    function createSection(id: number, content: number[]): number[] {
        return [id].concat(toUint32(content.length)).concat(content)
    }
    function createVector(...content: number[][]): number[] {
        return toUint32(content.length).concat(content.reduce((a, u) => a.concat(u), []))
    }
    function createFunctionType(parameterTypes: number[], resultTypes: number[]): number[] {
        return [0x60].concat(createVector(...parameterTypes.map(x => [x]))).concat(createVector(...resultTypes.map(x => [x])))
    }
    function createFunction(locals: number[], instructions: number[]): number[] {
        let expr = instructions.concat([0x0B])
        let func = createVector(...locals.map(x => [1].concat([x]))).concat(expr)
        return toUint32(func.length).concat(func)
    }
    function createString(str: string): number[] {
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
            return [instruction.code].concat(<number[]> instruction.arg)
        }
        if (instruction.code === I32_STORE) {
            let offset = allocator.getUnifiedOffset(<Variable> instruction.arg)
            return [LOCAL_SET].concat(toUint32(swapLocal))
                .concat([I32_CONST]).concat(toUint32(offset))
                .concat([LOCAL_GET]).concat(toUint32(swapLocal))
                .concat([instruction.code]).concat(toUint32(1)).concat(toUint32(0))
        }
        if (instruction.code === I32_LOAD) {
            let offset = allocator.getUnifiedOffset(<Variable> instruction.arg)
            return [I32_CONST].concat(toUint32(offset))
                .concat([instruction.code]).concat(toUint32(1)).concat(toUint32(0))
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
