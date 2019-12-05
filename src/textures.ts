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
  _putPixel(pixel: number, x: number, y: number, z: number): void
}

export class KTexture implements GPUTexture {
  _descriptor: GPUTextureDescriptor
  _buffers: Array<Uint32Array> = []

  constructor(descriptor: GPUTextureDescriptor) {
    this._descriptor = {...{
      arrayLayerCount: 1,
      mipLevelCount: 1,
      sampleCount: 1,
      dimension: '2d',
    }, ...descriptor}
    if (
      this._descriptor.dimension! != '2d'
      ) {
      dontKnow()
    }
    // TODO: implement MSAA
    // TODO: ...and mipmapping
    for (let i = 0; i < this._descriptor.arrayLayerCount!; i++) {
      this._buffers[i] = new Uint32Array(this._descriptor.size.width! * this._descriptor.size.height! * this._descriptor.size.depth!)
    }
     
  }

  createView(descriptor: GPUTextureViewDescriptor): GPUTextureView {
    return new GPUTextureView(this, descriptor)
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
    if (this._descriptor.format == 'rgba8unorm') {
      return 32
    }
    dontKnow()
    return 0
  }

  _putPixel(pixel: number, x: number, y: number, z: number, arrayLevel: number = 0) {
    this._buffers[arrayLevel][z * this._descriptor.size.height! * this._descriptor.size.width! + y * this._descriptor.size.width! + x] = pixel
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
    _descriptor: GPUTextureViewDescriptor

    constructor (public _texture: GPUTexture, descriptor: GPUTextureViewDescriptor) {
      this._descriptor = { ...{
        aspect: 'all',
        baseMipLevel: 0,
        mipLevelCount: 0,
        baseArrayLayer: 0,
        arrayLayerCount: 0
      }, ...descriptor }
      if (
        this._descriptor.baseMipLevel! != 0 || 
        this._descriptor.mipLevelCount! != 0 || 
        this._descriptor.baseArrayLayer! != 0 || 
        this._descriptor.arrayLayerCount! != 0 || 
        this._descriptor.aspect! != 'all'
        ) {
        dontKnow()
      }
    }
}
