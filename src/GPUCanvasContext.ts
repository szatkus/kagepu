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
    constructor(public _context: CanvasRenderingContext2D, public _descriptor: GPUSwapChainDescriptor) {
        
    }

    createView(descriptor: GPUTextureViewDescriptor): GPUTextureView {
        throw new Error("Method not implemented.");
    }

    _getPixelSize(): number {
        throw new Error("Method not implemented.");
    }
    
    _putPixel(pixel: number, x: number, y: number, z: number): void {
        throw new Error("Method not implemented.");
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

export default class {
    private context: CanvasRenderingContext2D
    constructor(context: CanvasRenderingContext2D) {
        this.context = context
    }
    configureSwapChain (descriptor: GPUSwapChainDescriptor) : GPUSwapChain {
        return new GPUSwapChain(descriptor, this.context)
    }
}
  