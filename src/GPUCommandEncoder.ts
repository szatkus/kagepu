import { GPUCommandBuffer } from "./GPUQueue";
import { GPURenderPassEncoder, GPURenderPassDescriptor } from "./GPURenderPassEncoder";

export class KCommandBuffer implements GPUCommandBuffer  {
    constructor(public _renderPasses: Array<GPURenderPassEncoder>) {}
}

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
  }
