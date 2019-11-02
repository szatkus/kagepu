import GPUQueue from "./GPUQueue";
import { KCommandBuffer } from "./GPUCommandEncoder";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPURenderPassEncoder, KCommand, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBindGroup from "./GPUBindGroup";
import GPUBuffer from "./GPUBuffer";
import dontKnow from "./dontKnow";
import { GPUPipelineStageDescriptor } from "./interfaces";
import { Context2DTexture } from "./GPUCanvasContext";
import { executeShader } from "./spirv/execution";

export default class KQueue implements GPUQueue {
    _pipeline?: GPURenderPipeline
    _vertexBuffers: GPUBuffer[] = []
    _passDescriptor?: GPURenderPassDescriptor
    _bindGroups: GPUBindGroup[] = []
    submit(buffers: Array<KCommandBuffer>) {
        //console.profile()
        for (let commandBuffer of buffers) {
            this._processRenderPasses(commandBuffer._renderPasses)
        }
        //console.profileEnd()
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
        let verticiesData: any[] = []
        for (let i = 0; i < vertexCount; i++) {
            // according to the specification it's a required property, but in samples it's omitted
            if (pipeline._descriptor.vertexInput &&
                pipeline._descriptor.vertexInput.vertexBuffers &&
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
            inputBufferView[0] = i
            if (i > 255) dontKnow()
            verticiesData[i] = executeVertexShader(pipeline._descriptor.vertexStage, inputBuffer)
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
                        let pixelData = executeFragmentShader(pipeline._descriptor.fragmentStage, inputBuffer)
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
                
function executeVertexShader(vertexStage: GPUPipelineStageDescriptor, inputBuffer: ArrayBuffer) {
    let output = executeShader(vertexStage, inputBuffer)
    return {
        position: Array.from(output.slice(0, 4))
        // TODO: read te rest of output
    }
}

function executeFragmentShader(vertexStage: GPUPipelineStageDescriptor, inputBuffer: ArrayBuffer) {
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
