import { GPUCommandBuffer } from "./GPUQueue";
import { GPURenderPassEncoder, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBuffer from "./GPUBuffer";

export class KCommandBuffer implements GPUCommandBuffer  {
    constructor(public _renderPasses: Array<GPURenderPassEncoder>) {}
}

type GPUBufferSize = number;

export default class GPUCommandEncoder {
    private _currentRenderPass?: GPURenderPassEncoder
    private _renderPasses: Array<GPURenderPassEncoder> = []
    beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder {
        if (this._currentRenderPass) {
           this._renderPasses.push(this._currentRenderPass)
        }
        this._currentRenderPass = new GPURenderPassEncoder(descriptor)
        return this._currentRenderPass
    }
    finish(descriptor?: any): GPUCommandBuffer  {
        if (descriptor) {
            throw new Error('not supported yet')
        }
        if (this._currentRenderPass) {
            this._renderPasses.push(this._currentRenderPass)
         }
        return new KCommandBuffer(this._renderPasses)
    }
    copyBufferToBuffer(source: GPUBuffer, sourceOffset: GPUBufferSize, destination: GPUBuffer, destinationOffset: GPUBufferSize, size: GPUBufferSize) {
        let sourceView = new Uint8Array(source._data)
        let destinationView = new Uint8Array(destination._data)
        for (let i = 0; i < size; i++) {
            destinationView[destinationOffset + i] = sourceView[sourceOffset + i]
        }
    }
  }
