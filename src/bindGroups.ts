import { GPUSampler } from './samplers'
import { GPUBuffer } from './buffers'
import { GPUObjectDescriptorBase } from './interfaces'
import { GPUTextureView } from './textures'

export class GPUBindGroup {
  constructor (public descriptor: GPUBindGroupDescriptor) {
    this.descriptor = descriptor
  }
}

export interface GPUBindGroupDescriptor extends GPUObjectDescriptorBase {
  layout: GPUBindGroupLayout,
  bindings: Array<GPUBindGroupBinding>
}

export class GPUBindGroupLayout {
  constructor (private _descriptor: GPUBindGroupLayoutDescriptor) {
  }
  _getBindingsByType (type: String): number[] {
    return this._descriptor.bindings.filter(binding => binding.type === type).map(binding => binding.binding)
  }
  _getBindingsCount (): number {
    return this._descriptor.bindings.length
  }
}

export interface GPUBindGroupBinding {
  binding: number,
  resource: GPUBindingResource
}

export interface GPUBindGroupLayoutDescriptor {
  bindings: Array<GPUBindGroupLayoutBinding>
}

export type GPUBindingResource = GPUSampler | GPUTextureView | GPUBufferBinding

export interface GPUBufferBinding {
  buffer: GPUBuffer,
  offset?: number,
  // If size is undefined, use the whole size of the buffer.
  size?: number
}

export interface GPUBindGroupLayoutBinding {
  binding: number,
  visibility: number,
  type: string
}
