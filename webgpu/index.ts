/// <reference types="@webgpu/types" />

import { GPUCanvasContext } from './canvas'
import { GPUDevice, GPUAdapter } from './device'
import { GPURenderPassEncoder } from './GPURenderPassEncoder'
import { GPUComputePassEncoder } from './GPUComputePassEncoder'
import { GPUShaderStage } from './GPUShaderModule'
import { KValidationError } from './errors'

let gpu = {
  async requestAdapter (): Promise<GPUAdapter> {
    return new GPUAdapter()
  },

  monkeyPatch () {
    (window as any).GPUBufferUsage = {
      MAP_READ:  0x0001,
      MAP_WRITE: 0x0002,
      COPY_SRC:  0x0004,
      COPY_DST:  0x0008,
      INDEX:     0x0010,
      VERTEX:    0x0020,
      UNIFORM:   0x0040,
      STORAGE:   0x0080,
      INDIRECT:  0x0100
    };
    // name has changed, but I leave it for near future
    (window as any).GPUShaderStageBit = GPUShaderStage;
    (window as any).GPUShaderStage = GPUShaderStage;
    (window as any).GPUTextureUsage = {
      COPY_SRC:          0x01,
      COPY_DST:          0x02,
      SAMPLED:           0x04,
      STORAGE:           0x08,
      OUTPUT_ATTACHMENT: 0x10
    };
    (window as any).GPUValidationError = KValidationError;
    (window as any).GPUCanvasContext = GPUCanvasContext;
    (window as any).GPUDevice = GPUDevice;
    (window as any).GPURenderPassEncoder = GPURenderPassEncoder;
    (window as any).GPUComputePassEncoder = GPUComputePassEncoder;
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
