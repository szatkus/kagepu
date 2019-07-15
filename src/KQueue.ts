import GPUQueue from "./GPUQueue";
import { KCommandBuffer } from "./GPUCommandEncoder";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPURenderPassEncoder, KCommand, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBindGroup from "./GPUBindGroup";
import GPUBuffer from "./GPUBuffer";
import dontKnow from "./dontKnow";

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
        let vertexBuffer = this._vertexBuffers[0]._data
        // TODO: clear color
        let inputBuffer = new ArrayBuffer(32)
        let vertexBufferView = new Uint8Array(vertexBuffer)
        let inputBufferView = new Uint8Array(inputBuffer)
        if (this._pipeline!._descriptor.vertexInput.vertexBuffers.length != 1) {
            dontKnow()
        }
        let vertexBufferInput = this._pipeline!._descriptor.vertexInput.vertexBuffers[0]
        if (vertexBufferInput.stepMode != 'vertex') {
            dontKnow()
        }
        let offset = 0
        let vertexStage = this._pipeline!._descriptor.vertexStage
        for (let i = 0; i < vertexCount; i++) {
            for (let attribute of vertexBufferInput.attributeSet) {
                copyBytes(inputBufferView, attribute.offset, dataLength.get(attribute.format)!, vertexBufferView, offset + attribute.offset)
            }
            console.debug(vertexStage.entryPoint)
            console.debug(vertexStage.module)
            console.debug(new Float32Array(inputBuffer))
            // execute a shader
            offset += vertexBufferInput.stride
        }
    }
}

function copyBytes(output: Uint8Array, outputOffset: number, length: number, input: Uint8Array, inputOffset: number) {
    for (let i = 0; i < length; i++) {
        output[outputOffset + i] = input[inputOffset + i]
    }
}

const dataLength: Map<String, number> = new Map([['float4', 16]])
