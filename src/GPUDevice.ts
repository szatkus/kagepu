import GPUAdapter from './GPUAdapter'
import { extensions, limits } from './constants'
import { GPUSamplerDescriptor, GPUBindGroupLayoutDescriptor, GPUShaderModuleDescriptor, GPUPipelineLayoutDescriptor } from './interfaces'
import { GPUBuffer, GPUBufferDescriptor } from './buffers'
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
import GPUValidationError from './GPUValidationError'

enum GPUErrorFilter {
  NONE = 'none',
  OUT_OF_MEMORY = 'out-of-memory',
  VALIDATION = 'validation'
};

export default class {
  extensions = extensions
  limit = limits
  adapter: GPUAdapter
  _filters: GPUErrorFilter = GPUErrorFilter.NONE
  _error?: GPUError
  public defaultQueue = new KQueue()
  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }
  createBuffer (descriptor: GPUBufferDescriptor): GPUBuffer {
    return new GPUBuffer(descriptor)
  }
  createBufferMapped (descriptor: GPUBufferDescriptor): [GPUBuffer, ArrayBuffer] {
    let buffer = new GPUBuffer(descriptor, true)
    return [buffer, buffer._mapWrite()]
  }
  /*
   * @deprecated
   */
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
    if (this._validation()) {
      if (descriptor.layout._getBindingsCount() !== descriptor.bindings.length) {
        this._error = new GPUValidationError('Bindings count mismatch.')
      }
    }
    return new GPUBindGroup(descriptor)
  }
  createCommandEncoder(descriptor?: any): GPUCommandEncoder {
    return new GPUCommandEncoder()
  }
  pushErrorScope(filter: GPUErrorFilter) {
    this._filters = filter
  }
  async popErrorScope(): Promise<GPUError | null> {
    let error = this._error
    delete this._error
    return error || null
  }
  /*
   * @deprecated
   */
  getQueue(): GPUQueue {
    return this.defaultQueue
  }
  _validation(): boolean {
    return this._filters === GPUErrorFilter.VALIDATION
  }
}
