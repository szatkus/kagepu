import { KBuffer } from './buffers'
import { KTexture, KBufferTexture } from './textures'
import { KSampler } from './samplers'
import GPUCommandEncoder from './GPUCommandEncoder'
import { KBindGroupLayout, KBindGroup } from './bindGroups'
import KQueue from './KQueue'
import { GPUComputePipeline } from './GPUComputePipeline'
import { KValidationError } from './errors'
import { GPURenderBundleEncoder } from './GPURenderBundleEncoder'
import { KShaderModule } from './GPUShaderModule'
import { KRenderPipeline } from './GPURenderPassEncoder'

export const extensions = {
  anisotropicFiltering: false
}
export const limits = {
  maxBindGroups: 8
}

export class KPipelineLayout implements GPUPipelineLayout {
  public label = 'pipeline-layout'
  constructor (public _descriptor: GPUPipelineLayoutDescriptor) {

  }
}

export class GPUDevice {
  public extensions = extensions
  public limit = limits
  public adapter: GPUAdapter
  private _filters: GPUErrorFilter = 'none'
  private _error?: GPUError
  public defaultQueue = new KQueue()

  constructor (adapter: GPUAdapter) {
    this.adapter = adapter
  }

  createBuffer (descriptor: GPUBufferDescriptor): GPUBuffer {
    return new KBuffer(descriptor)
  }

  createBufferMapped (descriptor: GPUBufferDescriptor): [GPUBuffer, ArrayBuffer] {
    let buffer = new KBuffer(descriptor, true)
    return [buffer, buffer._mapWrite()]
  }

  /*
   * @deprecated
   */
  async createBufferMappedAsync (descriptor: GPUBufferDescriptor): Promise<[GPUBuffer, ArrayBuffer]> {
    return this.createBufferMapped(descriptor)
  }

  createTexture (descriptor: GPUTextureDescriptor): GPUTexture {
    return new KBufferTexture(descriptor)
  }

  createSampler (descriptor: GPUSamplerDescriptor): GPUSampler {
    return new KSampler()
  }

  createBindGroupLayout (descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
    return new KBindGroupLayout(descriptor)
  }

  createPipelineLayout (descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout {
    return new KPipelineLayout(descriptor)
  }

  createShaderModule (descriptor: GPUShaderModuleDescriptor): GPUShaderModule {
    return new KShaderModule(descriptor.code)
  }

  createRenderPipeline (descriptor: GPURenderPipelineDescriptor): GPURenderPipeline {
    if (this._validation() && descriptor.vertexState) {
      if ((descriptor.vertexState.vertexBuffers?.length ?? 0) > 16) {
        this._error = new KValidationError('Too many vertex buffers.')
      }
      if ((descriptor.vertexState.vertexBuffers ?? []).map(v => v.attributes.length).reduce((a, b) => a + b, 0) > 16) {
        this._error = new KValidationError('Too many attributes.')
      }
      let locations = new Set()
      for (let vertexBuffer of descriptor.vertexState.vertexBuffers || []) {
        if ((vertexBuffer.arrayStride ?? 0) > 2048) {
          this._error = new KValidationError('Too large array stride.')
        }
        for (let attribute of vertexBuffer.attributes) {
          if ((vertexBuffer.arrayStride ?? 0) > 0 && attribute.offset >= vertexBuffer.arrayStride) {
            this._error = new KValidationError('Attribute offset cannot exceed vertex buffer array stride.')
          }
          if (locations.has(attribute.shaderLocation)) {
            this._error = new KValidationError('Multiple attributes in one location.')
          }
          locations.add(attribute.shaderLocation)
        }
      }
    }
    return new KRenderPipeline(descriptor)
  }

  createComputePipeline (descriptor: GPUComputePipelineDescriptor): GPUComputePipeline {
    return new GPUComputePipeline(descriptor)
  }

  createBindGroup (descriptor: GPUBindGroupDescriptor): GPUBindGroup {
    if (this._validation()) {
      if ((descriptor.layout as KBindGroupLayout)._getBindingsCount() !== descriptor.bindings.length) {
        this._error = new GPUValidationError('Bindings count mismatch.')
      }
    }
    for (let binding of descriptor.bindings) {
      if (binding.binding >= descriptor.bindings.length) {
        this._error = new GPUValidationError('Incorrect binding location.')
      }
    }
    return new KBindGroup(descriptor)
  }

  createCommandEncoder (descriptor?: any): GPUCommandEncoder {
    return new GPUCommandEncoder()
  }

  createRenderBundleEncoder (descriptor: GPURenderBundleEncoderDescriptor): GPURenderBundleEncoder {
    return new GPURenderBundleEncoder(descriptor)
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
    return this._filters === 'validation'
  }
}

export class GPUAdapter {
  name = 'kagegpu'
  extensions = extensions

  async requestDevice (): Promise<GPUDevice> {
    return new GPUDevice(this)
  }
}
