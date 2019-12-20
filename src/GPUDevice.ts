import GPUAdapter from './GPUAdapter'
import { extensions, limits } from './constants'
import { GPUBufferDescriptor, GPUSamplerDescriptor, GPUBindGroupLayoutDescriptor, GPUShaderModuleDescriptor, GPUPipelineLayoutDescriptor } from './interfaces'
import { GPUBuffer } from './buffers'
import { GPUTexture, GPUTextureDescriptor, KTexture } from './textures'
import { GPUSampler } from './samplers'
import GPUBindGroupLayout from './GPUBindGroupLayout';
import GPUShaderModule from './GPUShaderModule';
import GPUPipelineLayout from './GPUPipelineLayout';
import { GPURenderPipeline, GPURenderPipelineDescriptor } from './GPURenderPipeline';
import GPUCommandEncoder from './GPUCommandEncoder';
import { GPUBindGroup, GPUBindGroupDescriptor } from './bindGroups';
import GPUQueue from './GPUQueue';
import GPUError from './GPUError';
import KQueue from './KQueue';
import { GPUComputePipelineDescriptor, GPUComputePipeline } from './GPUComputePipeline'

enum GPUErrorFilter {
  "none",
  "out-of-memory",
  "validation"
};

export default class {
  extensions = extensions
  limit = limits
  adapter: GPUAdapter
  _filters: GPUErrorFilter[] = []
  public defaultQueue = new KQueue()
  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }
  createBuffer (descriptor: GPUBufferDescriptor): GPUBuffer {
    return new GPUBuffer(descriptor)
  }
  createBufferMapped (descriptor: GPUBufferDescriptor): [GPUBuffer, ArrayBuffer] {
    let buffer = new GPUBuffer(descriptor)
    buffer._mapped = true
    return [buffer, buffer._mapWrite()]
  }
  async createBufferMappedAsync (descriptor: GPUBufferDescriptor): Promise<[GPUBuffer, ArrayBuffer]> {
    return this.createBufferMapped(descriptor)
  }
  createTexture (descriptor: GPUTextureDescriptor): GPUTexture {
    return new KTexture(descriptor)
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
    return new GPUShaderModule(descriptor.code)
  }
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    return new GPURenderPipeline(descriptor)
  }
  createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline {
    return new GPUComputePipeline(descriptor)
  }
  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    return new GPUBindGroup(descriptor)
  }
  createCommandEncoder(descriptor?: any): GPUCommandEncoder {
    return new GPUCommandEncoder()
  }
  pushErrorScope(filter: GPUErrorFilter) {
    this._filters.push(filter)
  }
  async popErrorScope(): Promise<GPUError | null> {
    return null
  }
  /*
   * @deprecated
   */
  getQueue(): GPUQueue {
    return this.defaultQueue
  }
}
