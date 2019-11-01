import GPUQueue from "./GPUQueue";
import { KCommandBuffer } from "./GPUCommandEncoder";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPURenderPassEncoder, KCommand, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBindGroup from "./GPUBindGroup";
import GPUBuffer from "./GPUBuffer";
import dontKnow from "./dontKnow";
import { GPUVertexInputDescriptor, GPUPipelineStageDescriptor } from "./interfaces";

export default class KQueue implements GPUQueue {
    _pipeline?: GPURenderPipeline
    _vertexBuffers: GPUBuffer[] = []
    _passDescriptor?: GPURenderPassDescriptor
    _bindGroups: GPUBindGroup[] = []
    submit(buffers: Array<KCommandBuffer>) {
        console.debug(buffers)
        for (let commandBuffer of buffers) {
            this._processRenderPasses(commandBuffer._renderPasses)
        }
    }
    _processRenderPasses(renderPasses: GPURenderPassEncoder[]) {
        for (let pass of renderPasses) {
            this._passDescriptor = pass._descriptor
            for (let command of pass._commands) {
                this._executeCommand(command)
            }
        }
    }
    _executeCommand(command: KCommand) {
        (this as any)['__command__' + command.name].apply(this, command.args)
    }
    __command__setPipeline(pipeline: GPURenderPipeline) {
        this._pipeline = pipeline
    }
    __command__setVertexBuffers(startSlot: number, buffers: Array<GPUBuffer>, offsets: Array<number>) {
        this._vertexBuffers = buffers
    }
    __command__setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
        this._bindGroups[index] = bindGroup
    }
    __command__draw(vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
        let pipeline = this._pipeline ? this._pipeline : dontKnow()
        // TODO: clear color
        
        let offsets: number[] = []
        let vertexStage = this._pipeline!._descriptor.vertexStage
        for (let i = 0; i < vertexCount; i++) {
            // according to the specification it's a required property, but in samples it's omitted
            if (pipeline._descriptor.vertexInput.vertexBuffers &&
                pipeline._descriptor.vertexInput.vertexBuffers.length != this._vertexBuffers.length) {
                dontKnow()
            }
            let inputBuffer = new ArrayBuffer(32)
            let inputBufferView = new Uint8Array(inputBuffer)
            for (let j = 0; j < this._vertexBuffers.length; j++) {
                let offset = offsets[j] || 0
                let vertexBuffer = this._vertexBuffers[0]._data
                let vertexBufferView = new Uint8Array(vertexBuffer)
                let vertexBufferInput = this._pipeline!._descriptor.vertexInput.vertexBuffers[0]
                if (vertexBufferInput.stepMode != 'vertex') {
                    dontKnow()
                }
                for (let attribute of vertexBufferInput.attributeSet) {
                    copyBytes(inputBufferView, attribute.offset, dataLength.get(attribute.format)!, vertexBufferView, offset + attribute.offset)
                }
                offsets[j] = offset + vertexBufferInput.stride
            }
            console.debug(vertexStage.entryPoint)
            console.debug(vertexStage.module)
            console.debug(new Float32Array(inputBuffer))
            executeVertexShader(pipeline._descriptor.vertexStage, pipeline._descriptor.vertexInput, inputBuffer)
        }
    }
}

const CAPABILITY_SHADER = 1

const OP_SOURCE = 3
const OP_SOURCE_EXTENSION = 4
const OP_MEMBER_NAME = 6
const OP_EXT_INST_IMPORT = 11
const OP_MEMORY_MODEL = 14
const OP_TYPE_VOID = 19
const OP_TYPE_INT = 21
const OP_TYPE_FLOAT = 22
const OP_TYPE_VECTOR = 23
const OP_TYPE_FUNCTION = 33
const OP_CONSTANT = 43
const OP_DECORATE = 71
const OP_MEMBER_DECORATE = 72

class Type {
    getSize(): number {
        dontKnow()
        return 0
    }
}
class TypeVoid extends Type {}
class ArrayStride extends Type {
    constructor(public stride: Number) {
        super()
    }
}
class TypeFunction extends Type {
    constructor(public type: Type) {
        super()
    }
}
class TypeInt extends Type {
    constructor(public width: number, public signed: boolean) {
        super()
        if (width != 32 && width != 64) {
            dontKnow()
        }
    }

    getSize(): number {
        return this.width / 4
    }
}
class TypeVector extends Type {
    constructor(public type: Type, public count: number) {
        super()
    }

    getSize(): number {
        return this.type.getSize() * this.count
    }
}
class TypeFloat extends Type {
    constructor(public width: number) {
        super()
        if (width != 32 && width != 64) {
            dontKnow()
        }
        // TODO: what could go wrong if float is too precise?
    }

    getSize(): number {
        return this.width / 4
    }
}

class TypePointer extends Type {
    constructor(public storageClass: number, public type: Type) {
        super()
    }
}

class TypeArray extends Type {
    constructor( public type: Type, public count: number) {
        super()
    }

    getSize(): number {
        return this.type.getSize() * this.count
    }
}

class TypeStruct extends Type {
    constructor(public members: Type[]) {
        super()
    }

    getSize(): number {
        return this.members.reduce((a, t) => a + t.getSize(), 0)
    }
}






class Pointer {
    constructor(public address: number, public type: Type) {

    }
}

class Memory {
    memory = new ArrayBuffer(1024 * 1024 * 4) // our GPU has 4MB
    lastFree = 0 // and we never deallocate anything
    uint8View = new Uint8Array(this.memory)
    uint32View = new Uint32Array(this.memory)
    int32View = new Int32Array(this.memory)

    allocateMemory(size: number) {
        if (size < 1) dontKnow()
        // alignment
        if (this.lastFree % size != 0) {
            this.lastFree += this.lastFree % size
        }
        let pointer = this.lastFree
        this.lastFree += size
        return pointer
    }

    store(pointer: Pointer, value: number[]) {
        if (value.length != pointer.type.getSize()) dontKnow()
        for (let i = 0; i < value.length; i++) {
            this.uint8View[pointer.address + i] = value[i]
        }
    }

    createVariable(type: Type, value: number[]) {
        let address = this.allocateMemory(type.getSize())
        let pointer = new Pointer(address, type)
        this.store(pointer, value)
        return pointer
    }
}

const globalMemory = new Memory()

function executeVertexShader(vertexStage: GPUPipelineStageDescriptor, vertexInput: GPUVertexInputDescriptor, inputBuffer: ArrayBuffer) {
    function consumeString(): String {
        let start = pos
        let end = start
        while ((code[pos] & 0xFF) != 0 && pos < endPos - 1) {
            pos++
            end = pos
        }
        let stringBuffer = code.slice(start, end + 1).buffer
        let decoder = new TextDecoder('utf-8')
        let rawString = decoder.decode(stringBuffer)
        let i = rawString.length - 1
        while (rawString.codePointAt(i) == 0) {
            i--
        }
        return rawString.substring(0, i + 1)
    }
    if (!vertexStage.module._spirvCode) {
        dontKnow()
    }
    let addressingModel, memoryModel
    let code = vertexStage.module._spirvCode!
    let pos = 1
    let heap: any[] = []
    let members = []
    let names = []
    let opCode, wordCount, startPos, endPos: number
    let decorations: any[] = []
    let entryPoint
    let currentFunction
    while (pos < code.length) {
        if (pos == 1) {
            let majorVersion = (code[pos] & 0xFF0000) >> 16
            let minorVersion = (code[pos] & 0xFF00) >> 8
            console.debug(`version ${majorVersion}.${minorVersion}`)
        }
        if (pos >= 5) {
            let resultId, name, typeId, memberNumber, targetId, width, count, objectId, indexes
            let type: Type
            opCode = code[pos] & 0xFF
            wordCount = (code[pos] & 0xFF0000) >> 16
            startPos = pos
            endPos = startPos + wordCount
            switch(opCode) {
                // OpSource
                // OpSourceExtension
                case 3:
                case 4:
                    console.debug('OpSource')
                    pos += wordCount - 1
                break
                // OpName
                case 5:
                    pos++
                    targetId = code[pos]
                    pos++
                    names[targetId] = consumeString()
                    console.debug(`$${targetId} OpName  ` + names[targetId].toString())
                break
                // OpString
                case 7:
                    pos++
                    resultId = code[pos]
                    pos++
                    heap[resultId] = consumeString()
                    console.debug(`$${resultId} = OpString ` + heap[resultId].toString())
                break
                // OpEntryPoint
                case 15:
                    pos++
                    let executionModel = code[pos]
                    pos++
                    entryPoint = code[pos]
                    pos++
                    name = consumeString()
                    let interfaces = []
                    while (pos < startPos + wordCount) {
                        interfaces.push(code[pos])
                        pos++
                    }
                    pos--
                    if (vertexStage.entryPoint !== name) dontKnow()
                    console.debug(`OpEntryPoint ${executionModel} $${entryPoint} ${name} ${interfaces})`)
                break
                // OpCapability
                case 17:
                    pos++
                    if (code[pos] != CAPABILITY_SHADER) {
                        dontKnow()
                    }
                    console.debug(`OpCapability ${code[pos]}`)
                break
                case OP_MEMBER_NAME:
                    pos++
                    typeId = code[pos]
                    pos++
                    memberNumber = code[pos]
                    pos++
                    name = consumeString()
                    members[memberNumber] = {
                        name,
                        typeId
                    }
                    console.debug(`OP_MEMBER_NAME ${name} ${typeId}`)
                break
                case OP_TYPE_VOID:
                    pos++
                    resultId = code[pos]
                    heap[resultId] = new TypeVoid
                    console.debug(`$${resultId} = OP_TYPE_VOID`)
                break
                case OP_TYPE_INT:
                    pos++
                    resultId = code[pos]
                    pos++
                    width = code[pos]
                    pos++
                    let signed = code[pos] == 1
                    heap[resultId] = new TypeInt(width, signed)
                    console.debug(`$${resultId} = OP_TYPE_INT(${width}, ${signed})`)
                break
                case OP_TYPE_FLOAT:
                    pos++
                    resultId = code[pos]
                    pos++
                    width = code[pos]
                    heap[resultId] = new TypeFloat(width)
                    console.debug(`$${resultId} = OP_TYPE_FLOAT(${width})`)
                break
                case OP_TYPE_VECTOR:
                    pos++
                    resultId = code[pos]
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    count = code[pos]
                    heap[resultId] = new TypeVector(type, count)
                    console.debug(`$${resultId} = OP_TYPE_VECTOR(${type.constructor.name}, ${count})`)
                break
                // OP_TYPE_ARRAY
                case 28:
                    pos++
                    resultId = code[pos]
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    count = code[pos]
                    heap[resultId] = new TypeArray(type, count)
                    console.debug(`$${resultId} = OP_TYPE_ARRAY(${type.constructor.name} ${count})`)
                break
                // OP_TYPE_POINTER
                case 32:
                    pos++
                    resultId = code[pos]
                    pos++
                    let storageClass = code[pos]
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    heap[resultId] = new TypePointer(storageClass, type)
                    console.debug(`$${resultId} = OP_TYPE_POINTER(${storageClass} ${type.constructor.name})`)
                break
                // OP_TYPE_STRUCT
                case 30:
                    pos++
                    resultId = code[pos]
                    let types: Type[] = []
                    for (pos++; pos < endPos; pos++) {
                        typeId = code[pos]
                        types.push(heap[typeId])
                    }
                    pos--
                    heap[resultId] = new TypeStruct(types)
                    console.debug(`$${resultId} = OP_TYPE_STRUCT(${types})`)
                break
                // OpConstantComposite
                case 44:
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    let constituents = []
                    for (pos++; pos < endPos; pos++) {
                        typeId = code[pos]
                        constituents.push(heap[typeId])
                    }
                    pos--
                    heap[resultId] = {
                        constituents,
                        type
                    }
                    console.debug(`$${resultId} = OpConstantComposite(${type}, ${constituents})`)
                break
                // OpFunction
                case 54:
                    pos++
                    typeId = code[pos]
                    let returnType = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    pos++
                    let functionControl = code[pos]
                    pos++
                    typeId = code[pos]
                    let functionType = <Type> heap[typeId]
                    currentFunction = {
                        functionType,
                        returnType,
                        functionControl
                    }
                    heap[resultId] = currentFunction
                    if (entryPoint != resultId) dontKnow()
                    console.debug(`$${resultId} = OpFunction ${functionType.constructor.name} ${returnType.constructor.name} ${functionControl}`)
                break
                case OP_TYPE_FUNCTION:
                    if (wordCount > 3) dontKnow()
                    pos++
                    resultId = code[pos]
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    heap[resultId] = new TypeFunction(type)
                    console.debug(`$${resultId} = OP_TYPE_FUNCTION(${type.constructor.name})`)
                break
                case OP_CONSTANT:
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    pos++
                    if (wordCount > 4) dontKnow()
                    let value = code[pos]
                    heap[resultId] = globalMemory.createVariable(type, [value])
                    console.debug(`$${resultId} = OP_CONSTANT(${type.constructor.name}, ${value})`)
                break
                case OP_DECORATE:
                    pos++
                    targetId = code[pos]
                    pos++
                    let decoration
                    if (code[pos] == 2) {
                        decoration = 2
                    } else if (code[pos] == 11) {
                        pos++
                        decoration = {
                            builtin: code[pos]
                        }
                    } else if (code[pos] == 6) {
                        pos++
                        decoration = new ArrayStride(code[pos])
                    } else {
                        dontKnow()
                    }
                    decorations[targetId] = decorations[targetId] ? decorations[targetId].push(decoration) : [decoration]
                    console.debug(`decorate ${targetId} with ${code[pos]}`)
                break
                case OP_MEMBER_DECORATE:
                    pos++
                    typeId = code[pos]
                    pos++
                    memberNumber = code[pos]
                    pos++
                    if (code[pos] == 11) {
                        pos++
                        (members[memberNumber] as any).builtin = code[pos]
                    } else {
                        dontKnow()
                    }
                    console.debug(`OP_MEMBER_DECORATE ${memberNumber}`)
                break
                case OP_EXT_INST_IMPORT:
                    pos++
                    resultId = code[pos]
                    pos++
                    name = consumeString()
                    heap[resultId] = name
                    console.debug(`OP_EXT_INST_IMPORT ${name}`)
                break
                case OP_MEMORY_MODEL:
                    pos++
                    addressingModel = code[pos]
                    pos++
                    memoryModel = code[pos]
                    console.debug(`OP_MEMORY_MODEL ${addressingModel} ${memoryModel}`)
                break
                // OpVariable
                case 59:
                    if (wordCount > 4) dontKnow()
                    pos++
                    typeId = code[pos]
                    pos++
                    resultId = code[pos]
                    pos++
                    storageClass = code[pos]
                    let pointerType = <TypePointer> heap[typeId]
                    type = pointerType.type
                    let pointer = globalMemory.allocateMemory(type.getSize())
                    heap[resultId] = pointer
                    console.debug(`$${resultId} = OpVariable ${type.constructor.name} ${pointer} ${storageClass}`)
                break
                // OpLoad
                case 61:
                    if (wordCount > 4) dontKnow()
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    pos++
                    pointer = code[pos]
                    console.debug(`$${resultId} = OpLoad(${type.constructor.name}, ${pointer})`)
                break
                // OpStore
                case 62:
                    if (wordCount > 4) dontKnow()
                    pos++
                    pointer = code[pos]
                    pos++
                    objectId = code[pos]
                    
                    console.debug(`OpStore(${pointer}, ${objectId})`)
                break
                // OpAccessChain
                case 65:
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    pos++
                    let base = code[pos]
                    indexes = []
                    for (pos++; pos < endPos; pos++) {
                        typeId = code[pos]
                        indexes.push(heap[typeId])
                    }
                    pos--
                    
                    console.debug(`$${resultId} = OpAccessChain(${type}, ${base}, ${indexes})`)
                break
                // OpCompositeConstruct
                case 80:
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    pos++
                    constituents = []
                    for (pos++; pos < endPos; pos++) {
                        typeId = code[pos]
                        constituents.push(heap[typeId])
                    }
                    pos--
                    
                    console.debug(`$${resultId} = OpCompositeConstruct(${type}, ${constituents})`)
                break
                // OpReturn
                case 253:
                    pos++
                    console.debug('OpReturn')
                break;
                // OpCompositeExtract
                case 81:
                    pos++
                    typeId = code[pos]
                    type = <Type> heap[typeId]
                    pos++
                    resultId = code[pos]
                    pos++
                    let composite = code[pos]
                    indexes = []
                    for (pos++; pos < endPos; pos++) {
                        typeId = code[pos]
                        indexes.push(heap[typeId])
                    }
                    pos--
                    
                    console.debug(`$${resultId} = OpCompositeExtract(${type}, ${composite}, ${indexes})`)
                break
                // OpLabel
                case 248:
                    pos++
                    resultId = code[pos]
                    heap[resultId] = {currentFunction}
                    console.debug(`$${resultId} = OpLabel`)
                break
                default:
                    console.debug(code[pos])
                    console.debug(code[pos + 1])
                    console.debug(code[pos + 2])
                    console.debug(code[pos + 3])
                    throw new Error(`Unknown opcode ${code[pos] & 0xFF}`)
            }
        }
        pos++
    }
}

function copyBytes(output: Uint8Array, outputOffset: number, length: number, input: Uint8Array, inputOffset: number) {
    for (let i = 0; i < length; i++) {
        output[outputOffset + i] = input[inputOffset + i]
    }
}

const dataLength: Map<String, number> = new Map([['float4', 16]])
