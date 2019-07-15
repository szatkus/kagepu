import GPUQueue from "./GPUQueue";
import { KCommandBuffer } from "./GPUCommandEncoder";
import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPURenderPassEncoder, KCommand, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBindGroup from "./GPUBindGroup";

export default class KQueue implements GPUQueue {
    _pipeline?: GPURenderPipeline
    _vertexBuffer: any
    _passDescriptor?: GPURenderPassDescriptor;
    _bindGroup?: GPUBindGroup;
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
    __command__setVertexBuffers(pipeline: GPURenderPipeline) {
        this._pipeline = pipeline
    }
    __command__setBindGroup(bindGroup: GPUBindGroup) {
        this._bindGroup = bindGroup
    }
    __command__draw(vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
        
    }
}
