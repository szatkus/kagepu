import { GPUSampler } from "./samplers";
import { GPUBuffer } from "./buffers";
import { GPUObjectDescriptorBase } from "./interfaces";
import { GPUTextureView } from "./textures";
import GPUBindGroupLayout from "./GPUBindGroupLayout";

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

export class GPUBindGroup {
  constructor(public descriptor: GPUBindGroupDescriptor) {
    this.descriptor = descriptor
  }
}
