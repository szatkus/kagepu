import GPUQueue from "./GPUQueue";
import { KCommandBuffer } from "./GPUCommandEncoder";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPURenderPassEncoder, KCommand, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBindGroup from "./GPUBindGroup";
import GPUBuffer from "./GPUBuffer";
import dontKnow from "./dontKnow";
import { GPUPipelineStageDescriptor, GPUInputStepMode, GPUIndexFormat } from "./interfaces";
import { Context2DTexture } from "./GPUCanvasContext";
import { executeShader } from "./spirv/execution";
import { GPUFenceDescriptor, GPUFence } from "./GPUFence";

export interface VertexInputs {
    buffer: ArrayBuffer,
    locations: Array<{
        start: number,
        length: number
    }>
}

export default class KQueue implements GPUQueue {
    _pipeline?: GPURenderPipeline | GPUComputePipeline
    _indexBuffer = new ArrayBuffer(64)
    _vertexBuffers: ArrayBuffer[] = []
    _passDescriptor?: GPURenderPassDescriptor
    _computePassDescriptor?: GPUComputePassDescriptor
    _bindGroups: GPUBindGroup[] = []
    createFence(descriptor: GPUFenceDescriptor = { }): GPUFence {
        return new GPUFence(descriptor)
    }
    signal(fence: GPUFence, signalValue: number) {
        fence._value = signalValue
    }
    submit(buffers: Array<KCommandBuffer>) {
        for (let commandBuffer of buffers) {
            await this._processRenderPasses(commandBuffer._renderPasses)
        }
    }
    async _processRenderPasses(renderPasses: GPURenderPassEncoder[]) {
        for (let pass of renderPasses) {
            this._passDescriptor = pass._descriptor
            await this._runRenderPass(pass)
        }
    }
    async _runRenderPass(pass: GPURenderPassEncoder) {
        return new Promise((resolve, reject) => {
            // we don't want to hung a browser
            let commands = pass._commands
            let i = 0
            if (commands.length === 0) {
                return resolve()
            }
            let run = () => {
                try {
                    let command = commands[i]
                    this._executeCommand(command)
                    i++
                    if (i < commands.length) {
                        setTimeout(run, 1)
                    } else {
                        resolve()
                    }
                } catch (e) {
                    reject(e)
                }
            }
            setTimeout(run, 1)
        })
    }
    _executeCommand(command: KCommand) {
        let methodName = '__command__' + command.name
        if (!(methodName in this)) {
            console.error('Missing command ' + command.name)
        }
        (this as any)[methodName].apply(this, command.args)
    }
    __command__setPipeline(pipeline: GPURenderPipeline) {
        this._pipeline = pipeline
    }
    __command__setIndexBuffer(buffer: GPUBuffer, offset: number) {
        this._indexBuffer = buffer._data!.slice(offset)
    }
    __command__setVertexBuffer(slot: number, buffer: GPUBuffer, offset: number) {
        this._vertexBuffers[slot] = buffer._data!.slice(offset)
    }
    __command__setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
        this._bindGroups[index] = bindGroup
    }
    __command__draw(vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
        let pipeline = this._pipeline ? this._pipeline : dontKnow()
        // TODO: clear color
        
        let offsets: number[] = []
        let vertexStage = this._pipeline!._descriptor.vertexStage
        let verticiesData: any[] = []
        for (let i = 0; i < vertexCount; i++) {
            let inputBuffer = new ArrayBuffer(32)
            let inputBufferView = new Uint8Array(inputBuffer)
            // according to the specification it's a required property, but in samples it's omitted
            /*if (pipeline._descriptor.vertexInput &&
                pipeline._descriptor.vertexInput.vertexBuffers &&
                pipeline._descriptor.vertexInput.vertexBuffers.length != this._vertexBuffers.length) {
                dontKnow()
            }
            for (let j = 0; j < this._vertexBuffers.length; j++) {
                let offset = offsets[j] || 0
                let vertexBufferView = new Uint8Array(this._vertexBuffers[j])
                let vertexBufferInput = this._pipeline!._descriptor.vertexInput.vertexBuffers[0]
                if (vertexBufferInput.stepMode != 'vertex') {
                    dontKnow()
                }
                for (let attribute of vertexBufferInput.attributeSet) {
                    copyBytes(inputBufferView, attribute.offset, dataLength.get(attribute.format)!, vertexBufferView, offset + attribute.offset)
                }
                offsets[j] = offset + vertexBufferInput.stride
            }*/
            console.debug(vertexStage.entryPoint)
            console.debug(vertexStage.module)
            console.debug(new Float32Array(inputBuffer))
            inputBufferView[0] = i
            if (i > 255) dontKnow()
            verticiesData[i] = executeVertexShader(pipeline._descriptor.vertexStage, {buffer: inputBuffer, locations:[]})
        }
        let output = <Context2DTexture> this._passDescriptor!.colorAttachments[0].attachment._texture
        if (this._pipeline!._descriptor.primitiveTopology != 'triangle-list' || vertexCount % 3 !== 0 || !(output instanceof Context2DTexture) ) dontKnow()
        let imageData = output._context.getImageData(0, 0, output._context.canvas.width, output._context.canvas.height)
        for (let i = 0; i < vertexCount / 3; i++) {
            for (let y = 0; y < imageData.height; y++) {
                for (let x = 0; x < imageData.width; x++) {
                    
                    let normalizedX = (x / imageData.width) * 2 - 1
                    let normalizedY = ((imageData.height - y) / imageData.height) * 2 - 1
                    const dir1 = checkDirection(normalizedX, normalizedY, verticiesData[0].position[0], verticiesData[0].position[1], verticiesData[1].position[0], verticiesData[1].position[1])
                    const dir2 = checkDirection(normalizedX, normalizedY, verticiesData[2].position[0], verticiesData[2].position[1], verticiesData[1].position[0], verticiesData[1].position[1])
                    const dir3 = checkDirection(normalizedX, normalizedY, verticiesData[0].position[0], verticiesData[0].position[1], verticiesData[2].position[0], verticiesData[2].position[1])
                    if (dir1 == -1 && dir2 == 1 && dir3 == -1) {
                        let inputBuffer = new ArrayBuffer(32)
                        let pixelData = executeFragmentShader(pipeline._descriptor.fragmentStage, {buffer: inputBuffer, locations:[]})
                        imageData.data[(y * imageData.height + x) * 4] = pixelData.color[0] * 255
                        imageData.data[(y * imageData.height + x) * 4 + 1] = pixelData.color[1] * 255
                        imageData.data[(y * imageData.height + x) * 4 + 2] = pixelData.color[2] * 255
                        imageData.data[(y * imageData.height + x) * 4 + 3] = pixelData.color[3] * 255
                    }
                }
            }
        }
        output._context.putImageData(imageData, 0, 0)
    }
    __command__drawIndexed(indexCount: number, instanceCount: number, firstIndex: number, baseVertex: number, firstInstance: number) {
        let pipeline = this._pipeline ? this._pipeline : dontKnow()
        
        let offsets: number[] = []
        let vertexStage = this._pipeline!._descriptor.vertexStage
        let vertexState = this._pipeline!._descriptor.vertexState
        let verticiesData: any[] = []
        for (let i = 0; i < indexCount; i++) {
            let inputBuffer = new ArrayBuffer(64)
            let inputBufferView = new Uint8Array(inputBuffer)
            let lastPosition = 0
            let inputs: VertexInputs = {
                buffer: inputBuffer,
                locations: []
            }
            for (let j = 0; j < vertexState.vertexBuffers.length; j++) {
                let descriptor = vertexState.vertexBuffers[j]
                let indexBuffer = new Uint16Array(this._indexBuffer)
                let vertexBuffer = new Uint8Array(this._vertexBuffers[j])
                if (descriptor.stepMode !== GPUInputStepMode.vertex || vertexState.indexFormat !== GPUIndexFormat.uint16 || descriptor.attributes.length > 1  || descriptor.attributes[0].offset !== 0) {
                    dontKnow()
                }
                var index = indexBuffer[i]
                for (let k = 0; k < descriptor.arrayStride; k++) {
                    inputBufferView[lastPosition] = vertexBuffer[index * descriptor.arrayStride + k]
                    lastPosition++
                }
                inputs.locations[j] = {
                    start: lastPosition - descriptor.arrayStride,
                    length: descriptor.arrayStride
                }
            }
            verticiesData[i] = executeVertexShader(pipeline._descriptor.vertexStage, inputs)
            debugger
        }
    }
}

function checkDirection(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
    let yy = 0
    if (y2 == y3) {
        yy = y2
    } else {
        yy = y2 + ((x1 - x2) / (x3 - x2)) * (y3 - y2)
    }
    if (y1 < yy) {
        return -1
    }
    if (y1 > yy) {
        return 1
    }
    return 0
}
                
function executeVertexShader(vertexStage: GPUPipelineStageDescriptor, inputBuffer: VertexInputs) {
    let output = executeShader(vertexStage, inputBuffer)
    return {
        position: Array.from(output.slice(0, 4))
        // TODO: read te rest of output
    }
}

function executeFragmentShader(vertexStage: GPUPipelineStageDescriptor, inputBuffer: VertexInputs) {
    let output = executeShader(vertexStage, inputBuffer)
    return {     
        color: Array.from(output.slice(0, 4))
    }
}

function copyBytes(output: Uint8Array, outputOffset: number, length: number, input: Uint8Array, inputOffset: number) {
    for (let i = 0; i < length; i++) {
        output[outputOffset + i] = input[inputOffset + i]
    }
}

const dataLength: Map<String, number> = new Map([['float4', 16]])
