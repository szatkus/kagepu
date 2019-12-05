import { GPURenderPipeline } from "./GPURenderPipeline";
import GPUBuffer from "./GPUBuffer";
import GPUBindGroup from "./GPUBindGroup";
import dontKnow from "./dontKnow";
import { GPUObjectDescriptorBase } from "./interfaces";
import { GPUTextureView } from "./textures";

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

export interface GPURenderPassDescriptor extends GPUObjectDescriptorBase {
    colorAttachments: Array<GPURenderPassColorAttachmentDescriptor>,
    depthStencilAttachment?: GPURenderPassDepthStencilAttachmentDescriptor
}

export interface KPUDrawStep {
    vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number
}

export interface KCommand {
    name: String,
    args: Array<any>
}

export class GPURenderPassEncoder {
    
    _commands: Array<KCommand> = []
    private _isFinished = false
    constructor(public _descriptor: GPURenderPassDescriptor) {
        this._checkState()
    }
    setPipeline(pipeline: GPURenderPipeline) {
        this._checkState()
        this._commands.push({
            name: 'setPipeline',
            args: [pipeline]
        })
    }
    setVertexBuffers(startSlot: number, buffers: Array<GPUBuffer>, offsets: Array<number>) {
        this._checkState()
        if (startSlot != 0 || offsets.length != 1 || offsets[0] != 0) {
            dontKnow()
        }
        this._commands.push({
            name: 'setVertexBuffers',
            args: [startSlot, buffers, offsets]
        })
    }
    draw(vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number) {
        if (instanceCount != 1 || firstVertex != 0 || firstInstance != 0) {
            dontKnow()
        }
        this._checkState()
        this._commands.push({
            name: 'draw',
            args: [vertexCount, instanceCount, firstVertex, firstInstance]
        });
    }
    // GPUProgrammablePassEncoder
    setBindGroup(index: number, bindGroup: GPUBindGroup, dynamicOffsets?: Array<number>) {
        this._checkState()
        if (dynamicOffsets) {
            dontKnow();
        }
        this._commands.push({
            name: 'setBindGroup',
            args: [index, bindGroup, dynamicOffsets]
        });
    }
    endPass() {
        this._checkState()
        this._isFinished = true;
    }
    _checkState() {
        if (this._isFinished) {
            new Error('Pass is finished.')
        }
    }
}
