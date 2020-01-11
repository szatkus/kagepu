import { KTexture, KTextureView } from './textures'

export class Context2DTexture implements KTexture {
  private _imageData?: ImageData
  public label = 'texture'

  constructor (public _context: CanvasRenderingContext2D, public _descriptor: GPUSwapChainDescriptor) {

  }

  destroy (): void {
    throw new Error('Method not implemented.')
  }

  _getHeight (): number {
    return this._context.canvas.height
  }

  _getWidth (): number {
    return this._context.canvas.width
  }

  _getDepth (): number {
    return 1
  }

  _isSampled (): boolean {
    return false
  }

  _isStorage (): boolean {
    return false
  }

  _getFormat (): GPUTextureFormat {
    return 'r8unorm'
  }

  createView (descriptor: GPUTextureViewDescriptor = {}): GPUTextureView {
    return new KTextureView(this, descriptor)
  }

  _getArrayLayerCount (): number {
    return 1
  }
  _getMipmapLevelCount (): number {
    return 1
  }

  _getPixelSize (): number {
    return 32
  }

  _putPixel (pixel: number, x: number, y: number, z: number): void {
    let imageData = new ImageData(1, 1)
    new Uint32Array(imageData.data.buffer)[0] = pixel
    this._context.putImageData(imageData, x, y)
  }

  _getPixel (x: number, y: number, z: number, arrayLevel: number, mipLevel: number): number {
    throw new Error('Method not implemented.')
  }

  _getBuffer (arrayLayer: number, mipmap: number): ArrayBuffer {
    let imageData = this._context.getImageData(0, 0, this._getWidth(), this._getHeight())
    this._imageData = imageData
    return imageData.data.buffer
  }

  _flush () {
    if (this._imageData) {
      this._context.putImageData(this._imageData, 0, 0)
    }
  }
}

class GPUSwapChain {
  constructor (private _descriptor: GPUSwapChainDescriptor, private _context: CanvasRenderingContext2D) {
  }

  getCurrentTexture (): GPUTexture {
    return new Context2DTexture(this._context, this._descriptor)
  }
}

export class GPUCanvasContext {
  private context: CanvasRenderingContext2D
  constructor (context: CanvasRenderingContext2D) {
    this.context = context
  }
  configureSwapChain (descriptor: GPUSwapChainDescriptor): GPUSwapChain {
    return new GPUSwapChain(descriptor, this.context)
  }
}
