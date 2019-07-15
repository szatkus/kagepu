import { GPUCommandBuffer } from "./GPUQueue";
import { GPURenderPassEncoder, GPURenderPassDescriptor } from "./GPURenderPassEncoder";



export class KCommandBuffer implements GPUCommandBuffer  {
    constructor(private renderPasses: Array<GPURenderPassEncoder>) {

    }
}

export default class GPUCommandEncoder {
    private currentRenderPass?: GPURenderPassEncoder
    private renderPasses: Array<GPURenderPassEncoder> = []
    beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder {
        if (this.currentRenderPass) {
           this.renderPasses.push(this.currentRenderPass)
        }
        this.currentRenderPass = new GPURenderPassEncoder(descriptor)
        return this.currentRenderPass
    }
    finish(descriptor?: any): GPUCommandBuffer  {
        if (descriptor) {
            throw new Error('not supported yet')
        }
        if (this.currentRenderPass) {
            this.renderPasses.push(this.currentRenderPass)
         }
        return new KCommandBuffer(this.renderPasses)
    }
  }
