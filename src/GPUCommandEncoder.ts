import { GPUObjectDescriptorBase } from "./interfaces";
import GPUTextureView from "./GPUTextureView";
import { GPURenderPipeline } from "./GPURenderPipeline";
import GPUBuffer from "./GPUBuffer";
import GPUBindGroup from "./GPUBindGroup";

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

class GPURenderPassEncoder {
    private descriptor: GPURenderPassDescriptor
    private pipeline?: GPURenderPipeline
    private vertexBuffers: Array<GPUBuffer> = []
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

    }

    // GPUProgrammablePassEncoder
    setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
        if (dynamicOffsets) {
            throw new Error('not supported yet')
        }
    }

    endPass() {

    }
}

export default class GPUCommandEncoder {
    beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder {
        return new GPURenderPassEncoder(descriptor)
    }
    finish(descriptor?: any) {
        if (descriptor) {
            throw new Error('not supported yet')
        }
    }
  }
