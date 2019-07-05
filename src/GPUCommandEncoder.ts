import { GPUObjectDescriptorBase } from "./interfaces";
import GPUTextureView from "./GPUTextureView";
import { GPURenderPipeline } from "./GPURenderPipeline";
import GPUBuffer from "./GPUBuffer";
import GPUBindGroup from "./GPUBindGroup";
import { GPUCommandBuffer } from "./GPUQueue";

enum GPULoadOp {
    "clear",
    "load"
}

enum GPUStoreOp {
    "store"
}

interface GPUColorDict {
    r: number,
    g: number,
    b: number,
    a: number
}

type GPUColor = Array<number> | GPUColorDict

interface GPURenderPassColorAttachmentDescriptor {
    attachment: GPUTextureView,
    resolveTarget?: GPUTextureView,

    loadOp: GPULoadOp,
    storeOp: GPUStoreOp,
    clearColor?: GPUColor  // defaults to {r: 0.0, g: 0.0, b: 0.0, a: 1.0}
};

interface GPURenderPassDepthStencilAttachmentDescriptor {
    attachment: GPUTextureView,

    depthLoadOp: GPULoadOp,
    depthStoreOp: GPUStoreOp,
    clearDepth: number,

    stencilLoadOp: GPULoadOp,
    stencilStoreOp: GPUStoreOp,
    clearStencil?: number
};

interface GPURenderPassDescriptor extends GPUObjectDescriptorBase {
    colorAttachments: Array<GPURenderPassColorAttachmentDescriptor>,
    depthStencilAttachment?: GPURenderPassDepthStencilAttachmentDescriptor
}

interface KPUDrawStep {
    vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number
}

export class GPURenderPassEncoder {
    private descriptor: GPURenderPassDescriptor
    private pipeline?: GPURenderPipeline
    private vertexBuffers: Array<GPUBuffer> = []
    private draws: Array<KPUDrawStep> = []
    private isFinished = false
    constructor(descriptor: GPURenderPassDescriptor) {
        this.descriptor = descriptor
    }

    setPipeline(pipeline: GPURenderPipeline) {
        this.pipeline = pipeline
    }

    setVertexBuffers(startSlot: number, buffers: Array<GPUBuffer>, offset: number) {
        /*for (let i = 0; i < offset; i++) {
            this.vertexBuffers[startSlot + i] = buffers
        }*/
        // not sure what I should do here
    }

    draw(vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
        this.draws.push({
            vertexCount, instanceCount, firstVertex, firstInstance
        })
    }

    // GPUProgrammablePassEncoder
    setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
        if (dynamicOffsets) {
            throw new Error('not supported yet')
        }
    }

    endPass() {
        this.isFinished = true
    }
}

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
