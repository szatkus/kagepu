import { GPUSamplerDescriptor, GPUShaderModuleDescriptor, GPUPipelineLayoutDescriptor } from './interfaces'
import { GPUBuffer, GPUBufferDescriptor } from './buffers'
import { GPUTexture, GPUTextureDescriptor, KTexture } from './textures'
import { GPUSampler } from './samplers'
import GPUShaderModule from './GPUShaderModule'
import GPUPipelineLayout from './GPUPipelineLayout'
import { GPURenderPipeline, GPURenderPipelineDescriptor } from './GPURenderPipeline'
import GPUCommandEncoder from './GPUCommandEncoder'
import { GPUBindGroup, GPUBindGroupDescriptor, GPUBindGroupLayout, GPUBindGroupLayoutDescriptor } from './bindGroups'
import GPUQueue from './GPUQueue'
import KQueue from './KQueue'
import { GPUComputePipelineDescriptor, GPUComputePipeline } from './GPUComputePipeline'
import { GPUError, GPUErrorFilter, GPUValidationError } from './errors'

export const extensions = {
  anisotropicFiltering: false
}
export const limits = {
  maxBindGroups: 8
}

export class GPUDevice {
  public extensions = extensions
  public limit = limits
  public adapter: GPUAdapter
  private _filters: GPUErrorFilter = GPUErrorFilter.NONE
  private _error?: GPUError
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

  createBindGroupLayout (descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    return new GPUBindGroupLayout(descriptor)
  }

  createPipelineLayout (descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    return new GPUPipelineLayout(descriptor)
  }

  createShaderModule (descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return new GPUShaderModule(descriptor.code)
  }

  createRenderPipeline (descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    if (this._validation() && descriptor.vertexState) {
      if ((descriptor.vertexState.vertexBuffers?.length ?? 0) > 16) {
        this._error = new GPUValidationError('Too many vertex buffers.')
      }
      if ((descriptor.vertexState.vertexBuffers ?? []).map(v => v.attributes.length).reduce((a, b) => a + b, 0) > 16) {
        this._error = new GPUValidationError('Too many attributes.')
      }
      let locations = new Set()
      for (let vertexBuffer of descriptor.vertexState.vertexBuffers || []) {
        if ((vertexBuffer.arrayStride ?? 0) > 2048) {
          this._error = new GPUValidationError('Too large array stride.')
        }
        for (let attribute of vertexBuffer.attributes) {
          if ((vertexBuffer.arrayStride ?? 0) > 0 && attribute.offset >= vertexBuffer.arrayStride) {
            this._error = new GPUValidationError('Attribute offset cannot exceed vertex buffer array stride.')
          }
          if (locations.has(attribute.shaderLocation)) {
            this._error = new GPUValidationError('Multiple attributes in one location.')
          }
          locations.add(attribute.shaderLocation)
        }
      }
    }
    return new GPURenderPipeline(descriptor)
  }

  createComputePipeline (descriptor: GPUComputePipelineDescriptor): GPUComputePipeline {
    return new GPUComputePipeline(descriptor)
  }

  createBindGroup (descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    if (this._validation()) {
      if (descriptor.layout._getBindingsCount() !== descriptor.bindings.length) {
        this._error = new GPUValidationError('Bindings count mismatch.')
      }
    }
    return new GPUBindGroup(descriptor)
  }

  createCommandEncoder (descriptor?: any): GPUCommandEncoder {
    return new GPUCommandEncoder()
  }

  pushErrorScope (filter: GPUErrorFilter) {
    this._filters = filter
  }

  async popErrorScope (): Promise<GPUError | null> {
    let error = this._error
    delete this._error
    return error || null
  }

  /*
   * @deprecated
   */
  getQueue (): GPUQueue {
    return this.defaultQueue
  }

  _validation (): boolean {
    return this._filters === GPUErrorFilter.VALIDATION
  }
}

export class GPUAdapter {
  name = 'kagegpu'
  extensions = extensions

  async requestDevice (): Promise<GPUDevice> {
    return new GPUDevice(this)
  }
}
