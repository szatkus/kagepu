import GPUSampler from "./GPUSampler";
import GPUBuffer from "./GPUBuffer";
import { GPUObjectDescriptorBase, GPUBindGroupLayout } from "./interfaces";
import { GPUTextureView } from "./textures";

export type GPUBindingResource = GPUSampler | GPUTextureView | GPUBufferBinding

export interface GPUBufferBinding {
  buffer: GPUBuffer,
  offset?: number,
  // If size is undefined, use the whole size of the buffer.
  size?: number
}

export interface GPUBindGroupBinding {
  binding: number,
  resource: GPUBindingResource
}

export interface GPUBindGroupDescriptor extends GPUObjectDescriptorBase {
  layout: GPUBindGroupLayout,
  bindings: Array<GPUBindGroupBinding>
}

export default class GPUBindGroup {
  private descriptor: GPUBindGroupDescriptor
  constructor(descriptor: GPUBindGroupDescriptor) {
    this.descriptor = descriptor
  }
}
