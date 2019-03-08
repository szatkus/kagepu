import GPUAdapter from './GPUAdapter'
import { extensions, limits } from './constants'
import { GPUBufferDescriptor, GPUTextureDescriptor, GPUSamplerDescriptor, GPUBindGroupLayoutDescriptor, GPUShaderModuleDescriptor } from './interfaces'
import GPUBuffer from './GPUBuffer'
import GPUTexture from './GPUTexture'
import GPUSampler from './GPUSampler'
import GPUBindGroupLayout from './GPUBindGroupLayout';
import GPUShaderModule from './GPUShaderModule';

export default class {
  extensions = extensions
  limit = limits
  adapter: GPUAdapter
  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }
  createBuffer (descriptor: GPUBufferDescriptor): GPUBuffer {
    return new GPUBuffer(descriptor)
  }
  createBufferMapped (descriptor: GPUBufferDescriptor): [GPUBuffer, ArrayBuffer] {
    let buffer = new GPUBuffer(descriptor)
    buffer.mapped = true
    return [buffer, buffer.data]
  }
  async createBufferMappedAsync (descriptor: GPUBufferDescriptor): Promise<[GPUBuffer, ArrayBuffer]> {
    return this.createBufferMapped(descriptor)
  }
  createTexture (descriptor: GPUTextureDescriptor): GPUTexture {
    return new GPUTexture()
  }
  createSampler (descriptor: GPUSamplerDescriptor): GPUSampler {
    return new GPUSampler()
  }
  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    return new GPUBindGroupLayout()
  }
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return new GPUShaderModule()
  }
}
