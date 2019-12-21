import { GPUExtent3D } from './interfaces'
import dontKnow from './dontKnow'

export interface GPUTextureDescriptor {
  size: GPUExtent3D,
  arrayLayerCount?: number,
  mipLevelCount?: number,
  sampleCount?: number,
  dimension?: string,
  format: string,
  usage: number
}

export interface GPUTexture {
  createView(descriptor: GPUTextureViewDescriptor): GPUTextureView
  _getPixelSize(): number,
  _putPixel(pixel: number, x: number, y: number, z: number, arrayLevel: number, mipLevel: number): void
  _getPixel(x: number, y: number, z: number, arrayLevel: number, mipLevel: number): number
  _getBuffer(arrayLayer: number, mipmap: number): ArrayBuffer
  _getArrayLayerCount(): number
  _getMipmapLevelCount(): number
}

interface MipMap {
  buffer: Uint32Array,
  width: number,
  height: number,
  depth: number
}

export class KTexture implements GPUTexture {
  _descriptor: GPUTextureDescriptor
  _buffers: Array<Array<MipMap>> = []
  _mipLevelCount: number

  constructor(descriptor: GPUTextureDescriptor) {
    this._descriptor = {...{
      arrayLayerCount: 1,
      sampleCount: 1,
      dimension: '2d',
    }, ...descriptor}
    this._mipLevelCount = descriptor.mipLevelCount || 1
    if (
      this._descriptor.dimension! != '2d'
      ) {
      dontKnow()
    }
    // TODO: implement MSAA
    // TODO: ...and mipmapping
    for (let i = 0; i < this._descriptor.arrayLayerCount!; i++) {
      let buffer: Array<MipMap> = []
      this._buffers.push(buffer)
      let width = this._descriptor.size.width!
      let height = this._descriptor.size.height!
      let depth = this._descriptor.size.depth!
      for (let m = 0; m < this._mipLevelCount; m++) {
        buffer[m] = {
          buffer: new Uint32Array(width * height * depth),
          width,
          height,
          depth
        }
        width = Math.max(Math.floor(width / 2), 1)
        height = Math.max(Math.floor(height / 2), 1)
        depth = Math.max(Math.floor(depth / 2), 1)
      }
    }
     
  }

  createView(descriptor: GPUTextureViewDescriptor = {}): GPUTextureView {
    return new GPUTextureView(this, descriptor)
  }

  _getArrayLayerCount(): number {
    return this._buffers.length
  }
  _getMipmapLevelCount(): number {
    return this._mipLevelCount
  }

  _getPixelSize(): number {
    const todo = [
        // 8-bit formats
        "r8unorm",
        "r8snorm",
        "r8uint",
        "r8sint",
    
        // 16-bit formats
        "r16uint",
        "r16sint",
        "r16float",
        "rg8unorm",
        "rg8snorm",
        "rg8uint",
        "rg8sint",
    
        // 32-bit formats
        "r32uint",
        "r32sint",
        "r32float",
        "rg16uint",
        "rg16sint",
        "rg16float",
        "rgba8unorm",
        "rgba8unorm-srgb",
        "rgba8snorm",
        "rgba8uint",
        "rgba8sint",
        "bgra8unorm",
        "bgra8unorm-srgb",
        // Packed 32-bit formats
        "rgb10a2unorm",
        "rg11b10float",
    
        // 64-bit formats
        "rg32uint",
        "rg32sint",
        "rg32float",
        "rgba16uint",
        "rgba16sint",
        "rgba16float",
    
        // 128-bit formats
        "rgba32uint",
        "rgba32sint",
        "rgba32float",
    
        // Depth and stencil formats
        "depth32float",
        "depth24plus",
        "depth24plus-stencil8"
    ]
    if (this._descriptor.format === 'rgba8unorm' || this._descriptor.format === 'rgba8uint') {
      return 32
    }
    dontKnow()
    return 0
  }

  _putPixel(pixel: number, x: number, y: number, z: number, arrayLevel: number = 0, mipLevel: number = 0) {
    let mipmap = this._buffers[arrayLevel][mipLevel]
    mipmap.buffer[z * mipmap.height * mipmap.width + y * mipmap.width + x] = pixel
  }

  _getPixel(x: number, y: number, z: number, arrayLevel: number, mipLevel: number): number {
    let mipmap = this._buffers[arrayLevel][mipLevel]
    return mipmap.buffer[z * mipmap.height * mipmap.width + y * mipmap.width + x]
  }

  _getBuffer(arrayLayer: number, mipmap: number): ArrayBuffer {
    return this._buffers[arrayLayer][mipmap].buffer.buffer
  }

  destroy () {

  }
}

export interface GPUTextureViewDescriptor {
  format?: string,
  dimension?: string,
  aspect?: string,
  baseMipLevel?: number,
  mipLevelCount?: number,
  baseArrayLayer?: number,
  arrayLayerCount?: number
}

export class GPUTextureView {
    _baseMipLevel: number
    _baseArrayLayer: number

    constructor (public _texture: GPUTexture, descriptor: GPUTextureViewDescriptor) {
      this._baseMipLevel = descriptor.baseMipLevel || 0
      this._baseArrayLayer = descriptor.baseArrayLayer || 0
    }

    _getBuffer(): ArrayBuffer {
      return this._texture._getBuffer(this._baseArrayLayer, this._baseMipLevel)
    }
}
