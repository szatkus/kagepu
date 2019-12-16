import { GPUCommandBuffer } from "./GPUQueue";
import { GPURenderPassEncoder, GPURenderPassDescriptor } from "./GPURenderPassEncoder";
import GPUBuffer, { GPUBufferSize } from "./GPUBuffer";
import { GPUTexture } from "./textures";
import { GPUExtent3D, GPUComputePassDescriptor } from "./interfaces";
import dontKnow from "./dontKnow";
import { GPUComputePassEncoder } from "./GPUComputePassEncoder";

export class KCommandBuffer implements GPUCommandBuffer  {
    constructor(public _renderPasses: Array<GPURenderPassEncoder>, public _computePasses: Array<GPUComputePassEncoder>) {}
}

interface GPUBufferCopyView {
    buffer: GPUBuffer, 
    offset?: GPUBufferSize,
    rowPitch: number,
    imageHeight: number,
};

interface GPUOrigin3D {
    x?: number,
    y?: number,
    z?: number
}

interface GPUTextureCopyView {
    texture: GPUTexture,
    mipLevel?: number,
    arrayLayer?: number,
    origin?: GPUOrigin3D;
}



export default class GPUCommandEncoder {
    private _currentRenderPass?: GPURenderPassEncoder
    private _renderPasses: Array<GPURenderPassEncoder> = []
    private _currentComputePass?: GPUComputePassEncoder
    private _computePasses: Array<GPUComputePassEncoder> = []

    beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder {
        if (this._currentRenderPass) {
           this._renderPasses.push(this._currentRenderPass)
        }
        this._currentRenderPass = new GPURenderPassEncoder(descriptor)
        return this._currentRenderPass
    }

    beginComputePass(descriptor: GPUComputePassDescriptor = { label: '' }): GPUComputePassEncoder {
        if (this._currentComputePass) {
           this._computePasses.push(this._currentComputePass)
        }
        this._currentComputePass = new GPUComputePassEncoder(descriptor)
        return this._currentComputePass
    }

    finish(descriptor?: any): GPUCommandBuffer  {
        if (descriptor) {
            throw new Error('not supported yet')
        }
        if (this._currentRenderPass) {
            this._renderPasses.push(this._currentRenderPass)
        }
        if (this._currentComputePass) {
            this._computePasses.push(this._currentComputePass)
        }
        return new KCommandBuffer(this._renderPasses, this._computePasses)
    }

    copyBufferToBuffer(source: GPUBuffer, sourceOffset: GPUBufferSize, destination: GPUBuffer, destinationOffset: GPUBufferSize, size: GPUBufferSize) {
        let sourceView = new Uint8Array(source._mapWrite())
        let destinationView = new Uint8Array(destination._mapWrite())
        for (let i = 0; i < size; i++) {
            destinationView[destinationOffset + i] = sourceView[sourceOffset + i]
        }
    }

    copyBufferToTexture(source: GPUBufferCopyView, destination: GPUTextureCopyView, copySize: GPUExtent3D) {
        source = {
            ...{
                offset: 0
            },
            ...source
        }
        destination = {
            ...{
                mipLevel: 0,
                arrayLayer: 0,
                origin: { x: 0, y: 0, z: 0}
            },
            ...destination
        }
        if (
            source.offset! != 0 ||
            destination.origin!.x! != 0 ||
            destination.origin!.y! != 0 ||
            destination.origin!.z! != 0
            ) {
            dontKnow()
        }
        if (
            !copySize.width ||
            !copySize.height ||
            !copySize.depth ||
            copySize.depth != 1
            ) {
            dontKnow()
        }
        let view: Uint8Array | Uint32Array = new Uint8Array(source.buffer._data!)
        if (destination.texture._getPixelSize() == 32) {
            view = new Uint32Array(source.buffer._data!)
        }
        for (var x = 0; x < copySize.width!; x++) {
            for (var y = 0; y < copySize.height!; y++) {
                for (var z = 0; z < copySize.depth!; z++) {
                    let pixel = view[z * source.imageHeight * source.rowPitch + source.rowPitch * y + x]
                    destination.texture._putPixel(pixel, x, y, z, destination.arrayLayer!, destination.mipLevel!)
                }
            }
        }
    }
}
