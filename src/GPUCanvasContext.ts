import GPUDevice from "./GPUDevice";
import { GPUObjectDescriptorBase } from "./interfaces";
import { GPUTexture, GPUTextureView, GPUTextureViewDescriptor } from "./textures";
import dontKnow from "./dontKnow";

export interface GPUSwapChainDescriptor extends GPUObjectDescriptorBase {
    device: GPUDevice,
    format: GPUTextureFormat,
    usage?: number
  }  

  enum GPUTextureFormat {
    /* Normal 8 bit formats */
    "r8unorm",
    "r8unorm-srgb",
    "r8snorm",
    "r8uint",
    "r8sint",
    /* Normal 16 bit formats */
    "r16unorm",
    "r16snorm",
    "r16uint",
    "r16sint",
    "r16float",
    "rg8unorm",
    "rg8unorm-srgb",
    "rg8snorm",
    "rg8uint",
    "rg8sint",
    /* Packed 16 bit formats */
    "b5g6r5unorm",
    /* Normal 32 bit formats */
    "r32uint",
    "r32sint",
    "r32float",
    "rg16unorm",
    "rg16snorm",
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
    /* Packed 32 bit formats */
    "rgb10a2unorm",
    "rg11b10float",
    /* Normal 64 bit formats */
    "rg32uint",
    "rg32sint",
    "rg32float",
    "rgba16unorm",
    "rgba16snorm",
    "rgba16uint",
    "rgba16sint",
    "rgba16float",
    /* Normal 128 bit formats */
    "rgba32uint",
    "rgba32sint",
    "rgba32float",
    /* Depth and Stencil formats */
    "depth32float",
    // depth24plus has a precision of 1 ULP <= 1/(2**24).
    // (This is unlike the 24-bit unsigned normalized format family typically
    // found in native APIs, which has a precision of 1 ULP = 1/(2**24-1).)
    "depth24plus",
    "depth24plus-stencil8"
}

export class Context2DTexture implements GPUTexture {
    _imageData?: ImageData
    
    constructor(public _context: CanvasRenderingContext2D, public _descriptor: GPUSwapChainDescriptor) {
        
    }

    _getHeight(): number {
        return this._context.canvas.height
    }
    _getWidth(): number {
        return this._context.canvas.width
    }

    createView(descriptor: GPUTextureViewDescriptor = {}): GPUTextureView {
        return new GPUTextureView(this, descriptor)
    }

    _getArrayLayerCount(): number {
        return 1
    }
    _getMipmapLevelCount(): number {
        return 1
    }

    _getPixelSize(): number {
        return 32
    }
    
    _putPixel(pixel: number, x: number, y: number, z: number): void {
        let imageData = new ImageData(1, 1)
        new Uint32Array(imageData.data.buffer)[0] = pixel
        this._context.putImageData(imageData, x, y)
    }

    _getPixel(x: number, y: number, z: number, arrayLevel: number, mipLevel: number): number {
        throw new Error("Method not implemented.");
    }

    _getBuffer(arrayLayer: number, mipmap: number): ArrayBuffer {
        let imageData = this._context.getImageData(0, 0, this._getWidth(), this._getHeight())
        this._imageData = imageData
        return imageData.data.buffer
    }

    _flush() {
        if (this._imageData) {
            this._context.putImageData(this._imageData, 0, 0)
        }
    }
}

class GPUSwapChain {
    private descriptor: GPUSwapChainDescriptor
    private context: CanvasRenderingContext2D
    constructor(descriptor: GPUSwapChainDescriptor, context: CanvasRenderingContext2D) {
        this.descriptor = descriptor
        this.context = context
    }
    getCurrentTexture(): GPUTexture {
        return new Context2DTexture(this.context, this.descriptor)
    }
}

export default class GPUCanvasContext {
    private context: CanvasRenderingContext2D
    constructor(context: CanvasRenderingContext2D) {
        this.context = context
    }
    configureSwapChain (descriptor: GPUSwapChainDescriptor) : GPUSwapChain {
        return new GPUSwapChain(descriptor, this.context)
    }
}
  