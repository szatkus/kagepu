/// <reference types="@webgpu/types" />

import { GPUCanvasContext } from './canvas'
import { GPUDevice, GPUAdapter } from './device'
import { KRenderPassEncoder } from './render'
import { KComputePassEncoder } from './compute'
import { GPUShaderStage } from './shaders'
import { KValidationError } from './errors'
import { KBufferUsage } from './buffers'
import { KTextureUsage } from './textures'

let gpu = {
  brutal: false,

  async requestAdapter (): Promise<GPUAdapter> {
    return new GPUAdapter(this.brutal)
  },

  monkeyPatch (options = { brutal: false }) {
    this.brutal = options.brutal;
    (window as any).GPUBufferUsage = KBufferUsage;
    // name has changed, but I leave it for near future
    (window as any).GPUShaderStageBit = GPUShaderStage;
    (window as any).GPUShaderStage = GPUShaderStage;
    (window as any).GPUTextureUsage = KTextureUsage;
    (window as any).GPUValidationError = KValidationError;
    (window as any).GPUCanvasContext = GPUCanvasContext;
    (window as any).GPUDevice = GPUDevice;
    (window as any).GPURenderPassEncoder = KRenderPassEncoder;
    (window as any).GPUComputePassEncoder = KComputePassEncoder;
    (window.navigator as any).gpu = gpu

    let originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype as any).getContext = function (contextType: string, contextAttributes: any): any {
      if (contextType === 'gpu' || contextType === 'gpupresent') {
        let context = originalGetContext.apply(this, ['2d']) as CanvasRenderingContext2D
        return new GPUCanvasContext(context)
      }
      return originalGetContext.apply(this, [contextType, contextAttributes])
    }

  }
}

export default gpu
