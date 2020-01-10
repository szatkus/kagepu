import dontKnow from './dontKnow'

export interface KTexture extends GPUTexture {
  _getPixelSize (): number,
  _putPixel (pixel: number, x: number, y: number, z: number, arrayLevel: number, mipLevel: number): void
  _getPixel (x: number, y: number, z: number, arrayLevel: number, mipLevel: number): number
  _getArrayLayerCount (): number
  _getMipmapLevelCount (): number
  _getHeight (): number
  _getWidth (): number
  _getDepth (): number
  _getBuffer (arrayLevel: number, mipLevel: number): ArrayBuffer
  _flush (): void
}

interface MipMap {
  buffer: Uint32Array,
  width: number,
  height: number,
  depth: number
}

export function extent3DToDict (extent: GPUExtent3D): GPUExtent3DDict {
  if (extent instanceof Array) {
    return {
      width: extent[0],
      height: extent[1],
      depth: extent[2]
    }
  } else {
    return extent
  }
}

export function origin3DToDict (origin: GPUOrigin3D): GPUOrigin3DDict {
  if (origin instanceof Array) {
    return {
      x: origin[0],
      y: origin[1],
      z: origin[2]
    }
  } else {
    return origin
  }
}

export class KBufferTexture implements KTexture {
  _descriptor: GPUTextureDescriptor
  _buffers: Array<Array<MipMap>> = []
  _mipLevelCount: number
  _size: GPUExtent3DDict
  label = 'texture'

  constructor (descriptor: GPUTextureDescriptor) {
    this._descriptor = {...{
      arrayLayerCount: 1,
      sampleCount: 1,
      dimension: '2d'
    }, ...descriptor}
    this._mipLevelCount = descriptor.mipLevelCount || 1
    if (
      this._descriptor.dimension! !== '2d'
      ) {
      dontKnow()
    }
    this._size = extent3DToDict(descriptor.size)
    // TODO: implement MSAA
    // TODO: ...and mipmapping
    for (let i = 0; i < this._descriptor.arrayLayerCount!; i++) {
      let buffer: Array<MipMap> = []
      this._buffers.push(buffer)
      let width = this._size.width
      let height = this._size.height
      let depth = this._size.depth
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

  _getHeight (): number {
    return this._size.height
  }
  _getWidth (): number {
    return this._size.width
  }

  _getDepth (): number {
    return this._size.depth
  }

  createView (descriptor: GPUTextureViewDescriptor = {}): GPUTextureView {
    return new KTextureView(this, descriptor)
  }

  _getArrayLayerCount (): number {
    return this._buffers.length
  }
  _getMipmapLevelCount (): number {
    return this._mipLevelCount
  }

  _getPixelSize (): number {
    const todo = [
        // 8-bit formats
      'r8unorm',
      'r8snorm',
      'r8uint',
      'r8sint',

        // 16-bit formats
      'r16uint',
      'r16sint',
      'r16float',
      'rg8unorm',
      'rg8snorm',
      'rg8uint',
      'rg8sint',

        // 32-bit formats
      'r32uint',
      'r32sint',
      'r32float',
      'rg16uint',
      'rg16sint',
      'rg16float',
      'rgba8unorm',
      'rgba8unorm-srgb',
      'rgba8snorm',
      'rgba8uint',
      'rgba8sint',
      'bgra8unorm',
      'bgra8unorm-srgb',
        // Packed 32-bit formats
      'rgb10a2unorm',
      'rg11b10float',

        // 64-bit formats
      'rg32uint',
      'rg32sint',
      'rg32float',
      'rgba16uint',
      'rgba16sint',
      'rgba16float',

        // 128-bit formats
      'rgba32uint',
      'rgba32sint',
      'rgba32float',

        // Depth and stencil formats
      'depth32float',
      'depth24plus',
      'depth24plus-stencil8'
    ]
    if (this._descriptor.format === 'rgba8unorm' || this._descriptor.format === 'rgba8uint') {
      return 32
    }
    if (this._descriptor.format === 'r8unorm') {
      return 8
    }
    dontKnow()
    return 0
  }

  _putPixel (pixel: number, x: number, y: number, z: number, arrayLevel: number = 0, mipLevel: number = 0) {
    let mipmap = this._buffers[arrayLevel][mipLevel]
    mipmap.buffer[z * mipmap.height * mipmap.width + y * mipmap.width + x] = pixel
  }

  _getPixel (x: number, y: number, z: number, arrayLevel: number, mipLevel: number): number {
    let mipmap = this._buffers[arrayLevel][mipLevel]
    return mipmap.buffer[z * mipmap.height * mipmap.width + y * mipmap.width + x]
  }

  _getBuffer (arrayLayer: number, mipmap: number): ArrayBuffer {
    return this._buffers[arrayLayer][mipmap].buffer.buffer
  }

  _flush (): void {}

  destroy () {}
}

export class KTextureView implements GPUTextureView {
  _baseMipLevel: number
  _baseArrayLayer: number
  label = 'texture-view'

  constructor (public _texture: KTexture, descriptor: GPUTextureViewDescriptor) {
    this._baseMipLevel = descriptor.baseMipLevel || 0
    this._baseArrayLayer = descriptor.baseArrayLayer || 0
  }

  _getBuffer (): ArrayBuffer {
    return this._texture._getBuffer(this._baseArrayLayer, this._baseMipLevel)
  }
}
