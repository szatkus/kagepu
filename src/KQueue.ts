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

const OP_EXT_INST_IMPORT = 11
const OP_MEMORY_MODEL = 14
const OP_ENTRY_POINT = 15
const OP_CAPABILITY = 17

function executeVertexShader(vertexStage: GPUPipelineStageDescriptor, vertexInput: GPUVertexInputDescriptor, inputBuffer: ArrayBuffer) {
    function consumeString(): String {
        let start = pos
        let end = start
        while ((code[pos] & 0xFF) != 0) {
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
    let heap = []
    let entryPoints = new Map<string, any>()
    while (pos < code.length) {
        if (pos == 1) {
            let majorVersion = (code[pos] & 0xFF0000) >> 16
            let minorVersion = (code[pos] & 0xFF00) >> 8
            console.debug(`version ${majorVersion}.${minorVersion}`)
        }
        if (pos >= 5) {
            let resultId, name
            let opCode = code[pos] & 0xFF
            let wordCount = (code[pos] & 0xFF0000) >> 16
            let startPos = pos
            switch(opCode) {
                case OP_EXT_INST_IMPORT:
                    pos++
                    resultId = code[pos]
                    pos++
                    name = consumeString()
                    heap[resultId] = name
                break
                case OP_MEMORY_MODEL:
                    pos++
                    addressingModel = code[pos]
                    pos++
                    memoryModel = code[pos]
                break
                case OP_ENTRY_POINT:
                    pos++
                    let executionModel = code[pos]
                    pos++
                    resultId = code[pos]
                    pos++
                    name = consumeString()
                    let interfaces = []
                    while (pos + 1 < startPos + wordCount) {
                        interfaces.push(code[pos])
                        pos++
                    }
                    pos--
                    heap[resultId] = {
                        name, executionModel, interfaces
                    }
                break
                case OP_CAPABILITY:
                    pos++
                    if (code[pos] != CAPABILITY_SHADER) {
                        dontKnow()
                    }
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
