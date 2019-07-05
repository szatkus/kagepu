import GPUAdapter from './GPUAdapter'
import { extensions, limits } from './constants'
import { GPUBufferDescriptor, GPUTextureDescriptor, GPUSamplerDescriptor, GPUBindGroupLayoutDescriptor, GPUShaderModuleDescriptor, GPUPipelineLayoutDescriptor, GPURenderPipelineDescriptor } from './interfaces'
import GPUBuffer from './GPUBuffer'
import GPUTexture from './GPUTexture'
import GPUSampler from './GPUSampler'
import GPUBindGroupLayout from './GPUBindGroupLayout';
import GPUShaderModule from './GPUShaderModule';
import GPUPipelineLayout from './GPUPipelineLayout';
import { GPURenderPipeline } from './GPURenderPipeline';
import GPUCommandEncoder from './GPUCommandEncoder';
import GPUBindGroup, { GPUBindGroupDescriptor } from './GPUBindGroup';
import GPUQueue from './GPUQueue';

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
    return new GPUTexture(descriptor)
  }
  createSampler (descriptor: GPUSamplerDescriptor): GPUSampler {
    return new GPUSampler()
  }
  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    return new GPUBindGroupLayout(descriptor)
  }
  createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    return new GPUPipelineLayout(descriptor)
  }
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return new GPUShaderModule()
  }
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    return new GPURenderPipeline(descriptor)
  }
  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    return new GPUBindGroup(descriptor)
  }
  createCommandEncoder(descriptor?: any): GPUCommandEncoder {
    if (descriptor) {
      throw new Error("not supported yet")
    }
    return new GPUCommandEncoder()
  }

  getQueue(): GPUQueue {
    return new GPUQueue()
  }
}
