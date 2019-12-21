import { GPURenderPipeline } from "./GPURenderPipeline";
import { GPUBuffer } from "./buffers";
import { GPUBindGroup } from "./bindGroups";
import dontKnow from "./dontKnow";
import { GPUObjectDescriptorBase } from "./interfaces";
import { GPUTextureView } from "./textures";
import { GPUColor } from "./colors";

enum GPULoadOp {
    "clear",
    "load"
}

enum GPUStoreOp {
    "store"
}

interface GPURenderPassColorAttachmentDescriptor {
    attachment: GPUTextureView,
    resolveTarget?: GPUTextureView,

    storeOp: GPUStoreOp,
    loadValue: GPULoadOp | GPUColor
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
    
    private _isFinished = false
    constructor(descriptor: GPURenderPassDescriptor, public _commands: Array<KCommand>) {
        this._checkState()
        this._commands.push({
            name: 'setDescriptor',
            args: [descriptor]
        })
    }
    setPipeline(pipeline: GPURenderPipeline) {
        this._checkState()
        this._commands.push({
            name: 'setPipeline',
            args: [pipeline]
        })
    }
    setIndexBuffer(buffer: GPUBuffer, offset: number = 0) {
        this._checkState()
        this._commands.push({
            name: 'setIndexBuffer',
            args: [buffer, offset]
        })
    }
    setVertexBuffer(slot: number, buffer: GPUBuffer, offset: number) {
        this._checkState()
        this._commands.push({
            name: 'setVertexBuffer',
            args: [slot, buffer, offset]
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
    drawIndexed(indexCount: number, instanceCount: number, firstIndex: number, baseVertex: number, firstInstance: number) {
        this._checkState()
        this._commands.push({
            name: 'drawIndexed',
            args: [indexCount, instanceCount, firstIndex, baseVertex, firstInstance]
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
            throw new Error('Pass is finished.')
        }
    }
}
